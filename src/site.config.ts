/**
 * Single source of truth for site-wide content.
 * Edit values here → they propagate everywhere.
 *
 * NOTE on the phone number: placeholder — replace with the practice's actual line.
 * NOTE on the healow booking URL: placeholder — replace with the real
 *      "Book Appointment" deep-link healow gives the practice.
 */

export const SITE = {
  name: 'Luma Pediatrics',
  tagline: "Where your child's health shines.",
  subtagline: 'Bright beginnings. Healthy futures.',
  status: 'Opening Soon',
  /** Estimated opening month — shown in hero pill. Update when confirmed. */
  openingWindow: 'Fall 2026',
  locationShort: 'McKinney, Texas',
  description:
    "Luma Pediatrics is a board-certified pediatric practice opening in McKinney, Texas, offering warm, evidence-based care for newborns, children, and teens through every stage of childhood.",
  domain: 'https://www.lumapediatrics.com',

  /**
   * Provider-detail visibility flag.
   *
   * When `true`, the public site publishes the pediatrician's name, headshot,
   * education, personal bio, structured data, and bylines. Flip to `false` to
   * hide all of that behind a "Provider profile coming soon" placeholder
   * (e.g., pre-launch while the founding pediatrician is still employed
   * elsewhere).
   */
  showProviderProfile: true,

  provider: {
    name: 'Praveena Tallapureddy, M.D., F.A.A.P.',
    /** Visible heading form on the About page ("Meet {displayName}"). */
    displayName: 'Praveena Tallapureddy, MD',
    shortName: 'Dr. Tallapureddy',
    role: 'Board-certified pediatrician',
    /**
     * Generic, employer-safe trust signal usable while showProviderProfile = false.
     * No name, no current employer, no specific year count tied to a public CV.
     * Update to specifics (e.g., "10+ years") only when ready to attribute publicly.
     */
    experienceLine:
      'Backed by years of pediatric experience caring for North Texas families.',
    /** First-person welcome shown beside the professional headshot. */
    welcome: [
      'Hello, and welcome to Luma Pediatrics!',
      "I'm Dr. Praveena Tallapureddy—a board-certified pediatrician, mom of two, and proud Aggie.",
      'As both a doctor and a parent, I know that raising kids is a beautiful, unpredictable, and sometimes overwhelming adventure. I founded Luma Pediatrics to build the exact kind of practice I would want for my own children: a place where medical expertise meets genuine partnership, and where you always feel heard and never rushed.',
      'My goal is for you to leave every visit with a clear plan, confidence in next steps, and the peace of mind that your voice was truly heard. They say it takes a village to raise a child, and I would be absolutely honored to be a part of yours!',
    ],
    /** Personal note shown beside the casual family photo. */
    lifeOutside:
      "When I'm not in the office, you'll usually find me chasing after my two kids, enjoying a walk, or spending time with my massive extended family. I look forward to our monthly cousins' cooking sessions despite my complete lack of culinary talent. I'm also an avid reader with an apparent superpower for remembering every tiny detail which has made me the unofficial narrator of my book club.",
    /** Quick-facts grid rendered under the bio. */
    quickFacts: [
      { label: 'Board Certified', value: 'American Board of Pediatrics' },
      { label: 'Education', value: 'Texas A&M Health Science Center College of Medicine' },
      { label: 'Residency', value: "Baylor Scott & White McLane Children's Hospital" },
      { label: 'Community', value: 'Serving McKinney and North Texas families since 2022' },
      { label: 'Languages', value: 'Fluent in Telugu; Conversational in Hindi and Urdu' },
      {
        label: 'Care Scope',
        value:
          'Newborn through young adult care, including well-checks, sick visits, and chronic condition management',
      },
    ],
    /**
     * Casual family photo near "Life Outside the Clinic". Leave empty to show a
     * styled placeholder; set to e.g. '/images/provider-family.jpg' to swap in
     * the real photo (add a matching .webp sibling for best performance).
     */
    familyPhoto: '',
    /** Structured fields retained for schema.org (Physician) — mirror Quick Facts. */
    education: [
      'Texas A&M Health Science Center College of Medicine',
      "Baylor Scott & White McLane Children's Hospital",
    ],
    languages: ['Telugu', 'Hindi', 'Urdu'],
  },

  address: {
    street: '3801 North Central Expressway',
    city: 'McKinney',
    region: 'TX',
    postalCode: '75071',
    country: 'US',
  },

  contact: {
    phone: '(555) 555-0100',
    phoneHref: 'tel:+15555550100',
    smsHref: 'sms:+15555550100',
    email: 'hello@lumapediatrics.com',
    emailHref: 'mailto:hello@lumapediatrics.com',
  },

  hours: [
    { day: 'Mon–Fri',  time: '7:30 am – 4:30 pm' },
    { day: 'Saturday', time: '8:30 am – 12:30 pm' },
    { day: 'Sunday',   time: 'Closed' },
  ],

  /** Surrounding North Collin County cities the practice serves. */
  areasServed: [
    'McKinney',
    'Prosper',
    'Melissa',
    'Anna',
    'Van Alstyne',
    'Princeton',
    'Allen',
    'Frisco',
  ],
  areasServedTagline: 'and nearby North Collin County communities',

  // PLACEHOLDER: replace with the real healow booking URL from the practice.
  // healow gives practices a unique link like https://book.healow.com/?p=...
  bookingUrl: 'https://book.healow.com/',

  /**
   * Approximate geo coordinates for the practice address — used for
   * LocalBusiness JSON-LD schema. Replace with the verified lat/lng once
   * the practice is opened (Google Maps "What's here?" gives precise values).
   */
  geo: {
    latitude: 33.2066,
    longitude: -96.6680,
  },

  /** External profiles for sameAs structured data (add as they go live). */
  social: {
    facebook: '',
    instagram: '',
    googleBusiness: '',
  },

  /** Professional affiliations / credentials surfaced near the provider bio. */
  affiliations: [
    { icon: 'lucide:shield-check', label: 'Board-Certified Pediatrician' },
    { icon: 'lucide:award',        label: 'Fellow, American Academy of Pediatrics (AAP)' },
    { icon: 'lucide:graduation-cap', label: 'Texas A&M College of Medicine' },
    { icon: 'lucide:stethoscope',  label: 'Baylor Scott & White — Pediatric Residency' },
  ],

  /** Downloadable patient forms (placeholders until the practice opens). */
  patientForms: [
    { file: '/forms/patient-intake-form.pdf',          label: 'New Patient Intake Form' },
    { file: '/forms/hipaa-acknowledgment.pdf',         label: 'HIPAA Privacy Acknowledgment' },
    { file: '/forms/vaccine-consent.pdf',              label: 'Vaccine Consent' },
    { file: '/forms/medical-records-release.pdf',      label: 'Medical Records Release / Transfer' },
    { file: '/forms/school-sports-physical-form.pdf',  label: 'School / Sports / Camp Physical' },
  ],

  /**
   * After-hours guidance. The first option is the practice's recommended
   * pediatric nurse triage line; the second is the universal 911 instruction.
   * IMPORTANT: verify the partner number before launch.
   */
  afterHours: {
    partner: "Children's Health Plano",
    partnerPhone: '(469) 303-2000',
    partnerPhoneHref: 'tel:+14693032000',
    note: 'Pediatric nurse triage available 24/7. Verify current line at launch.',
  },

  /** Telehealth offering — Healow Telehealth for med refills + follow-ups. */
  telehealth: {
    platform: 'healow Telehealth',
    useCases: [
      'Prescription refills',
      'Follow-up visits',
      'Quick questions about lab or imaging results',
      'Behavioral / ADHD check-ins',
    ],
  },

  /** Web3Forms access key for the contact + insurance-verify forms. */
  forms: {
    // Sign up free at https://web3forms.com and paste the access key here.
    web3formsAccessKey: 'REPLACE_WITH_WEB3FORMS_ACCESS_KEY',
  },

  /** Mailchimp newsletter signup configuration. */
  newsletter: {
    // Find these by going to your Mailchimp Audience → Signup forms → Embedded forms
    mailchimpAction: '',   // e.g. https://lumapediatrics.us20.list-manage.com/subscribe/post
    mailchimpUserId: '',   // value of "u" query param
    mailchimpListId: '',   // value of "id" query param
    pitch: 'Seasonal parenting tips, vaccine reminders, and Luma updates — about once a month, never spammy.',
  },

  /**
   * Analytics + search-console verification.
   * - ga4MeasurementId: Google Analytics 4 measurement ID, e.g. 'G-XXXXXXXXXX'.
   *   Create a property at https://analytics.google.com → Admin → Create property.
   *   Leave empty to disable in dev / before launch.
   * - googleSiteVerification: verification token from Google Search Console
   *   (Settings → Ownership verification → HTML tag). Leave empty if using DNS or file method.
   * - bingSiteVerification: optional, from Bing Webmaster Tools.
   */
  analytics: {
    ga4MeasurementId: '',
    googleSiteVerification: '',
    bingSiteVerification: '',
  },

  nav: [
    { href: '/',              label: 'Home' },
    { href: '/about',         label: 'About' },
    { href: '/services',      label: 'Services' },
    { href: '/new-patients',  label: 'New Patients' },
    { href: '/resources',     label: 'Resources' },
    { href: '/faq',           label: 'FAQ' },
    { href: '/contact',       label: 'Contact' },
  ],
} as const;
