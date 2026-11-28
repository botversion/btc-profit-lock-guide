import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { localeFromPath, localizedPath, type PublicPath } from "@/lib/locales";
import { translate } from "@/lib/translations";

export function useTranslation() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const locale = localeFromPath(pathname);
  return { locale, t: (text: string) => translate(text, locale) };
}

export function LocaleLink({ to, ...props }: {
  to: PublicPath;
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
  activeOptions?: { exact: boolean };
}) {
  const { locale } = useTranslation();
  return <Link to={localizedPath(locale, to)} {...props} />;
}