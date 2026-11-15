/**
 * Local landing-page content for nearby cities.
 *
 * Each entry powers a /pediatrician/[slug] page used for local search
 * discovery ("pediatrician in Frisco", "Allen pediatric clinic", etc.).
 *
 * Keep copy human, warm, and specific to each community. Avoid keyword
 * stuffing - Google's helpful-content systems penalise it.
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

/** City pages listed in search results, the footer, and the service-area index. */
export const INDEXED_CITY_SLUGS = ['mckinney', 'allen', 'frisco', 'prosper', 'melissa', 'anna'];

export const isIndexedCity = (slug: string) => INDEXED_CITY_SLUGS.includes(slug);

export const CITIES: CityPage[] = [
  {
    slug: 'mckinney',
    name: 'McKinney',
    distanceMi: 0,
    driveMinutes: 'In town',
    intro:
      'Luma Pediatrics is a McKinney pediatric practice caring for newborns, children, and teens.',
    landmarks: ['Stonebridge Ranch', 'Adriatica Village', 'Craig Ranch', 'Historic Downtown McKinney'],
    whyLuma:
      'Our McKinney clinic sits near Stonebridge, Craig Ranch, Tucker Hill, and downtown McKinney, with one physician and appointments that leave time for questions.',
  },
  {
    slug: 'frisco',
    name: 'Frisco',
    distanceMi: 8,
    driveMinutes: '15–20 min',
    intro:
      'Frisco families are a short drive east of Luma Pediatrics in McKinney, and appointments can be booked online.',
    landmarks: ['The Star', 'Stonebriar', 'Phillips Creek Ranch', 'Frisco ISD schools'],
    whyLuma:
      'Frisco families get continuity with one pediatrician, longer appointment times, and same-day sick visits when capacity allows.',
  },
  {
    slug: 'allen',
    name: 'Allen',
    distanceMi: 7,
    driveMinutes: '12–15 min',
    intro:
      'Allen families can reach Luma Pediatrics in McKinney via US-75 in about 12 to 15 minutes.',
    landmarks: ['Watters Creek', 'Twin Creeks', 'Allen ISD schools', 'Allen Premium Outlets'],
    whyLuma:
      'Allen families can reach Luma in under fifteen minutes via US-75. We hold time for same-day sick visits and work to keep routine appointments on time.',
  },
  {
    slug: 'prosper',
    name: 'Prosper',
    distanceMi: 9,
    driveMinutes: '15–20 min',
    intro:
      'Prosper families can find Luma Pediatrics just down 380 in McKinney, with newborn and primary pediatric care in one place.',
    landmarks: ['Windsong Ranch', 'Light Farms', 'Prosper ISD schools', 'Gates of Prosper'],
    whyLuma:
      'For Prosper families delivering at Baylor Scott & White Medical Center in McKinney, Luma offers outpatient newborn follow-up, with hospital rounds subject to hospital arrangements.',
  },
  {
    slug: 'melissa',
    name: 'Melissa',
    distanceMi: 8,
    driveMinutes: '10–15 min',
    intro:
      'Melissa families can reach Luma Pediatrics with a short trip south on US-75 to McKinney.',
    landmarks: ['Liberty', 'North Creek', 'Melissa ISD schools', 'Zadow Park'],
    whyLuma:
      'Luma is a nearby option for Melissa families who want one pediatrician for newborn care, routine checkups, sick visits, and care through adolescence.',
  },
  {
    slug: 'anna',
    name: 'Anna',
    distanceMi: 14,
    driveMinutes: '20–25 min',
    intro:
      'Anna families can reach Luma Pediatrics by traveling south on US-75 to our McKinney location.',
    landmarks: ['Anna Town Square', 'Slayter Creek Park', 'Hurricane Creek', 'Anna ISD schools'],
    whyLuma:
      'Luma gives Anna families a consistent relationship with one pediatrician and appointments with time for questions.',
  },
  {
    slug: 'princeton',
    name: 'Princeton',
    distanceMi: 12,
    driveMinutes: '20–25 min',
    intro:
      'Princeton families can find Luma Pediatrics just west of town in McKinney, caring for newborns, children, and teens.',
    landmarks: ['Lake Lavon', 'Bridgewater', 'Princeton ISD schools', 'J.M. Caldwell Sr. Community Park'],
    whyLuma:
      'Luma offers Princeton families a physician-led pediatric option focused on clear communication and continuity, from newborn and well-child care to sick visits, vaccines, physicals, and adolescent health.',
  },
  {
    slug: 'celina',
    name: 'Celina',
    distanceMi: 16,
    driveMinutes: '20–30 min',
    intro:
      'Celina families can reach Luma Pediatrics in McKinney for relationship-centered care from the newborn years through adolescence.',
    landmarks: ['Downtown Celina', 'Light Farms', 'Mustang Lakes', 'Celina ISD schools'],
    whyLuma:
      'As Celina grows, Luma is another pediatric option for families who value seeing the same physician, having time for questions, and getting evidence-based guidance in a calm setting.',
  },
  {
    slug: 'van-alstyne',
    name: 'Van Alstyne',
    distanceMi: 20,
    driveMinutes: '25–30 min',
    intro:
      'Van Alstyne families can travel south on US-75 to reach Luma Pediatrics at our McKinney location.',
    landmarks: ['Downtown Van Alstyne', 'Central Social District', 'Mantua', 'Van Alstyne ISD schools'],
    whyLuma:
      'For families in the growing Van Alstyne community, Luma is a physician-led pediatric option along the US-75 corridor, with care from the newborn years through adolescence.',
  },
  {
    slug: 'fairview',
    name: 'Fairview',
    distanceMi: 9,
    driveMinutes: '15–20 min',
    intro:
      'Fairview families can reach Luma Pediatrics with a convenient drive north to McKinney.',
    landmarks: ['Fairview Town Center', 'Heritage Ranch', 'Sloan Creek', 'Lovejoy ISD schools'],
    whyLuma:
      'Luma suits Fairview families who value continuity with one pediatrician, evidence-based guidance, and visits with enough time to discuss questions and concerns.',
  },
  {
    slug: 'lucas',
    name: 'Lucas',
    distanceMi: 15,
    driveMinutes: '20–25 min',
    intro:
      'Lucas families can reach Luma Pediatrics in McKinney for pediatric care in a calm, relationship-centered setting.',
    landmarks: ['Lovejoy ISD schools', 'Lake Lavon', 'Brockdale Park', 'Lucas Community Park'],
    whyLuma:
      'For Lucas families seeking a consistent pediatric relationship, Luma offers preventive care, sick visits, vaccines, physicals, and support through adolescence.',
  },
  {
    slug: 'sherman',
    name: 'Sherman',
    distanceMi: 32,
    driveMinutes: '35–45 min',
    intro:
      'Sherman and southern Grayson County families who travel to McKinney for care are welcome at Luma Pediatrics.',
    landmarks: ['Sherman Town Center', 'Austin College', 'Pecan Grove Park', 'Sherman ISD schools'],
    whyLuma:
      'Luma gives Sherman-area families another physician-led pediatric option along US-75, with continuity and a long-term relationship with one pediatrician.',
  },
  {
    slug: 'howe',
    name: 'Howe',
    distanceMi: 25,
    driveMinutes: '30–35 min',
    intro:
      'Howe families who travel south along US-75 are welcome at Luma Pediatrics in McKinney.',
    landmarks: ['Downtown Howe', 'Howe Community Library', 'Howe ISD schools', 'US-75 corridor'],
    whyLuma:
      'Luma gives Howe-area families another pediatric option along the US-75 corridor, with a focus on continuity, clear guidance, and time for parent questions.',
  },
  {
    slug: 'new-hope',
    name: 'New Hope',
    distanceMi: 9,
    driveMinutes: '15–20 min',
    intro:
      'New Hope families are close to Luma Pediatrics at our location in north McKinney.',
    landmarks: ['New Hope Town Hall', 'FM 1827 corridor', 'East McKinney', 'Collin County communities'],
    whyLuma:
      'For families in New Hope and east McKinney, Luma is a nearby practice with one physician and care from infancy through adolescence.',
  },
  {
    slug: 'lowry-crossing',
    name: 'Lowry Crossing',
    distanceMi: 11,
    driveMinutes: '15–20 min',
    intro:
      'Lowry Crossing families can find Luma Pediatrics nearby in McKinney.',
    landmarks: ['Lowry Crossing City Hall', 'FM 546', 'US-380 corridor', 'East Collin County'],
    whyLuma:
      'Luma gives Lowry Crossing families a nearby physician-led option for newborn care, preventive visits, sick care, vaccines, physicals, and adolescent health.',
  },
  {
    slug: 'farmersville',
    name: 'Farmersville',
    distanceMi: 21,
    driveMinutes: '30–35 min',
    intro:
      'Farmersville families can travel west to Luma Pediatrics at our McKinney location.',
    landmarks: ['Historic Downtown Farmersville', 'Chaparral Trail', 'Onion Shed', 'Farmersville ISD schools'],
    whyLuma:
      'For Farmersville families seeking a long-term pediatric relationship in the McKinney area, Luma offers clear communication and time to discuss each child’s needs.',
  },
  {
    slug: 'aubrey',
    name: 'Aubrey',
    distanceMi: 30,
    driveMinutes: '40–50 min',
    intro:
      'Aubrey-area families who travel to McKinney for care are welcome at Luma Pediatrics.',
    landmarks: ['Downtown Aubrey', 'Sandbrock Ranch', 'Union Park', 'Aubrey ISD schools'],
    whyLuma:
      'Luma gives Aubrey-area families another physician-led pediatric option, with continuity, evidence-based guidance, and a calm visit experience.',
  },
  {
    slug: 'little-elm',
    name: 'Little Elm',
    distanceMi: 25,
    driveMinutes: '35–45 min',
    intro:
      'Little Elm families who travel toward McKinney are welcome at Luma Pediatrics.',
    landmarks: ['Little Elm Park', 'The Lakefront', 'Lake Lewisville', 'Little Elm ISD schools'],
    whyLuma:
      'For Little Elm families seeking care in the greater McKinney area, Luma offers a pediatric option centered on a consistent physician relationship and clear guidance.',
  },
  {
    slug: 'plano',
    name: 'Plano',
    distanceMi: 20,
    driveMinutes: '25–35 min',
    intro:
      'Plano families looking north toward McKinney are welcome at Luma Pediatrics.',
    landmarks: ['Downtown Plano', 'Legacy West', 'Oak Point Park', 'Plano ISD schools'],
    whyLuma:
      'Luma gives Plano families another pediatric option, with one consistent physician, longer conversations, and care from newborn visits through adolescence.',
  },
];
