# Luma Pediatrics

Public website for Luma Pediatrics, deployed to GitHub Pages at **https://www.lumapediatrics.com**.

## Stack

- **[Astro 5](https://astro.build/)** — static site generator
- **[Tailwind CSS v4](https://tailwindcss.com/)** — styling
- **[Decap CMS](https://decapcms.org/)** — visual content editor at `/admin` (added in a later phase)
- **[Lucide](https://lucide.dev/)** icons via `astro-icon`
- **Cormorant Garamond** (display) + **Plus Jakarta Sans** (body) self-hosted via `@fontsource`
- **GitHub Pages** — hosting (free, HTTPS via Let's Encrypt, custom domain)
- **GitHub Actions** — CI/CD (added in a later phase)

## Local development

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # production build → dist/
npm run preview  # preview production build locally
npm run check    # type + content checks
npm run check:seo # verify GA4, schema, NAP, social metadata, sitemap, and robots after a build
```

## Google Maps locator

The Contact page progressively enhances its existing iframe map with Google's
Extended Component Library store locator. The standard iframe remains visible
if the JavaScript component or API key is unavailable.

For local development, create `.env.local`:

```sh
PUBLIC_GOOGLE_MAPS_API_KEY=your_browser_key
```

For GitHub Pages, add the same browser key as the repository secret
`GOOGLE_MAPS_BROWSER_API_KEY`. The workflow exposes it to Astro as
`PUBLIC_GOOGLE_MAPS_API_KEY` during the static build.

Maps JavaScript API keys are visible in browser requests by design. Restrict
the key to the production website's HTTPS referrers and to the Maps JavaScript
API. Enable additional APIs only if the locator later adds features that need
them. Never use a server-side Address Validation or web-service key in this
client-side variable.

## Analytics and search metadata

GA4 loads only in production using the measurement ID in `src/site.config.ts`.
The site records:

- standard GA4 page views
- `generate_lead` after a successful practice-updates signup
- `contact_action` with `contact_method` set to `phone`, `sms`, `email`, or
  `directions`

In GA4 Admin, mark `generate_lead` and `contact_action` as key events when they
should count as conversions.

`BaseLayout.astro` publishes linked `WebSite`, `MedicalClinic`, `Physician`, and
`WebPage` JSON-LD plus canonical, Open Graph, and Twitter metadata. The
canonical NAP/status contract is:

- Luma Pediatrics
- 3801 N Central Expy, Suite 302, McKinney, TX 75071
- (469) 200-1151
- https://www.lumapediatrics.com/
- Opening late 2026

Planned office hours remain excluded from structured data until
`SITE.schema.publishOpeningHours` is explicitly enabled after opening.

After building, run `npm run check:seo` to verify GA4 hooks, structured data,
NAP wording, canonical URLs, social metadata, sitemap coverage, and
`robots.txt`.

## Project structure

```
src/
├── components/    Reusable Astro components (Header, Footer, Button, ...)
├── content/       Markdown content collections (providers, services)
├── layouts/       BaseLayout.astro — HTML shell, meta, fonts, header/footer
├── pages/         Routes (index.astro, providers/[...slug].astro, ...)
└── styles/
    └── global.css  Tailwind v4 + design tokens (the design system)
public/
├── CNAME          GitHub Pages custom domain
├── favicon.svg
└── robots.txt
```

## Design system

The visual design (colors, type, spacing, components, anti-patterns) is documented in this session's
`luma-design-system.md` and codified in `src/styles/global.css` via the Tailwind v4 `@theme` block.

**Key tokens:**
- Primary (CTA / trust): `#083058` (deep brand navy)
- Secondary: `#7B8F70` (soft sage)
- Accent: `#D09830` (warm gold)
- Background: `#FBF3EE` (warm cream)
- Display: Cormorant Garamond; Body: Plus Jakarta Sans
- All buttons ≥ 44×44px, 3px focus rings, WCAG AA contrast minimum

## Compliance notes

- **No PHI on this site.** The email-updates form collects only optional name, email, explicit consent, source page, and timestamps.
- **No patient intake before opening.** Scheduling, insurance verification, patient forms, and clinical messaging are not offered through the site.
- **WCAG 2.1 AA** target; Lighthouse a11y score 100.
- **State medical-advertising rules** vary; have the practice's attorney review before launch.
