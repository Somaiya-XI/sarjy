# waslah-web

## What this is

The Waslah website at [waslah.cc](https://waslah.cc), in Arabic (default) and English. Four pages: Home, About, Contact and Terms.

**The design is in Figma. Start with [DESIGN.md](./DESIGN.md)**: it links every page, the colors, fonts and assets. The landing page currently in this repo is a placeholder to replace with the Figma design.

**Run it in 3 steps:** install [Node.js 22](https://nodejs.org), then in the project folder run `npm install`, then `npm run dev`, and open [localhost:3000](http://localhost:3000).

> **One app. Every gathering. Guaranteed.**

## Product context

- [Design (Figma)](./DESIGN.md)
- [Website Brief](https://github.com/Waslah-cc/waslah-wiki/blob/main/01%20Product/Website%20Brief.md): what the site must do and what's out of scope
- [Waslah Platform PRD](https://github.com/Waslah-cc/waslah-wiki/blob/main/01%20Product/PRDs/Waslah%20Platform%20-%20PRD.md)

## Stack

| Area      | Choice                                                                    |
| --------- | ------------------------------------------------------------------------- |
| Framework | [Next.js](https://nextjs.org) 16 (App Router, `src/` dir)                 |
| UI        | React 19, TypeScript 5                                                    |
| Styling   | Tailwind CSS 4 (logical properties for RTL)                               |
| i18n      | [next-intl](https://next-intl.dev) 4 (`ar` default, `en`)                 |
| Fonts     | Thmanyah + itf Huwiya Arabic per Figma (see DESIGN.md); IBM Plex Sans Arabic fallback |
| Quality   | ESLint 9, Prettier 3 + `prettier-plugin-tailwindcss`                      |
| CI        | GitHub Actions                                                            |
| Hosting   | Team decision (see [Deployment](#deployment))                             |

## Prerequisites

- Node.js 22 LTS (see `.nvmrc`). We recommend [nvm](https://github.com/nvm-sh/nvm).
- npm 10+

## Getting started

```bash
git clone https://github.com/Waslah-cc/waslah-web.git
cd waslah-web
nvm use
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000/ar](http://localhost:3000/ar) (Arabic) or [http://localhost:3000/en](http://localhost:3000/en) (English). Visiting `/` redirects to `/ar`.

### First-time setup (one engineer, once)

Two files could not be added by the setup tooling. The first engineer adds them in their first PR (2 minutes, nothing extra to download):

```bash
npm install                     # generates package-lock.json
git mv .github/workflows-pending/ci.yml .github/workflows/ci.yml
git add package-lock.json .github
git commit -m "chore: add CI workflow and lockfile"
```

`package-lock.json` pins exact library versions so everyone runs the same thing. `ci.yml` turns on automatic checks for every pull request.

### Environment variables

| Variable               | Default             | Purpose                                                |
| ---------------------- | ------------------- | ------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL` | `https://waslah.cc` | Absolute site URL for metadata, `robots.txt`, sitemap. |

## Project structure

```text
.
├── DESIGN.md                # Figma links, colors, fonts: start here
├── messages/                # Translation files (one per locale)
│   ├── ar.json
│   └── en.json
├── public/                  # Static assets served as-is (exported images, SVGs)
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx   # Root layout: <html lang dir>, font, metadata
│   │   │   └── page.tsx     # Home (placeholder, replace with Figma Home)
│   │   ├── globals.css      # Tailwind and design tokens
│   │   ├── icon.svg         # Favicon (placeholder)
│   │   ├── robots.ts        # /robots.txt
│   │   └── sitemap.ts       # /sitemap.xml
│   ├── components/          # Placeholder sections, replace with Figma components
│   ├── i18n/
│   │   ├── navigation.ts    # Locale-aware Link, redirect, useRouter
│   │   ├── request.ts       # Loads messages per request
│   │   └── routing.ts       # Locales, default locale, text direction
│   ├── lib/site.ts          # Site URL and contact emails
│   ├── global.d.ts          # Typed message keys for next-intl
│   └── proxy.ts             # Locale detection and redirects (Next.js 16 "proxy", formerly middleware)
└── .github/                 # CI workflow, PR and issue templates
```

Pages still to add: `src/app/[locale]/about/page.tsx`, `contact/page.tsx`, `terms/page.tsx` (see DESIGN.md).

## Internationalization (i18n)

All user-facing text lives in `messages/ar.json` and `messages/en.json`. Never hardcode strings in components. Copy text from the Figma frames (AR frames into `ar.json`, EN frames into `en.json`).

To add a string:

1. Add the key to **both** `messages/ar.json` and `messages/en.json` under the right namespace (e.g. `Hero`).
2. Use it in a component:

   ```tsx
   import { useTranslations } from "next-intl";

   export function Example() {
     const t = useTranslations("Hero");
     return <p>{t("newKey")}</p>;
   }
   ```

3. Run `npm run typecheck`. Message keys are typed from `messages/en.json`, so a missing or misspelled key fails the check.

Use `Link` from `@/i18n/navigation` (not `next/link`) for internal links so the locale prefix is kept.

## RTL rules

`<html dir>` is `rtl` for Arabic and `ltr` for English, so layouts must flip automatically:

- Use logical utilities: `ms-*` / `me-*` (margin), `ps-*` / `pe-*` (padding), `start-*` / `end-*` (position), `text-start` / `text-end`, `rounded-s-*` / `rounded-e-*`, `border-s` / `border-e`.
- Avoid physical utilities: `ml-*`, `mr-*`, `pl-*`, `pr-*`, `left-*`, `right-*`, `text-left`, `text-right`.
- Flex and grid follow `dir` automatically; do not reverse them manually per locale.
- Directional icons (arrows, chevrons) need `rtl:rotate-180` or a mirrored variant.
- Always check every change in both `/ar` and `/en`, on mobile and desktop, against the matching Figma frame.

## Scripts

| Script                 | Description                           |
| ---------------------- | ------------------------------------- |
| `npm run dev`          | Start the dev server on port 3000     |
| `npm run build`        | Production build                      |
| `npm run start`        | Serve the production build            |
| `npm run lint`         | Run ESLint                            |
| `npm run typecheck`    | Run the TypeScript compiler (no emit) |
| `npm run format`       | Format all files with Prettier        |
| `npm run format:check` | Check formatting (used in CI)         |

CI (`.github/workflows/ci.yml`) runs lint, typecheck, format check and build on every pull request and on pushes to `main`.

## Deployment

**Hosting is open: the team picks it.** Any host that runs Next.js 16 works, for example Vercel, Netlify, Cloudflare, AWS Amplify, or a Node server / Docker container on any cloud.

Whatever you choose, it must:

- Run `npm ci && npm run build`, then serve with `npm run start` (or the host's native Next.js runtime) on Node 22.
- Set `NEXT_PUBLIC_SITE_URL=https://waslah.cc`.
- Serve `waslah.cc` and `www.waslah.cc` over HTTPS, with one redirecting to the other.
- Deploy automatically from `main`, with preview deploys for pull requests if the host supports it.

Point the `waslah.cc` DNS records at the chosen host using the values it gives you, and document the final choice (host, who has access, how to roll back) in this section.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).
