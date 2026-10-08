"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LocaleSwitcher() {
  const t = useTranslations("Header");
  const locale = useLocale();
  const pathname = usePathname();
  const nextLocale = routing.locales.find((l) => l !== locale) ?? routing.defaultLocale;

  return (
    <Link
      href={pathname}
      locale={nextLocale}
      aria-label={t("switchLocaleLabel")}
      className="rounded-full border border-current/20 py-1.5 ps-4 pe-4 text-sm font-medium transition hover:bg-surface"
    >
      {t("switchLocale")}
    </Link>
  );
}
