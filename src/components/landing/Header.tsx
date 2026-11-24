import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BOT_NAME, DOWNLOAD_FILENAME, DOWNLOAD_PATH } from "@/lib/site";

const NAV = [
  { href: "#features", label: "Features" },
  { href: "#download", label: "Download" },
  { href: "#install", label: "Install" },
  { href: "#ranking", label: "Ranking" },
  { href: "#faq", label: "FAQ" },
];

export function Logo() {
  return (
    <a href="#top" className="flex items-center gap-2.5">
      <span className="grid h-8 w-8 place-items-center rounded-md bg-gradient-primary font-display text-lg font-bold text-primary-foreground">
        ₿
      </span>
      <span className="font-display text-base font-semibold tracking-wide">{BOT_NAME}</span>
    </a>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Logo />
        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {n.label}
            </a>
          ))}
        </nav>
        <Button asChild variant="hero" size="sm">
          <a href={DOWNLOAD_PATH} download={DOWNLOAD_FILENAME}>
            <Download /> Download
          </a>
        </Button>
      </div>
    </header>
  );
}
