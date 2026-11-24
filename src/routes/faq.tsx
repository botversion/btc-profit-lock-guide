import { createFileRoute } from "@tanstack/react-router";
import { Faq } from "@/components/landing/Faq";
import { PageBody, PageHeader } from "@/components/landing/PageHeader";

const TITLE = "FAQ & Risk Notice — BTCBot Weekly Challenge";
const DESCRIPTION = "Answers about brokers, demo testing, stop-losses, loss limits and the ranking address, plus the trading risk notice.";

export const Route = createFileRoute("/faq")({
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
  component: FaqPage,
});

function FaqPage() {
  return (
    <>
      <PageHeader index="05" eyebrow="FAQ" title="Questions, answered." lead="If yours isn't here, email support from the link at the bottom of the page." />
      <PageBody>
        <Faq />
      </PageBody>
    </>
  );
}
