import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Download, FileUp, LogOut, Trash2, Users, Eye, ShieldAlert } from "lucide-react";
import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin dashboard — BTCBot Weekly Challenge" },
      { name: "description", content: "Manage bot downloads and see site visitors." },
      { property: "og:title", content: "Admin dashboard — BTCBot Weekly Challenge" },
      { property: "og:description", content: "Manage bot downloads and see site visitors." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Overview = {
  page_views_total: number;
  page_views_7d: number;
  visitors_total: number;
  visitors_7d: number;
  downloads_total: number;
  downloads_7d: number;
  downloaders_total: number;
};

const fmtDate = (s: string) =>
  new Date(s).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
const fmtSize = (n: number) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);
const shortId = (id: string) => id.slice(0, 8);
const browserOf = (ua: string) =>
  /Edg\//.test(ua) ? "Edge" : /Chrome\//.test(ua) ? "Chrome" : /Firefox\//.test(ua) ? "Firefox" : /Safari\//.test(ua) ? "Safari" : ua ? "Other" : "—";

function useAdminCheck() {
  const { user } = Route.useRouteContext();
  const q = useQuery({
    queryKey: ["admin", "role", user.id],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
      if (error) throw error;
      return Boolean(data);
    },
  });
  return { user, isAdmin: q.data, loading: q.isPending };
}

function AdminPage() {
  const { user, isAdmin, loading } = useAdminCheck();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    void navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">Admin</p>
          <h1 className="mt-2 text-3xl font-bold">Dashboard</h1>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="font-mono text-xs">{user.email}</span>
          <Button variant="terminal" size="sm" onClick={signOut}>
            <LogOut /> Sign out
          </Button>
        </div>
      </div>
      {loading ? (
        <p className="py-20 text-center text-muted-foreground">Checking access…</p>
      ) : isAdmin ? (
        <Dashboard userId={user.id} />
      ) : (
        <div className="mx-auto mt-16 max-w-md rounded-lg border border-loss/40 bg-loss/5 p-8 text-center">
          <ShieldAlert className="mx-auto h-8 w-8 text-loss" />
          <h2 className="mt-4 text-xl font-bold">No admin access</h2>
          <p className="mt-2 text-sm text-muted-foreground">This account isn't on the admin list. Sign in with the admin email.</p>
        </div>
      )}
    </div>
  );
}

