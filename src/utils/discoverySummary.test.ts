import assert from 'node:assert/strict';
import test from 'node:test';
import { SITE } from '../site.config.ts';
import { renderDiscoverySummary } from './discoverySummary.ts';

test('discovery summary follows the service pages and pre-opening care boundaries', () => {
  const text = renderDiscoverySummary(SITE);
  for (const path of ['/meet-and-greet/', '/newborn-care/', '/well-child-visits/']) {
    assert(text.includes(`${SITE.domain}${path}`));
  }
  assert(text.includes('Medical appointment booking is not currently enabled.'));
  assert(text.includes('does not establish a physician-patient relationship'));
  assert(text.includes('No Meet & Greet booking workflow is enabled'));
  assert(text.includes('minor injuries'));
  assert(text.includes('day’s appointment capacity'));
  assert(!text.includes('Saint Louis University'));
});

test('provider privacy applies to the AI-facing summary as well as HTML', () => {
  const text = renderDiscoverySummary({ ...SITE, showProviderProfile: false });
  assert(!text.includes(SITE.provider.schemaName));
  assert(!text.includes(SITE.provider.familiarName));
  assert(!text.includes('**Provider:**'));
  assert(!text.includes('**Languages:**'));
  assert(text.includes(SITE.address.street));
});

test('insurance summary includes major insurers, additional plans, and plan-specific verification', () => {
  const text = renderDiscoverySummary({
    ...SITE,
    contact: { ...SITE.contact, phone: '(555) 010-0100' },
  });
  assert(text.includes('Blue Cross Blue Shield of Texas (BCBS)'));
  assert(text.includes('Cigna / Great-West'));
  assert(text.includes('Curative; Coventry / First Health (PPO)'));
  assert(text.includes('6 Degrees – Fort Worth Firefighters; QuikTrip (Open Access)'));
  assert(text.includes('Participation varies by specific plan and network.'));
  assert(text.includes('office at (555) 010-0100 to verify coverage before your appointment.'));
  assert(!/Medicaid|Molina|Superior Health Plan|Community Medicaid/i.test(text));
});

test('changed business facts and hours propagate without editing a second summary', () => {
  const site = {
    ...SITE,
    name: 'Example Pediatrics',
    domain: 'https://clinic.example.test',
    contact: { ...SITE.contact, phone: '(555) 010-0100' },
    address: { ...SITE.address, street: '100 Example Street' },
    schema: { publishOpeningHours: true },
    hours: [{ ...SITE.hours[0], day: 'Monday', time: '9:00 am - 5:00 pm' }],
  };
  const text = renderDiscoverySummary(site);
  assert(text.startsWith('# Example Pediatrics'));
  assert(text.includes('**Phone:** (555) 010-0100'));
  assert(text.includes('**Address:** 100 Example Street'));
  assert(text.includes('https://clinic.example.test/newborn-care/'));
  assert(text.includes('**Office hours:** Monday: 9:00 am - 5:00 pm'));
  assert(!text.includes('**Planned hours:**'));
});

test('summary booking availability respects independent manual service activation', () => {
  const text = renderDiscoverySummary({
    ...SITE,
    newbornScheduling: { ...SITE.newbornScheduling, plannedLaunchDate: '2000-01-01' },
    wellChildScheduling: {
      ...SITE.wellChildScheduling,
      enabled: true,
      url: 'https://booking.example.test/well-child',
    },
  });
  assert(text.includes('**Newborn booking:** Not enabled'));
  assert(text.includes('**Well-child booking:** Enabled'));
  assert(!text.includes('Medical appointment booking is not currently enabled.'));
  assert(text.includes('No Meet & Greet booking workflow is enabled'));
  assert(!text.includes('booking.example.test'));
});
