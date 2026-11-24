import { useLiveFeed } from "@/hooks/use-live-feed";
import { DAY_LOSS_LIMIT_PCT, fmtPrice, fmtTime, type LogTag } from "@/lib/live-feed";
import { SIGNAL_MAX, SIGNAL_TRADE_MIN } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Radar } from "./Radar";
import { ScoreMeter } from "./ScoreMeter";

const TAG_TONE: Record<LogTag, string> = {
  SCAN: "text-muted-foreground",
  OPEN: "text-primary",
  LOCK: "text-signal",
  CLOSE: "text-foreground",
};

const signed = (n: number, digits = 2) => `${n >= 0 ? "+" : "−"}${Math.abs(n).toFixed(digits)}`;

function Sparkline({ data, entry, stop, up }: { data: number[]; entry?: number | undefined; stop?: number | undefined; up: boolean }) {
  const W = 320;
  const H = 72;
  const vals = [...data, ...(entry ? [entry] : []), ...(stop ? [stop] : [])];
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const span = max - min || 1;
  const y = (v: number) => H - 6 - ((v - min) / span) * (H - 12);
  const x = (i: number) => (i / Math.max(1, data.length - 1)) * W;
  const pts = data.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const level = (v: number, label: string, cls: string) => (
    <span className={cn("absolute right-0 -translate-y-1/2 bg-card px-1 text-[9px]", cls)} style={{ top: `${(y(v) / H) * 100}%` }}>
      {label}
    </span>
  );
  return (
    <div className="relative mt-3 h-[72px]">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-full w-full" aria-hidden>
        <polygon points={`0,${H} ${pts} ${W},${H}`} className={up ? "fill-signal/10" : "fill-loss/10"} />
        {entry && <line x1={0} x2={W} y1={y(entry)} y2={y(entry)} className="stroke-muted-foreground/60" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />}
        {stop && <line x1={0} x2={W} y1={y(stop)} y2={y(stop)} className="stroke-loss/70" strokeDasharray="2 4" vectorEffect="non-scaling-stroke" />}
        <polyline points={pts} fill="none" className={up ? "stroke-signal" : "stroke-loss"} strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
      </svg>
      {entry && level(entry, "ENTRY", "text-muted-foreground")}
      {stop && level(stop, "SL", "text-loss")}
    </div>
  );
}

function Stat({ label, value, sub, tone }: { label: string; value: string; sub?: string | undefined; tone?: string | undefined }) {
  return (
    <div className="bg-card px-4 py-3">
      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className={cn("mt-1 text-sm text-foreground", tone)}>{value}</dd>
      {sub && <dd className="text-[10px] text-muted-foreground">{sub}</dd>}
    </div>
  );
}

export function LiveTerminal() {
  const { state: s, view: v } = useLiveFeed();
  const pos = s.position;
  const biasTone = s.bias === "BUY" ? "border-signal/50 text-signal" : s.bias === "SELL" ? "border-loss/50 text-loss" : "border-border text-muted-foreground";

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card font-mono text-xs shadow-panel">
      <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-2.5">
        <div className="flex items-center gap-3">
          <span className="flex gap-1.5" aria-hidden>
            <span className="h-2 w-2 rounded-full bg-muted" />
            <span className="h-2 w-2 rounded-full bg-muted" />
            <span className="h-2 w-2 rounded-full bg-muted" />
          </span>
          <span className="text-muted-foreground">BTCBot · BTCUSD · M5</span>
        </div>
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-signal">
            <span className="blink h-1.5 w-1.5 rounded-full bg-signal" /> LIVE
          </span>
          <span className="text-muted-foreground">{fmtTime(s.now)}</span>
        </span>
      </div>

      <div className="grid gap-5 border-b border-border p-4 sm:grid-cols-[148px_1fr]">
        <div className="mx-auto w-36 sm:w-full">
          <Radar score={s.score} bias={s.bias} />
        </div>
        <div className="min-w-0">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-muted-foreground">BTCUSD · Bid</span>
            <span className={v.changePct >= 0 ? "text-signal" : "text-loss"}>{signed(v.changePct)}% 24h</span>
          </div>
          <p className={cn("mt-1 text-3xl font-medium tracking-tight transition-colors duration-300", v.up ? "text-signal" : "text-loss")}>
            {fmtPrice(v.bid)}
          </p>
          <div className="mt-2 flex gap-5 text-muted-foreground">
            <span>
              Ask <span className="text-foreground">{fmtPrice(v.ask)}</span>
            </span>
            <span>
              Spread <span className="text-foreground">{s.spread.toFixed(1)}</span>
            </span>
          </div>
          <Sparkline data={s.history} entry={pos?.entry} stop={pos?.stop} up={s.price >= (s.history[0] ?? s.price)} />
        </div>
      </div>

      <div className="border-b border-border p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-muted-foreground">Signal score</span>
          <span className="flex items-center gap-3">
            <span className={cn("rounded-sm border px-1.5 py-0.5 text-[10px]", biasTone)}>{s.bias}</span>
            <span className={cn("text-xl font-semibold", v.tradable ? "text-signal" : "text-primary")}>
              {s.score}
              <span className="text-sm text-muted-foreground">/{SIGNAL_MAX}</span>
            </span>
          </span>
        </div>
        <ScoreMeter score={s.score} />
        <p className="mt-2 text-[10px] text-muted-foreground">
          {v.tradable ? `Tradable · at or above ${SIGNAL_TRADE_MIN}` : `Watching · trades start at ${SIGNAL_TRADE_MIN}`}
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-px border-b border-border bg-border sm:grid-cols-4">
        <Stat label="Position" value={pos ? `${pos.side} ${pos.lots.toFixed(2)}` : "Flat"} sub={pos ? `@ ${fmtPrice(pos.entry)}` : "scanning"} tone={pos ? (pos.side === "BUY" ? "text-signal" : "text-loss") : undefined} />
        <Stat label="Stop loss" value={pos ? fmtPrice(pos.stop) : "—"} sub={pos ? (pos.locked ? "profit locked" : "initial") : "set on entry"} tone={pos?.locked ? "text-signal" : "text-loss"} />
        <Stat label="Floating P/L" value={`${signed(v.floatPnl)} $`} tone={v.floatPnl >= 0 ? "text-signal" : "text-loss"} />
        <Stat label="Week P/L" value={`${signed(v.weekPct)}%`} tone={v.weekPct >= 0 ? "text-signal" : "text-loss"} />
        <Stat label="Day loss" value={`${v.dayLossPct.toFixed(2)} / ${DAY_LOSS_LIMIT_PCT.toFixed(1)}%`} />
        <Stat label="Trades today" value={String(s.tradesToday)} />
        <Stat label="Win rate" value={`${v.winRate.toFixed(1)}%`} sub={`${s.wins}W · ${s.losses}L`} />
        <Stat label="Balance" value={`$${fmtPrice(s.balance)}`} />
      </dl>

      <ol className="h-[118px] overflow-hidden px-4 py-3" aria-label="Bot activity log">
        {s.log.map((e) => (
          <li key={e.id} className="flex gap-3 truncate leading-[22px]">
            <span className="text-muted-foreground/70">{fmtTime(e.t)}</span>
            <span className={cn("w-10 shrink-0", TAG_TONE[e.tag])}>{e.tag}</span>
            <span className="truncate text-foreground/85">{e.text}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
