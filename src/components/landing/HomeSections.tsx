import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { PAGES, SIGNAL_MAX, SIGNAL_MIN, SIGNAL_TRADE_MIN } from "@/lib/site";

const FLOW = [
  ["Scan", "Reads BTCUSD price action on every new bar."],
  ["Score", `Rates the setup ${SIGNAL_MIN}–${SIGNAL_MAX}. Below ${SIGNAL_TRADE_MIN}, it waits.`],
  ["Enter", "Opens the trade with a stop-loss already attached."],
  ["Lock", "Trails the stop behind price once the trade runs."],
  ["Log & rank", "Records the result and feeds your weekly ranking."],
];

export function TradeFlow() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-3xl font-bold sm:text-4xl">How a trade happens</h2>
          <p className="max-w-sm text-muted-foreground">The same five steps, every time. No trade skips the stop.</p>
        </div>
        <ol className="mt-12 grid border-l border-t border-border sm:grid-cols-2 lg:grid-cols-5">
          {FLOW.map(([title, text], i) => (
            <li key={title} className="border-b border-r border-border p-6">
              <span className="font-mono text-xs text-primary">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-6 text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Explore() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-5 py-20">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">Explore</p>
        <ul className="mt-6 border-t border-border">
          {PAGES.map((p) => (
            <li key={p.to}>
              <Link
                to={p.to}
                className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 border-b border-border py-6 transition-colors hover:bg-surface sm:grid-cols-[3rem_14rem_1fr_auto] sm:px-2"
              >
                <span className="font-mono text-xs text-muted-foreground">{p.index}</span>
                <span className="font-display text-2xl font-bold [font-stretch:112%] group-hover:text-primary">{p.label}</span>
                <span className="col-start-2 text-sm text-muted-foreground sm:col-start-auto">{p.blurb}</span>
                <ArrowUpRight className="row-start-1 col-start-3 h-5 w-5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary sm:col-start-4" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
