import localFont from "next/font/local";

export const fontEnDisplay = localFont({
  src: [
    {
      path: "../../public/fonts/New-Spirit-Light-Condensed.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/New-Spirit-Regular-Condensed.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/New-Spirit-Medium-Condensed.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/New-Spirit-Bold-Condensed.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-eng-display",
  display: "swap",
});

export const fontEnBody = localFont({
  src: [
    { path: "../../public/fonts/itfHuwiyaArabic-Regular.otf", weight: "400", style: "normal" },
    { path: "../../public/fonts/itfHuwiyaArabic-Medium.otf", weight: "500", style: "normal" },
    { path: "../../public/fonts/itfHuwiyaArabic-Bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-eng-body",
  display: "swap",
});

export const fontAr = localFont({
  src: [
    { path: "../../public/fonts/thmanyahseriftext-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/thmanyahseriftext-Black.woff2", weight: "900", style: "normal" },
    { path: "../../public/fonts/thmanyahseriftext-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-ar",
  display: "swap",
});

export const fontArBody = localFont({
  src: [
    { path: "../../public/fonts/itfHuwiyaArabic-Regular.otf", weight: "400", style: "normal" },
    { path: "../../public/fonts/itfHuwiyaArabic-Medium.otf", weight: "500", style: "normal" },
    { path: "../../public/fonts/itfHuwiyaArabic-Bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-ar-body",
  display: "swap",
});
