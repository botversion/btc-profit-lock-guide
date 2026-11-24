import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { isBotUserAgent, readVisitorId, referrerHost, shortUserAgent, visitorCookie } from "@/lib/tracking";

const Body = z.object({
  path: z.string().min(1).max(200).regex(/^\/[\w\-./]*$/),
  referrer: z.string().max(1000).optional(),
});

// Public: records an anonymous page view. Stores no personal data, returns nothing.
export const Route = createFileRoute("/api/public/visit")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let json: unknown;
        try {
          json = await request.json();
        } catch {
          return new Response("Bad request", { status: 400 });
        }
        const parsed = Body.safeParse(json);
        if (!parsed.success) return new Response("Bad request", { status: 400 });

        const existing = readVisitorId(request.headers.get("cookie"));
        const visitorId = existing ?? crypto.randomUUID();
        const ua = request.headers.get("user-agent");
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { error } = await supabaseAdmin.from("page_visits").insert({
          visitor_id: visitorId,
          path: parsed.data.path,
          referrer: referrerHost(parsed.data.referrer, new URL(request.url).host),
          country: (request.headers.get("cf-ipcountry") ?? "").slice(0, 2),
          user_agent: shortUserAgent(ua),
          is_bot: isBotUserAgent(ua),
        });
        if (error) console.error("visit insert failed", error.message);

        const headers = new Headers({ "Cache-Control": "no-store" });
        if (!existing) headers.set("Set-Cookie", visitorCookie(visitorId));
        return new Response(null, { status: 204, headers });
      },
    },
  },
});
