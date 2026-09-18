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
  legalName: 'Luma Physician Group PLLC',
  organizationNpi: '1689504292',
  disambiguatingDescription:
    'Independent pediatric primary care practice in McKinney, Texas, operated by Luma Physician Group PLLC.',
  address: '3801 N Central Expy, Suite 302',
  cityLine: 'McKinney, TX 75071',
  phone: '(469) 200-1151',
  phoneE164: '+14692001151',
  smsHref: 'sms:+14692001151',
  physicianName: 'Praveena Tallapureddy',
  physicianHonorificPrefix: 'Dr.',
  physicianHonorificSuffix: 'M.D., F.A.A.P.',
  status: 'Opening late 2026',
  ga4: 'G-QL30ZJXMW8',
  socialImage: '/og-luma-pediatrics-2026-09-15.png',
  homeSocialTitle: 'Luma Pediatrics | McKinney, TX',
  homeDescription:
    'Board-certified pediatric care planned for newborns through teens in McKinney, TX. Luma Pediatrics opens late 2026 with well visits, sick care, vaccines, and more.',
  homeSocialDescription:
    'Care for your child. Time for you. Board-certified pediatric care planned for newborns to teens. Opening late 2026 in McKinney, Texas.',
};
const serviceSlugs = [
  'free-meet-and-greet',
  'newborn-rounds-bsw-mckinney',
  'newborn-care',
  'well-child-visits',
  'sick-visits',
  'vaccinations',
  'school-sports-camp-physicals',
  'adhd-behavior-developmental-care',
  'teen-adolescent-health',
  'telehealth-virtual-visits',
];

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

