import { pageHead } from "@/lib/page-head";
import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/landing/Hero";
import { Explore, TradeFlow } from "@/components/landing/HomeSections";

export const Route = createFileRoute("/fr/")({
  head: () => pageHead("fr", "/"),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <TradeFlow />
      <Explore />
    </>
  );
}
