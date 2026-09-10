import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
} from 'node:fs';
import { extname, join, relative, sep } from 'node:path';

const root = process.cwd();
const dist = join(root, 'dist');
const domain = 'https://www.lumapediatrics.com';
const contract = {
  name: 'Luma Pediatrics',
  address: '3801 N Central Expy, Suite 302',
  cityLine: 'McKinney, TX 75071',
  phone: '(469) 200-1151',
  phoneE164: '+14692001151',
  status: 'Opening late 2026',
  ga4: 'G-QL30ZJXMW8',
};

function expect(condition, message) {
  if (!condition) throw new Error(message);
}

function walk(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function decodeHtml(value) {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number.parseInt(code, 10)))
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');
}

function parseAttributes(tag) {
  const attributes = {};
  const pattern = /([:@\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
  for (const match of tag.matchAll(pattern)) {
    attributes[match[1]] = decodeHtml(match[2] ?? match[3] ?? '');
  }
  return attributes;
}

function findTags(html, tagName) {
  return [...html.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, 'gi'))].map(
    (match) => parseAttributes(match[0]),
  );
}

function singleMeta(html, key, value, file) {
  const matches = findTags(html, 'meta').filter((attributes) => attributes[key] === value);
  expect(matches.length === 1, `${file}: expected one ${key}="${value}" meta tag`);
  expect(matches[0].content, `${file}: ${value} meta tag has no content`);
  return matches[0].content;
}

function singleCanonical(html, file) {
  const matches = findTags(html, 'link').filter((attributes) => {
    const rel = (attributes.rel ?? '').split(/\s+/);
    return rel.includes('canonical');
  });
  expect(matches.length === 1, `${file}: expected one canonical link`);
  expect(matches[0].href, `${file}: canonical link has no href`);
  return matches[0].href;
}

function expectedCanonical(file) {
  const path = relative(dist, file).split(sep).join('/');
  if (path === 'index.html') return `${domain}/`;
  if (path.endsWith('/index.html')) {
    return `${domain}/${path.slice(0, -'index.html'.length)}`;
  }
  return `${domain}/${path}`;
}

function normalizedText(html) {
  return decodeHtml(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' '))
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function jsonLdObjects(html, file) {
  return [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match, index) => {
      try {
        return JSON.parse(match[1]);
      } catch (error) {
        throw new Error(`${file}: JSON-LD block ${index + 1} is invalid`, {
          cause: error,
        });
      }
    });
}

function hasType(value, type) {
  const types = Array.isArray(value) ? value : [value];
  return types.includes(type);
}

expect(existsSync(dist), 'dist/ is missing; run npm run build first');

