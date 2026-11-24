import { Link } from "@tanstack/react-router";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { RANK_ALLOW_URL } from "@/lib/site";

const STEPS = [
  { title: "Install MetaTrader 5", text: "Download MT5 from your broker or metatrader5.com and sign in to your trading account." },
  { title: "Open the data folder", text: "In MT5 choose File → Open Data Folder, then open MQL5 → Experts." },
  { title: "Copy the bot file", text: "Paste the downloaded .mq5 file into the Experts folder." },
  { title: "Compile in MetaEditor", text: "Press F4, open the file and click Compile. Then refresh the Navigator in MT5." },
  { title: "Open a BTCUSD chart", text: "Open a chart for BTCUSD (your broker's Bitcoin symbol) and drag the bot onto it." },
  { title: "Enable Algo Trading", text: "Tick “Allow Algo Trading” in the bot settings and switch on the Algo Trading button in the toolbar." },
  { title: "Allow the ranking address", text: "Tools → Options → Expert Advisors → tick “Allow WebRequest for listed URL” and add this address:" },
];

function CopyAddress() {
  const [copied, setCopied] = useState(false);
  return (
    <div className="mt-4 flex max-w-md items-stretch overflow-hidden rounded-md border border-signal/40">
      <code className="flex-1 break-all bg-background px-3 py-2 font-mono text-sm text-signal">{RANK_ALLOW_URL}</code>
      <button
        type="button"
        onClick={() => {
          void navigator.clipboard?.writeText(RANK_ALLOW_URL).then(() => {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1600);
          });
        }}
        className="flex cursor-pointer items-center gap-1.5 border-l border-signal/40 px-3 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-signal" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

export function InstallGuide() {
  return (
    <div className="grid gap-14 lg:grid-cols-[1fr_280px]">
      <ol>
        {STEPS.map((s, i) => (
          <li key={s.title} className="relative grid grid-cols-[3rem_1fr] gap-5 pb-10 last:pb-0">
            {i < STEPS.length - 1 && <span className="absolute bottom-0 left-6 top-12 w-px bg-border" aria-hidden />}
            <span className="grid h-12 w-12 place-items-center rounded-full border border-border bg-card font-mono text-sm text-primary">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="pt-2.5">
              <h2 className="text-lg font-bold">{s.title}</h2>
              <p className="mt-1.5 max-w-xl leading-relaxed text-muted-foreground">{s.text}</p>
              {i === STEPS.length - 1 && <CopyAddress />}
            </div>
          </li>
        ))}
      </ol>
      <aside className="h-fit rounded-lg border border-border bg-card p-6 lg:sticky lg:top-24">
        <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">Before you start</h2>
        <ul className="mt-4 space-y-3 text-sm">
          <li>MetaTrader 5 desktop</li>
          <li>
            The bot file —{" "}
            <Link to="/download" className="text-primary hover:underline">
              download it
            </Link>
          </li>
          <li>A trading account (demo recommended)</li>
        </ul>
      </aside>
    </div>
  );
}
