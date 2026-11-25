import { useEffect, useState } from "react";
import { useLiveFeed } from "@/hooks/use-live-feed";
import { fmtPrice } from "@/lib/live-feed";
import { BOT_NAME, SIGNAL_TRADE_MIN, SUPPORT_EMAIL } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Marketing preview of the bot's MT5 panel: live BTC price, showcase (profitable) account figures. */
const DAYS = [
  { day: 1, net: 182.4, entries: 46, status: "ENDED" },
  { day: 2, net: 96.1, entries: 38, status: "ENDED" },
  { day: 3, net: 214.75, entries: 52, status: "ENDED" },
  { day: 4, net: 0, entries: 0, status: "ACTIVE" },
  { day: 5, net: 0, entries: 0, status: "UPCOMING" },
  { day: 6, net: 0, entries: 0, status: "UPCOMING" },
  { day: 7, net: 0, entries: 0, status: "UPCOMING" },
];

type Row = { id: number; t: number; side: "BUY" | "SELL"; price: number; profit: number };

const money = (n: number) => `${n >= 0 ? "+" : "−"}$${Math.abs(n).toFixed(2)}`;
const hm = (t: number) => (t > 0 ? new Date(t).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "--:--");

function Box({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-sm border border-border bg-card", className)}>
      <h4 className="border-b border-border bg-surface px-3 py-1.5 text-[11px] font-semibold text-foreground">
        <span className="mr-1.5 text-primary">■</span>
        {title}
      </h4>
      <div className="px-3 py-2">{children}</div>
    </section>
  );
}

function KV({ k, v, tone }: { k: string; v: string; tone?: string }) {
  return (
    <div className="flex justify-between gap-2 leading-5">
      <span className="text-muted-foreground">{k}</span>
      <span className={cn("text-foreground", tone)}>{v}</span>
    </div>
  );
}

