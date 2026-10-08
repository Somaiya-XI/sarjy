import { PaperBackground } from "@/components/ui/PaperBackground";
import { getDirection, routing } from "@/i18n/routing";
import { fontAr, fontEnBody, fontEnDisplay } from "@/lib/fonts";
import { siteUrl } from "@/lib/site";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import "../globals.css";
import { Footer } from "@/components/layout/Footer";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ ...props }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("Metadata");

  return {
    metadataBase: new URL(siteUrl),
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}`])),
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `/${locale}`,
      siteName: locale === "ar" ? "تحف سرج" : "Sarjy",
      locale: locale === "ar" ? "ar_SA" : "en_US",
      type: "website",
    },
  };
}

export default async function LocaleLayout({ children }: LayoutProps<"/[locale]">) {
  const locale = await getLocale();

  return (
<html
  lang={locale}
  dir={getDirection(locale)}
  className={`${fontAr.variable} ${fontEnDisplay.variable} ${fontEnBody.variable} h-full`}
>
  <body className="flex min-h-screen flex-col">
    <NextIntlClientProvider>
      <PaperBackground className="flex min-h-screen flex-col">
        {children}
        <Footer />
      </PaperBackground>
    </NextIntlClientProvider>
  </body>
</html>
  );
}
