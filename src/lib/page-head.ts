import { BOT_NAME } from "./site";
import { localizedPath, type Locale, type PublicPath, LOCALES } from "./locales";

const metadata: Record<Locale, Record<PublicPath, readonly [string, string]>> = {
  en: {
    "/": ["BTCUSD Trading Bot for MetaTrader 5", "BTCUSD Expert Advisor with 3–8 signal scores, profit locking, loss limits and a weekly leaderboard."],
    "/features": ["Features", "Stops on every trade, signal scores from 3 to 8, profit locking, loss limits and a trade log."],
    "/download": ["Download the BTCUSD Bot for MT5", "Download the BTCBot .mq5 file and check the MetaTrader 5 requirements."],
    "/install": ["Installation Guide", "Seven steps to install BTCBot in MetaTrader 5 and allow the ranking address."],
    "/ranking": ["Weekly Ranking & Leaderboard", "Explore the weekly leaderboard and find a trader by username."],
    "/faq": ["FAQ & Risk Notice", "Answers about BTCBot, demo testing, stop-losses, loss limits and trading risks."],
    "/documentation": ["Bot Documentation", "Read the BTCBot documentation directly on the site or open the original manual."],
  },
  fr: {
    "/": ["Bot de trading BTCUSD pour MetaTrader 5", "Expert Advisor BTCUSD avec scores de 3 à 8, protection des gains, limites de perte et classement hebdomadaire."],
    "/features": ["Fonctionnalités", "Un stop sur chaque transaction, scores de 3 à 8, protection des gains, limites de perte et journal."],
    "/download": ["Télécharger le bot BTCUSD pour MT5", "Téléchargez le fichier BTCBot .mq5 et consultez les prérequis MetaTrader 5."],
    "/install": ["Guide d'installation", "Sept étapes pour installer BTCBot dans MetaTrader 5 et autoriser l'adresse de classement."],
    "/ranking": ["Classement hebdomadaire", "Consultez le classement hebdomadaire et recherchez un trader par pseudonyme."],
    "/faq": ["FAQ et avertissement sur les risques", "Réponses sur BTCBot, les tests en démo, les stops, les limites de perte et les risques du trading."],
    "/documentation": ["Documentation du bot", "Consultez la documentation BTCBot sur le site ou ouvrez le manuel original."],
  },
  de: {
    "/": ["BTCUSD Trading-Bot für MetaTrader 5", "BTCUSD Expert Advisor mit Signalbewertungen von 3 bis 8, Gewinnsicherung, Verlustgrenzen und Wochenrangliste."],
    "/features": ["Funktionen", "Stops bei jedem Trade, Signalbewertungen von 3 bis 8, Gewinnsicherung, Verlustgrenzen und Handelsprotokoll."],
    "/download": ["BTCUSD-Bot für MT5 herunterladen", "BTCBot .mq5 herunterladen und die MetaTrader-5-Voraussetzungen prüfen."],
    "/install": ["Installationsanleitung", "In sieben Schritten BTCBot in MetaTrader 5 installieren und die Ranglistenadresse zulassen."],
    "/ranking": ["Wochenrangliste", "Wochenrangliste ansehen und Trader per Benutzernamen suchen."],
    "/faq": ["FAQ und Risikohinweis", "Antworten zu BTCBot, Demotests, Stops, Verlustgrenzen und Handelsrisiken."],
    "/documentation": ["Bot-Dokumentation", "Die BTCBot-Dokumentation direkt auf der Website lesen oder das Originalhandbuch öffnen."],
  },
};

export function pageHead(locale: Locale, path: PublicPath) {
  const [heading, description] = metadata[locale][path];
  const title = `${heading} — ${BOT_NAME}`;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: { en: "en_GB", fr: "fr_FR", de: "de_DE" }[locale] },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      ...LOCALES.map((language) => ({ rel: "alternate", hrefLang: language, href: localizedPath(language, path) })),
      { rel: "alternate", hrefLang: "x-default", href: localizedPath("en", path) },
    ],
  };
}
