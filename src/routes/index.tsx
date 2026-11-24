import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/landing/Hero";
import { Explore, TradeFlow } from "@/components/landing/HomeSections";

const TITLE = "BTCBot Weekly Challenge — BTCUSD Trading Bot for MetaTrader 5";
const DESCRIPTION =
  "A BTCUSD Expert Advisor for MT5 with stops on every trade, 3–8 signal scoring, profit locking, loss limits and a weekly leaderboard.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <TradeFlow />
      <Explore />
    </>
  );
}
