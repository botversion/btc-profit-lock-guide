import { createFileRoute } from "@tanstack/react-router";
import { InstallGuide } from "@/components/landing/InstallGuide";
import { NextPage, PageBody, PageHeader } from "@/components/landing/PageHeader";

const TITLE = "Installation Guide — BTCBot Weekly Challenge";
const DESCRIPTION = "Seven steps to install the BTCBot Expert Advisor: from MetaTrader 5 setup to allowing the ranking address.";

export const Route = createFileRoute("/install")({
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
  component: InstallPage,
});

function InstallPage() {
  return (
    <>
      <PageHeader index="03" eyebrow="Installation guide" title="Up and running in seven steps." lead="From a fresh MetaTrader 5 install to your first scan. Takes about ten minutes." />
      <PageBody>
        <InstallGuide />
        <NextPage to="/ranking" label="Weekly ranking" />
      </PageBody>
    </>
  );
}
