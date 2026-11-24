import { describe, expect, it } from "vitest";
import { isBotUserAgent, readVisitorId, referrerHost } from "./tracking";

describe("visitor tracking", () => {
  it("does not count crawlers as visitors", () => {
    expect(isBotUserAgent("Mozilla/5.0 (compatible; Googlebot/2.1)")).toBe(true);
    expect(isBotUserAgent("")).toBe(true);
    expect(isBotUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0 Safari/537.36")).toBe(false);
  });
  it("keeps only the referring site, not our own pages", () => {
    expect(referrerHost("https://www.google.com/search?q=btc", "btcbot.com")).toBe("google.com");
    expect(referrerHost("https://btcbot.com/features", "btcbot.com")).toBe("");
  });
  it("reads a valid visitor id from the cookie", () => {
    const id = "123e4567-e89b-12d3-a456-426614174000";
    expect(readVisitorId(`a=1; btcbot_vid=${id}`)).toBe(id);
    expect(readVisitorId("btcbot_vid=<script>")).toBeNull();
  });
});
