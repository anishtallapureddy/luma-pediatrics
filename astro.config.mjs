import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.lumapediatrics.com',
  trailingSlash: 'ignore',
  build: {
    inlineStylesheets: 'auto',
  },
  integrations: [
    sitemap(),
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
          'home',
          'file-text',
          'video',
          'send',
        ],
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
