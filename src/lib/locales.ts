export const LOCALES = ["en", "fr", "de"] as const;
export type Locale = (typeof LOCALES)[number];
export const PUBLIC_PATHS = ["/", "/features", "/download", "/install", "/ranking", "/faq", "/documentation"] as const;
export type PublicPath = (typeof PUBLIC_PATHS)[number];

const paths = {
  en: { "/": "/", "/features": "/features", "/download": "/download", "/install": "/install", "/ranking": "/ranking", "/faq": "/faq", "/documentation": "/documentation" },
  fr: { "/": "/fr", "/features": "/fr/features", "/download": "/fr/download", "/install": "/fr/install", "/ranking": "/fr/ranking", "/faq": "/fr/faq", "/documentation": "/fr/documentation" },
  de: { "/": "/de", "/features": "/de/features", "/download": "/de/download", "/install": "/de/install", "/ranking": "/de/ranking", "/faq": "/de/faq", "/documentation": "/de/documentation" },
} as const;

export function localeFromPath(pathname: string): Locale {
  const prefix = pathname.split("/")[1];
  return prefix === "fr" || prefix === "de" ? prefix : "en";
}

export function publicPathFromLocation(pathname: string): PublicPath {
  const path = pathname.replace(/^\/(fr|de)(?=\/|$)/, "").replace(/\/$/, "") || "/";
  return PUBLIC_PATHS.find((candidate) => candidate === path) ?? "/";
}

export function localizedPath(locale: Locale, path: PublicPath) {
  return paths[locale][path];
}