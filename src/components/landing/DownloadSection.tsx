import { Download, FileCode2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DOWNLOAD_FILENAME, DOWNLOAD_PATH } from "@/lib/site";

const REQUIREMENTS = [
  ["Platform", "MetaTrader 5 (desktop, Windows or macOS)"],
  ["Symbol", "BTCUSD (or your broker's Bitcoin symbol)"],
  ["Account", "Demo or live, hedging or netting"],
  ["Algo Trading", "Enabled in MT5 toolbar"],
  ["WebRequest", "Ranking address allowed (for the Rank button)"],
  ["Uptime", "PC or VPS running while the bot trades"],
];

export function DownloadSection() {
  return (
    <section id="download" className="border-t border-border py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <p className="section-eyebrow">Download</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Get the Expert Advisor.</h2>
          <p className="mt-4 text-muted-foreground">
            One source file. Drop it into MetaTrader 5, compile, and attach it to a BTCUSD chart.
          </p>
          <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-panel">
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-primary/15 text-primary">
                <FileCode2 className="h-6 w-6" />
              </div>
              <div>
                <p className="font-mono text-sm">{DOWNLOAD_FILENAME}</p>
                <p className="text-xs text-muted-foreground">MQL5 source · Expert Advisor</p>
              </div>
            </div>
            <Button asChild variant="hero" size="xl" className="mt-6 w-full">
              <a href={DOWNLOAD_PATH} download={DOWNLOAD_FILENAME}>
                <Download /> Download .mq5
              </a>
            </Button>
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Requirements</caption>
            <thead className="bg-surface font-mono text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Requirement</th>
                <th className="px-5 py-3 font-medium">Details</th>
              </tr>
            </thead>
            <tbody>
              {REQUIREMENTS.map(([k, v]) => (
                <tr key={k} className="border-t border-border bg-card">
                  <td className="px-5 py-4 font-medium">{k}</td>
                  <td className="px-5 py-4 text-muted-foreground">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
