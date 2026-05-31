/**
 * Local landing-page content for nearby North Collin County cities.
 *
 * Each entry powers a /pediatrician/[slug] page used for local search
 * discovery ("pediatrician in Frisco", "Allen pediatric clinic", etc.).
 *
 * Keep copy human, warm, and specific to each community. Avoid keyword
 * stuffing — Google's helpful-content systems penalise it.
 */

export type CityPage = {
  slug: string;
  name: string;
  distanceMi: number;
  driveMinutes: string;
  /** Short blurb shown in the hero, 1–2 sentences. */
  intro: string;
  /** Two to four local landmarks / neighbourhoods to ground the page. */
  landmarks: string[];
  /** Local-flavour reason families in this city travel to Luma. */
  whyLuma: string;
};

export const CITIES: CityPage[] = [
  {
    slug: 'mckinney',
    name: 'McKinney',
    distanceMi: 0,
    driveMinutes: 'In town',
    intro:
      "Luma Pediatrics is opening right here in McKinney — your neighborhood pediatric home for newborns, kids, and teens.",
    landmarks: ['Stonebridge Ranch', 'Adriatica Village', 'Craig Ranch', 'Historic Downtown McKinney'],
    whyLuma:
      "We're proud to call McKinney home. Families across Stonebridge, Craig Ranch, Tucker Hill, and downtown will find a calm, unhurried clinic minutes from where they live, learn, and play.",
  },
  {
    slug: 'frisco',
    name: 'Frisco',
    distanceMi: 8,
    driveMinutes: '15–20 min',
    intro:
      'Frisco families — Luma Pediatrics is a short drive east, offering longer visits and same-day sick appointments.',
    landmarks: ['The Star', 'Stonebriar', 'Phillips Creek Ranch', 'Frisco ISD schools'],
    whyLuma:
      "Frisco parents tell us they want a pediatrician who actually listens. Our model — fewer patients per provider, longer visit times, direct provider access — is built for that.",
  },
  {
    slug: 'allen',
    name: 'Allen',
    distanceMi: 7,
    driveMinutes: '12–15 min',
    intro:
      'Allen families can reach Luma Pediatrics in under fifteen minutes via US-75 — with same-day sick visits and gentle, unhurried care.',
    landmarks: ['Watters Creek', 'Twin Creeks', 'Allen ISD schools', 'Allen Premium Outlets'],
    whyLuma:
      "We see a lot of Allen families because we're easy to reach off 75 and we never double-book. When your child is sick, we get you in the same day — no triage runaround.",
  },
  {
    slug: 'prosper',
    name: 'Prosper',
    distanceMi: 9,
    driveMinutes: '15–20 min',
    intro:
      'Prosper families — Luma Pediatrics offers warm, evidence-based care just down 380, with newborn rounds at BSW McKinney.',
    landmarks: ['Windsong Ranch', 'Light Farms', 'Prosper ISD schools', 'Gates of Prosper'],
    whyLuma:
      "Many Prosper families deliver at BSW McKinney — where we'll round on your newborn before you even leave the hospital. From there, the transition to our clinic is seamless.",
  },
];
