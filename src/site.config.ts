/**
 * Single source of truth for site-wide content.
 * Edit values here → they propagate everywhere.
 */

export const SITE = {
  name: 'Luma Pediatrics',
  tagline: "Where your child's health shines.",
  subtagline: 'Bright beginnings. Healthy futures.',
  status: 'Opening late 2026',
  /** Opening timeframe phrase - appears in "Opening {openingWindow} in McKinney" copy. */
  openingWindow: 'late 2026',
  locationShort: 'McKinney, Texas',
  description:
    "Luma Pediatrics is a board-certified pediatric practice opening in late 2026 in McKinney, Texas, with evidence-based care planned for newborns, children, and teens.",
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

  /**
   * "Inside Luma" office gallery visibility (About page).
   *
   * Hidden until real clinic interior photos are available. Flip to `true`
   * once real photos replace the placeholders in
   * public/images/inside-luma-*.jpg.
   */
  showOfficeGallery: false,

  provider: {
    name: 'Praveena Tallapureddy, M.D., F.A.A.P.',
    /** Visible heading form on the About page ("Meet {displayName}"). */
    displayName: 'Praveena Tallapureddy, MD',
    shortName: 'Dr. Tallapureddy',
    role: 'Board-certified pediatrician',
    /** First-person welcome shown beside the professional headshot. */
    welcome: [
      'Hello, and welcome to Luma Pediatrics!',
      "I'm Dr. Praveena Tallapureddy, a board-certified pediatrician, mom of two, and proud Aggie.",
      'Being both a doctor and a parent shapes how I care for families. I founded Luma Pediatrics to create a practice where parents have time to ask questions and children can build a lasting relationship with their pediatrician.',
      'My goal is simple: listen carefully, explain the options, and make sure families leave with a clear plan.',
    ],
    /** Personal note shown beside the casual family photo. */
    lifeOutside:
      "Outside the office, I spend time with my two children and extended family, take long walks, read, and join our monthly cousins' cooking sessions. I am also an enthusiastic member of my book club.",
    /** Quick-facts grid rendered under the bio. */
    quickFacts: [
      { label: 'Board Certified', value: 'American Board of Pediatrics' },
      { label: 'Education', value: 'Texas A&M Health Science Center College of Medicine' },
      { label: 'Residency', value: "Baylor Scott & White McLane Children's Hospital" },
      { label: 'Community', value: 'Serving McKinney and North Texas families since 2022' },
      { label: 'Languages', value: 'Fluent in English and Telugu; conversational in Hindi and Urdu' },
      {
        label: 'Care Scope',
        value:
          'Newborn through young adult care, including well-checks, sick visits, and chronic condition management',
      },
    ],
    /** Structured fields retained for schema.org (Physician) - mirror Quick Facts. */
    education: [
      'Texas A&M Health Science Center College of Medicine',
      "Baylor Scott & White McLane Children's Hospital",
    ],
    languages: ['English', 'Telugu', 'Hindi', 'Urdu'],
  },

  address: {
    street: '3801 North Central Expressway, Ste 302',
    city: 'McKinney',
    region: 'TX',
    postalCode: '75071',
    country: 'US',
  },

  contact: {
    phone: '(469) 200-1151',
    phoneHref: 'tel:+14692001151',
    smsHref: 'sms:+14692001151',
    email: 'hello@lumapediatrics.com',
    emailHref: 'mailto:hello@lumapediatrics.com',
  },

  hours: [
    { day: 'Mon–Fri',  time: '7:30 am – 4:30 pm' },
    { day: 'Saturday', time: '8:30 am – 12:30 pm' },
    { day: 'Sunday',   time: 'Closed' },
  ],

  /** Surrounding cities the practice serves. */
  areasServed: [
    'McKinney',
    'Prosper',
    'Melissa',
    'Anna',
    'Van Alstyne',
    'Howe',
    'Princeton',
    'Farmersville',
    'Allen',
    'Frisco',
    'Plano',
    'Celina',
    'Little Elm',
    'Aubrey',
    'Fairview',
    'Lucas',
    'Lowry Crossing',
    'New Hope',
    'Sherman',
  ],
  areasServedTagline: 'and nearby communities',

  /**
   * Geo coordinates for the practice (3801 North Central Expressway, Ste 302,
   * McKinney) - used for the contact-page map pin, the "Get directions" link,
   * and LocalBusiness JSON-LD. Set from a Google Maps dropped pin on the
   * building (west frontage of US-75, just north of Bloomdale); geocoding the
   * highway-frontage street address lands on the wrong side of US-75.
   */
  geo: {
    latitude: 33.2354224,
    longitude: -96.6322071,
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
    { icon: 'lucide:stethoscope',  label: 'Pediatric Residency, Baylor Scott & White' },
  ],

  /**
   * After-hours guidance. When `showNurseTriage` is true the card shows a
   * partner pediatric nurse-triage line alongside the universal 911 instruction;
   * when false, only the 911 guidance + "call our office" line are shown.
   * IMPORTANT: verify the partner number before enabling nurse triage.
   */
  afterHours: {
    /** Hidden until the partner nurse-triage line is confirmed. */
    showNurseTriage: false,
    partner: "Children's Health Plano",
    partnerPhone: '(469) 303-2000',
    partnerPhoneHref: 'tel:+14693032000',
    note: 'Pediatric nurse triage available 24/7. Verify current line at launch.',
  },

  /** Telehealth offering for med refills + follow-ups. */
  telehealth: {
    platform: 'Telehealth',
    useCases: [
      'Prescription refills',
      'Follow-up visits',
      'Quick questions about lab or imaging results',
      'Behavioral / ADHD check-ins',
    ],
  },

  forms: {
    /**
     * Practice-updates signup backend.
     *
     * A Google Apps Script Web App URL (ends in /exec) that appends each
     * signup as a row in a Google Sheet you own, without a separate marketing
     * platform. Follow docs/waitlist-setup.md to deploy the script, then paste
     * the /exec URL here to activate the in-page form. While empty, the form
     * directs visitors to the public email address instead of collecting.
     */
    waitlistEndpoint: 'https://script.google.com/macros/s/AKfycbzuXKLJBONuTLTMthiyOu5NYJp3rd6yrSUi3NfiXgT71OMz447CiN2E9QNRMi8zk7g8aw/exec',
  },

  /**
   * Analytics + search-console verification.
   * - ga4MeasurementId: Google Analytics 4 measurement ID.
   *   Create a property at https://analytics.google.com → Admin → Create property.
   *   Leave empty to disable in dev / before launch.
   * - googleSiteVerification: verification token from Google Search Console
   *   (Settings → Ownership verification → HTML tag). Leave empty if using DNS or file method.
   * - bingSiteVerification: optional, from Bing Webmaster Tools.
   */
  analytics: {
    ga4MeasurementId: 'G-QL30ZJXMW8',
    googleSiteVerification: '',
    bingSiteVerification: '',
  },

  nav: [
    { href: '/',              label: 'Home' },
    { href: '/about',         label: 'About' },
    { href: '/services',      label: 'Services' },
    { href: '/resources',     label: 'Resources' },
    { href: '/faq',           label: 'FAQ' },
    { href: '/contact',       label: 'Contact' },
  ],
} as const;
