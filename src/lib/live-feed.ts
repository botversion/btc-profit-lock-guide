/**
 * Simulated bot dashboard feed. The price can be seeded from a real BTC quote;
 * everything after that is a random walk with the bot's rules applied.
 */
import { SIGNAL_MAX, SIGNAL_MIN, SIGNAL_TRADE_MIN } from "./site";

export type Side = "BUY" | "SELL";
export type Bias = Side | "WAIT";
export type LogTag = "SCAN" | "OPEN" | "LOCK" | "CLOSE";
export type LogEntry = { id: number; t: number; tag: LogTag; text: string };
export type Position = { side: Side; lots: number; entry: number; stop: number; locked: boolean; openedTick: number };

export type FeedState = {
  tick: number;
  now: number;
  price: number;
  prevPrice: number;
  drift: number;
  sessionOpen: number;
  history: number[];
  spread: number;
  score: number;
  bias: Bias;
  position: Position | null;
  balance: number;
  weekStart: number;
  dayLoss: number;
  tradesToday: number;
  wins: number;
  losses: number;
  log: LogEntry[];
  nextId: number;
};

export type Rand = () => number;

export const DAY_LOSS_LIMIT_PCT = 3;
const HISTORY_LEN = 60;
const LOG_LEN = 5;
const LOTS = 0.2;
const STOP_PCT = 0.0018;
const LOCK_TRIGGER_PCT = 0.0012;
const LOCK_TRAIL_PCT = 0.0008;
const MAX_HOLD_TICKS = 150;

