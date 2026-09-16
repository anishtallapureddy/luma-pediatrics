import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const domain = 'https://www.lumapediatrics.com';
const priorityPaths = [
  '/',
  '/about/',
  '/contact/',
  '/services/',
  '/resources/',
  '/new-patients/',
  '/health-watch/',
  '/dosing-charts/',
  '/vaccines/',
  '/blog/',
  '/blog/vaccine-schedule-explained/',
  '/pediatrician/',
  '/pediatrician/mckinney/',
  '/pediatrician/allen/',
  '/pediatrician/frisco/',
  '/pediatrician/prosper/',
];

const sitemapPath = join(process.cwd(), 'dist', 'sitemap-0.xml');
if (!existsSync(sitemapPath)) {
  throw new Error('dist/sitemap-0.xml is missing; run npm run build first');
}

const sitemap = readFileSync(sitemapPath, 'utf8');
const urls = priorityPaths.map((path) => `${domain}${path}`);
for (const url of urls) {
  if (!sitemap.includes(`<loc>${url}</loc>`)) {
    throw new Error(`Priority URL is missing from the sitemap: ${url}`);
  }
}

console.log('Google Search Console priority indexing list:');
urls.forEach((url, index) => console.log(`${index + 1}. ${url}`));
console.log(`\nSubmit the sitemap index once: ${domain}/sitemap-index.xml`);
