/**
 * Single source of truth for the practice's service catalog.
 * - `short` is used on the homepage preview tiles.
 * - `full`  is used on the dedicated /services page.
 * - `featured: true` controls which services appear on the home preview.
 *
 * Keep all customer-facing service copy here so home + services stay in sync.
 */

export interface ServiceItem {
  slug: string;
  icon: string;
  title: string;
  short: string;
  full: string;
  nextStep: { href: string; label: string };
  featured?: boolean;
  badge?: string;
}

export const services: ServiceItem[] = [
  {
    slug: 'free-meet-and-greet',
    icon: 'lucide:handshake',
    title: 'Free Meet & Greet',
    short:
      'After opening, families may schedule a complimentary visit to see the practice and meet the pediatrician.',
    full:
      'Meet the pediatrician, see the office, and ask questions before choosing a practice. Complimentary meet-and-greets are planned after opening; booking is not available yet.',
    nextStep: { href: '/about/', label: 'Get to know our pediatrician' },
    featured: true,
  },
  {
    slug: 'newborn-rounds-bsw-mckinney',
    icon: 'lucide:hospital',
    title: 'Newborn Rounds at BSW McKinney',
    short:
      'Newborn hospital visits at Baylor Scott & White McKinney are planned, subject to hospital arrangements.',
    full:
      'After opening and completion of hospital arrangements, Luma plans to provide newborn rounding at Baylor Scott & White Medical Center in McKinney, supporting the transition from hospital to outpatient pediatric care.',
    nextStep: { href: '/new-patients/#what-to-bring', label: 'See what to bring after discharge' },
    featured: true,
  },
  {
    slug: 'newborn-care',
    icon: 'lucide:baby',
    title: 'Newborn Care',
    short:
      'Feeding support, growth tracking, jaundice screening, and newborn visits.',
    full:
      'Planned newborn visits include breast and bottle-feeding support, growth and weight monitoring, jaundice screening, and time to discuss sleep, crying, and the first weeks at home.',
    nextStep: { href: '/new-patients/#first-visit', label: 'See what a first visit involves' },
    featured: true,
  },
  {
    slug: 'well-child-visits',
    icon: 'lucide:stethoscope',
    title: 'Well-Child Visits',
    short:
      'Routine checkups, developmental screening, and age-specific guidance.',
    full:
      'Planned well-child visits follow the recommended schedule from infancy through adolescence. Visits include a physical exam, developmental and behavioral screening, growth tracking, age-specific guidance, and time for questions.',
    nextStep: { href: '/new-patients/#first-visit', label: 'Plan your child’s first visit' },
    featured: true,
  },
  {
    slug: 'sick-visits',
    icon: 'lucide:heart',
    title: 'Same-Day Sick Visits',
    short:
      'Planned same-day appointments for fevers, infections, injuries, and the unexpected.',
    full:
      'After opening, we plan to offer same-day appointments for fevers, coughs, ear pain, stomach bugs, rashes, and injuries. Availability will depend on the day’s appointment capacity.',
    nextStep: { href: '/faq/#same-day-visits', label: 'Read about same-day availability' },
    featured: true,
  },
  {
    slug: 'vaccinations',
    icon: 'lucide:syringe',
    title: 'Vaccinations',
    short:
      'Keeping your child protected with recommended vaccines based on the latest AAP guidelines.',
    full:
      'Luma plans to offer the recommended childhood vaccine schedule aligned with AAP guidance. Questions about timing and catch-up schedules will be discussed during visits.',
    nextStep: { href: '/vaccines/', label: 'View the vaccine schedule' },
    featured: true,
  },
  {
    slug: 'school-sports-camp-physicals',
    icon: 'lucide:graduation-cap',
    title: 'School, Sports & Camp Physicals',
    short: 'Physical exams for school, camp, and athletic clearance.',
    full:
      'Physical exams are planned for school, summer camp, and athletic clearance. Bring the required forms to your visit so we can review and complete them.',
    nextStep: { href: '/new-patients/#what-to-bring', label: 'Check what to bring' },
    featured: true,
  },
  {
    slug: 'adhd-behavior-developmental-care',
    icon: 'lucide:sparkles',
    title: 'ADHD, Behavior & Developmental Care',
    short:
      'ADHD evaluations, behavior support, developmental screening, and specialist referrals when needed.',
    full:
      'Planned care includes evaluations and follow-up for ADHD, learning concerns, and behavioral challenges, along with developmental screening and specialist referrals when needed.',
    nextStep: { href: '/new-patients/#first-visit', label: 'Learn about a first visit' },
  },
  {
    slug: 'teen-adolescent-health',
    icon: 'lucide:users',
    title: 'Teen & Adolescent Health',
    short:
      'Support for the physical, emotional, and mental health of tweens and teens.',
    full:
      'Planned care for tweens and teens includes age-appropriate preventive care, mental health screening, sports medicine, and confidential discussions consistent with applicable law.',
    nextStep: { href: '/new-patients/#first-visit', label: 'Plan your teen’s first visit' },
    featured: true,
  },
  {
    slug: 'telehealth-virtual-visits',
    icon: 'lucide:video',
    title: 'Telehealth / Virtual Visits',
    short:
      'Planned virtual follow-up visits for appropriate established-patient needs.',
    full:
      'After opening, Luma plans to offer secure video follow-ups for appropriate established-patient needs, such as selected medication, result, behavioral, or ADHD check-ins when an in-person exam is not required.',
    nextStep: { href: '/faq/#telehealth', label: 'Read about planned video visits' },
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