function hasElementClass(html, className, tagName = 'div') {
  return findTags(html, tagName).some((attributes) =>
    (attributes.class ?? '').split(/\s+/).includes(className),
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
  const expectedSocialTitle =
    canonical === `${domain}/` ? contract.homeSocialTitle : title;
  const expectedSocialDescription =
    canonical === `${domain}/` ? contract.homeSocialDescription : description;
  const robots = singleMeta(html, 'name', 'robots', fileLabel);
  const noindex = robots.includes('noindex');
  if (!noindex) {
    expect(title.length <= 70, `${fileLabel}: title is unnecessarily long (${title.length} characters)`);
    expect(
      description.length <= 180,
      `${fileLabel}: meta description is unnecessarily long (${description.length} characters)`,
    );
  }

  expect(singleMeta(html, 'property', 'og:type', fileLabel), `${fileLabel}: og:type missing`);
  expect(
    singleMeta(html, 'property', 'og:site_name', fileLabel) === contract.name,
    `${fileLabel}: og:site_name does not match the NAP contract`,
  );
  expect(
    singleMeta(html, 'property', 'og:title', fileLabel) === expectedSocialTitle,
    `${fileLabel}: og:title does not match expected social title`,
  );
  expect(
    singleMeta(html, 'property', 'og:description', fileLabel) === expectedSocialDescription,
    `${fileLabel}: og:description does not match expected social description`,
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
  expect(
    singleMeta(html, 'property', 'og:image:url', fileLabel) === ogImage,
    `${fileLabel}: og:image:url does not match og:image`,
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
    singleMeta(html, 'name', 'twitter:title', fileLabel) === expectedSocialTitle,
    `${fileLabel}: twitter:title does not match expected social title`,
  );
  expect(
    singleMeta(html, 'name', 'twitter:description', fileLabel) === expectedSocialDescription,
    `${fileLabel}: twitter:description does not match expected social description`,
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
  expect(clinic.legalName === contract.legalName, `${fileLabel}: clinic legal name does not match`);
  expect(
    clinic.disambiguatingDescription === contract.disambiguatingDescription,
    `${fileLabel}: clinic disambiguating description does not match`,
  );
  expect(
    clinic.identifier?.['@type'] === 'PropertyValue' &&
      clinic.identifier?.propertyID === 'NPI' &&
      clinic.identifier?.value === contract.organizationNpi,
    `${fileLabel}: clinic organization NPI does not match`,
  );
  expect(clinic.url === `${domain}/`, `${fileLabel}: clinic URL does not match`);
  expect(clinic.telephone === contract.phoneE164, `${fileLabel}: clinic phone does not match`);
  expect(clinic.address?.streetAddress === contract.address, `${fileLabel}: clinic address does not match`);
  expect(clinic.address?.addressLocality === 'McKinney', `${fileLabel}: clinic city does not match`);
  expect(clinic.address?.addressRegion === 'TX', `${fileLabel}: clinic state does not match`);
  expect(clinic.address?.postalCode === '75071', `${fileLabel}: clinic ZIP does not match`);
  expect(clinic.isAcceptingNewPatients === false, `${fileLabel}: pre-opening patient status is missing`);
  expect(physician.name === contract.physicianName, `${fileLabel}: physician schema name is not plain text`);
  expect(
    physician.honorificPrefix === contract.physicianHonorificPrefix &&
      physician.honorificSuffix === contract.physicianHonorificSuffix,
    `${fileLabel}: physician credentials must use honorific fields`,
  );
  expect(
    Array.isArray(clinic.sameAs) &&
      clinic.sameAs.some((url) => url.includes('query_place_id=ChIJay82ghcTTIYRfMrdtqknRvU')),
    `${fileLabel}: exact Google Business Place-ID URL is missing from sameAs`,
  );
  for (const profile of [
    'instagram.com/luma.pediatrics',
    'facebook.com/people/Luma-Pediatrics/61589364039396',
    'linkedin.com/company/lumapediatrics',
    'tiktok.com/@lumapediatrics',
  ]) {
    expect(
      Array.isArray(clinic.sameAs) && clinic.sameAs.some((url) => url.includes(profile)),
      `${fileLabel}: social profile is missing from sameAs: ${profile}`,
    );
  }
  expect(
    clinic.additionalProperty?.value === contract.status,
    `${fileLabel}: structured opening status does not match`,
  );
  expect(!clinic.openingHoursSpecification, `${fileLabel}: planned hours must not publish before opening`);
  expect(website.publisher?.['@id'] === clinic['@id'], `${fileLabel}: website publisher is not linked`);
  expect(physician.worksFor?.['@id'] === clinic['@id'], `${fileLabel}: physician is not linked to clinic`);
  expect(clinic.founder?.['@id'] === physician['@id'], `${fileLabel}: clinic founder is not linked`);
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

  pages.push({ canonical, fileLabel, html, noindex, title, description });
}

expect(pages.length > 0, 'No canonical Astro pages were found');
for (const field of ['title', 'description']) {
  const seen = new Map();
  for (const page of pages.filter((candidate) => !candidate.noindex)) {
    const existing = seen.get(page[field]);
    expect(
      !existing,
      `${page.fileLabel}: duplicate ${field} also used by ${existing?.fileLabel}`,
    );
    seen.set(page[field], page);
  }
}

const home = pages.find((page) => page.canonical === `${domain}/`);
expect(home, 'Home page was not generated');
expect(
  singleMeta(home.html, 'name', 'description', home.fileLabel) ===
    contract.homeDescription,
  'Home meta description does not match the concise search contract',
);
expect(
  singleMeta(home.html, 'property', 'og:title', home.fileLabel) ===
    contract.homeSocialTitle,
  'Home social title is not the concise messaging-app title',
);
expect(
  singleMeta(home.html, 'property', 'og:description', home.fileLabel) ===
    contract.homeSocialDescription,
  'Home social description is not the current brand message',
);
expect(
  singleMeta(home.html, 'property', 'og:image', home.fileLabel) ===
    `${domain}${contract.socialImage}`,
  'Home social image is not the current versioned asset',
);
expect(home.html.includes(`googletagmanager.com/gtag/js?id=${contract.ga4}`), 'GA4 loader is missing');
expect(home.html.includes("'contact_action'"), 'GA4 contact conversion event is missing');
expect(home.html.includes("'generate_lead'"), 'GA4 lead conversion event is missing');
const heroPreload = findTags(home.html, 'link').find(
  (attributes) =>
    (attributes.rel ?? '').split(/\s+/).includes('preload') &&
    attributes.as === 'image',
);
expect(
  heroPreload?.href === `${domain}/images/luma-hero-banner.webp` &&
    heroPreload?.type === 'image/webp' &&
    heroPreload?.fetchpriority === 'high',
  'Home page must preload the poster WebP',
);
const homeText = normalizedText(home.html);
expect(
  findTags(home.html, 'a').some(
    (attributes) => attributes.href === '/new-patients/',
  ),
  'Home Plan Ahead section must link to the new-patient guide',
);
for (const value of [
  'Board-certified',
  'A calm place for children and parents.',
  'Family centered',
  'Kid-friendly visits',
  'Clear guidance',
  'Made for children',
  'The standards we hold ourselves to',
]) {
  expect(homeText.includes(value), `Home page is missing restored content: ${value}`);
}
for (const service of [
  'Free Meet & Greet',
  'Newborn Rounds at BSW McKinney',
  'Newborn Care',
  'Well-Child Visits',
  'Sick Visits',
  'Vaccinations',
  'School, Sports & Camp Physicals',
  'Teen & Adolescent Health',
  'Telehealth / Virtual Visits',
]) {
  expect(homeText.includes(service), `Home page is missing restored service: ${service}`);
}
for (const serviceGroup of [
  'Getting started',
  'Everyday pediatric care',
  'Growing years and follow-up',
]) {
  expect(
    homeText.includes(serviceGroup),
    `Home page is missing service group: ${serviceGroup}`,
  );
}
expect(
  home.html.includes('/images/luma-hero-banner.webp'),
  'Home page must use the approved hero banner',
);
expect(!home.html.includes('/images/warm-family.'), 'Home page must not include the unused family-photo hero');
expect(!home.html.includes('hero-status-pill'), 'Home page must not repeat the opening-status pill');
expect(
  home.html.includes('class="hero-credibility-ribbon"') &&
    homeText.includes(
      'Board-certified pediatric care for North Texas families, guided by AAP and CDC recommendations.',
    ),
  'Board-certified care must appear inside the hero credential ribbon',
);
expect(
  !home.html.includes('class="sage-sweep"'),
  'Home hero must not stack a second sage transition behind the credential ribbon',
);
const homeImages = findTags(home.html, 'img');
const heroImage = homeImages.find(
  (attributes) => attributes.src === '/images/luma-hero-banner.jpg',
);
expect(
  heroImage?.width === '1440' && heroImage?.height === '753',
  'Home hero banner must publish intrinsic dimensions',
);
for (const bannerAsset of [
  'images/luma-hero-banner.jpg',
  'images/luma-hero-banner.webp',
]) {
  expect(
    existsSync(join(root, 'public', bannerAsset)),
    `Home hero banner asset is missing: ${bannerAsset}`,
  );
}
for (const trustImage of [
  'trust-family.jpg',
  'trust-checkup.jpg',
  'trust-gentle.jpg',
  'trust-playful.jpg',
]) {
  const image = homeImages.find(
    (attributes) => attributes.src === `/images/${trustImage}`,
  );
  expect(
    image?.width === '1200' && image?.height === '1005',
    `Trust image must publish intrinsic dimensions: ${trustImage}`,
  );
}
expect(
  !homeText.includes('Meet Dr. Tallapureddy'),
  'Provider spotlight must remain off the homepage',
);
expect(
  !homeText.includes('We typically respond within one business day'),
  'Home page must not publish an unverified response-time promise',
);
for (const value of [
  'Why Luma',
  'Practical details for future Luma families.',
  'Stay Updated on Luma',
]) {
  expect(homeText.includes(value), `Home page is missing restructured content: ${value}`);
}
for (const href of [
  '#services',
  '#why-luma',
  '#plan-ahead',
  '#practice-updates',
]) {
  expect(
    home.html.includes(`href="${href}"`),
    `Home section navigation is missing ${href}`,
  );
}
expect(
  home.html.includes('class="trust-photo-grid') &&
    home.html.includes('aria-label="Family-centered practice gallery"'),
  'Home gallery must retain the accessible mobile scroll region',
);
for (const slug of serviceSlugs.filter(
  (slug) => slug !== 'adhd-behavior-developmental-care',
)) {
  expect(
    home.html.includes(`href="/services/#${slug}"`),
    `Home service card is missing deep link: ${slug}`,
  );
}
const homeSectionOrder = [
  ...home.html.matchAll(/data-home-section="([^"]+)"/g),
].map((match) => match[1]);
expect(
  JSON.stringify(homeSectionOrder) ===
    JSON.stringify([
      'hero',
      'credibility',
      'services',
      'why-luma',
      'practical',
      'updates',
      'final',
    ]),
  `Home page section order is incorrect: ${homeSectionOrder.join(', ')}`,
);
for (const city of ['mckinney', 'allen', 'frisco', 'prosper', 'melissa', 'princeton', 'anna', 'fairview']) {
  expect(
    home.html.includes(`/pediatrician/${city}/`),
    `Home footer is missing core service-area link: ${city}`,
  );
}
for (const secondaryCity of ['sherman', 'aubrey', 'little-elm']) {
  expect(
    !home.html.includes(`/pediatrician/${secondaryCity}/`),
    `Home footer still exposes the full city list: ${secondaryCity}`,
  );
}
const rssDiscovery = findTags(home.html, 'link').find(
  (attributes) =>
    (attributes.rel ?? '').split(/\s+/).includes('alternate') &&
    attributes.type === 'application/rss+xml',
);
expect(
  rssDiscovery?.href === `${domain}/rss.xml` &&
    rssDiscovery?.title === `${contract.name} Blog & Parent Guides`,
  'RSS discovery link is missing from page metadata',
);

const articlePages = pages.filter((page) => /\/blog\/[^/]+\/$/.test(page.canonical));
expect(
  articlePages.length > 0,
  'A generated blog article is required for article metadata verification',
);
const articleHeroPaths = [];
for (const articlePage of articlePages) {
  expect(
    singleMeta(articlePage.html, 'property', 'og:type', articlePage.fileLabel) === 'article',
    `${articlePage.fileLabel}: article og:type is missing`,
  );
  const publishedTime = singleMeta(
    articlePage.html,
    'property',
    'article:published_time',
    articlePage.fileLabel,
  );
  expect(publishedTime, `${articlePage.fileLabel}: article publish time is missing`);
  const modifiedTime = singleMeta(
    articlePage.html,
    'property',
    'article:modified_time',
    articlePage.fileLabel,
  );
  expect(
    /^\d{4}-\d{2}-\d{2}T/.test(modifiedTime ?? ''),
    `${articlePage.fileLabel}: article modified time is missing or not an ISO timestamp`,
  );
  const conciseTitle = articlePage.title.split(' | ')[0].trim();
  expect(
    conciseTitle.length > 0 && normalizedText(articlePage.html).includes(conciseTitle),
    `${articlePage.fileLabel}: article title is not the concise published version`,
  );
  const articleStructuredData = jsonLdObjects(
    articlePage.html,
    articlePage.fileLabel,
  ).find((value) => hasType(value['@type'], 'BlogPosting'));
  expect(articleStructuredData, `${articlePage.fileLabel}: BlogPosting JSON-LD is missing`);
  expect(
    articleStructuredData.dateModified === modifiedTime,
    `${articlePage.fileLabel}: BlogPosting dateModified must match article:modified_time`,
  );
  expect(
    articleStructuredData.author?.['@type'] === 'Person' &&
      articleStructuredData.author?.name === contract.physicianName &&
      articleStructuredData.author?.url === `${domain}/about/`,
    `${articlePage.fileLabel}: physician author markup is incomplete`,
  );
  const requiredRatios = [
    [1200, 900],
    [1200, 675],
    [900, 900],
  ];
  expect(
    Array.isArray(articleStructuredData.image) &&
      articleStructuredData.image.length === requiredRatios.length &&
      requiredRatios.every(([width, height]) =>
        articleStructuredData.image.some(
          (image) => image.width === width && image.height === height,
        ),
      ),
    `${articlePage.fileLabel}: article schema must publish 4:3, 16:9, and 1:1 images`,
  );
  expect(
    findTags(articlePage.html, 'a').some(
      (attributes) =>
        attributes.href === '/about/' &&
        (attributes.rel ?? '').split(/\s+/).includes('author'),
    ),
    `${articlePage.fileLabel}: visible author must link to the provider profile`,
  );
  const asVisibleDate = (value) =>
    new Date(value).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    });
  const visibleUpdated = asVisibleDate(modifiedTime);
  const articleText = normalizedText(articlePage.html);
  if (visibleUpdated === asVisibleDate(publishedTime)) {
    expect(
      !articleText.includes('Updated '),
      `${articlePage.fileLabel}: byline must omit a redundant updated date that matches the publish date`,
    );
  } else {
    expect(
      articleText.includes(`Updated ${visibleUpdated}`),
      `${articlePage.fileLabel}: visible updated date must match structured data`,
    );
  }
  const heroEntry = articleStructuredData.image.find(
    (image) => image.width === 1200 && image.height === 900,
  );
  const heroPath = String(heroEntry.url).replace(domain, '');
  articleHeroPaths.push(heroPath);
  const articleHero = findTags(articlePage.html, 'img').find(
    (attributes) => attributes.src === heroPath,
  );
  expect(
    articleHero?.width === '1200' && articleHero?.height === '900',
    `${articlePage.fileLabel}: article hero must publish intrinsic dimensions`,
  );
  for (const image of articleStructuredData.image) {
    const imagePath = String(image.url).replace(domain, '').replace(/^\//, '');
    expect(
      existsSync(join(root, 'public', imagePath)),
      `${articlePage.fileLabel}: article schema image is missing: ${imagePath}`,
    );
  }
}

const aboutPage = pages.find((page) => page.canonical === `${domain}/about/`);
expect(aboutPage, 'About page was not generated');
const aboutText = normalizedText(aboutPage.html);
expect(
  findTags(aboutPage.html, 'a').some(
    (attributes) =>
      attributes.href === '/about/' &&
      attributes['aria-current'] === 'page',
  ),
  'About page must mark the active primary navigation item',
);
expect(
  aboutText.includes(
    'Caring for children and families in North Texas since 2022',
  ),
  'About page must clarify that the 2022 date refers to provider experience',
);
for (const value of [
  'Your pediatrician',
  'Praveena Tallapureddy, MD',
  'Board certified by the American Board of Pediatrics',
  'Outside the office',
  'Credentials & background',
  'How we care',
  'Family partnership',
  'Evidence-based decisions',
  'Accessible, continuous care',
  'Learn more about our future practice',
]) {
  expect(aboutText.includes(value), `About page is missing restructured content: ${value}`);
}
expect(
  aboutPage.html.indexOf('provider-spotlight') <
    aboutPage.html.indexOf('How we care'),
  'About page must introduce the pediatrician before the care principles',
);
for (const redundantText of [
  'Meet your pediatrician',
  'Meet Praveena Tallapureddy',
  'Our approach',
  'including well-child visits, same-day sick care, vaccinations, and more',
]) {
  expect(
    !aboutText.includes(redundantText),
    `About page still contains redundant copy: ${redundantText}`,
  );
}
const aboutHeadshot = findTags(aboutPage.html, 'img').find(
  (attributes) => attributes.src === '/images/provider-headshot.jpg',
);
expect(
  aboutHeadshot?.width === '1003' && aboutHeadshot?.height === '1254',
  'About provider headshot must publish intrinsic dimensions',
);

const newPatientsPage = pages.find(
  (page) => page.canonical === `${domain}/new-patients/`,
);
expect(newPatientsPage, 'New Patients page was not generated');
expect(
  normalizedText(newPatientsPage.html).includes('Leave with a clear plan'),
  'New Patients page must use the distinct fourth-step title',
);

const blogIndex = pages.find((page) => page.canonical === `${domain}/blog/`);
expect(blogIndex, 'Blog index was not generated');
expect(
  findTags(blogIndex.html, 'a').some(
    (attributes) =>
      attributes.href === '/resources/' &&
      attributes['aria-current'] === 'page',
  ),
  'Blog page must mark Resources as the active primary navigation item',
);
expect(
  normalizedText(blogIndex.html).includes(
    articlePages.length === 1
      ? 'Start with our current physician-reviewed guide.'
      : 'Articles on fevers, sleep, newborn care, vaccines, and when to contact a healthcare provider.',
  ),
  'Blog index intro must accurately describe the number of published guides',
);
expect(
  articlePages.length === 1
    ? blogIndex.html.includes('max-w-xl mx-auto')
    : blogIndex.html.includes('sm:grid-cols-2'),
  articlePages.length === 1
    ? 'A single Blog article card must be centered'
    : 'Multiple Blog article cards must use the two-column grid',
);
for (const heroPath of articleHeroPaths) {
  const blogCardImage = findTags(blogIndex.html, 'img').find(
    (attributes) => attributes.src === heroPath,
  );
  expect(
    blogCardImage?.width === '1200' && blogCardImage?.height === '900',
    `Blog card image must publish intrinsic dimensions: ${heroPath}`,
  );
}
const resourcesPage = pages.find(
  (page) => page.canonical === `${domain}/resources/`,
);
expect(resourcesPage, 'Resources page was not generated');
for (const href of ['/vaccines/']) {
  expect(
    findTags(resourcesPage.html, 'a').some(
      (attributes) => attributes.href === href,
    ),
    `Resources page must link to ${href}`,
  );
}
expect(
  !findTags(resourcesPage.html, 'a').some(
    (attributes) => attributes.href === '/new-patients/',
  ),
  'Resources page must not restore the removed future new-patient card',
);

for (const path of [
  '/services/',
  '/faq/',
  '/new-patients/',
  '/terms/',
  '/privacy/',
  '/notice-of-privacy-practices/',
  '/accessibility/',
  '/vaccines/',
  '/dosing-charts/',
  '/health-watch/',
  '/resources/',
  '/blog/',
  '/pediatrician/',
]) {
  const page = pages.find((candidate) => candidate.canonical === `${domain}${path}`);
  expect(page, `Expected generated page for continuity check: ${path}`);
  expect(
    page.html.includes('page-hero py-12 md:py-16'),
    `${path}: standard page hero spacing is inconsistent`,
  );
}

for (const path of [
  '/about/',
  '/contact/',
  '/services/',
  '/faq/',
  '/new-patients/',
  '/resources/',
  '/blog/',
  '/vaccines/',
  '/dosing-charts/',
  '/health-watch/',
  '/pediatrician/',
]) {
  const page = pages.find((candidate) => candidate.canonical === `${domain}${path}`);
  expect(page, `Expected generated page for decoration check: ${path}`);
  expect(
    hasElementClass(page.html, 'page-decor--soft') &&
      hasElementClass(page.html, 'brand-cloud') &&
      hasElementClass(page.html, 'botanical-spray'),
    `${path}: primary hero must use the soft Luma decoration motif`,
  );
}

for (const path of [
  '/privacy/',
  '/terms/',
  '/accessibility/',
  '/notice-of-privacy-practices/',
]) {
  const page = pages.find((candidate) => candidate.canonical === `${domain}${path}`);
  expect(page, `Expected generated legal page for decoration check: ${path}`);
  expect(
    hasElementClass(page.html, 'page-decor--minimal') &&
      !hasElementClass(page.html, 'brand-cloud') &&
      !hasElementClass(page.html, 'botanical-spray'),
    `${path}: legal hero must use minimal star decoration only`,
  );
}
for (const articlePage of articlePages) {
  expect(
    !hasElementClass(articlePage.html, 'page-decor'),
    `${articlePage.fileLabel}: long-form reading content must remain undecorated`,
  );
}

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
const inboundLinks = new Map(
  [...sitemapUrls].map((url) => [new URL(url).pathname, new Set()]),
);
for (const page of pages.filter((candidate) => !candidate.noindex)) {
  const sourcePath = new URL(page.canonical).pathname;
  for (const attributes of findTags(page.html, 'a')) {
    const href = attributes.href;
    if (
      !href ||
      href.startsWith('#') ||
      /^(?:mailto:|tel:|sms:|javascript:)/i.test(href)
    ) {
      continue;
    }
    const target = new URL(href, domain);
    if (target.origin !== domain) continue;
    const targetSources = inboundLinks.get(target.pathname);
    if (targetSources && target.pathname !== sourcePath) {
      targetSources.add(sourcePath);
    }
  }
}
for (const [pathname, sources] of inboundLinks) {
  if (pathname === '/') continue;
  expect(
    sources.size > 0,
    `Sitemap page has no internal discovery link: ${pathname}`,
  );
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
const indexNowKey = '68a3f60f6888a5a9ed55db78c80dda34';
expect(
  readFileSync(join(root, 'public', `${indexNowKey}.txt`), 'utf8').trim() ===
    indexNowKey,
  'IndexNow verification key file is missing or incorrect',
);
const deployWorkflow = readFileSync(
  join(root, '.github', 'workflows', 'deploy.yml'),
  'utf8',
);
expect(
  deployWorkflow.includes('https://api.indexnow.org/indexnow') &&
    deployWorkflow.includes('sitemap-0.xml') &&
    deployWorkflow.includes('"urlList": urls'),
  'Deployment workflow must notify IndexNow with every sitemap URL',
);
const searchConsolePrioritySource = readFileSync(
  join(root, 'scripts', 'search-console-priority.mjs'),
  'utf8',
);
for (const priorityPath of [
  '/resources/',
  '/dosing-charts/',
  '/blog/',
  '/pediatrician/',
]) {
  expect(
    searchConsolePrioritySource.includes(`'${priorityPath}'`),
    `Search Console priority list is missing ${priorityPath}`,
  );
}

const currentSocialImage = readFileSync(
  join(root, 'public', contract.socialImage.replace(/^\//, '')),
);
expect(currentSocialImage.readUInt32BE(16) === 1200, 'Current social image must be 1200px wide');
expect(currentSocialImage.readUInt32BE(20) === 630, 'Current social image must be 630px tall');
const compatibilitySocialImage = readFileSync(join(root, 'public', 'og-default.png'));
expect(
  currentSocialImage.equals(compatibilitySocialImage),
  'og-default.png must remain a current-brand compatibility alias',
);
const previousVersionSocialImage = readFileSync(
  join(root, 'public', 'og-luma-pediatrics-2026-09.png'),
);
expect(
  currentSocialImage.equals(previousVersionSocialImage),
  'Previous versioned social image must remain a current-brand compatibility alias',
);
const favicon = readFileSync(join(root, 'public', 'favicon.png'));
expect(favicon.readUInt32BE(16) === 256, 'favicon.png must be 256px wide');
expect(favicon.readUInt32BE(20) === 256, 'favicon.png must be 256px tall');
const appleTouchIcon = readFileSync(join(root, 'public', 'apple-touch-icon.png'));
expect(appleTouchIcon.readUInt32BE(16) === 512, 'apple-touch-icon.png must be 512px wide');
expect(appleTouchIcon.readUInt32BE(20) === 512, 'apple-touch-icon.png must be 512px tall');
for (const removedAsset of [
  'favicon.svg',
  'images/warm-family.jpg',
  'images/warm-family.webp',
  'images/clinic-welcome.jpg',
  'images/clinic-welcome.webp',
  'images/doctor-child.jpg',
  'images/doctor-child.webp',
  'images/happy-baby.jpg',
  'images/happy-baby.webp',
]) {
  expect(
    !existsSync(join(root, 'public', removedAsset)),
    `Legacy asset should be removed: ${removedAsset}`,
  );
}

const rss = readFileSync(join(dist, 'rss.xml'), 'utf8');
expect(rss.includes('<rss version="2.0"'), 'rss.xml is not a valid RSS 2.0 document');
expect(
  rss.includes(`<atom:link href="${domain}/rss.xml" rel="self" type="application/rss+xml" />`),
  'rss.xml self link is incorrect',
);
expect(
  rss.includes(`<link>${domain}/blog/</link>`),
  'rss.xml channel link is incorrect',
);
const rssItems = [...rss.matchAll(/<item>/g)].length;
expect(rssItems > 0, 'rss.xml must contain at least one published article');
for (const article of pages.filter((page) => /\/blog\/[^/]+\/$/.test(page.canonical))) {
  expect(rss.includes(`<guid isPermaLink="true">${article.canonical}</guid>`), `RSS feed is missing ${article.canonical}`);
}

const llms = readFileSync(join(root, 'public', 'llms.txt'), 'utf8');
for (const value of [
  `**Practice name:** ${contract.name}`,
  `**Legal entity:** ${contract.legalName}`,
  `**Organization NPI:** ${contract.organizationNpi}`,
  `**Address:** ${contract.address}, ${contract.cityLine}`,
  `**Phone:** ${contract.phone}`,
  `**Website:** ${domain}/`,
  `**Status:** ${contract.status}`,
  '**Planned hours:** Mon–Tue and Thu–Fri 7:30 am–4:30 pm · Wed 7:30 am–11:30 am · Sat 8:30 am–12:30 pm · Sun closed',
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
expect(
  llms.includes(
    'Luma Pediatrics is the public-facing practice name of Luma Physician Group PLLC',
  ),
  'llms.txt must explain the legal-name and practice-name relationship',
);
expect(
  llms.includes(`[RSS Feed](${domain}/rss.xml)`),
  'llms.txt must advertise the RSS feed',
);

const contactHtml = readFileSync(join(dist, 'contact', 'index.html'), 'utf8');
const contactText = normalizedText(contactHtml);
const contactSource = readFileSync(
  join(root, 'src', 'pages', 'contact.astro'),
  'utf8',
);
expect(
  /\.contact-medical-note\s*\{[\s\S]*?flex:\s*1 1 auto/.test(contactSource) &&
    !contactSource.includes('flex: 1 1 30rem'),
  'Contact medical note must not reserve desktop-sized vertical space on mobile',
);
for (const hoursText of [
  'Mon–Tue, Thu–Fri 7:30 am – 4:30 pm',
  'Wednesday 7:30 am – 11:30 am',
]) {
  expect(
    contactText.includes(hoursText),
    `Contact page is missing planned hours: ${hoursText}`,
  );
}
expect(
  !contactText.includes('Mon–Fri 7:30 am – 4:30 pm'),
  'Contact page must not show Wednesday as a full office day',
);
expect(
  contactHtml.includes('class="contact-primary-actions"') &&
    contactHtml.includes('<details id="sms-disclosure"') &&
    contactHtml.includes('class="contact-planning-section') &&
    contactHtml.includes('class="contact-location-layout"') &&
    contactText.includes('Get in touch') &&
    contactText.includes('Future McKinney location'),
  'Contact page must separate contact actions from visit planning',
);
expect(
  !contactHtml.includes('class="areas-served-card"'),
  'Contact page must not restore the removed service-area city list',
);
expect(
  !contactText.includes('General information and future location') &&
    !contactText.includes('Stay connected as we prepare to open') &&
    !contactHtml.includes('class="contact-opening-banner"') &&
    !contactHtml.includes('class="contact-location-section'),
  'Contact page must not restore the overloaded combined presentation',
);
expect(
  contactHtml.includes('href="/privacy/"') &&
    contactHtml.includes('href="/terms/"'),
  'Contact SMS disclosure must link to the public Privacy Policy and Terms pages',
);
expect(
  !contactHtml.includes('github.com/anishtallapureddy/luma-pediatrics/blob'),
  'Contact SMS disclosure must not expose GitHub source links',
);
expect(
  !contactHtml.includes('luma-hero-banner') &&
    !contactHtml.includes('luma-opening-banner'),
  'Contact hero must stay text-only; the banner now leads the home page',
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
  expect(
    cityPage.html.includes('page-hero py-12 md:py-16'),
    `${cityPage.fileLabel}: city hero must use the shared page treatment`,
  );
  expect(
    hasElementClass(cityPage.html, 'page-decor--soft'),
    `${cityPage.fileLabel}: city hero must use the soft Luma decoration motif`,
  );
  expect(
    !cityPage.html.includes('from-sky-50'),
    `${cityPage.fileLabel}: legacy blue city-page styling must not return`,
  );
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
  /vaccines\/schedules\/parents\/index\.html/i,
  /Acetaminophen-Dosage-Table\.aspx/i,
  /Ibuprofen-for-Children-Dosage-Table\.aspx/i,
  /--color-accent/,
  /(?:text|bg|border|ring)-luma-/,
];
for (const file of textSourceFiles) {
  const content = readFileSync(file, 'utf8');
  for (const pattern of forbidden) {
    expect(!pattern.test(content), `${relative(root, file)} contains inconsistent NAP/status text: ${pattern}`);
  }
  if (extname(file) === '.astro') {
    for (const match of content.matchAll(/href=(?:"(\/[^"#?]*?)"|'(\/[^'#?]*?)')/g)) {
      const href = match[1] ?? match[2];
      if (href === '/' || href.endsWith('/') || href.includes('.')) continue;
      throw new Error(
        `${relative(root, file)} contains noncanonical internal link: ${href}`,
      );
    }
  }
}

const vaccinesHtml = readFileSync(join(dist, 'vaccines', 'index.html'), 'utf8');
expect(
  vaccinesHtml.includes(
    'https://www.healthychildren.org/English/safety-prevention/immunizations/Pages/Recommended-Immunization-Schedules.aspx',
  ),
  'Vaccines page must link to the current AAP parent-friendly schedule',
);
const dosingHtml = readFileSync(join(dist, 'dosing-charts', 'index.html'), 'utf8');
for (const sourceUrl of [
  'https://www.healthychildren.org/English/safety-prevention/at-home/medication-safety/Pages/Acetaminophen-for-Fever-and-Pain.aspx',
  'https://www.healthychildren.org/English/safety-prevention/at-home/medication-safety/Pages/Ibuprofen-for-Fever-and-Pain.aspx',
]) {
  expect(
    dosingHtml.includes(sourceUrl),
    `Dosing page is missing current AAP source: ${sourceUrl}`,
  );
}

const servicesHtml = readFileSync(join(dist, 'services', 'index.html'), 'utf8');
for (const slug of serviceSlugs) {
  expect(
    servicesHtml.includes(`id="${slug}"`),
    `Services page is missing deep-link target: ${slug}`,
  );
}
const globalCss = readFileSync(join(root, 'src', 'styles', 'global.css'), 'utf8');
const pageDecorSource = readFileSync(
  join(root, 'src', 'components', 'PageDecor.astro'),
  'utf8',
);
expect(
  pageDecorSource.includes('page-decor--${variant}') &&
    pageDecorSource.includes('opacity: 0.46') &&
    pageDecorSource.includes('opacity: 0.34'),
  'Page decorations must be bounded and subdued on mobile',
);
const baseLayoutSource = readFileSync(
  join(root, 'src', 'layouts', 'BaseLayout.astro'),
  'utf8',
);
expect(
  baseLayoutSource.includes(
    "threshold: 0.02, rootMargin: '0px 0px -24px 0px'",
  ),
  'Reveal animation must trigger early enough for tall mobile sections',
);
const footerSource = readFileSync(
  join(root, 'src', 'components', 'Footer.astro'),
  'utf8',
);
expect(
  footerSource.includes('footer class="mt-16 md:mt-20'),
  'Footer spacing must use the restrained shared rhythm',
);
expect(
  footerSource.includes(
    'lg:grid-cols-[1.35fr_1fr_1.6fr_0.9fr]',
  ) &&
    footerSource.includes('whitespace-nowrap text-right'),
  'Footer office hours must reserve enough width to keep time ranges intact',
);
for (const link of [
  '<li><a href="/about/"',
  '<li><a href="/services/"',
  '<li><a href="/resources/"',
  '<li><a href="/faq/"',
  '<li><a href="/contact/"',
]) {
  expect(footerSource.includes(link), `Footer Explore navigation is missing ${link}`);
}
expect(
  !footerSource.includes('<li><a href="/vaccines/"') &&
    !footerSource.includes('<li><a href="/rss.xml"') &&
    footerSource.includes('aria-label="Legal"') &&
    footerSource.includes('>HIPAA Notice</a>'),
  'Footer utility and legal links must use the compact secondary navigation',
);
expect(
  footerSource.includes('Follow Along') &&
    footerSource.includes("simple-icons:instagram") &&
    footerSource.includes("simple-icons:facebook") &&
    footerSource.includes("simple-icons:tiktok") &&
    footerSource.includes("simple-icons:linkedin"),
  'Footer must surface the social profile row with all four brand icons',
);
expect(
  footerSource.includes('rel="noopener noreferrer"') &&
    footerSource.includes('(opens in a new tab)'),
  'Footer social links must open safely and announce the new tab to screen readers',
);
expect(
  /\.eyebrow-sun\s*\{[\s\S]*?color:\s*var\(--color-sage-hover\)/.test(globalCss),
  'Light-background eyebrow text must use the darker sage token',
);
expect(
  /\.tagline-italic-sage\s*\{[\s\S]*?color:\s*var\(--color-sage-hover\)/.test(globalCss),
  'Sage tagline text must use the darker sage token',
);
expect(
  /\.trust-photo-grid\s*\{[\s\S]*?scroll-snap-type:\s*inline mandatory/.test(globalCss),
  'Mobile gallery scroll-snap styling is missing',
);
expect(
  /\.hero-credibility-ribbon\s*\{[\s\S]*?background:\s*var\(--color-sage-light\)/.test(
    globalCss,
  ),
  'Hero credential ribbon must match the footer sage band',
);
expect(
  /\.hero-credibility-ribbon\s*\{[\s\S]*?color:\s*var\(--color-sage-foreground\)/.test(
    globalCss,
  ),
  'Hero credential ribbon must use the footer white text treatment',
);
expect(
  /@media \(min-width: 900px\)\s*\{[\s\S]*?\.hero-credibility-copy\s*\{[\s\S]*?white-space:\s*nowrap/.test(
    globalCss,
  ),
  'Hero credential ribbon copy must remain on one line at desktop widths',
);
expect(
  /\.home-section-nav\s*\{[\s\S]*?background:\s*var\(--color-card\)/.test(
    globalCss,
  ),
  'Home section navigation must use a neutral surface below the sage ribbon',
);
expect(
  homeText.includes('Text us') &&
    home.html.includes(`href="${contract.smsHref}"`) &&
    !homeText.includes('Texting info'),
  'Header and mobile quick actions must provide direct, equally labeled texting access',
);

console.log(
  `SEO verification passed for ${pages.length} canonical pages and ${sitemapUrls.size} sitemap URLs.`,
);
