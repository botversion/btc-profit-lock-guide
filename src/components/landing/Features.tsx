import { useTranslation } from "./LocaleLink";
import { Gauge, LayoutDashboard, Lock, ScrollText, ShieldCheck, TrendingDown } from "lucide-react";
import { SIGNAL_MAX, SIGNAL_MIN, SIGNAL_TRADE_MIN } from "@/lib/site";
import { cn } from "@/lib/utils";

const FEATURES = [
  { icon: ShieldCheck, title: "Stops on every trade", text: "No position opens without a stop-loss attached. Ever.", spec: "SL set on entry" },
  { icon: Gauge, title: "Signal scoring", text: `Each setup is rated from ${SIGNAL_MIN} to ${SIGNAL_MAX}; only strong signals are traded.`, spec: `Trades at ${SIGNAL_TRADE_MIN}+` },
  { icon: Lock, title: "Profit locking", text: "Stops trail behind price to protect gains once a trade runs.", spec: "Trailing stop" },
  { icon: TrendingDown, title: "Loss limits", text: "Daily and weekly loss caps pause trading before damage grows.", spec: "Daily + weekly caps" },
  { icon: LayoutDashboard, title: "Live dashboard", text: "See the scan, score, open risk and P/L right on your chart.", spec: "On-chart panel" },
  { icon: ScrollText, title: "Trade log", text: "Every entry, exit and reason is recorded for easy review.", spec: "Entry · exit · reason" },
];

export function Features() {
  const { t } = useTranslation();
  return (
    <div className="grid border-t border-border md:grid-cols-2">
      {FEATURES.map(({ icon: Icon, title, text, spec }, i) => (
        <article key={t(title ?? "")} className="flex gap-6 border-b border-border py-9 md:pr-10 md:even:border-l md:even:pl-10 md:even:pr-0">
          <span className="pt-1.5 font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
          <div>
            <Icon className="h-5 w-5 text-primary" />
            <h2 className="mt-4 text-xl font-bold">{t(title ?? "")}</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">{t(text ?? "")}</p>
            <p className="mt-4 inline-block rounded-sm border border-border px-2 py-1 font-mono text-[11px] text-foreground/80">{t(spec ?? "")}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

const SCALE = Array.from({ length: SIGNAL_MAX - SIGNAL_MIN + 1 }, (_, i) => SIGNAL_MIN + i);

export function ScoreScale() {
  const { t } = useTranslation();
  return (
    <section className="mt-20 grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-end">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{t("Signal score")}</p>
        <h2 className="mt-3 text-3xl font-bold">{t("Rated ")}{SIGNAL_MIN}{t(" to ")}{SIGNAL_MAX}{t(". Traded at ")}{SIGNAL_TRADE_MIN}+.</h2>
        <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">{t("The indicator rates every setup it finds. Weak setups stay on the radar but are never traded — only scores of")}{" "}
          {SIGNAL_TRADE_MIN}{t("or higher can open a position.")}</p>
      </div>
      <div className="grid grid-cols-6 items-end gap-2" aria-label={`Score scale from ${SIGNAL_MIN} to ${SIGNAL_MAX}`}>
        {SCALE.map((n, i) => {
          const ok = n >= SIGNAL_TRADE_MIN;
          return (
            <div key={n} className="flex flex-col">
              <div
                className={cn("rounded-t-sm border border-b-0", ok ? "border-signal/40 bg-signal/15" : "border-border bg-muted")}
                style={{ height: `${48 + i * 26}px` }}
              />
              <div className={cn("border-t-2 pt-3 text-center", ok ? "border-signal" : "border-border")}>
                <span className={cn("font-display text-2xl font-bold", ok ? "text-signal" : "text-muted-foreground")}>{n}</span>
                <span className="mt-1 block font-mono text-[10px] uppercase text-muted-foreground">{t(ok ? "Trade" : "Watch")}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
