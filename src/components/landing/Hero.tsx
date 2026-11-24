import { Link } from "@tanstack/react-router";
import { ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DOWNLOAD_FILENAME, DOWNLOAD_PATH, SIGNAL_MAX, SIGNAL_MIN } from "@/lib/site";
import { LiveTerminal } from "./LiveTerminal";

const FACTS = [
  ["Platform", "MetaTrader 5"],
  ["Symbol", "BTCUSD"],
  ["Signal score", `${SIGNAL_MIN}–${SIGNAL_MAX}`],
  ["Stop-loss", "Every trade"],
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-hero">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 pb-20 pt-14 md:pt-20 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <span className="h-px w-8 bg-primary" />
            MT5 Expert Advisor for BTCUSD
          </p>
          <h1 className="mt-6 text-[2.6rem] font-extrabold leading-[0.98] sm:text-6xl lg:text-[3.3rem]">
            Scan Bitcoin.
            <br />
            <span className="text-primary">Trade with a stop</span>
            <br />
            on every move.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
            The bot rates every setup from {SIGNAL_MIN} to {SIGNAL_MAX}, trades only the strong ones, locks in profit and
            stops when your loss limit is hit. Then it ranks you on the weekly leaderboard.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild variant="hero" size="xl">
              <a href={DOWNLOAD_PATH} download={DOWNLOAD_FILENAME}>
                <Download /> Download
              </a>
            </Button>
            <Button asChild variant="terminal" size="xl">
              <Link to="/install">
                Install guide <ArrowRight />
              </Link>
            </Button>
          </div>
          <dl className="mt-12 grid max-w-md grid-cols-2 border-l border-t border-border sm:grid-cols-4">
            {FACTS.map(([k, val]) => (
              <div key={k} className="border-b border-r border-border px-3 py-3">
                <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{k}</dt>
                <dd className="mt-1 text-sm font-medium">{val}</dd>
              </div>
            ))}
          </dl>
        </div>
        <LiveTerminal />
      </div>
    </section>
  );
}
