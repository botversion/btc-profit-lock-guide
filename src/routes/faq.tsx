import { pageHead } from "@/lib/page-head";
import { createFileRoute } from "@tanstack/react-router";
import { Faq } from "@/components/landing/Faq";
import { PageBody, PageHeader } from "@/components/landing/PageHeader";

export const Route = createFileRoute("/faq")({
  head: () => pageHead("en", "/faq"),
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
