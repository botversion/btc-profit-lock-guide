import { Link, useRouterState } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { LOCALES, localizedPath, publicPathFromLocation } from "@/lib/locales";
import { useTranslation } from "./LocaleLink";

const names = { en: "English", fr: "Français", de: "Deutsch" } as const;

export function LanguageSwitcher() {
  const { locale } = useTranslation();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  return (
    <nav aria-label="Language" className="flex shrink-0 items-center gap-0.5">
      {LOCALES.map((language) => (
        <Button key={language} asChild size="sm" variant={locale === language ? "secondary" : "ghost"} className="h-8 px-2 font-mono text-xs">
          <Link to={localizedPath(language, publicPathFromLocation(pathname))} lang={language} hrefLang={language} aria-label={names[language]} aria-current={locale === language ? "page" : undefined}>
            {language.toUpperCase()}
          </Link>
        </Button>
      ))}
    </nav>
  );
}