/** Helpers shared by the visit and download trackers. Pure so they can be tested. */
export const VISITOR_COOKIE = "btcbot_vid";

const BOT_RE = /bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit|curl|wget|python-requests/i;

export function isBotUserAgent(ua: string | null | undefined): boolean {
  if (!ua) return true;
  return BOT_RE.test(ua);
}

/** Keep only the referring site's host, and drop it when it is our own site. */
export function referrerHost(referrer: string | null | undefined, ownHost: string): string {
  if (!referrer) return "";
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "");
    return host === ownHost.replace(/^www\./, "").split(":")[0] ? "" : host.slice(0, 120);
  } catch {
    return "";
  }
}

export function readVisitorId(cookieHeader: string | null | undefined): string | null {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === VISITOR_COOKIE) {
      const v = rest.join("=");
      return /^[a-f0-9-]{36}$/i.test(v) ? v : null;
    }
  }
  return null;
}

export function visitorCookie(id: string): string {
  return `${VISITOR_COOKIE}=${id}; Path=/; Max-Age=31536000; SameSite=Lax; HttpOnly; Secure`;
}

export function shortUserAgent(ua: string | null | undefined): string {
  return (ua ?? "").slice(0, 300);
}
