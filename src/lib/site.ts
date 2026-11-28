export const BOT_NAME = "BTCBot Weekly Challenge";
export const BOT_SHORT_NAME = "BTCBot";
export const SUPPORT_EMAIL = "xauscalper.version@gmail.com";
/** Logs the download, then serves the current bot file (uploaded in the admin dashboard). */
export const DOWNLOAD_PATH = "/api/public/download";
export const DOWNLOAD_FILENAME = "BTCBot.mq5";
export const DOCUMENTATION_URL = "https://drive.google.com/file/d/1g_fgZAz4q_AznOYU5xGmehzJQQMsy78r/view";
export const DOCUMENTATION_PREVIEW_URL = "https://drive.google.com/file/d/1g_fgZAz4q_AznOYU5xGmehzJQQMsy78r/preview";
/** Ranking server base address (mock until the real server exists). A username lookup opens RANK_BASE + username. */
export const RANK_BASE = "https://rank.btcbot.com/u/";
/** Address users allow in MT5 WebRequest settings so the Rank button can submit. */
export const RANK_ALLOW_URL = new URL(RANK_BASE).origin;

/** The bot's indicator rates every setup on this scale. */
export const SIGNAL_MIN = 3;
export const SIGNAL_MAX = 8;
/** Lowest signal score the bot opens a trade on. */
export const SIGNAL_TRADE_MIN = 4;

export const PAGES = [
  { to: "/features", label: "Features", index: "01", blurb: "Stops, scoring, profit locking, loss limits, dashboard and trade log." },
  { to: "/download", label: "Download", index: "02", blurb: "Get the .mq5 file and check what you need to run it." },
  { to: "/install", label: "Install", index: "03", blurb: "Seven steps from MetaTrader 5 to your first scan." },
  { to: "/ranking", label: "Ranking", index: "04", blurb: "Press Rank, climb the weekly leaderboard, look up any trader." },
  { to: "/faq", label: "FAQ", index: "05", blurb: "Common questions and the risk notice." },
  { to: "/documentation", label: "Documentation", index: "06", blurb: "Read the bot documentation." },
] as const;

export type PagePath = (typeof PAGES)[number]["to"];

export function buildRankUrl(username: string, base: string = RANK_BASE): string | null {
  const name = username.trim();
  if (!name) return null;
  return base + encodeURIComponent(name);
}

export type Trader = {
  username: string;
  profitPct: number;
  winRate: number;
  trades: number;
  maxDrawdown: number;
};

export type SortKey = keyof Trader;
export type SortDir = "asc" | "desc";

export function sortTraders(rows: readonly Trader[], key: SortKey, dir: SortDir): Trader[] {
  const sign = dir === "asc" ? 1 : -1;
  return [...rows].sort((a, b) => {
    const x = a[key];
    const y = b[key];
    if (typeof x === "string" && typeof y === "string") return x.localeCompare(y) * sign;
    return ((x as number) - (y as number)) * sign;
  });
}

/** Sample leaderboard rows shown until the page reads from the ranking server. */
export const SAMPLE_TRADERS: Trader[] = [
  { username: "satoshi_scan", profitPct: 38.4, winRate: 64.2, trades: 412, maxDrawdown: 6.1 },
  { username: "orange_pill", profitPct: 31.9, winRate: 61.5, trades: 377, maxDrawdown: 7.4 },
  { username: "halving_hawk", profitPct: 27.2, winRate: 58.9, trades: 501, maxDrawdown: 8.8 },
  { username: "m5_sniper", profitPct: 22.6, winRate: 66.7, trades: 219, maxDrawdown: 4.3 },
  { username: "blockwatcher", profitPct: 18.1, winRate: 55.3, trades: 644, maxDrawdown: 9.6 },
  { username: "coldwallet", profitPct: 14.7, winRate: 59.8, trades: 298, maxDrawdown: 5.2 },
  { username: "dca_dave", profitPct: 11.3, winRate: 52.4, trades: 188, maxDrawdown: 7.9 },
  { username: "lightning_lou", profitPct: 8.9, winRate: 57.1, trades: 156, maxDrawdown: 3.8 },
];
