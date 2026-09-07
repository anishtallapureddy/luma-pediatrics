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
      'After opening, families may schedule a complimentary visit to see the practice and meet the pediatrician.',
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
      'After opening and completion of hospital arrangements, Luma plans to provide newborn rounding at Baylor Scott & White Medical Center in McKinney, supporting the transition from hospital to outpatient pediatric care.',
    featured: true,
  },
  {
    icon: 'lucide:baby',
    title: 'Newborn Care',
    short:
      'Feeding support, growth tracking, jaundice screening, and newborn visits.',
    full:
      'Planned newborn visits include breast and bottle-feeding support, growth and weight monitoring, jaundice screening, and time to discuss sleep, crying, and the first weeks at home.',
    featured: true,
  },
  {
    icon: 'lucide:stethoscope',
    title: 'Well-Child Visits',
    short:
      'Routine checkups, developmental screening, and age-specific guidance.',
    full:
      'Planned well-child visits follow the recommended schedule from infancy through adolescence. Visits include a physical exam, developmental and behavioral screening, growth tracking, age-specific guidance, and time for questions.',
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
      'Luma plans to offer the recommended childhood vaccine schedule aligned with CDC and AAP guidance. Questions about timing and catch-up schedules will be discussed during visits.',
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
      'ADHD evaluations, behavior support, developmental screening, and specialist referrals when needed.',
    full:
      'Evaluations and ongoing support for ADHD, learning concerns, and behavioral challenges. Early screening for developmental delays, family-centered guidance, and trusted referrals to specialists when more support is needed.',
  },
  {
    icon: 'lucide:users',
    title: 'Teen & Adolescent Health',
    short:
      'Support for the physical, emotional, and mental health of tweens and teens.',
    full:
      'Planned care for tweens and teens includes age-appropriate preventive care, mental health screening, sports medicine, and confidential discussions consistent with applicable law.',
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
 * NOTE: representative list - confirm before launch.
 */
export const insurancePlans = [
  'Blue Cross Blue Shield of Texas',
  'Aetna',
  'Cigna',
  'UnitedHealthcare',
  'Scott & White Health Plan',
  'Curative',
];
