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
    short:
      'A complimentary future opportunity to tour the practice, meet your pediatrician, and ask questions before choosing Luma.',
    full:
      'After opening, Luma plans to offer free, no-pressure Meet & Greet sessions so families can tour the practice, meet the pediatrician, and ask questions before a first appointment.',
    featured: true,
  },
  {
    icon: 'lucide:hospital',
    title: 'Newborn Rounds at BSW McKinney',
    short:
      'Planned in-hospital newborn visits at Baylor Scott & White McKinney.',
    full:
      'After opening and completion of hospital arrangements, Luma plans to provide newborn rounding at Baylor Scott & White Medical Center – McKinney, supporting the transition from hospital to outpatient pediatric care.',
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
    icon: 'lucide:stethoscope',
    title: 'Well-Child Visits',
    short:
      'Routine checkups, developmental screenings, and milestone guidance at every age.',
    full:
      'Comprehensive check-ups at every recommended age — from infancy through adolescence. Each visit includes a comprehensive physical exam, developmental and behavioral screening, milestone guidance, growth tracking, and time for your questions.',
    featured: true,
  },
  {
    icon: 'lucide:heart',
    title: 'Sick Visits',
    short:
      'Planned same-day appointments for fevers, infections, injuries, and the unexpected.',
    full:
      'After opening, we plan to offer same-day appointments for fevers, coughs, ear pain, stomach bugs, rashes, injuries, and the unexpected.',
    featured: true,
  },
  {
    icon: 'lucide:syringe',
    title: 'Vaccinations',
    short:
      'Keeping your child protected with recommended vaccines based on the latest AAP guidelines.',
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
      'Support for the physical, emotional, and mental health of tweens and teens.',
    full:
      'Confidential, age-appropriate care for tweens and teens — including mental health screening, sports medicine, and the conversations adolescents deserve to have with a trusted clinician.',
    featured: true,
  },
  {
    icon: 'lucide:video',
    title: 'Telehealth / Virtual Visits',
    short:
      'Planned virtual follow-up visits for appropriate established-patient needs.',
    full:
      'After opening, Luma plans to offer secure video follow-ups for appropriate established-patient needs, such as selected medication, result, behavioral, or ADHD check-ins when an in-person exam is not required.',
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
  'Cigna',
  'UnitedHealthcare',
  'Scott & White Health Plan',
  'Curative',
];
