import { ExternalLink, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DOCUMENTATION_PREVIEW_URL, DOCUMENTATION_URL } from "@/lib/site";
import { useTranslation } from "./LocaleLink";

export function Documentation() {
  const { t } = useTranslation();
  return (
    <section>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold"><FileText className="h-5 w-5 text-primary" />{t("Bot documentation")}</h2>
        <Button asChild variant="outline" size="sm">
          <a href={DOCUMENTATION_URL} target="_blank" rel="noopener noreferrer"><ExternalLink />{t("Open original")}</a>
        </Button>
      </div>
      <iframe
        src={DOCUMENTATION_PREVIEW_URL}
        title={t("BTCBot documentation preview")}
        className="h-[70vh] min-h-[480px] w-full rounded-sm border border-border bg-surface sm:min-h-[640px]"
        allow="fullscreen"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </section>
  );
}