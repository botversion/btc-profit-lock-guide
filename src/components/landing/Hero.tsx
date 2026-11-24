import { BookOpen, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DOWNLOAD_FILENAME, DOWNLOAD_PATH } from "@/lib/site";
import { Radar } from "./Radar";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-hero">
      <div className="bg-grid pointer-events-none absolute inset-0" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-16 px-5 pb-24 pt-16 md:pt-24 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <p className="section-eyebrow">MetaTrader 5 · BTCUSD Expert Advisor</p>
          <h1 className="mt-5 text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
            Scan Bitcoin. <br />
            Trade with a <span className="text-gradient-primary">stop on every move.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-muted-foreground">
            A disciplined BTCUSD bot that scores each signal, locks in profit, respects your loss limits — and
            lets you compete on the weekly leaderboard.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild variant="hero" size="xl">
              <a href={DOWNLOAD_PATH} download={DOWNLOAD_FILENAME}>
                <Download /> Download
              </a>
            </Button>
            <Button asChild variant="terminal" size="xl">
              <a href="#install">
                <BookOpen /> Install guide
              </a>
            </Button>
          </div>
          <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-border pt-6 font-mono text-sm">
            <div>
              <dt className="text-muted-foreground">Platform</dt>
              <dd className="mt-1 text-foreground">MT5</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Symbol</dt>
              <dd className="mt-1 text-foreground">BTCUSD</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Stops</dt>
              <dd className="mt-1 text-signal">100%</dd>
            </div>
          </dl>
        </div>
        <Radar />
      </div>
    </section>
  );
}
