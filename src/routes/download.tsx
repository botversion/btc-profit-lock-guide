import { createFileRoute } from "@tanstack/react-router";
import { DownloadSection } from "@/components/landing/DownloadSection";
import { NextPage, PageBody, PageHeader } from "@/components/landing/PageHeader";

const TITLE = "Download the BTCUSD Bot for MT5 — BTCBot Weekly Challenge";
const DESCRIPTION = "Download the BTCBot .mq5 Expert Advisor for MetaTrader 5 and check the requirements before you install.";

export const Route = createFileRoute("/download")({
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