function Dashboard({ userId }: { userId: string }) {
  const overview = useQuery({
    queryKey: ["admin", "overview"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("admin_overview");
      if (error) throw error;
      return data as unknown as Overview;
    },
    refetchInterval: 30000,
  });
  const o = overview.data;

  return (
    <div className="mt-8 space-y-10">
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border lg:grid-cols-4">
        <StatCard icon={<Users />} label="Visitors" value={o?.visitors_total} sub={o ? `${o.visitors_7d} in last 7 days` : ""} />
        <StatCard icon={<Eye />} label="Page views" value={o?.page_views_total} sub={o ? `${o.page_views_7d} in last 7 days` : ""} />
        <StatCard icon={<Download />} label="Downloads" value={o?.downloads_total} sub={o ? `${o.downloads_7d} in last 7 days` : ""} tone="text-primary" />
        <StatCard icon={<CheckCircle2 />} label="Unique downloaders" value={o?.downloaders_total} sub="people who downloaded" tone="text-signal" />
      </dl>
      <DailyChart />
      <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
        <UploadCard userId={userId} />
        <FilesList />
      </div>
      <Tabs defaultValue="visitors">
        <TabsList className="bg-surface">
          <TabsTrigger value="visitors">Visitors</TabsTrigger>
          <TabsTrigger value="downloads">Downloads</TabsTrigger>
          <TabsTrigger value="pages">Top pages</TabsTrigger>
        </TabsList>
        <TabsContent value="visitors"><VisitorsTable /></TabsContent>
        <TabsContent value="downloads"><DownloadsTable /></TabsContent>
        <TabsContent value="pages"><TopPages /></TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({ icon, label, value, sub, tone }: { icon: ReactNode; label: string; value: number | undefined; sub: string; tone?: string }) {
  return (
    <div className="bg-card p-5">
      <dt className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground [&_svg]:h-3.5 [&_svg]:w-3.5">
        {icon} {label}
      </dt>
      <dd className={cn("mt-3 font-display text-3xl font-bold", tone)}>{value ?? "—"}</dd>
      <dd className="mt-1 text-xs text-muted-foreground">{sub}</dd>
    </div>
  );
}

function DailyChart() {
  const q = useQuery({
    queryKey: ["admin", "daily"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("admin_daily", { _days: 14 });
      if (error) throw error;
      return data;
    },
  });
  const rows = q.data ?? [];
  const max = Math.max(1, ...rows.map((r) => r.page_views));
  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold">Last 14 days</h2>
        <div className="flex gap-4 font-mono text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-muted-foreground/50" /> Page views</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-primary" /> Downloads</span>
        </div>
      </div>
      <div className="mt-6 flex h-40 items-end gap-1.5">
        {rows.map((r) => (
          <div key={r.day} className="group relative flex h-full flex-1 flex-col justify-end" title={`${r.day}: ${r.page_views} views, ${r.visitors} visitors, ${r.downloads} downloads`}>
            <div className="relative w-full rounded-t-sm bg-muted-foreground/30" style={{ height: `${(r.page_views / max) * 100}%`, minHeight: r.page_views ? 2 : 0 }}>
              <div className="absolute inset-x-0 bottom-0 rounded-t-sm bg-primary" style={{ height: r.page_views ? `${Math.min(100, (r.downloads / r.page_views) * 100)}%` : 0, minHeight: r.downloads ? 2 : 0 }} />
            </div>
            <span className="mt-2 text-center font-mono text-[9px] text-muted-foreground">{r.day.slice(8)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function UploadCard({ userId }: { userId: string }) {
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [version, setVersion] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<{ tone: "error" | "ok"; text: string } | null>(null);

  const upload = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("Choose a file first.");
      if (!/\.(mq5|ex5|zip)$/i.test(file.name)) throw new Error("Upload a .mq5, .ex5 or .zip file.");
      const safe = file.name.replace(/[^\w.\-]/g, "_");
      const path = `${Date.now()}-${safe}`;
      const { error: upErr } = await supabase.storage.from("bot-files").upload(path, file, {
        contentType: "application/octet-stream",
        upsert: false,
      });
      if (upErr) throw upErr;
      const { data: row, error } = await supabase
        .from("bot_files")
        .insert({ file_name: file.name, storage_path: path, size_bytes: file.size, version_label: version.trim(), notes: notes.trim(), uploaded_by: userId })
        .select("id")
        .single();
      if (error) throw error;
      const { error: curErr } = await supabase.rpc("set_current_bot_file", { _id: row.id });
      if (curErr) throw curErr;
    },
    onSuccess: () => {
      setStatus({ tone: "ok", text: "Uploaded. The site's Download buttons now give out this file." });
      setFile(null);
      setVersion("");
      setNotes("");
      if (inputRef.current) inputRef.current.value = "";
      void queryClient.invalidateQueries({ queryKey: ["admin", "files"] });
    },
    onError: (e: Error) => setStatus({ tone: "error", text: e.message }),
  });

  function submit(e: FormEvent) {
    e.preventDefault();
    setStatus(null);
    upload.mutate();
  }

  return (
    <form onSubmit={submit} className="h-fit rounded-lg border border-border bg-card p-6">
      <h2 className="flex items-center gap-2 text-lg font-bold"><FileUp className="h-5 w-5 text-primary" /> Upload bot file</h2>
      <p className="mt-1 text-sm text-muted-foreground">The newest upload becomes the public download.</p>
      <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-border bg-background px-4 py-6 text-center text-sm transition-colors hover:border-primary/60">
        <input ref={inputRef} type="file" accept=".mq5,.ex5,.zip" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        {file ? (
          <span className="font-mono">{file.name} · {fmtSize(file.size)}</span>
        ) : (
          <span className="text-muted-foreground">Click to choose a .mq5, .ex5 or .zip file</span>
        )}
      </label>
      <label htmlFor="version" className="mt-4 block font-mono text-xs uppercase tracking-wider text-muted-foreground">Version</label>
      <Input id="version" value={version} onChange={(e) => setVersion(e.target.value)} placeholder="v1.2" maxLength={40} className="mt-2 bg-background" />
      <label htmlFor="notes" className="mt-4 block font-mono text-xs uppercase tracking-wider text-muted-foreground">Notes</label>
      <Input id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="What changed" maxLength={200} className="mt-2 bg-background" />
      {status && <p role="status" className={cn("mt-4 text-sm", status.tone === "ok" ? "text-signal" : "text-loss")}>{status.text}</p>}
      <Button type="submit" variant="hero" size="lg" className="mt-5 w-full" disabled={!file || upload.isPending}>
        {upload.isPending ? "Uploading…" : "Upload & publish"}
      </Button>
    </form>
  );
}

function FilesList() {
  const queryClient = useQueryClient();
  const q = useQuery({
    queryKey: ["admin", "files"],
    queryFn: async () => {
      const { data, error } = await supabase.from("bot_files").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const makeCurrent = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.rpc("set_current_bot_file", { _id: id });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "files"] }),
  });
  const remove = useMutation({
    mutationFn: async (f: { id: string; storage_path: string }) => {
      const { error: sErr } = await supabase.storage.from("bot-files").remove([f.storage_path]);
      if (sErr) throw sErr;
      const { error } = await supabase.from("bot_files").delete().eq("id", f.id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "files"] }),
  });
  const files = q.data ?? [];

  return (
    <section>
      <h2 className="text-lg font-bold">Uploaded files</h2>
      {files.length === 0 ? (
        <p className="mt-4 rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
          No uploads yet. Visitors currently get the built-in placeholder file.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-border rounded-lg border border-border bg-card">
          {files.map((f) => (
            <li key={f.id} className="flex flex-wrap items-center gap-4 p-4">
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 truncate font-mono text-sm">
                  {f.file_name}
                  {f.is_current && <span className="rounded-sm border border-signal/50 px-1.5 text-[10px] text-signal">LIVE</span>}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {[f.version_label, fmtSize(f.size_bytes), fmtDate(f.created_at), f.notes].filter(Boolean).join(" · ")}
                </p>
              </div>
              {!f.is_current && (
                <Button size="sm" variant="terminal" disabled={makeCurrent.isPending} onClick={() => makeCurrent.mutate(f.id)}>
                  Make live
                </Button>
              )}
              <Button
                size="icon"
                variant="ghost"
                aria-label={`Delete ${f.file_name}`}
                disabled={remove.isPending}
                onClick={() => {
                  if (window.confirm(`Delete ${f.file_name}? This can't be undone.`)) remove.mutate(f);
                }}
              >
                <Trash2 className="text-muted-foreground" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function TableShell({ head, children, empty }: { head: string[]; children: ReactNode; empty: boolean }) {
  return (
    <div className="mt-4 overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[640px] text-sm">
        <thead className="bg-surface font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          <tr>{head.map((h) => <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>)}</tr>
        </thead>
        <tbody className="font-mono text-xs">
          {empty ? (
            <tr><td colSpan={head.length} className="bg-card px-4 py-8 text-center font-sans text-sm text-muted-foreground">No data yet.</td></tr>
          ) : children}
        </tbody>
      </table>
    </div>
  );
}

function VisitorsTable() {
  const q = useQuery({
    queryKey: ["admin", "visitors"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("admin_visitors", { _limit: 200 });
      if (error) throw error;
      return data;
    },
  });
  const rows = q.data ?? [];
  return (
    <TableShell head={["Visitor", "Country", "First seen", "Last seen", "Page views", "Downloads", "Last page"]} empty={rows.length === 0}>
      {rows.map((r) => (
        <tr key={r.visitor_id} className="border-t border-border bg-card">
          <td className="px-4 py-3">{shortId(r.visitor_id)}</td>
          <td className="px-4 py-3">{r.country || "—"}</td>
          <td className="px-4 py-3 text-muted-foreground">{fmtDate(r.first_seen)}</td>
          <td className="px-4 py-3">{fmtDate(r.last_seen)}</td>
          <td className="px-4 py-3">{r.page_views}</td>
          <td className={cn("px-4 py-3", r.downloads > 0 && "text-primary")}>{r.downloads}</td>
          <td className="px-4 py-3 text-muted-foreground">{r.last_path}</td>
        </tr>
      ))}
    </TableShell>
  );
}

function DownloadsTable() {
  const q = useQuery({
    queryKey: ["admin", "downloads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("download_events")
        .select("id, created_at, visitor_id, file_name, country, referrer, user_agent")
        .eq("is_bot", false)
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    },
  });
  const rows = q.data ?? [];
  return (
    <TableShell head={["Time", "File", "Visitor", "Country", "Came from", "Browser"]} empty={rows.length === 0}>
      {rows.map((r) => (
        <tr key={r.id} className="border-t border-border bg-card">
          <td className="px-4 py-3">{fmtDate(r.created_at)}</td>
          <td className="px-4 py-3">{r.file_name}</td>
          <td className="px-4 py-3">{shortId(r.visitor_id)}</td>
          <td className="px-4 py-3">{r.country || "—"}</td>
          <td className="px-4 py-3 text-muted-foreground">{r.referrer || "direct"}</td>
          <td className="px-4 py-3 text-muted-foreground">{browserOf(r.user_agent)}</td>
        </tr>
      ))}
    </TableShell>
  );
}

function TopPages() {
  const q = useQuery({
    queryKey: ["admin", "pages"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("admin_top_pages");
      if (error) throw error;
      return data;
    },
  });
  const rows = q.data ?? [];
  return (
    <TableShell head={["Page", "Views", "Visitors"]} empty={rows.length === 0}>
      {rows.map((r) => (
        <tr key={r.path} className="border-t border-border bg-card">
          <td className="px-4 py-3">{r.path}</td>
          <td className="px-4 py-3">{r.views}</td>
          <td className="px-4 py-3">{r.visitors}</td>
        </tr>
      ))}
    </TableShell>
  );
}
