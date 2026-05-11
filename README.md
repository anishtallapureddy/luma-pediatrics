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
```

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

- **No PHI on this site.** Contact form must not collect symptoms, conditions, or insurance member IDs.
- **HIPAA scope avoided by design.** Patient portal / booking is delegated to an external HIPAA-compliant SaaS (linked, not embedded).
- **WCAG 2.1 AA** target; Lighthouse a11y score 100.
- **State medical-advertising rules** vary; have the practice's attorney review before launch.
