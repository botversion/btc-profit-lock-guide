import { pageHead } from "@/lib/page-head";
import { createFileRoute } from "@tanstack/react-router";
import { Documentation } from "@/components/landing/Documentation";
import { PageBody, PageHeader } from "@/components/landing/PageHeader";

export const Route = createFileRoute("/fr/documentation")({
  head: () => pageHead("fr", "/documentation"),
  component: DocumentationPage,
});

function DocumentationPage() {
  return <><PageHeader index="06" eyebrow="Documentation" title="Read the bot manual." /><PageBody><Documentation /></PageBody></>;
}