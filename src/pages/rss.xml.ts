import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../site.config';

export const prerender = true;

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export const GET: APIRoute = async () => {
  const posts = (await getCollection('blog', ({ data }) => !data.draft))
    .sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime());
  const latestDate = posts[0]?.data.updatedDate ?? posts[0]?.data.publishDate ?? new Date();

  const items = posts.map((post) => {
    const url = `${SITE.domain}/blog/${post.id}/`;
    const categories = post.data.tags
      .map((tag) => `<category>${escapeXml(tag)}</category>`)
      .join('');
    return [
      '<item>',
      `<title>${escapeXml(post.data.title)}</title>`,
      `<link>${escapeXml(url)}</link>`,
      `<guid isPermaLink="true">${escapeXml(url)}</guid>`,
      `<description>${escapeXml(post.data.description)}</description>`,
      `<pubDate>${post.data.publishDate.toUTCString()}</pubDate>`,
      `<dc:creator>${escapeXml(post.data.author)}</dc:creator>`,
      categories,
      '</item>',
    ].join('');
  });

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">',
    '<channel>',
    `<title>${escapeXml(`${SITE.name} Blog & Parent Guides`)}</title>`,
    `<link>${escapeXml(`${SITE.domain}/blog/`)}</link>`,
    `<description>${escapeXml('Pediatric information and parent guides from Luma Pediatrics in McKinney, Texas.')}</description>`,
    `<language>en-us</language>`,
    `<lastBuildDate>${latestDate.toUTCString()}</lastBuildDate>`,
    `<atom:link href="${escapeXml(`${SITE.domain}/rss.xml`)}" rel="self" type="application/rss+xml" />`,
    '<image>',
    `<url>${escapeXml(`${SITE.domain}/og-default.png`)}</url>`,
    `<title>${escapeXml(SITE.name)}</title>`,
    `<link>${escapeXml(`${SITE.domain}/`)}</link>`,
    '</image>',
    ...items,
    '</channel>',
    '</rss>',
    '',
  ].join('');

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
