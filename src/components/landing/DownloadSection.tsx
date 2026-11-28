import { useTranslation } from "./LocaleLink";
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
  const { t } = useTranslation();
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.35fr]">
      <div className="h-fit rounded-lg border border-border bg-card">
        <div className="flex items-center gap-4 border-b border-border p-6">
          <div className="grid h-12 w-12 place-items-center rounded-md border border-primary/40 text-primary">
            <FileCode2 className="h-6 w-6" />
          </div>
          <div>
            <p className="font-mono text-sm">{DOWNLOAD_FILENAME}</p>
            <p className="text-xs text-muted-foreground">{t("MQL5 source · Expert Advisor")}</p>
          </div>
        </div>
        <div className="p-6">
          <Button asChild variant="hero" size="xl" className="w-full">
            <a href={DOWNLOAD_PATH} download={DOWNLOAD_FILENAME}>
              <Download />{t("Download .mq5")}</a>
          </Button>
          <p className="mt-4 text-center text-xs text-muted-foreground">{t("Free download · test on a demo account first")}</p>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-bold">{t("Requirements")}</h2>
        <table className="mt-4 w-full border-t border-border text-left text-sm">
          <caption className="sr-only">{t("Requirements")}</caption>
          <tbody>
            {REQUIREMENTS.map(([k, v]) => (
              <tr key={t(k ?? "")} className="border-b border-border">
                <th scope="row" className="w-40 py-4 pr-4 align-top font-mono text-xs font-normal uppercase tracking-wider text-muted-foreground">
                  {t(k ?? "")}
                </th>
                <td className="py-4">{t(v ?? "")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
