import { useEffect, useState } from "react";
import { createInitialState, deriveView, nextState } from "@/lib/live-feed";

const FALLBACK_PRICE = 60000;
const QUOTE_URL = "https://api.exchange.coinbase.com/products/BTC-USD/stats";

/** Ticks once a second after mount; seeds from a real BTC-USD quote when it loads. */
export function useLiveFeed() {
  const [state, setState] = useState(() => createInitialState(FALLBACK_PRICE, 0));
  const [live, setLive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setState(createInitialState(FALLBACK_PRICE, Date.now()));
    setLive(true);
    fetch(QUOTE_URL)
      .then((r) => (r.ok ? (r.json() as Promise<{ open?: string; last?: string }>) : null))
      .then((j) => {
        const last = Number(j?.last);
        const open = Number(j?.open);
        if (cancelled || !(last > 0)) return;
        setState({ ...createInitialState(last, Date.now()), sessionOpen: open > 0 ? open : last });
      })
      .catch(() => {});
    const id = window.setInterval(() => setState((s) => nextState(s, Math.random, Date.now())), 1000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  return { state, view: deriveView(state), live };
}