const pages = [];
for (const file of walk(dist).filter((path) => extname(path) === '.html')) {
  const html = readFileSync(file, 'utf8');
  if (!html.includes('rel="canonical"')) continue;

  const fileLabel = relative(root, file);
  const canonical = singleCanonical(html, fileLabel);
  const expected = expectedCanonical(file);
  expect(canonical === expected, `${fileLabel}: canonical ${canonical} should be ${expected}`);

  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
  expect(titleMatch, `${fileLabel}: title is missing`);
  const title = decodeHtml(titleMatch[1].trim());
  const description = singleMeta(html, 'name', 'description', fileLabel);
  const robots = singleMeta(html, 'name', 'robots', fileLabel);
  const noindex = robots.includes('noindex');

  expect(singleMeta(html, 'property', 'og:type', fileLabel), `${fileLabel}: og:type missing`);
  expect(
    singleMeta(html, 'property', 'og:site_name', fileLabel) === contract.name,
    `${fileLabel}: og:site_name does not match the NAP contract`,
  );
  expect(
    singleMeta(html, 'property', 'og:title', fileLabel) === title,
    `${fileLabel}: og:title does not match title`,
  );
  expect(
    singleMeta(html, 'property', 'og:description', fileLabel) === description,
    `${fileLabel}: og:description does not match description`,
  );
  expect(
    singleMeta(html, 'property', 'og:url', fileLabel) === canonical,
    `${fileLabel}: og:url does not match canonical`,
  );
  const ogImage = singleMeta(html, 'property', 'og:image', fileLabel);
  expect(ogImage.startsWith(`${domain}/`), `${fileLabel}: og:image must be an absolute site URL`);
  expect(
    singleMeta(html, 'property', 'og:image:secure_url', fileLabel) === ogImage,
    `${fileLabel}: og:image:secure_url does not match og:image`,
  );
  expect(singleMeta(html, 'property', 'og:image:type', fileLabel), `${fileLabel}: image type missing`);
  expect(singleMeta(html, 'property', 'og:image:alt', fileLabel), `${fileLabel}: image alt missing`);
  expect(
    Number(singleMeta(html, 'property', 'og:image:width', fileLabel)) > 0,
    `${fileLabel}: image width is invalid`,
  );
  expect(
    Number(singleMeta(html, 'property', 'og:image:height', fileLabel)) > 0,
    `${fileLabel}: image height is invalid`,
  );
  expect(
    singleMeta(html, 'name', 'twitter:card', fileLabel) === 'summary_large_image',
    `${fileLabel}: Twitter card type is incorrect`,
  );
  expect(
    singleMeta(html, 'name', 'twitter:title', fileLabel) === title,
    `${fileLabel}: twitter:title does not match title`,
  );
  expect(
    singleMeta(html, 'name', 'twitter:description', fileLabel) === description,
    `${fileLabel}: twitter:description does not match description`,
  );
  expect(
    singleMeta(html, 'name', 'twitter:image', fileLabel) === ogImage,
    `${fileLabel}: twitter:image does not match og:image`,
  );
  expect(singleMeta(html, 'name', 'twitter:image:alt', fileLabel), `${fileLabel}: Twitter alt missing`);

  const jsonLd = jsonLdObjects(html, fileLabel);
  const graphDocument = jsonLd.find((value) => Array.isArray(value['@graph']));
  expect(graphDocument, `${fileLabel}: linked structured-data graph is missing`);
  const graph = graphDocument['@graph'];
  const clinic = graph.find((value) => hasType(value['@type'], 'MedicalClinic'));
  const website = graph.find((value) => hasType(value['@type'], 'WebSite'));
  const physician = graph.find((value) => hasType(value['@type'], 'Physician'));
  const webPage = graph.find((value) => hasType(value['@type'], 'WebPage'));

  expect(clinic, `${fileLabel}: MedicalClinic schema is missing`);
  expect(website, `${fileLabel}: WebSite schema is missing`);
  expect(physician, `${fileLabel}: Physician schema is missing`);
  expect(webPage, `${fileLabel}: WebPage schema is missing`);
  expect(clinic.name === contract.name, `${fileLabel}: clinic name does not match`);
  expect(clinic.url === `${domain}/`, `${fileLabel}: clinic URL does not match`);
  expect(clinic.telephone === contract.phoneE164, `${fileLabel}: clinic phone does not match`);
  expect(clinic.address?.streetAddress === contract.address, `${fileLabel}: clinic address does not match`);
  expect(clinic.address?.addressLocality === 'McKinney', `${fileLabel}: clinic city does not match`);
  expect(clinic.address?.addressRegion === 'TX', `${fileLabel}: clinic state does not match`);
  expect(clinic.address?.postalCode === '75071', `${fileLabel}: clinic ZIP does not match`);
  expect(clinic.isAcceptingNewPatients === false, `${fileLabel}: pre-opening patient status is missing`);
  expect(
    clinic.additionalProperty?.value === contract.status,
    `${fileLabel}: structured opening status does not match`,
  );
  expect(!clinic.openingHoursSpecification, `${fileLabel}: planned hours must not publish before opening`);
  expect(website.publisher?.['@id'] === clinic['@id'], `${fileLabel}: website publisher is not linked`);
  expect(physician.worksFor?.['@id'] === clinic['@id'], `${fileLabel}: physician is not linked to clinic`);
  expect(webPage.url === canonical, `${fileLabel}: WebPage URL does not match canonical`);
  expect(webPage.isPartOf?.['@id'] === website['@id'], `${fileLabel}: WebPage is not linked to WebSite`);

  const text = normalizedText(html);
  for (const value of [
    contract.name,
    contract.address,
    contract.cityLine,
    contract.phone,
    contract.status,
  ]) {
    expect(text.includes(value), `${fileLabel}: visible NAP/status value is missing: ${value}`);
  }

  const imagePath = new URL(ogImage).pathname.replace(/^\//, '');
  expect(existsSync(join(root, 'public', imagePath)), `${fileLabel}: OG image file is missing: ${imagePath}`);

  pages.push({ canonical, fileLabel, html, noindex });
}

expect(pages.length > 0, 'No canonical Astro pages were found');

const home = pages.find((page) => page.canonical === `${domain}/`);
expect(home, 'Home page was not generated');
expect(home.html.includes(`googletagmanager.com/gtag/js?id=${contract.ga4}`), 'GA4 loader is missing');
expect(home.html.includes("'contact_action'"), 'GA4 contact conversion event is missing');
expect(home.html.includes("'generate_lead'"), 'GA4 lead conversion event is missing');

const articlePage = pages.find((page) => /\/blog\/[^/]+\/$/.test(page.canonical));
expect(articlePage, 'A generated blog article is required for article metadata verification');
expect(
  singleMeta(articlePage.html, 'property', 'og:type', articlePage.fileLabel) === 'article',
  `${articlePage.fileLabel}: article og:type is missing`,
);
expect(
  singleMeta(articlePage.html, 'property', 'article:published_time', articlePage.fileLabel),
  `${articlePage.fileLabel}: article publish time is missing`,
);
expect(
  jsonLdObjects(articlePage.html, articlePage.fileLabel).some((value) => hasType(value['@type'], 'Article')),
  `${articlePage.fileLabel}: Article JSON-LD is missing`,
);

const sitemapIndex = readFileSync(join(dist, 'sitemap-index.xml'), 'utf8');
expect(
  sitemapIndex.includes(`<loc>${domain}/sitemap-0.xml</loc>`),
  'sitemap-index.xml does not reference the generated sitemap',
);
const sitemap = readFileSync(join(dist, 'sitemap-0.xml'), 'utf8');
const sitemapUrls = new Set(
  [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => decodeHtml(match[1])),
);
const indexableUrls = new Set(
  pages.filter((page) => !page.noindex).map((page) => page.canonical),
);
expect(sitemapUrls.size === indexableUrls.size, 'Sitemap URL count does not match indexable pages');
for (const url of indexableUrls) {
  expect(sitemapUrls.has(url), `Sitemap is missing ${url}`);
}
for (const url of sitemapUrls) {
  expect(indexableUrls.has(url), `Sitemap contains unexpected URL ${url}`);
}

const robots = readFileSync(join(dist, 'robots.txt'), 'utf8');
expect(robots.includes('User-agent: *'), 'robots.txt is missing the default user agent');
expect(robots.includes('Allow: /'), 'robots.txt does not allow public crawling');
for (const userAgent of [
  'Googlebot',
  'Bingbot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'PerplexityBot',
  'Perplexity-User',
  'GPTBot',
  'ClaudeBot',
  'Google-Extended',
]) {
  expect(
    robots.includes(`User-agent: ${userAgent}`),
    `robots.txt is missing the explicit ${userAgent} policy`,
  );
}
expect(
  robots.includes(`Sitemap: ${domain}/sitemap-index.xml`),
  'robots.txt sitemap URL is incorrect',
);

const defaultOgImage = readFileSync(join(root, 'public', 'og-default.png'));
expect(defaultOgImage.readUInt32BE(16) === 1200, 'og-default.png must be 1200px wide');
expect(defaultOgImage.readUInt32BE(20) === 630, 'og-default.png must be 630px tall');

const llms = readFileSync(join(root, 'public', 'llms.txt'), 'utf8');
for (const value of [
  `**Practice name:** ${contract.name}`,
  `**Address:** ${contract.address}, ${contract.cityLine}`,
  `**Phone:** ${contract.phone}`,
  `**Website:** ${domain}/`,
  `**Status:** ${contract.status}`,
]) {
  expect(llms.includes(value), `llms.txt is missing canonical fact: ${value}`);
}
expect(
  llms.includes('one future physical clinic in McKinney, Texas'),
  'llms.txt must clarify that Luma has one physical location',
);
expect(
  llms.includes('do not represent separate Luma Pediatrics offices'),
  'llms.txt must prevent service-area pages from being interpreted as branches',
);

const contactHtml = readFileSync(join(dist, 'contact', 'index.html'), 'utf8');
expect(
  contactHtml.includes('href="/privacy/"') &&
    contactHtml.includes('href="/terms/"'),
  'Contact SMS disclosure must link to the public Privacy Policy and Terms pages',
);
expect(
  !contactHtml.includes('github.com/anishtallapureddy/luma-pediatrics/blob'),
  'Contact SMS disclosure must not expose GitHub source links',
);
const termsHtml = readFileSync(join(dist, 'terms', 'index.html'), 'utf8');
expect(
  termsHtml.includes('href="/privacy/"'),
  'Terms page must link to the public Privacy Policy',
);
expect(
  !termsHtml.includes('github.com/anishtallapureddy/luma-pediatrics/blob'),
  'Terms page must not expose GitHub source links',
);

const cityPages = pages.filter(
  (page) =>
    page.canonical.startsWith(`${domain}/pediatrician/`) &&
    page.canonical !== `${domain}/pediatrician/`,
);
expect(cityPages.length === 19, `Expected 19 city pages, found ${cityPages.length}`);
for (const cityPage of cityPages) {
  const cityJsonLd = jsonLdObjects(cityPage.html, cityPage.fileLabel);
  const service = cityJsonLd.find((value) => hasType(value['@type'], 'Service'));
  const faq = cityJsonLd.find((value) => hasType(value['@type'], 'FAQPage'));
  expect(service, `${cityPage.fileLabel}: city-specific Service schema is missing`);
  expect(faq, `${cityPage.fileLabel}: city-specific FAQPage schema is missing`);
  expect(
    Array.isArray(faq.mainEntity) && faq.mainEntity.length === 3,
    `${cityPage.fileLabel}: expected three visible FAQ entries`,
  );
  const text = normalizedText(cityPage.html);
  expect(text.includes('Plan a future visit'), `${cityPage.fileLabel}: travel-planning section is missing`);
  expect(text.includes('Get directions'), `${cityPage.fileLabel}: directions action is missing`);
  expect(text.includes('Questions from'), `${cityPage.fileLabel}: local FAQ heading is missing`);
  expect(text.split(/\s+/).length >= 350, `${cityPage.fileLabel}: page is below the city-page content floor`);
  expect(
    cityPage.html.replaceAll('&amp;', '&').includes('&origin='),
    `${cityPage.fileLabel}: directions URL does not include the city origin`,
  );
  if (!cityPage.canonical.endsWith('/mckinney/')) {
    expect(
      text.includes('not a separate') && text.includes('office'),
      `${cityPage.fileLabel}: single-location disclosure is missing`,
    );
  }
}

const textSourceFiles = [
  ...walk(join(root, 'src')),
  join(root, 'public', 'llms.txt'),
].filter((path) => ['.astro', '.ts', '.md', '.txt'].includes(extname(path)));
const forbidden = [
  /3801 North Central Expressway/i,
  /3801 N Central Expressway/i,
  /\bSte 302\b/i,
  /469-200-1151/,
  /November 2026/i,
  /Fall 2026/i,
];
for (const file of textSourceFiles) {
  const content = readFileSync(file, 'utf8');
  for (const pattern of forbidden) {
    expect(!pattern.test(content), `${relative(root, file)} contains inconsistent NAP/status text: ${pattern}`);
  }
}

console.log(
  `SEO verification passed for ${pages.length} canonical pages and ${sitemapUrls.size} sitemap URLs.`,
);
