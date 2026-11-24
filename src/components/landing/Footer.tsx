import { SUPPORT_EMAIL } from "@/lib/site";
import { Logo } from "./Header";

export function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 sm:flex-row sm:items-center">
        <Logo />
        <p className="text-sm text-muted-foreground">
          For Support:{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary hover:underline">
            {SUPPORT_EMAIL}
          </a>
        </p>
        <p className="font-mono text-xs text-muted-foreground">© {new Date().getFullYear()} · Trading involves risk</p>
      </div>
    </footer>
  );
}
