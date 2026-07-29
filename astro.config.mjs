import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';

// ─────────────────────────────────────────────────────────────────────────────
// TEMPORARY pre-opening holding page — marketing route redirects.
//
// While the site is a neutral pre-opening holding page, every public marketing
// route temporarily redirects to the homepage. Uses status 302 (TEMPORARY), not
// 301, so restoring the full site later is clean. The route source files are
// preserved (renamed with a leading `_` so Astro excludes them from routing).
//
// NOTE: GitHub Pages is static hosting and cannot emit true HTTP 302 responses;
// Astro generates a `<meta http-equiv="refresh">` redirect page for each entry.
// The 302 status below documents intent and applies if an SSR adapter is added.
//
// AT LAUNCH / TO RESTORE: delete `holdingRedirects` and the `redirects` key,
// then restore the `_`-prefixed page files (strip the leading underscore).
// ─────────────────────────────────────────────────────────────────────────────
const HOLDING_REDIRECT_ROUTES = [
  '/about',
  '/services',
  '/contact',
  '/faq',
  '/resources',
  '/dosing-charts',
  '/health-watch',
  '/vaccines',
  '/new-patients',
  '/notice-of-privacy-practices',
  // Blog (index + each post)
  '/blog',
  '/blog/fever-when-to-call',
  '/blog/healthy-sleep-kids',
  '/blog/newborn-first-week',
  '/blog/picky-eater-playbook',
  '/blog/rsv-flu-winter-cough',
  '/blog/vaccine-schedule-explained',
  // Physician-bio index + city landing pages
  '/pediatrician',
  '/pediatrician/mckinney',
  '/pediatrician/frisco',
  '/pediatrician/allen',
  '/pediatrician/prosper',
];
const holdingRedirects = Object.fromEntries(
  HOLDING_REDIRECT_ROUTES.map((route) => [route, { status: 302, destination: '/' }]),
);

// https://astro.build/config
export default defineConfig({
  site: 'https://www.lumapediatrics.com',
  trailingSlash: 'ignore',
  redirects: holdingRedirects,
  build: {
    inlineStylesheets: 'auto',
  },
  integrations: [
    // Sitemap intentionally disabled while pre-launch — we don't advertise URLs
    // to crawlers yet. AT LAUNCH: re-add `@astrojs/sitemap` here (and restore
    // the "Sitemap:" line in public/robots.txt).
    icon({
      include: {
        lucide: [
          'stethoscope',
          'baby',
          'heart',
          'calendar',
          'calendar-check',
          'clipboard-check',
          'syringe',
          'phone',
          'mail',
          'map-pin',
          'clock',
          'shield-check',
          'users',
          'sparkles',
          'menu',
          'x',
          'arrow-right',
          'pill',
          'alert-triangle',
          'check',
          'check-circle',
          'star',
          'thermometer',
          'sun',
          'help-circle',
          'info',
          'chevron-down',
          'graduation-cap',
          'activity',
          'award',
          'download',
          'image',
          'wind',
          'flower-2',
          'cloud-off',
          'home',
          'file-text',
          'video',
          'send',
          'hospital',
          'handshake',
          'arrow-up-right',
          'message-circle',
          'siren',
          'activity',
          'pill',
          'book-open',
        ],
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
