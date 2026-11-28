import { pageHead } from "@/lib/page-head";
import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/landing/Hero";
import { Explore, TradeFlow } from "@/components/landing/HomeSections";

export const Route = createFileRoute("/")({
  head: () => pageHead("en", "/"),
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
