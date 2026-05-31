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
    icon: 'lucide:handshake',
    title: 'Free Meet & Greet',
    badge: 'New families',
    short:
      'Complimentary in-office visit to tour the practice and meet your pediatrician before you commit.',
    full:
      'Choosing a pediatrician is a big decision. Schedule a free, no-pressure Meet & Greet session to tour the practice, meet your pediatrician, and ask the questions that matter to your family — before your first appointment. Especially helpful for expectant parents and families new to the area.',
    featured: true,
  },
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
    icon: 'lucide:hospital',
    title: 'Newborn Rounds at BSW McKinney',
    short:
      'In-hospital newborn visits at Baylor Scott & White McKinney — so your baby meets their pediatrician on day one.',
    full:
      'We provide newborn rounding at Baylor Scott & White Medical Center – McKinney. If you deliver at BSW McKinney and choose Luma, your baby meets their pediatrician right at the bedside — for the first exam, feeding support, and a smooth handoff from hospital to home.',
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
    short: 'Physical exams for school, camp, and athletic clearance.',
    full:
      'Physical exams for school, summer camp, and athletic clearance. Bring the forms with you and we will take care of the rest during the visit.',
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
];
