/**
 * Single source of truth for the practice's service catalog.
 * - `short` is used on the homepage preview tiles.
 * - `full`  is used on the dedicated /services page.
 * - `featured: true` controls which services appear on the home preview.
 *
 * Keep all customer-facing service copy here so home + services stay in sync.
 */

import { SITE } from '../site.config.ts';
import { getMedicalScheduling } from '../utils/serviceScheduling.ts';
const { appointments } = getMedicalScheduling(SITE);

export interface ServiceItem {
  slug: string;
  icon: string;
  title: string;
  short: string;
  full: string;
  nextStep: { href: string; label: string };
  /** Dedicated service page, when available; otherwise cards use the hub anchor. */
  detailHref?: string;
  featured?: boolean;
  badge?: string;
  relatedCare?: Pick<ServiceItem, 'slug' | 'title' | 'full' | 'nextStep'>;
}

const newbornHospitalCare: NonNullable<ServiceItem['relatedCare']> = {
  slug: 'newborn-rounds-bsw-mckinney',
  title: 'Newborn Rounds at BSW McKinney',
  full:
    'Newborn hospital rounds at Baylor Scott & White Medical Center in McKinney are subject to assignment, privileges, and final hospital arrangements. Hospital care is separate from routine newborn office visits.',
  nextStep: { href: '/newborn-care/#hospital-care', label: 'Read about hospital newborn care' },
};

export const services: ServiceItem[] = [
  {
    slug: 'well-child-visits',
    icon: 'lucide:stethoscope',
    title: 'Well-Child Visits',
    short:
      'Routine checkups, developmental screening, and age-specific guidance.',
    full:
      'Routine pediatric checkups help monitor growth and development, review recommended screenings and vaccines, and give families time to discuss questions and concerns.',
    nextStep: { href: '/well-child-visits/', label: 'Explore Well-Child Visits' },
    detailHref: '/well-child-visits/',
    featured: true,
  },
  {
    slug: 'sick-visits',
    icon: 'lucide:heart',
    title: 'Same-Day Sick Visits',
    short:
      'Same-day appointments for fevers, infections, and minor injuries, when capacity allows.',
    full:
      'Same-day appointments for fevers, coughs, ear pain, stomach bugs, rashes, and minor injuries, when capacity allows. For emergencies, call 911.',
    nextStep: appointments.enabled ? { href: appointments.href, label: 'Book a sick visit' } : { href: '/faq/#same-day-visits', label: 'Read about same-day availability' },
    featured: true,
  },
  {
    slug: 'newborn-care',
    icon: 'lucide:baby',
    title: 'Newborn Care',
    short:
      'Early checkups, feeding guidance, growth and weight monitoring, and support for new parents.',
    full:
      'Newborn visits focus on feeding, growth, weight monitoring, jaundice, and the questions that come with your baby’s earliest days. Learn about our approach and what to expect at a first visit.',
    nextStep: { href: '/newborn-care/', label: 'Explore Newborn Care' },
    detailHref: '/newborn-care/',
    featured: true,
    relatedCare: newbornHospitalCare,
  },
  {
    slug: 'vaccinations',
    icon: 'lucide:syringe',
    title: 'Vaccinations',
    short:
      'Keeping your child protected with recommended vaccines based on the latest AAP guidelines.',
    full:
      'We follow the recommended childhood vaccine schedule aligned with AAP guidance. We’re happy to talk through timing and catch-up schedules at any visit.',
    nextStep: { href: '/vaccines/', label: 'View the vaccine schedule' },
    featured: true,
  },
  {
    slug: 'adhd-behavior-developmental-care',
    icon: 'lucide:sparkles',
    title: 'ADHD, Behavior & Developmental Care',
    short:
      'ADHD evaluations, behavior support, developmental screening, and specialist referrals when needed.',
    full:
      'Care includes evaluations and follow-up for ADHD, learning concerns, and behavioral challenges, along with developmental screening and specialist referrals when needed.',
    nextStep: appointments.enabled ? { href: appointments.href, label: 'Book a behavioral visit' } : { href: '/new-patients/#first-visit', label: 'Learn about a first visit' },
    featured: true,
  },
  {
    slug: 'teen-adolescent-health',
    icon: 'lucide:users',
    title: 'Teen & Adolescent Health',
    short:
      'Support for the physical, emotional, and mental health of tweens and teens.',
    full:
      'Care for tweens and teens includes age-appropriate preventive care, mental health screening, sports medicine, and confidential discussions consistent with applicable law.',
    nextStep: { href: '/new-patients/#first-visit', label: 'Plan your teen’s first visit' },
    featured: true,
  },
  {
    slug: 'school-sports-camp-physicals',
    icon: 'lucide:graduation-cap',
    title: 'School, Sports & Camp Physicals',
    short: 'Physical exams for school, camp, and athletic clearance.',
    full:
      'Physical exams for school, summer camp, and athletic clearance. Bring required forms for review, and ask about completion requirements, timing, and any separate fees before your visit.',
    nextStep: { href: '/contact/', label: 'Call or text about a physical' },
    featured: true,
  },
  {
    slug: 'telehealth-virtual-visits',
    icon: 'lucide:video',
    title: 'Telehealth / Virtual Visits',
    short:
      'Virtual follow-up visits for appropriate established-patient needs.',
    full:
      'Secure video follow-ups for appropriate established-patient needs, such as selected medication, result, behavioral, or ADHD check-ins when an in-person exam is not required.',
    nextStep: { href: '/contact/', label: 'Call or text about telehealth' },
    featured: true,
  },
];

export const featuredServices = services.filter((s) => s.featured);
