import { createFileRoute } from "@tanstack/react-router";
import { Features, ScoreScale } from "@/components/landing/Features";
import { NextPage, PageBody, PageHeader } from "@/components/landing/PageHeader";

const TITLE = "Features — BTCBot Weekly Challenge";
const DESCRIPTION = "Stops on every trade, signal scoring from 3 to 8, profit locking, loss limits, a live dashboard and a full trade log.";

export const Route = createFileRoute("/features")({
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
  component: FeaturesPage,
});

function FeaturesPage() {
  return (
    <>
      <PageHeader index="01" eyebrow="Features" title="Built around risk control first." lead="Six things the bot does on every chart it runs on — starting with the stop-loss." />
      <PageBody>
        <Features />
        <ScoreScale />
        <NextPage to="/download" label="Download the bot" />
      </PageBody>
    </>
  );
}
