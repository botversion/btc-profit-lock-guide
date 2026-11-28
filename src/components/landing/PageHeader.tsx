import { useTranslation, LocaleLink as Link } from "./LocaleLink";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import type { PagePath } from "@/lib/site";

export function PageHeader({ index, eyebrow, title, lead }: { index: string; eyebrow: string; title: ReactNode; lead?: ReactNode }) {
  const { t } = useTranslation();
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-50" />
      <div className="relative mx-auto max-w-6xl px-5 pb-14 pt-14 md:pb-16 md:pt-20">
        <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
          <span className="text-primary">{index}</span>
          <span className="h-px w-8 bg-border" />
          {t(eyebrow ?? "")}
        </p>
        <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-[1.02] sm:text-5xl">{typeof title === "string" ? t(title) : title}</h1>
        {lead && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">{typeof lead === "string" ? t(lead) : lead}</p>}
      </div>
    </section>
  );
}

export function PageBody({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  return <div className="mx-auto max-w-6xl px-5 py-14 md:py-20">{children}</div>;
}

export function NextPage({ to, label }: { to: PagePath; label: string }) {
  const { t } = useTranslation();
  return (
    <Link
      to={to}
      className="group mt-20 flex items-center justify-between border-y border-border py-7 transition-colors hover:border-primary/60"
    >
      <span>
        <span className="block font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">{t("Next")}</span>
        <span className="mt-1 block font-display text-2xl font-bold [font-stretch:112%] group-hover:text-primary">{t(label ?? "")}</span>
      </span>
      <ArrowRight className="h-6 w-6 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
    </Link>
  );
}
