import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslation, LocaleLink as Link } from "./LocaleLink";
import { Download, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { BOT_SHORT_NAME, DOWNLOAD_FILENAME, DOWNLOAD_PATH, PAGES } from "@/lib/site";

export function Logo() {
  const { t } = useTranslation();
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label={t("BTCBot Weekly Challenge home")}>
      <span className="grid h-8 w-8 place-items-center rounded-sm bg-primary font-display text-lg font-bold text-primary-foreground">
        ₿
      </span>
      <span className="font-display text-[15px] font-bold leading-none tracking-tight [font-stretch:115%]">
        {BOT_SHORT_NAME}
        <span className="ml-1.5 hidden min-[480px]:inline font-medium text-muted-foreground">{t("Weekly Challenge")}</span>
      </span>
    </Link>
  );
}

const navLink =
  "relative flex h-16 items-center text-sm text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-foreground data-[status=active]:after:absolute data-[status=active]:after:inset-x-0 data-[status=active]:after:bottom-0 data-[status=active]:after:h-0.5 data-[status=active]:after:bg-primary";

export function Header() {
  const { t } = useTranslation();
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-5">
        <Logo />
        <nav aria-label={t("Main")} className="hidden items-center gap-5 xl:flex">
          {PAGES.map((p) => (
            <Link key={p.to} to={p.to} className={navLink}>
              {t(p.label ?? "")}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Button asChild variant="hero" size="sm" className="hidden 2xl:inline-flex">
            <a href={DOWNLOAD_PATH} download={DOWNLOAD_FILENAME}>
              <Download />{t("Download")}</a>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="xl:hidden" aria-label={t("Open menu")}>
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 border-border bg-background">
              <SheetTitle className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">{t("Menu")}</SheetTitle>
              <nav aria-label={t("Mobile")} className="mt-6 flex flex-col">
                <SheetClose asChild>
                  <Link to="/" activeOptions={{ exact: true }} className="border-b border-border py-4 text-lg data-[status=active]:text-primary">{t("Home")}</Link>
                </SheetClose>
                {PAGES.map((p) => (
                  <SheetClose asChild key={p.to}>
                    <Link to={p.to} className="flex items-baseline gap-3 border-b border-border py-4 text-lg data-[status=active]:text-primary">
                      <span className="font-mono text-xs text-muted-foreground">{p.index}</span>
                      {t(p.label ?? "")}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <Button asChild variant="hero" size="lg" className="mt-8 w-full">
                <a href={DOWNLOAD_PATH} download={DOWNLOAD_FILENAME}>
                  <Download />{t("Download .mq5")}</a>
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
