import { pageHead } from "@/lib/page-head";
import { createFileRoute } from "@tanstack/react-router";
import { InstallGuide } from "@/components/landing/InstallGuide";
import { NextPage, PageBody, PageHeader } from "@/components/landing/PageHeader";

export const Route = createFileRoute("/install")({
  head: () => pageHead("en", "/install"),
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