export function mulberry32(seed: number): Rand {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function clampScore(n: number): number {
  if (!Number.isFinite(n)) return SIGNAL_MIN;
  return Math.min(SIGNAL_MAX, Math.max(SIGNAL_MIN, Math.round(n)));
}

/** Move the score by at most one point; r is a random number in [0, 1). */
export function stepScore(prev: number, r: number): number {
  if (r < 0.3) return clampScore(prev - 1);
  if (r >= 0.7) return clampScore(prev + 1);
  return clampScore(prev);
}

const r2 = (n: number) => Math.round(n * 100) / 100;

export const fmtPrice = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function walk(price: number, drift: number, rand: Rand) {
  const nextDrift = drift * 0.9 + (rand() - 0.5) * 0.00012;
  return { price: r2(price * (1 + nextDrift + (rand() - 0.5) * 0.0006)), drift: nextDrift };
}

function biasOf(history: number[], price: number): Bias {
  const ref = history[history.length - 12] ?? history[0] ?? price;
  const rel = (price - ref) / ref;
  if (rel > 0.0003) return "BUY";
  if (rel < -0.0003) return "SELL";
  return "WAIT";
}

export function createInitialState(seedPrice: number, now: number, rand: Rand = mulberry32(42)): FeedState {
  const raw: number[] = [];
  let price = seedPrice;
  let drift = 0.00004;
  for (let i = 0; i < HISTORY_LEN; i++) {
    ({ price, drift } = walk(price, drift, rand));
    raw.push(price);
  }
  const offset = seedPrice - price;
  const history = raw.map((p) => r2(p + offset));
  const last = history[HISTORY_LEN - 1] ?? seedPrice;
  const entry = history[25] ?? last;
  const stop = r2(Math.min(entry, last) * (1 - STOP_PCT));
  return {
    tick: HISTORY_LEN,
    now,
    price: last,
    prevPrice: history[HISTORY_LEN - 2] ?? last,
    drift,
    sessionOpen: r2(seedPrice / 1.0121),
    history,
    spread: 14,
    score: SIGNAL_TRADE_MIN,
    bias: biasOf(history, last),
    position: { side: "BUY", lots: LOTS, entry, stop, locked: false, openedTick: 25 },
    balance: 10431.2,
    weekStart: 10000,
    dayLoss: 62.4,
    tradesToday: 5,
    wins: 3,
    losses: 1,
    nextId: 3,
    log: [
      { id: 2, t: now - 3000, tag: "SCAN", text: `score ${SIGNAL_TRADE_MIN} · managing BUY` },
      { id: 1, t: now - 35000, tag: "OPEN", text: `BUY ${LOTS.toFixed(2)} @ ${fmtPrice(entry)} · SL ${fmtPrice(stop)}` },
    ],
  };
}

export function nextState(s: FeedState, rand: Rand, now: number): FeedState {
  const tick = s.tick + 1;
  const { price, drift } = walk(s.price, s.drift, rand);
  const history = [...s.history, price].slice(-HISTORY_LEN);
  const spread = r2(Math.max(8, Math.min(30, s.spread + (rand() - 0.5) * 4)));
  const bias = biasOf(history, price);
  let score = tick % 2 === 0 ? stepScore(s.score, rand()) : s.score;
  if (bias === "WAIT" && score > SIGNAL_TRADE_MIN && rand() < 0.3) score = clampScore(score - 1);

  let { position, balance, dayLoss, tradesToday, wins, losses, nextId } = s;
  let log = s.log;
  const add = (tag: LogTag, text: string) => {
    log = [{ id: nextId++, t: now, tag, text }, ...log].slice(0, LOG_LEN);
  };
  const bid = price;
  const ask = r2(price + spread);

  if (position) {
    const dir = position.side === "BUY" ? 1 : -1;
    const mark = dir === 1 ? bid : ask;
    const stopHit = dir * (mark - position.stop) <= 0;
    const expired = tick - position.openedTick >= MAX_HOLD_TICKS;
    if (stopHit || expired) {
      const exit = stopHit ? position.stop : mark;
      const pnl = r2((exit - position.entry) * dir * position.lots);
      balance = r2(balance + pnl);
      if (pnl >= 0) wins++;
      else {
        losses++;
        dayLoss = r2(dayLoss - pnl);
      }
      add("CLOSE", `${position.side} closed @ ${fmtPrice(exit)} · ${pnl >= 0 ? "+" : "−"}$${Math.abs(pnl).toFixed(2)}`);
      position = null;
    } else if ((dir * (mark - position.entry)) / position.entry >= LOCK_TRIGGER_PCT) {
      const candidate = r2(mark * (1 - dir * LOCK_TRAIL_PCT));
      if (dir * (candidate - position.stop) >= position.entry * 0.0002) {
        position = { ...position, stop: candidate, locked: true };
        add("LOCK", `profit lock · SL → ${fmtPrice(candidate)}`);
      }
    }
  } else if (
    bias !== "WAIT" &&
    score >= SIGNAL_TRADE_MIN &&
    (dayLoss / s.weekStart) * 100 < DAY_LOSS_LIMIT_PCT &&
    rand() < 0.35
  ) {
    const entry = bias === "BUY" ? ask : bid;
    const stop = r2(entry * (1 - (bias === "BUY" ? 1 : -1) * STOP_PCT));
    position = { side: bias, lots: LOTS, entry, stop, locked: false, openedTick: tick };
    tradesToday++;
    add("OPEN", `${bias} ${LOTS.toFixed(2)} @ ${fmtPrice(entry)} · score ${score} · SL ${fmtPrice(stop)}`);
  }

  if (log === s.log && tick % 5 === 0) {
    add(
      "SCAN",
      position
        ? `score ${score} · managing ${position.side}`
        : score < SIGNAL_TRADE_MIN
          ? `score ${score} · below ${SIGNAL_TRADE_MIN}, no trade`
          : bias === "WAIT"
            ? `score ${score} · no clear direction`
            : `score ${score} · ${bias} setup`,
    );
  }

  return { ...s, tick, now, price, prevPrice: s.price, drift, history, spread, score, bias, position, balance, dayLoss, tradesToday, wins, losses, log, nextId };
}

export function deriveView(s: FeedState) {
  const bid = s.price;
  const ask = r2(s.price + s.spread);
  const pos = s.position;
  const floatPnl = pos
    ? r2(((pos.side === "BUY" ? bid : ask) - pos.entry) * (pos.side === "BUY" ? 1 : -1) * pos.lots)
    : 0;
  const closed = s.wins + s.losses;
  return {
    bid,
    ask,
    floatPnl,
    up: s.price >= s.prevPrice,
    changePct: ((s.price - s.sessionOpen) / s.sessionOpen) * 100,
    dayLossPct: (s.dayLoss / s.weekStart) * 100,
    weekPct: ((s.balance + floatPnl - s.weekStart) / s.weekStart) * 100,
    winRate: closed ? (s.wins / closed) * 100 : 0,
    tradable: s.score >= SIGNAL_TRADE_MIN,
  };
}

export const fmtTime = (t: number) =>
  t > 0 ? new Date(t).toLocaleTimeString("en-GB", { hour12: false }) : "--:--:--";
