import { Gauge, LayoutDashboard, Lock, ScrollText, ShieldCheck, TrendingDown } from "lucide-react";

const FEATURES = [
  { icon: ShieldCheck, title: "Stops on every trade", text: "No position opens without a stop-loss attached. Ever." },
  { icon: Gauge, title: "Signal scoring", text: "Each setup gets a 0–100 score; only strong signals are traded." },
  { icon: Lock, title: "Profit locking", text: "Stops trail behind price to protect gains once a trade runs." },
  { icon: TrendingDown, title: "Loss limits", text: "Daily and weekly loss caps pause trading before damage grows." },
  { icon: LayoutDashboard, title: "Live dashboard", text: "See the scan, score, open risk and P/L right on your chart." },
  { icon: ScrollText, title: "Trade log", text: "Every entry, exit and reason is recorded for easy review." },
];

export function Features() {
  return (
    <section id="features" className="border-t border-border bg-surface/40 py-24">
      <div className="mx-auto max-w-6xl px-5">
        <p className="section-eyebrow">What the bot does</p>
        <h2 className="mt-3 max-w-xl text-3xl font-bold sm:text-4xl">Built around risk control first.</h2>
        <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, text }, i) => (
            <div key={title} className="group bg-card p-7 transition-colors hover:bg-accent">
              <div className="flex items-center justify-between">
                <Icon className="h-6 w-6 text-primary" />
                <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
              </div>
              <h3 className="mt-6 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
