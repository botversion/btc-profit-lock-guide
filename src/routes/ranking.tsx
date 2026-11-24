import { createFileRoute } from "@tanstack/react-router";
import { NextPage, PageBody, PageHeader } from "@/components/landing/PageHeader";
import { Ranking } from "@/components/landing/Ranking";

const TITLE = "Weekly Ranking & Leaderboard — BTCBot Weekly Challenge";
const DESCRIPTION = "See how the Rank button works, sort the weekly BTCUSD leaderboard and look up any trader by username.";

export const Route = createFileRoute("/ranking")({
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
  component: RankingPage,
});

function RankingPage() {
  return (
    <>
      <PageHeader index="04" eyebrow="Weekly ranking" title="Compete every week." lead="Press Rank on your chart to post your stats. The leaderboard resets every week." />
      <PageBody>
        <Ranking />
        <NextPage to="/faq" label="FAQ & risk notice" />
      </PageBody>
    </>
  );
}
