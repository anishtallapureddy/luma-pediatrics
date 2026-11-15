import assert from 'node:assert/strict';
import test from 'node:test';
import { SITE } from '../site.config.ts';
import { renderDiscoverySummary } from './discoverySummary.ts';

test('discovery summary follows the service pages and pre-opening care boundaries', () => {
  const text = renderDiscoverySummary({
    ...SITE,
    appointmentScheduling: { enabled: false, url: '' },
    newbornScheduling: { enabled: false, url: '' },
    wellChildScheduling: { enabled: false, url: '' },
  });
  for (const path of ['/meet-and-greet/', '/newborn-care/', '/well-child-visits/']) {
    assert(text.includes(`${SITE.domain}${path}`));
  }
  assert(text.includes('Online medical appointment booking is not available yet.'));
  assert(text.includes('does not establish a physician-patient relationship'));
  assert(text.includes('Meet & Greet appointments are not available yet'));
  assert(text.includes('minor injuries'));
  assert(text.includes('when capacity allows'));
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

test('clinical discovery groups hospital information under newborn care and keeps introductions separate', () => {
  const text = renderDiscoverySummary(SITE);
  const planned = text.slice(text.indexOf('## Planned services'), text.indexOf('## Entity and location'));
  assert(planned.indexOf('[Well-Child Visits]') < planned.indexOf('[Same-Day Sick Visits]'));
  assert(planned.indexOf('[Same-Day Sick Visits]') < planned.indexOf('[Newborn Care]'));
  assert.match(planned, /\[Newborn Care\][^\n]+\n  - \[Newborn Rounds at BSW McKinney\]/);
  assert(planned.includes('subject to assignment, privileges, and final hospital arrangements'));
  assert(!planned.includes('[Free Meet & Greet]'));
  assert(text.includes('**Meet & Greet:** A free introduction is planned after opening.'));
});

test('public summary announces the approved opening while keeping scheduling targets internal', () => {
  const text = renderDiscoverySummary(SITE);
  assert(text.includes(`**Status:** ${SITE.status}`));
  assert(text.includes(SITE.openingWindow));
  assert(text.includes(`[Phreesia](${SITE.appointmentScheduling.url})`));
  assert(text.includes('newborn, behavioral, sick, and well-child checks from November 30 onward'));
  const booking = text.slice(text.indexOf('## Booking and care boundaries'), text.indexOf('## Insurance'));
  assert(!/sports physicals|telehealth visits/.test(booking));
  assert(text.includes('Clinical care begins on opening day'));
  for (const target of [SITE.newbornScheduling.plannedLaunchDate, SITE.wellChildScheduling.plannedLaunchDate]) {
    assert(!text.includes(target));
  }
  assert(!text.includes('Target launch:'));
  assert(!text.includes('**Opening target:**'));
});

test('insurance summary includes major insurers, additional plans, and plan-specific verification', () => {
  const text = renderDiscoverySummary({
    ...SITE,
    contact: { ...SITE.contact, phone: '(555) 010-0100' },
  });
  assert(text.includes('Blue Cross Blue Shield of Texas (BCBS)'));
  assert(text.includes('Cigna / Great-West'));
  assert(text.includes('Anthem'));
  assert(text.includes('Curative; Coventry / First Health (PPO)'));
  assert(text.includes('6 Degrees – Fort Worth Firefighters; QuikTrip (Open Access)'));
  assert(text.includes('Participation varies by specific plan and network.'));
  assert(text.includes('Call or text our office at (555) 010-0100 to verify coverage before your appointment.'));
  assert(!/Medicaid|Molina|Superior Health Plan|Community Medicaid/i.test(text));
});

test('self-pay summary shows public visit fees and separate costs, not a billing catalog', () => {
  const text = renderDiscoverySummary(SITE);
  assert(text.includes('**Patient visit (sick or well-child):** $130.'));
  assert(text.includes('**Sports physical:** $40.'));
  assert(text.includes('**Testing:** From $10.'));
  assert(text.includes('**Screenings:** From $10.'));
  assert(text.includes('Urine pregnancy testing $10.'));
  assert(text.includes('strep tests from $25 each; cost depends on the test method.'));
  assert(text.includes('vision and hearing screenings from $20 each.'));
  const feeSummary = text.slice(text.indexOf('## Self-pay'), text.indexOf('## Planned services'));
  assert.equal(feeSummary.match(/\$130\b/g)?.length, 1);
  assert(!/\*\*[^*]*vaccin[^*]*:\*\*/i.test(feeSummary));
  assert(text.includes('Patient visit and sports physical fees cover the visit only.'));
  assert(text.includes('These fees apply to visits after the practice opens.'));
  assert(text.includes('Tests, screenings, vaccines, procedures, and applicable add-on charges are billed separately.'));
  assert(text.includes(`${SITE.domain}/new-patients/#self-pay`));
  assert(text.includes(`Call or text ${SITE.contact.phone} for an estimate before your visit.`));
  assert(!/\bCPT\b|\bHCPCS\b|\bTVFC\b|\.xlsx\b/i.test(text));
});

test('contact choices include asynchronous texting without changing urgent-care boundaries', () => {
  const text = renderDiscoverySummary(SITE);
  assert(text.includes('(call or text for general questions)'));
  assert(text.includes(SITE.contact.textingNote));
  assert(text.includes('Replies are not immediate; do not send medical information.'));
  assert(text.includes("Contact your child's current healthcare provider. For a medical emergency, call 911"));
  assert(!text.includes('call or text 911'));
});

test('changed business facts and hours propagate without editing a second summary', () => {
  const site = {
    ...SITE,
    name: 'Example Pediatrics',
    domain: 'https://clinic.example.test',
    openingWindow: 'April 1, 2027',
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
  assert(text.includes('newborn, behavioral, sick, and well-child checks from April 1, 2027 onward'));
  assert(text.includes('**Office hours:** Monday: 9:00 am - 5:00 pm'));
  assert(!text.includes('**Planned hours:**'));
});

test('summary booking availability respects independent manual service activation', () => {
  const text = renderDiscoverySummary({
    ...SITE,
    appointmentScheduling: { enabled: false, url: '' },
    newbornScheduling: { ...SITE.newbornScheduling, enabled: false, plannedLaunchDate: '2000-01-01' },
    wellChildScheduling: {
      ...SITE.wellChildScheduling,
      enabled: true,
      url: 'https://booking.example.test/well-child',
    },
  });
  assert(text.includes('**Newborn booking:** Not available yet'));
  assert(text.includes('**Well-child booking:** Available'));
  assert(!text.includes('Online medical appointment booking is not available yet.'));
  assert(text.includes('Online booking is available for the visit types listed below.'));
  assert(text.includes('Meet & Greet appointments are not available yet'));
  assert(!text.includes('booking.example.test'));
});
