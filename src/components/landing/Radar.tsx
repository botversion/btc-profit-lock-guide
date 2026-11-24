import { useEffect, useState } from "react";

const BLIPS = [
  { x: 68, y: 30, label: "BUY", score: 82, tone: "signal" },
  { x: 28, y: 62, label: "SELL", score: 41, tone: "loss" },
  { x: 58, y: 74, label: "BUY", score: 67, tone: "signal" },
  { x: 36, y: 26, label: "WAIT", score: 23, tone: "muted" },
] as const;

const SCORES = [82, 79, 84, 88, 76, 81];

export function Radar() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2000);
    return () => clearInterval(id);
  }, []);
  const score = SCORES[tick % SCORES.length] ?? 82;

  return (
    <div className="relative mx-auto w-full max-w-[520px]">
      {/* Radar disc */}
      <div className="relative aspect-square overflow-hidden rounded-full border border-signal/30 bg-surface shadow-panel">
        <div className="radar-glow absolute inset-0 rounded-full" />
        {[20, 40, 60, 80].map((r) => (
          <div
            key={r}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-signal/15"
            style={{ width: `${r}%`, height: `${r}%` }}
          />
        ))}
        <div className="absolute left-1/2 top-0 h-full w-px bg-signal/15" />
        <div className="absolute left-0 top-1/2 h-px w-full bg-signal/15" />
        <div className="radar-ring-pulse absolute inset-0 rounded-full border border-signal/40" />
        <div className="radar-sweep absolute inset-0 rounded-full" />

        {BLIPS.map((b, i) => (
          <div
            key={i}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${b.x}%`, top: `${b.y}%` }}
          >
            <span
              className={`radar-blip block h-2.5 w-2.5 rounded-full ${
                b.tone === "signal" ? "bg-signal" : b.tone === "loss" ? "bg-loss" : "bg-muted-foreground"
              }`}
              style={{ animationDelay: `${i * 0.9}s` }}
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap rounded border border-border bg-background/80 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              {b.label} · {b.score}
            </span>
          </div>
        ))}

        <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-glow" />
      </div>

      {/* Dashboard overlay */}
      <div className="absolute -bottom-6 -left-2 w-56 rounded-lg border border-border bg-card/95 p-4 font-mono text-xs shadow-panel backdrop-blur sm:-left-8">
        <div className="mb-3 flex items-center justify-between text-muted-foreground">
          <span>SCAN · BTCUSD</span>
          <span className="flex items-center gap-1 text-signal">
            <span className="blink h-1.5 w-1.5 rounded-full bg-signal" /> LIVE
          </span>
        </div>
        <div className="flex items-end justify-between">
          <span className="text-muted-foreground">Signal score</span>
          <span className="font-display text-2xl font-semibold text-signal">{score}</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-signal transition-all duration-700" style={{ width: `${score}%` }} />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-y-1 text-muted-foreground">
          <span>Stop</span>
          <span className="text-right text-loss">set</span>
          <span>Profit lock</span>
          <span className="text-right text-signal">on</span>
          <span>Day loss</span>
          <span className="text-right text-foreground">0.8 / 3%</span>
        </div>
      </div>

      <div className="absolute -right-2 -top-4 rounded-lg border border-border bg-card/95 px-3 py-2 font-mono text-xs shadow-panel backdrop-blur sm:-right-6">
        <span className="text-muted-foreground">Week P/L </span>
        <span className="text-signal">+4.62%</span>
      </div>
    </div>
  );
}
