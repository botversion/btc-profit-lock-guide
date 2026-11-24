import { RANK_ALLOW_URL } from "@/lib/site";

const STEPS = [
  { title: "Install MetaTrader 5", text: "Download MT5 from your broker or metatrader5.com and sign in to your trading account." },
  { title: "Open the data folder", text: "In MT5 choose File → Open Data Folder, then open MQL5 → Experts." },
  { title: "Copy the bot file", text: "Paste the downloaded .mq5 file into the Experts folder." },
  { title: "Compile in MetaEditor", text: "Press F4, open the file and click Compile. Then refresh the Navigator in MT5." },
  { title: "Open a BTCUSD chart", text: "Open a chart for BTCUSD (your broker's Bitcoin symbol) and drag the bot onto it." },
  { title: "Enable Algo Trading", text: "Tick “Allow Algo Trading” in the bot settings and switch on the Algo Trading button in the toolbar." },
  { title: "Allow the ranking address", text: "Tools → Options → Expert Advisors → tick “Allow WebRequest for listed URL” and add the address below." },
];

export function InstallGuide() {
  return (
    <section id="install" className="border-t border-border bg-surface/40 py-24">
      <div className="mx-auto max-w-6xl px-5">
        <p className="section-eyebrow">Installation guide</p>
        <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Up and running in seven steps.</h2>
        <ol className="mt-12 grid gap-4 md:grid-cols-2">
          {STEPS.map((s, i) => (
            <li
              key={s.title}
              className={`flex gap-5 rounded-xl border border-border bg-card p-6 ${i === STEPS.length - 1 ? "md:col-span-2" : ""}`}
            >
              <span className="font-display text-3xl font-bold text-primary/80">{String(i + 1).padStart(2, "0")}</span>
              <div className="min-w-0">
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                {i === STEPS.length - 1 && (
                  <code className="mt-3 inline-block break-all rounded-md border border-signal/40 bg-background px-3 py-1.5 font-mono text-sm text-signal">
                    {RANK_ALLOW_URL}
                  </code>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
