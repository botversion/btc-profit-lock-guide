import { useTranslation } from "./LocaleLink";
import { useMemo, useState, type FormEvent } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, ExternalLink, Search, Send, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RANK_BASE, SAMPLE_TRADERS, buildRankUrl, sortTraders, type SortDir, type SortKey } from "@/lib/site";

const COLUMNS: { key: SortKey; label: string; numeric: boolean; fmt?: (v: number) => string }[] = [
  { key: "username", label: "Trader", numeric: false },
  { key: "profitPct", label: "Profit", numeric: true, fmt: (v) => `+${v.toFixed(1)}%` },
  { key: "winRate", label: "Win rate", numeric: true, fmt: (v) => `${v.toFixed(1)}%` },
  { key: "trades", label: "Trades", numeric: true, fmt: (v) => String(v) },
  { key: "maxDrawdown", label: "Max DD", numeric: true, fmt: (v) => `${v.toFixed(1)}%` },
];

const HOW = [
  { icon: Send, title: "Press Rank", text: "Click the Rank button on the bot's chart dashboard." },
  { icon: Trophy, title: "Stats are sent", text: "Your username, profit, win rate, trades and drawdown go to the ranking server." },
  { icon: Search, title: "See your place", text: "The weekly leaderboard updates and anyone can look you up by username." },
];

export function Ranking() {
  const { t } = useTranslation();
  const [sortKey, setSortKey] = useState<SortKey>("profitPct");
  const [dir, setDir] = useState<SortDir>("desc");
  const [username, setUsername] = useState("");

  const ranked = useMemo(
    () => sortTraders(SAMPLE_TRADERS, "profitPct", "desc").map((t, i) => ({ ...t, place: i + 1 })),
    [],
  );
  const rows = useMemo(() => {
    const sorted = sortTraders(ranked, sortKey, dir);
    const placeOf = new Map(ranked.map((r) => [r.username, r.place]));
    return sorted.map((r) => ({ ...r, place: placeOf.get(r.username) ?? 0 }));
  }, [ranked, sortKey, dir]);

  function toggle(key: SortKey) {
    if (key === sortKey) setDir(dir === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setDir(key === "username" || key === "maxDrawdown" ? "asc" : "desc");
    }
  }

  function lookup(e: FormEvent) {
    e.preventDefault();
    const url = buildRankUrl(username);
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div>
        <h2 className="text-xl font-bold">{t("How the Rank button works")}</h2>
        <ol className="mt-5 grid border-l border-t border-border md:grid-cols-3">
          {HOW.map(({ icon: Icon, title, text }, i) => (
            <li key={t(title ?? "")} className="border-b border-r border-border p-6">
              <div className="flex items-center justify-between">
                <Icon className="h-5 w-5 text-primary" />
                <span className="font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="mt-5 font-bold">{t(title ?? "")}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{t(text ?? "")}</p>
            </li>
          ))}
        </ol>

        <div className="mt-14 flex items-baseline justify-between gap-4">
          <h2 className="text-xl font-bold">{t("This week's leaderboard")}</h2>
          <span className="font-mono text-xs text-muted-foreground">{t("Sample data · click a column to sort")}</span>
        </div>

        <div className="mt-5 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[560px] text-sm">
              <caption className="sr-only">{t("Leaderboard, sortable by column")}</caption>
              <thead className="bg-surface font-mono text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">#</th>
                  {COLUMNS.map((c) => {
                    const active = c.key === sortKey;
                    const Icon = !active ? ArrowUpDown : dir === "asc" ? ArrowUp : ArrowDown;
                    return (
                      <th
                        key={c.key}
                        aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : "none"}
                        className={`px-4 py-3 font-medium ${c.numeric ? "text-right" : "text-left"}`}
                      >
                        <button
                          type="button"
                          onClick={() => toggle(c.key)}
                          className={`inline-flex cursor-pointer items-center gap-1 uppercase transition-colors hover:text-foreground ${active ? "text-primary" : ""}`}
                        >
                          {t(c.label ?? "")}
                          <Icon className="h-3 w-3" />
                        </button>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="font-mono">
                {rows.map((r) => (
                  <tr key={r.username} className="border-t border-border bg-card transition-colors hover:bg-accent">
                    <td className={`px-4 py-3 ${r.place <= 3 ? "text-primary" : "text-muted-foreground"}`}>{r.place}</td>
                    {COLUMNS.map((c) => {
                      const v = r[c.key];
                      const text = typeof v === "number" && c.fmt ? c.fmt(v) : String(v);
                      const tone =
                        c.key === "profitPct" ? "text-signal" : c.key === "maxDrawdown" ? "text-loss" : "text-foreground";
                      return (
                        <td key={c.key} className={`px-4 py-3 ${c.numeric ? "text-right" : "text-left font-sans font-medium"} ${tone}`}>
                          {t(text ?? "")}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <form onSubmit={lookup} className="flex h-fit flex-col rounded-lg border border-border bg-card p-6">
            <h3 className="text-lg font-semibold">{t("Look up a trader")}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{t("Opens the trader's ranking page in a new tab.")}</p>
            <label htmlFor="rank-username" className="mt-6 font-mono text-xs uppercase tracking-wider text-muted-foreground">{t("Username")}</label>
            <Input
              id="rank-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="satoshi_scan"
              className="mt-2 h-11 bg-background font-mono"
              autoComplete="off"
            />
            <p className="mt-2 break-all font-mono text-xs text-muted-foreground">
              {RANK_BASE}
              <span className="text-primary">{username.trim() || "username"}</span>
            </p>
            <Button type="submit" variant="hero" size="lg" className="mt-6" disabled={!username.trim()}>
              <ExternalLink />{t("Open ranking")}</Button>
          </form>
        </div>
    </div>
  );
}
