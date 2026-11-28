import { Link as AdminLink } from "@tanstack/react-router";
import { useTranslation, LocaleLink as Link } from "./LocaleLink";
import { PAGES, SUPPORT_EMAIL } from "@/lib/site";
import { Logo } from "./Header";

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">{t("A BTCUSD Expert Advisor for MetaTrader 5 with a weekly leaderboard.")}</p>
        </div>
        <nav aria-label={t("Footer")}>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">{t("Pages")}</p>
          <ul className="mt-4 grid grid-cols-2 gap-y-2 text-sm">
            {PAGES.map((p) => (
              <li key={p.to}>
                <Link to={p.to} className="text-foreground/80 transition-colors hover:text-primary">
                  {t(p.label ?? "")}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">{t("Contact")}</p>
          <p className="mt-4 text-sm">
            For Support:{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary hover:underline">
              {SUPPORT_EMAIL}
            </a>
          </p>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-5 font-mono text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} BTCBot Weekly Challenge</span>
          <span className="flex gap-4">
            <span>{t("Trading involves risk. Not financial advice.")}</span>
            <AdminLink to="/admin" className="hover:text-foreground">{t("Admin")}</AdminLink>
          </span>
        </div>
      </div>
    </footer>
  );
}
