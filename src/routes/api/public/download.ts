import { createFileRoute } from "@tanstack/react-router";
import { isBotUserAgent, readVisitorId, referrerHost, shortUserAgent, visitorCookie } from "@/lib/tracking";

const FALLBACK_PATH = "/downloads/BTCBot.mq5";
const FALLBACK_NAME = "BTCBot.mq5";

// Public: logs the download, then sends the visitor to the current bot file.
export const Route = createFileRoute("/api/public/download")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        let location = FALLBACK_PATH;
        let fileName = FALLBACK_NAME;
        let fileId: string | null = null;

        const { data: file } = await supabaseAdmin
          .from("bot_files")
          .select("id, file_name, storage_path")
          .eq("is_current", true)
          .maybeSingle();
        if (file) {
          const { data: signed } = await supabaseAdmin.storage
            .from("bot-files")
            .createSignedUrl(file.storage_path, 300, { download: file.file_name });
          if (signed?.signedUrl) {
            location = signed.signedUrl;
            fileName = file.file_name;
            fileId = file.id;
          }
        }

        const existing = readVisitorId(request.headers.get("cookie"));
        const visitorId = existing ?? crypto.randomUUID();
        const ua = request.headers.get("user-agent");
        const { error } = await supabaseAdmin.from("download_events").insert({
          visitor_id: visitorId,
          file_id: fileId,
          file_name: fileName,
          referrer: referrerHost(request.headers.get("referer"), new URL(request.url).host),
          country: (request.headers.get("cf-ipcountry") ?? "").slice(0, 2),
          user_agent: shortUserAgent(ua),
          is_bot: isBotUserAgent(ua),
        });
        if (error) console.error("download insert failed", error.message);

        const headers = new Headers({ Location: location, "Cache-Control": "no-store" });
        if (!existing) headers.set("Set-Cookie", visitorCookie(visitorId));
        return new Response(null, { status: 302, headers });
      },
    },
  },
});
