import { AlertTriangle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BOT_NAME } from "@/lib/site";

const FAQ = [
  { q: "Which broker do I need?", a: "Any broker that offers MetaTrader 5 and a Bitcoin (BTCUSD) symbol. Symbol names can vary slightly between brokers." },
  { q: "Can I test it on a demo account first?", a: "Yes — and we recommend it. Run the bot on a demo account until you're comfortable with how it behaves." },
  { q: "Does every trade really have a stop-loss?", a: "Yes. The bot attaches a stop-loss when it opens a position, and profit locking moves it as the trade moves in your favour." },
  { q: "What happens when a loss limit is hit?", a: "The bot stops opening new trades until the next period begins, so a bad day can't snowball." },
  { q: "Why do I need to allow the ranking address?", a: "MetaTrader 5 blocks web requests by default. Allowing the ranking address lets the Rank button send your stats to the leaderboard." },
  { q: "Does my PC need to stay on?", a: "Yes. The bot only runs while MetaTrader 5 is open. Many traders use a VPS to keep it running around the clock." },
];

export function Faq() {
  return (
    <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <Accordion type="single" collapsible className="border-t border-border">
            {FAQ.map((f, i) => (
              <AccordionItem key={f.q} value={`q${i}`} className="border-border">
                <AccordionTrigger className="py-5 text-base hover:no-underline hover:text-primary">{f.q}</AccordionTrigger>
                <AccordionContent className="leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <aside
          aria-labelledby="risk-title"
          className="h-fit rounded-lg border border-loss/40 bg-loss/5 p-7 lg:sticky lg:top-24"
        >
          <div className="flex items-center gap-3 text-loss">
            <AlertTriangle className="h-5 w-5" />
            <h3 id="risk-title" className="text-lg font-semibold">Risk notice</h3>
          </div>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p>
              Trading Bitcoin and other leveraged products carries a high level of risk and may not be suitable for
              everyone. You can lose some or all of your capital.
            </p>
            <p>
              {BOT_NAME} is a tool, not financial advice. Past results and leaderboard figures do not guarantee future
              performance. Only trade with money you can afford to lose, and test on a demo account first.
            </p>
          </div>
        </aside>
    </div>
  );
}
