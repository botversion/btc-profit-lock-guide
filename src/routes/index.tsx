import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { DownloadSection } from "@/components/landing/DownloadSection";
import { InstallGuide } from "@/components/landing/InstallGuide";
import { Ranking } from "@/components/landing/Ranking";
import { Faq } from "@/components/landing/Faq";
import { Footer } from "@/components/landing/Footer";

const TITLE = "BTCBot Weekly Challenge — BTCUSD Trading Bot for MetaTrader 5";
const DESCRIPTION =
  "A BTCUSD Expert Advisor for MT5 with stops on every trade, signal scoring, profit locking, loss limits and a weekly leaderboard.";

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
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <DownloadSection />
        <InstallGuide />
        <Ranking />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
