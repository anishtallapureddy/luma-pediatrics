import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import { isIndexedCity } from './src/data/cities.ts';

const cityPagePattern = /\/pediatrician\/([^/]+)\/$/;

// https://astro.build/config
export default defineConfig({
  site: 'https://www.lumapediatrics.com',
  trailingSlash: 'ignore',
  build: {
    inlineStylesheets: 'auto',
  },
  integrations: [
    sitemap({
      filter: (page) => {
        const city = new URL(page).pathname.match(cityPagePattern)?.[1];
        return !city || isIndexedCity(city);
      },
    }),
    icon({
      include: {
        lucide: [
          'stethoscope',
          'baby',
          'heart',
          'calendar',
          'calendar-check',
          'syringe',
          'droplet',
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
        'simple-icons': ['instagram', 'facebook', 'linkedin', 'tiktok'],
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
