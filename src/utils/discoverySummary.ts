import { services } from '../data/services.ts';
import { insurancePlans, additionalInsurancePlans, insuranceCoverageNote } from '../data/insurance.ts';
import { selfPayPricing, selfPayServices } from '../data/selfPay.ts';
import { getMedicalScheduling, type MedicalSchedulingConfig } from './serviceScheduling.ts';

interface DiscoverySite {
  name: string;
  description: string;
  legalName: string;
  organizationNpi: string;
  domain: string;
  status: string;
  locationShort: string;
  openingTargetDate: string;
  showProviderProfile: boolean;
  provider: {
    name: string;
    familiarName: string;
    role: string;
    quickFacts: ReadonlyArray<{ label: string; value: string }>;
  };
  address: {
    street: string;
    city: string;
    region: string;
    postalCode: string;
  };
  contact: { phone: string; email: string };
  schema: { publishOpeningHours: boolean };
  hours: ReadonlyArray<{ day: string; time: string }>;
  areasServed: readonly string[];
  newbornScheduling: MedicalSchedulingConfig & { plannedLaunchDate: string };
  wellChildScheduling: MedicalSchedulingConfig & { plannedLaunchDate: string };
}

export function renderDiscoverySummary(site: DiscoverySite) {
  const scheduling = getMedicalScheduling(site);
  const link = (path: string) => new URL(path, site.domain).href;
  const languages = site.provider.quickFacts.find((fact) => fact.label === 'Languages');
  const hours = site.hours.map((day) => `${day.day}: ${day.time}`).join('; ');
  const pages = [
    ['Home', '/', 'Practice overview and opening updates.'],
    ['About', '/about/', 'Practice approach and approved provider information.'],
    ['Services', '/services/', 'Complete pediatric services overview.'],
    ['Free Meet & Greet', '/meet-and-greet/', 'Planned complimentary, nonclinical introductions.'],
    ['Newborn Care', '/newborn-care/', 'Newborn office visits and hospital-arrangement information.'],
    ['Well-Child Visits', '/well-child-visits/', 'Preventive pediatric care and visit preparation.'],
    ['New Patients', '/new-patients/', 'Onboarding, insurance and approved scheduling information.'],
    ['FAQ', '/faq/', 'Answers about the practice, visits and pre-opening availability.'],
    ['Parent Resources', '/resources/', 'Parent guides and educational tools.'],
    ['Parent Guides / Blog', '/blog/', 'Published pediatric articles.'],
    ['Vaccine Reference', '/vaccines/', 'Parent reference; individualized timing requires clinical review.'],
    ['Dosing Calculator & Charts', '/dosing-charts/', 'Browser-only label lookup for supported ages and weight bands.'],
    ['Health Watch', '/health-watch/', 'Community respiratory trends with source dates and limitations.'],
    ['Service Area', '/pediatrician/', 'Nearby communities, not additional clinic locations.'],
    ['McKinney Location', '/pediatrician/mckinney/', 'Location and directions to the McKinney clinic.'],
    ['Contact', '/contact/', 'General inquiries only; do not submit medical information.'],
    ['Privacy Policy', '/privacy/', 'Website privacy information.'],
    ['Terms & Conditions', '/terms/', 'Website terms.'],
    ['Notice of Privacy Practices', '/notice-of-privacy-practices/', 'Practice privacy notice.'],
    ['Accessibility', '/accessibility/', 'Accessibility information and feedback.'],
  ];

  return [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    '## Key facts',
    '',
    `- **Practice name:** ${site.name}`,
    `- **Legal entity:** ${site.legalName}`,
    `- **Organization NPI:** ${site.organizationNpi}`,
    '- **Type:** Independent, physician-led pediatric primary care',
    ...(site.showProviderProfile ? [
      `- **Provider:** ${site.provider.name} (${site.provider.familiarName}), ${site.provider.role}`,
      ...(languages ? [`- **Languages:** ${languages.value}`] : []),
    ] : []),
    `- **Address:** ${site.address.street}, ${site.address.city}, ${site.address.region} ${site.address.postalCode}`,
    `- **Phone:** ${site.contact.phone}`,
    `- **Email:** ${site.contact.email}`,
    `- **Website:** ${link('/')}`,
    `- **Status:** ${site.status}`,
    `- **Opening target:** ${site.openingTargetDate}, subject to readiness; not a confirmed opening.`,
    `- **${site.schema.publishOpeningHours ? 'Office hours' : 'Planned hours'}:** ${hours}`,
    `- **Insurance:** See [accepted commercial insurers and networks](${link('/new-patients/#insurance')}). ${insuranceCoverageNote}`,
    '',
    '## Booking and care boundaries',
    '',
    scheduling.enabled
      ? 'Medical booking is enabled only for the services identified below. Use their linked pages for the approved workflows.'
      : 'Medical appointment booking is not currently enabled. Planned launch dates never activate scheduling.',
    `- **Newborn booking:** ${scheduling.newborn.enabled ? 'Enabled' : 'Not enabled'}. See [Newborn Care](${link('/newborn-care/')}). Target launch: ${site.newbornScheduling.plannedLaunchDate}.`,
    `- **Well-child booking:** ${scheduling.wellChild.enabled ? 'Enabled' : 'Not enabled'}. See [Well-Child Visits](${link('/well-child-visits/')}). Target launch: ${site.wellChildScheduling.plannedLaunchDate}.`,
    `- **Meet & Greet:** A free introduction is planned after opening. It is not an examination, diagnosis or treatment visit and does not establish a physician-patient relationship. No Meet & Greet booking workflow is enabled; [ask about arrangements](${link('/contact/')}).`,
    '- **Current medical concerns:** Contact your child\'s current healthcare provider. For a medical emergency, call 911 or go to the nearest emergency room.',
    '- **Privacy:** Website inquiries are for general questions, not patient intake. Do not submit protected medical information.',
    '',
    '## Insurance',
    '',
    `- **Major Insurance Plans Accepted:** ${insurancePlans.map(({ name }) => name).join('; ')}.`,
    `- **Additional Commercial Networks & Plans:** ${additionalInsurancePlans.join('; ')}.`,
    `${site.name} accepts a variety of commercial insurance plans. ${insuranceCoverageNote} Please contact our office at ${site.contact.phone} to verify coverage before your appointment.`,
    '',
    '## Self-pay',
    '',
    'These fees apply to visits after the practice opens.',
    ...selfPayServices.map(({ name, price, detail }) => `- **${name}:** ${price}. ${detail}`),
    `${selfPayPricing.visitFeeNote} ${selfPayPricing.additionalCharges}`,
    `Contact our office at ${site.contact.phone} for an estimate before your visit. See [self-pay pricing](${link('/new-patients/#self-pay')}).`,
    '',
    '## Planned services',
    '',
    ...services.map((service) =>
      `- [${service.title}](${link(service.detailHref ?? `/services/#${service.slug}`)}): ${service.full}`,
    ),
    '',
    '## Entity and location',
    '',
    `${site.name} is the public-facing practice name of ${site.legalName}.`,
    `${site.name} has one future physical clinic in ${site.locationShort}. Service-area pages describe travel to that clinic and do not represent separate ${site.name} offices.`,
    `Nearby communities: ${site.areasServed.join(', ')}.`,
    '',
    '## Pages',
    '',
    ...pages.map(([name, path, description]) => `- [${name}](${link(path)}): ${description}`),
    `- [RSS Feed](${link('/rss.xml')}): Published parent guides.`,
    `- [Sitemap](${link('/sitemap-index.xml')}): Canonical public page URLs.`,
    '',
    '## About this summary',
    '',
    'This optional plain-text summary is generated from the public website configuration, service catalog, insurance list, and public self-pay summary. Refer to the linked pages for current policies and clinical context. It is not medical advice, a patient intake channel, or a guarantee of search inclusion.',
    '',
  ].join('\n');
}
