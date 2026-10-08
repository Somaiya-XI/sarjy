import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Container } from "./Container";
import Image from 'next/image';

export function Header() {
  const t = useTranslations("Header");

  return (
    <header className="sticky top-0 z-10 border-b border-current/10 bg-background/90 backdrop-blur">
      <Container className="flex h-14 items-center justify-between gap-4">
        <Link href="/" className="flex items-baseline gap-2 text-2xl ">
          <span className="">{t("brand")}</span>
        </Link>
        <nav className=" items-center gap-6 text-base text-muted md:flex">
          <Image src="/logo.svg" alt="Sarjy" width={30} height={30} priority />

        </nav>
        {/* <LocaleSwitcher /> */}
      </Container>
    </header>
  );
}
