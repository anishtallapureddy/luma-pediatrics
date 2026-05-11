/**
 * Single source of truth for the practice's service catalog.
 * - `short` is used on the homepage preview tiles.
 * - `full`  is used on the dedicated /services page.
 * - `featured: true` controls which services appear on the home preview.
 *
 * Keep all customer-facing service copy here so home + services stay in sync.
 */

export interface ServiceItem {
  icon: string;
  title: string;
  short: string;
  full: string;
  featured?: boolean;
  badge?: string;
}

export const services: ServiceItem[] = [
  {
    icon: 'lucide:baby',
    title: 'Newborn Care',
    short:
      'Lactation support, growth tracking, and gentle first visits for your newest family member.',
    full:
      'A gentle, unhurried first visit. We support feeding (lactation and bottle), track healthy growth and weight gain, screen for jaundice, answer the sleep and crying questions every new parent has, and partner with you through those first big weeks at home.',
    featured: true,
  },
  {
    icon: 'lucide:home',
    title: 'Newborn Home Visit',
    badge: 'Included',
    short:
      'A complimentary in-home visit within your baby\'s first two weeks — feeding check, weight, jaundice screen.',
    full:
      'Every Luma newborn family receives one complimentary in-home visit within the first two weeks. We check feeding, weight gain, jaundice, and how you\'re settling in — all without packing up baby for a clinic trip. It\'s our way of making the fourth trimester feel a little easier.',
    featured: true,
  },
  {
    icon: 'lucide:stethoscope',
    title: 'Well-Child Visits',
    short:
      'Routine check-ups, developmental screening, and milestone guidance at every age.',
    full:
      'Comprehensive check-ups at every recommended age — from infancy through adolescence. Each visit includes a head-to-toe exam, developmental and behavioral screening, milestone guidance, growth tracking, and time for your questions.',
    featured: true,
  },
  {
    icon: 'lucide:heart',
    title: 'Sick Visits',
    badge: 'Same-day',
    short:
      'Same-day appointments for fevers, infections, injuries, and the unexpected.',
    full:
      'Same-day appointments for fevers, coughs, ear pain, stomach bugs, rashes, injuries, and the unexpected. Call our office in the morning and we will work to get your child seen the same day.',
    featured: true,
  },
  {
    icon: 'lucide:syringe',
    title: 'Vaccinations',
    short:
      'Full schedule of recommended childhood vaccines, on-time and CDC-aligned.',
    full:
      'The full schedule of recommended childhood vaccines, administered on time and aligned with CDC and AAP guidelines. We are happy to discuss the schedule with you in detail — your questions are welcome.',
    featured: true,
  },
  {
    icon: 'lucide:graduation-cap',
    title: 'School, Sports & Camp Physicals',
    short: 'Forms-ready exams for school, camp, and athletic clearance.',
    full:
      'Forms-ready physical exams for school, summer camp, and athletic clearance. Bring the forms; we will take care of the rest.',
    featured: true,
  },
  {
    icon: 'lucide:sparkles',
    title: 'ADHD, Behavior & Developmental Care',
    short:
      'ADHD evaluations, behavior support, early developmental screening, and trusted referrals.',
    full:
      'Evaluations and ongoing support for ADHD, learning concerns, and behavioral challenges. Early screening for developmental delays, family-centered guidance, and trusted referrals to specialists when more support is needed.',
  },
  {
    icon: 'lucide:users',
    title: 'Teen & Adolescent Health',
    short:
      'Confidential, age-appropriate care for tweens and teens through young adulthood.',
    full:
      'Confidential, age-appropriate care for tweens and teens — including mental health screening, sports medicine, and the conversations adolescents deserve to have with a trusted clinician.',
    featured: true,
  },
  {
    icon: 'lucide:video',
    title: 'Telehealth / Virtual Visits',
    short:
      'Secure video visits via healow Telehealth — for medication refills and quick follow-ups.',
    full:
      'Skip the trip when you don\'t need to come in. Through healow Telehealth, we offer secure video visits for prescription refills, follow-up appointments, lab/imaging result discussions, and behavioral or ADHD check-ins. Available to established Luma patients.',
    featured: true,
  },
];

export const featuredServices = services.filter((s) => s.featured);

/**
 * Insurance carriers commonly accepted. Used on /new-patients so families can
 * self-qualify at a glance. Update when the practice confirms its panel.
 * NOTE: representative list — confirm before launch.
 */
export const insurancePlans = [
  'Blue Cross Blue Shield of Texas',
  'Aetna',
  'UnitedHealthcare',
  'Cigna',
  'Humana',
  'Texas Medicaid (STAR & CHIP)',
];
