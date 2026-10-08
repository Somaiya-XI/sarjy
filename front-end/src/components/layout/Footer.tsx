import { useTranslations } from "next-intl";
import { Container } from "./Container";

export function Footer() {
  const t = useTranslations("Footer");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-3 border-t border-current/10 bg-background/90 text-sm text-muted backdrop-blur ">
      <Container className="items-center justify-center text-center h-12 flex flex-col gap-4 font-display text-primary/70">
        <p>Somaiya Saad  • {year} All rights reserved.</p>
      </Container>
    </footer>
  );
}
