import { pageHead } from "@/lib/page-head";
import { createFileRoute } from "@tanstack/react-router";
import { Features, ScoreScale } from "@/components/landing/Features";
import { NextPage, PageBody, PageHeader } from "@/components/landing/PageHeader";

export const Route = createFileRoute("/features")({
  head: () => pageHead("en", "/features"),
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
