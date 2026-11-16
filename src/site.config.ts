/**
 * Single source of truth for site-wide content.
 * Edit values here → they propagate everywhere.
 */

const OPENING_DATE = '2026-11-30';
const OPENING_WINDOW = new Date(`${OPENING_DATE}T00:00:00Z`).toLocaleDateString('en-US', {
  month: 'long', day: 'numeric', timeZone: 'UTC',
});
const PHREESIA_URL = 'https://phreesia.me/LumaPediatricsSelfScheduling';
const MEET_AND_GREET_URL = 'https://phreesia.me/LumaPediatricsMeetandGreet';

export const SITE = {
  name: 'Luma Pediatrics',
  legalName: 'Luma Physician Group PLLC',
  organizationNpi: '1689504292',
  tagline: "Where your child's health shines.",
  subtagline: 'Bright beginnings. Healthy futures.',
  status: `Opening ${OPENING_WINDOW} in McKinney`,
  /** Opening timeframe phrase - appears in "Opening {openingWindow} in McKinney" copy. */
  openingWindow: OPENING_WINDOW,
  /** Announced opening date; never automatically activates clinical care or hours. */
  openingDate: OPENING_DATE,
  appointmentScheduling: {
    /** Approved shared portal: newborn, behavioral, sick, and well-child checks. */
    enabled: true,
    url: PHREESIA_URL,
    /** Shows "Appointments available beginning {openingDate}" under the homepage scheduling button; set false on opening day. */
    showStartNote: true,
  },
  newbornScheduling: {
    /** Explicit manual activation; appointment dates must be checked before publishing. */
    enabled: true,
    url: PHREESIA_URL,
    /** Informational target, never an automatic activation date. */
    plannedLaunchDate: '2026-11-16',
  },
  wellChildScheduling: {
    /** The practice confirmed that the shared portal supports well-child visits too. */
    enabled: true,
    url: PHREESIA_URL,
    plannedLaunchDate: '2026-11-16',
  },
  meetAndGreetScheduling: {
    /** Separate Phreesia link for the free, nonclinical Meet & Greet (New Patients page). */
    enabled: true,
    url: MEET_AND_GREET_URL,
  },
  locationShort: 'McKinney, Texas',
  description:
    `Luma Pediatrics is an independent practice led by a board-certified pediatrician in McKinney, Texas. Opening ${OPENING_WINDOW}, with evidence-based care for newborns, children, and teens. Book an appointment online through Phreesia.`,
  disambiguatingDescription:
    'Independent pediatric primary care practice in McKinney, Texas, operated by Luma Physician Group PLLC.',
  domain: 'https://www.lumapediatrics.com',
  socialImage: '/og-luma-pediatrics-opening-november-30.png',

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
    schemaName: 'Praveena Tallapureddy',
    honorificPrefix: 'Dr.',
    honorificSuffix: 'M.D., F.A.A.P.',
    /** Visible heading form on the About page ("Meet {displayName}"). */
    displayName: 'Praveena Tallapureddy, MD',
    shortName: 'Dr. Tallapureddy',
    familiarName: 'Dr. T',
    role: 'Board-certified pediatrician',
    /** First-person welcome shown beside the professional headshot. */
    welcome: [
      'Hello, and welcome to Luma Pediatrics!',
      "I'm Dr. Praveena Tallapureddy, but most of my patients know me as Dr. T! I'm a board-certified pediatrician, a mom of two, and a proud Aggie.",
      "I've had the privilege of caring for children and families in McKinney since 2022. One of my favorite parts of pediatrics is getting to know families over time, from those early newborn days through all the milestones, big and small.",
      'Being both a pediatrician and a parent has shaped the way I practice medicine. I know how much it means to have a doctor who listens, takes your concerns seriously, and helps you feel confident in the decisions you make for your child.',
      'I started Luma Pediatrics to bring that kind of care together with a more thoughtful, convenient experience for families. My goal is simple: for you to feel heard, your child to feel comfortable, and your family to leave every visit with a clear plan.',
    ],
    /** "Outside the Office" paragraphs shown below the welcome. */
    lifeOutside: [
      "When I'm not at the clinic, you'll usually find me chasing after my two kids or enjoying a walk with my husband. I love spending time with my big extended family, especially our monthly cousins' cooking sessions, which are always full of good food and lots of laughter!",
      "When I get a little quiet time, I'm usually curled up with a good book. I'm also an enthusiastic member of my book club, where I've somehow become the official storyteller and recapper!",
    ],
    /** Quick-facts grid rendered under the bio. */
    quickFacts: [
      { label: 'Board Certified', value: 'American Board of Pediatrics' },
      { label: 'Education', value: 'Texas A&M Health Science Center College of Medicine' },
      { label: 'Residency', value: "Baylor Scott & White McLane Children's Hospital" },
      { label: 'North Texas Experience', value: 'Caring for children and families in North Texas since 2022' },
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
    street: '3801 N Central Expy, Suite 302',
    city: 'McKinney',
    region: 'TX',
    postalCode: '75071',
    country: 'US',
  },

  contact: {
    phone: '(469) 200-1151',
    phoneE164: '+14692001151',
    phoneHref: 'tel:+14692001151',
    smsHref: 'sms:+14692001151',
    textingNote: 'Prefer to message? Text us with nonurgent questions. Replies are not immediate; do not send medical information.',
    email: 'hello@lumapediatrics.com',
    emailHref: 'mailto:hello@lumapediatrics.com',
  },

  hours: [
    {
      day: 'Mon–Tue, Thu–Fri',
      time: '7:30 am – 4:30 pm',
      schemaDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
      opens: '07:30',
      closes: '16:30',
    },
    {
      day: 'Wednesday',
      time: '7:30 am – 11:30 am',
      schemaDays: ['Wednesday'],
      opens: '07:30',
      closes: '11:30',
    },
    {
      day: 'Saturday',
      time: '8:30 am – 12:30 pm',
      schemaDays: ['Saturday'],
      opens: '08:30',
      closes: '12:30',
    },
    {
      day: 'Sunday',
      time: 'Closed',
      schemaDays: [],
      opens: '',
      closes: '',
    },
  ],

  schema: {
    /** Flip only after the practice is open and these hours are operational. */
    publishOpeningHours: false,
  },

  /** Surrounding cities the practice serves. Feeds areaServed JSON-LD on every page. */
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

  /**
   * Geo coordinates for the practice (3801 N Central Expy, Suite 302,
   * McKinney) - used for the contact-page map pin, the "Get directions" link,
   * and LocalBusiness JSON-LD. Set from a Google Maps dropped pin on the
   * building (west frontage of US-75, just north of Bloomdale); geocoding the
   * highway-frontage street address lands on the wrong side of US-75.
   */
  geo: {
    latitude: 33.2354224,
    longitude: -96.6322071,
    googlePlaceId: 'ChIJay82ghcTTIYRfMrdtqknRvU',
  },

  /** External profiles for sameAs structured data (add as they go live). */
  social: {
    facebook: 'https://www.facebook.com/people/Luma-Pediatrics/61589364039396/',
    instagram: 'https://www.instagram.com/luma.pediatrics/',
    linkedin: 'https://www.linkedin.com/company/lumapediatrics/',
    tiktok: 'https://www.tiktok.com/@lumapediatrics/',
    googleBusiness: '',
    appleMaps: '',
    bingPlaces: '',
    healthgrades: '',
    webmd: '',
    doximity: '',
    yelp: '',
    usNews: '',
  },

  /** Professional affiliations / credentials surfaced near the provider bio. */
  affiliations: [
    { icon: 'lucide:shield-check', label: 'Board-Certified Pediatrician' },
    { icon: 'lucide:award',        label: 'Fellow, American Academy of Pediatrics (AAP)' },
    { icon: 'lucide:graduation-cap', label: 'Texas A&M College of Medicine' },
    { icon: 'lucide:stethoscope',  label: 'Pediatric Residency, Baylor Scott & White' },
  ],

  /**
   * After-hours guidance (/after-hours/). The on-call physician line and Patient
   * Portal messaging start on opening day; flip `onCallActive` manually then.
   * Add `patientPortalUrl` once the portal sign-in link is confirmed.
   */
  afterHours: {
    onCallActive: false,
    patientPortalUrl: '',
    consultationFee: '$50',
    symptomChecker: {
      name: "Children's Health Symptom Checker",
      url: 'https://www.childrens.com/specialties-services/symptom-checker',
    },
    nurseLine: {
      name: "Children's Health 24/7 Community Nurse Line",
      phone: '844-860-6976',
      phoneHref: 'tel:+18448606976',
    },
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
   * - googleAdsId / googleAdsConversionLabels: Google Ads conversion tracking
   *   (Goals → Conversions → each action's event snippet `send_to: 'AW-ID/label'`).
   *   Leave the ID empty to disable.
   */
  analytics: {
    ga4MeasurementId: 'G-QL30ZJXMW8',
    googleSiteVerification: '',
    bingSiteVerification: '',
    googleAdsId: 'AW-18548997925',
    googleAdsConversionLabels: {
      appointment: 'hZgyCKmRkrkdEKX-7IxF',
      contact: 'Gn-fCKyRkrkdEKX-7IxF',
    },
  },

  nav: [
    { href: '/',              label: 'Home' },
    { href: '/about/',        label: 'About' },
    { href: '/services/',     label: 'Services' },
    { href: '/new-patients/', label: 'New Patients' },
    { href: '/resources/',    label: 'Resources' },
    { href: '/faq/',          label: 'FAQ' },
    { href: '/contact/',      label: 'Contact' },
  ],
} as const;

const directionsDestination = `${SITE.address.street}, ${SITE.address.city}, ${SITE.address.region} ${SITE.address.postalCode}`;

export const GOOGLE_DIRECTIONS_URL =
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(directionsDestination)}` +
  `&destination_place_id=${SITE.geo.googlePlaceId}`;

export const GOOGLE_MAP_URL =
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(directionsDestination)}` +
  `&query_place_id=${SITE.geo.googlePlaceId}`;

export const STRUCTURED_DATA_IDS = {
  clinic: `${SITE.domain}/#medical-clinic`,
  website: `${SITE.domain}/#website`,
  physician: `${SITE.domain}/about/#physician`,
} as const;
