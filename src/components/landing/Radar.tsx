import type { Bias } from "@/lib/live-feed";

const OTHERS = [
  { x: 30, y: 64, tone: "bg-loss", delay: 1.2 },
  { x: 60, y: 76, tone: "bg-signal", delay: 2.1 },
  { x: 36, y: 28, tone: "bg-muted-foreground", delay: 3 },
] as const;

/** Compact scan radar; the lead blip mirrors the live score and direction. */
export function Radar({ score, bias }: { score: number; bias: Bias }) {
  const tone = bias === "BUY" ? "bg-signal" : bias === "SELL" ? "bg-loss" : "bg-muted-foreground";
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-full border border-signal/25 bg-background">
      <div className="radar-glow absolute inset-0 rounded-full" />
      {[25, 50, 75].map((r) => (
        <div
          key={r}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-signal/15"
          style={{ width: `${r}%`, height: `${r}%` }}
        />
      ))}
      <div className="absolute left-1/2 top-0 h-full w-px bg-signal/10" />
      <div className="absolute left-0 top-1/2 h-px w-full bg-signal/10" />
      <div className="radar-sweep absolute inset-0 rounded-full" />
      {OTHERS.map((b, i) => (
        <span
          key={i}
          className={`radar-blip absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${b.tone}`}
          style={{ left: `${b.x}%`, top: `${b.y}%`, animationDelay: `${b.delay}s` }}
        />
      ))}
      <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: "66%", top: "32%" }}>
        <span className={`radar-blip block h-2 w-2 rounded-full ${tone}`} />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-sm border border-border bg-background/90 px-1 font-mono text-[9px] leading-4 text-foreground">
          {bias} {score}
        </span>
      </div>
      <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />
    </div>
  );
}
