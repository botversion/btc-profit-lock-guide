import { pageHead } from "@/lib/page-head";
import { createFileRoute } from "@tanstack/react-router";
import { DownloadSection } from "@/components/landing/DownloadSection";
import { NextPage, PageBody, PageHeader } from "@/components/landing/PageHeader";

export const Route = createFileRoute("/fr/download")({
  head: () => pageHead("fr", "/download"),
  component: DownloadPage,
});

function DownloadPage() {
  return (
    <>
      <PageHeader index="02" eyebrow="Download" title="Get the Expert Advisor." lead="One source file. Drop it into MetaTrader 5, compile, and attach it to a BTCUSD chart." />
      <PageBody>
        <DownloadSection />
        <NextPage to="/install" label="Installation guide" />
      </PageBody>
    </>
  );
}
