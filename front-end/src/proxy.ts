import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Next.js 16 renamed `middleware` to `proxy`. This handles locale detection
// and redirects `/` to `/ar` (the default locale).
export default createMiddleware(routing);

export const config = {
  // Match all pathnames except API routes, Next.js internals, Vercel internals
  // and files with an extension (e.g. icon.svg, robots.txt, sitemap.xml).
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