export function LiveTerminal() {
  const { state: s } = useLiveFeed();
  const [rows, setRows] = useState<Row[]>([]);
  const [extra, setExtra] = useState({ trades: 0, profit: 0 });

  // Seed and grow a winning trade history once the live price is available.
  useEffect(() => {
    if (!s.now) return;
    if (rows.length === 0) {
      setRows(
        Array.from({ length: 5 }, (_, i) => ({
          id: 2746 - i,
          t: s.now - (i + 1) * 70000,
          side: (i % 3 === 1 ? "BUY" : "SELL") as Row["side"],
          price: s.price + (i - 2) * 18.4,
          profit: [0.94, 0.61, 1.12, 0.48, 0.87][i] ?? 0.5,
        })),
      );
      return;
    }
    if (s.tick % 8 === 0) {
      const profit = Math.round((0.35 + ((s.tick * 37) % 100) / 100) * 100) / 100;
      setRows((r) => [{ id: (r[0]?.id ?? 2746) + 1, t: s.now, side: s.bias === "BUY" ? "BUY" : "SELL", price: s.price, profit }, ...r].slice(0, 5));
      setExtra((e) => ({ trades: e.trades + 1, profit: e.profit + profit }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.tick]);

  const today = 64.3 + extra.profit;
  const week = 493.25 + today;
  const balance = 10000 + week;
  const open = Math.abs(((s.price * 7) % 3) - 0.4) + 0.6; // always-green open trade
  const totalTrades = 2746 + extra.trades;
  const side = s.bias === "BUY" ? "BUY" : "SELL";
  const sideTone = side === "BUY" ? "text-signal" : "text-loss";
  const days = DAYS.map((d) => (d.status === "ACTIVE" ? { ...d, net: today, entries: 21 + extra.trades } : d));
  const date = s.now ? new Date(s.now) : null;

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-background font-mono text-[11px] shadow-panel">
      {/* Title bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-surface px-3 py-2">
        <span className="font-display text-sm font-bold text-foreground">{BOT_NAME}</span>
        <div className="flex items-center gap-2">
          <span className="rounded-sm border border-signal/40 px-2 py-0.5 text-signal">
            <span className="blink mr-1 inline-block h-1.5 w-1.5 rounded-full bg-signal" />
            EA ACTIVE
          </span>
          <span className="hidden rounded-sm border border-border px-2 py-0.5 text-muted-foreground sm:inline">
            {date ? date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }) : "--"}{" "}
            <span className="text-foreground">{date ? date.toLocaleTimeString("en-GB") : "--:--:--"}</span>
          </span>
          <span className="rounded-sm border border-primary/60 px-2 py-0.5 font-semibold text-primary">★ RANK</span>
        </div>
      </div>

      {/* Account strip */}
      <dl className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
        {[
          ["Balance", `$${fmtPrice(balance)}`, "text-foreground"],
          ["Equity", `$${fmtPrice(balance + open)}`, "text-foreground"],
          ["Open P/L", money(open), "text-signal"],
          ["Day P/L", `${money(today)} (+${((today / 10000) * 100).toFixed(2)}%)`, "text-signal"],
        ].map(([k, v, t]) => (
          <div key={k} className="bg-card px-3 py-2">
            <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</dt>
            <dd className={cn("mt-0.5 text-sm font-medium", t)}>{v}</dd>
          </div>
        ))}
      </dl>

      <div className="flex items-center justify-between border-y border-border bg-primary/10 px-3 py-1 text-primary">
        <span>PROFIT LOCK ON · SCORE ≥ {SIGNAL_TRADE_MIN}</span>
        <span className={sideTone}>
          SIG {side} · {s.score}/8 · Spr {s.spread.toFixed(1)}
        </span>
      </div>

      <div className="grid gap-2 p-2 sm:grid-cols-2">
        <Box title="Current Trade">
          <p className={cn("text-sm font-semibold", sideTone)}>
            {side} 0.03 @ {fmtPrice(s.price - (side === "BUY" ? 22 : -22))}
          </p>
          <p className="text-signal">P/L {money(open)} · SL locked</p>
          <p className="text-muted-foreground">
            Bid <span className="text-foreground">{fmtPrice(s.price)}</span>
          </p>
        </Box>
        <Box title="Performance">
          <KV k="Total trades" v={String(totalTrades)} />
          <KV k="Win rate" v="78.4%" tone="text-signal" />
          <KV k="Total profit" v={money(1842.6 + week)} tone="text-signal" />
          <KV k="Profit factor" v="2.31" tone="text-signal" />
          <KV k="Max drawdown" v="−3.2%" tone="text-loss" />
        </Box>
        <Box title="7-Day Challenge" className="sm:col-span-2">
          <table className="w-full">
            <thead className="text-muted-foreground">
              <tr>
                <th className="text-left font-normal">Day</th>
                <th className="text-right font-normal">Net P/L</th>
                <th className="text-right font-normal">Entries</th>
                <th className="text-right font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {days.map((d) => (
                <tr key={d.day} className="leading-5">
                  <td>{d.day}</td>
                  <td className={cn("text-right", d.net > 0 ? "text-signal" : "text-muted-foreground")}>{d.net > 0 ? money(d.net) : "0.00"}</td>
                  <td className="text-right">{d.entries}</td>
                  <td className={cn("text-right", d.status === "ACTIVE" ? "text-primary" : d.status === "ENDED" ? "text-signal" : "text-muted-foreground")}>
                    {d.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </div>

      <div className="border-t border-border p-2">
        <p className="mb-1 px-1 font-semibold text-foreground">
          <span className="mr-1.5 text-primary">■</span>Trade History (latest 5)
        </p>
        <table className="w-full">
          <thead className="text-muted-foreground">
            <tr>
              <th className="text-left font-normal">#</th>
              <th className="text-left font-normal">Time</th>
              <th className="text-left font-normal">Type</th>
              <th className="text-right font-normal">Price</th>
              <th className="text-right font-normal">Profit</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="leading-5">
                <td className="text-muted-foreground">{r.id}</td>
                <td>{hm(r.t)}</td>
                <td className={r.side === "BUY" ? "text-signal" : "text-loss"}>{r.side}</td>
                <td className="text-right">{fmtPrice(r.price)}</td>
                <td className="text-right text-signal">{money(r.profit)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between border-t border-border bg-surface px-3 py-1.5 text-muted-foreground">
        <span>For Support: {SUPPORT_EMAIL}</span>
        <span>v7.20</span>
      </div>
    </div>
  );
}
