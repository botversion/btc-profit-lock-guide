import { describe, expect, it } from "vitest";
import { buildRankUrl, sortTraders, type Trader } from "./site";

describe("username lookup", () => {
  it("opens rankBase followed by the username", () => {
    expect(buildRankUrl("satoshi", "https://rank.example.com/u/")).toBe(
      "https://rank.example.com/u/satoshi",
    );
  });
  it("trims spaces and refuses an empty username", () => {
    expect(buildRankUrl("  bob  ", "https://r.io/")).toBe("https://r.io/bob");
    expect(buildRankUrl("   ", "https://r.io/")).toBeNull();
  });
});

describe("leaderboard sorting", () => {
  const rows: Trader[] = [
    { username: "b", profitPct: 5, winRate: 70, trades: 10, maxDrawdown: 2 },
    { username: "a", profitPct: 20, winRate: 50, trades: 30, maxDrawdown: 9 },
  ];
  it("sorts by profit descending", () => {
    expect(sortTraders(rows, "profitPct", "desc").map((r) => r.username)).toEqual(["a", "b"]);
  });
  it("sorts by username ascending", () => {
    expect(sortTraders(rows, "username", "asc").map((r) => r.username)).toEqual(["a", "b"]);
  });
  it("sorts by win rate descending", () => {
    expect(sortTraders(rows, "winRate", "desc").map((r) => r.username)).toEqual(["b", "a"]);
  });
});
