import { pageHead } from "@/lib/page-head";
import { createFileRoute } from "@tanstack/react-router";
import { NextPage, PageBody, PageHeader } from "@/components/landing/PageHeader";
import { Ranking } from "@/components/landing/Ranking";

export const Route = createFileRoute("/fr/ranking")({
  head: () => pageHead("fr", "/ranking"),
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
