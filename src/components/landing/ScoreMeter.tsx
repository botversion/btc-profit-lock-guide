import { cn } from "@/lib/utils";
import { SIGNAL_MAX, SIGNAL_MIN, SIGNAL_TRADE_MIN } from "@/lib/site";

const STEPS = Array.from({ length: SIGNAL_MAX - SIGNAL_MIN + 1 }, (_, i) => SIGNAL_MIN + i);

export function ScoreMeter({ score }: { score: number }) {
  const tradable = score >= SIGNAL_TRADE_MIN;
  return (
    <div className="flex gap-1" role="meter" aria-valuemin={SIGNAL_MIN} aria-valuemax={SIGNAL_MAX} aria-valuenow={score} aria-label="Signal score">
      {STEPS.map((n) => (
        <div key={n} className="flex-1">
          <div
            className={cn(
              "h-2 rounded-[2px] transition-colors duration-500",
              n <= score ? (tradable ? "bg-signal" : "bg-primary") : "bg-muted",
            )}
          />
          <span
            className={cn(
              "mt-1 block text-center text-[10px]",
              n === SIGNAL_TRADE_MIN ? "font-semibold text-foreground" : "text-muted-foreground",
            )}
          >
            {n}
          </span>
        </div>
      ))}
    </div>
  );
}
