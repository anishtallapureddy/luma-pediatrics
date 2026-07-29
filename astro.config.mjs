import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.lumapediatrics.com',
  trailingSlash: 'ignore',
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
