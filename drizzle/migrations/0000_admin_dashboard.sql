create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "Users can read their own roles" on public.user_roles
  for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

-- Emails that become admin when they sign up / sign in
create table public.admin_allowlist (
  email text primary key
);
grant all on public.admin_allowlist to service_role;
alter table public.admin_allowlist enable row level security;

create or replace function public.grant_admin_from_allowlist()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.admin_allowlist a where lower(a.email) = lower(new.email)) then
    insert into public.user_roles (user_id, role) values (new.id, 'admin') on conflict do nothing;
  end if;
  return new;
end;
$$;

create trigger on_auth_user_created_grant_admin
  after insert on auth.users
  for each row execute function public.grant_admin_from_allowlist();

-- Uploaded bot files
create table public.bot_files (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  storage_path text not null unique,
  size_bytes bigint not null default 0,
  version_label text not null default '',
  notes text not null default '',
  is_current boolean not null default false,
  uploaded_by uuid,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.bot_files to authenticated;
grant all on public.bot_files to service_role;
alter table public.bot_files enable row level security;
create policy "Admins manage bot files" on public.bot_files
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));
create unique index bot_files_one_current on public.bot_files (is_current) where is_current;

create or replace function public.set_current_bot_file(_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.has_role(auth.uid(), 'admin') then
    raise exception 'forbidden';
  end if;
  update public.bot_files set is_current = false where is_current and id <> _id;
  update public.bot_files set is_current = true where id = _id;
end;
$$;
revoke execute on function public.set_current_bot_file(uuid) from public, anon;
grant execute on function public.set_current_bot_file(uuid) to authenticated;

-- Page visits (written by the site's server, read by admins)
create table public.page_visits (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  visitor_id text not null,
  path text not null,
  referrer text not null default '',
  country text not null default '',
  user_agent text not null default '',
  is_bot boolean not null default false
);
grant select on public.page_visits to authenticated;
grant all on public.page_visits to service_role;
alter table public.page_visits enable row level security;
create policy "Admins read page visits" on public.page_visits
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create index page_visits_created_idx on public.page_visits (created_at desc);
create index page_visits_visitor_idx on public.page_visits (visitor_id);

-- Downloads (written by the site's server, read by admins)
create table public.download_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  visitor_id text not null,
  file_id uuid,
  file_name text not null,
  referrer text not null default '',
  country text not null default '',
  user_agent text not null default '',
  is_bot boolean not null default false
);
grant select on public.download_events to authenticated;
grant all on public.download_events to service_role;
alter table public.download_events enable row level security;
create policy "Admins read downloads" on public.download_events
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create index download_events_created_idx on public.download_events (created_at desc);
create index download_events_visitor_idx on public.download_events (visitor_id);

-- Admin reports
create or replace function public.admin_overview()
returns json language plpgsql stable security definer set search_path = public as $$
declare result json;
begin
  if not public.has_role(auth.uid(), 'admin') then raise exception 'forbidden'; end if;
  select json_build_object(
    'page_views_total', (select count(*) from page_visits where not is_bot),
    'page_views_7d', (select count(*) from page_visits where not is_bot and created_at > now() - interval '7 days'),
    'visitors_total', (select count(distinct visitor_id) from page_visits where not is_bot),
    'visitors_7d', (select count(distinct visitor_id) from page_visits where not is_bot and created_at > now() - interval '7 days'),
    'downloads_total', (select count(*) from download_events where not is_bot),
    'downloads_7d', (select count(*) from download_events where not is_bot and created_at > now() - interval '7 days'),
    'downloaders_total', (select count(distinct visitor_id) from download_events where not is_bot)
  ) into result;
  return result;
end;
$$;

create or replace function public.admin_daily(_days int default 14)
returns table(day date, page_views bigint, visitors bigint, downloads bigint)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.has_role(auth.uid(), 'admin') then raise exception 'forbidden'; end if;
  return query
  select d::date,
    (select count(*) from page_visits v where not v.is_bot and v.created_at::date = d::date),
    (select count(distinct v.visitor_id) from page_visits v where not v.is_bot and v.created_at::date = d::date),
    (select count(*) from download_events e where not e.is_bot and e.created_at::date = d::date)
  from generate_series(current_date - (least(greatest(_days, 1), 90) - 1), current_date, interval '1 day') d
  order by 1;
end;
$$;

create or replace function public.admin_visitors(_limit int default 100)
returns table(visitor_id text, country text, first_seen timestamptz, last_seen timestamptz, page_views bigint, downloads bigint, last_path text)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.has_role(auth.uid(), 'admin') then raise exception 'forbidden'; end if;
  return query
  with v as (
    select pv.visitor_id, max(pv.country) as country, min(pv.created_at) as first_seen, max(pv.created_at) as last_seen,
      count(*) as page_views,
      (array_agg(pv.path order by pv.created_at desc))[1] as last_path
    from page_visits pv where not pv.is_bot group by pv.visitor_id
  )
  select v.visitor_id, v.country, v.first_seen, v.last_seen, v.page_views,
    (select count(*) from download_events e where e.visitor_id = v.visitor_id and not e.is_bot),
    v.last_path
  from v order by v.last_seen desc limit least(greatest(_limit, 1), 500);
end;
$$;

create or replace function public.admin_top_pages()
returns table(path text, views bigint, visitors bigint)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.has_role(auth.uid(), 'admin') then raise exception 'forbidden'; end if;
  return query
  select pv.path, count(*), count(distinct pv.visitor_id)
  from page_visits pv where not pv.is_bot group by pv.path order by 2 desc limit 20;
end;
$$;

revoke execute on function public.admin_overview() from public, anon;
revoke execute on function public.admin_daily(int) from public, anon;
revoke execute on function public.admin_visitors(int) from public, anon;
revoke execute on function public.admin_top_pages() from public, anon;
grant execute on function public.admin_overview() to authenticated;
grant execute on function public.admin_daily(int) to authenticated;
grant execute on function public.admin_visitors(int) to authenticated;
grant execute on function public.admin_top_pages() to authenticated;

-- Storage: admins manage files in the bot-files bucket
create policy "Admins read bot files" on storage.objects
  for select to authenticated using (bucket_id = 'bot-files' and public.has_role(auth.uid(), 'admin'));
create policy "Admins upload bot files" on storage.objects
  for insert to authenticated with check (bucket_id = 'bot-files' and public.has_role(auth.uid(), 'admin'));
create policy "Admins update bot files" on storage.objects
  for update to authenticated using (bucket_id = 'bot-files' and public.has_role(auth.uid(), 'admin'));
create policy "Admins delete bot files" on storage.objects
  for delete to authenticated using (bucket_id = 'bot-files' and public.has_role(auth.uid(), 'admin'));