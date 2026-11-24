insert into public.admin_allowlist (email) values ('xauscalper.version@gmail.com') on conflict do nothing;
insert into public.user_roles (user_id, role)
select id, 'admin' from auth.users where lower(email) = 'xauscalper.version@gmail.com'
on conflict do nothing;