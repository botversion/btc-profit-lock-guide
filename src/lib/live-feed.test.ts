import { describe, expect, it } from "vitest";
import { clampScore, createInitialState, mulberry32, nextState, stepScore } from "./live-feed";

describe("signal score stays between 3 and 8", () => {
  it("clamps values outside the scale", () => {
    expect(clampScore(2)).toBe(3);
    expect(clampScore(9)).toBe(8);
    expect(clampScore(0)).toBe(3);
    expect(clampScore(100)).toBe(8);
  });
  it("never steps below 3 or above 8", () => {
    expect(stepScore(3, 0.1)).toBe(3);
    expect(stepScore(8, 0.9)).toBe(8);
  });
  it("stays in range over a long live run", () => {
    const rand = mulberry32(7);
    let s = createInitialState(60000, 1);
    for (let i = 0; i < 3000; i++) {
      s = nextState(s, rand, i);
      expect(s.score).toBeGreaterThanOrEqual(3);
      expect(s.score).toBeLessThanOrEqual(8);
    }
  });
});

describe("trades only open at score 4 or higher", () => {
  it("never opens a position on a score below 4", () => {
    const rand = mulberry32(11);
    let s = createInitialState(60000, 1);
    let opened = 0;
    for (let i = 0; i < 3000; i++) {
      const next = nextState(s, rand, i);
      if (!s.position && next.position) {
        opened++;
        expect(next.score).toBeGreaterThanOrEqual(4);
      }
      s = next;
    }
    expect(opened).toBeGreaterThan(0);
  });
});
