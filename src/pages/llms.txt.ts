import type { APIRoute } from 'astro';
import { SITE } from '../site.config';
import { renderDiscoverySummary } from '../utils/discoverySummary';

export const GET: APIRoute = () => new Response(renderDiscoverySummary(SITE), {
  headers: { 'Content-Type': 'text/plain; charset=utf-8' },
});
