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

export const CITIES: CityPage[] = [
  {
    slug: 'mckinney',
    name: 'McKinney',
    distanceMi: 0,
    driveMinutes: 'In town',
    intro:
      'Luma Pediatrics is opening in McKinney with planned care for newborns, children, and teens.',
    landmarks: ['Stonebridge Ranch', 'Adriatica Village', 'Craig Ranch', 'Historic Downtown McKinney'],
    whyLuma:
      'The future clinic is located near Stonebridge, Craig Ranch, Tucker Hill, and downtown McKinney, with one physician and appointments planned with time for questions.',
  },
  {
    slug: 'frisco',
    name: 'Frisco',
    distanceMi: 8,
    driveMinutes: '15–20 min',
    intro:
      'Frisco families will find the future Luma Pediatrics practice a short drive east in McKinney.',
    landmarks: ['The Star', 'Stonebriar', 'Phillips Creek Ranch', 'Frisco ISD schools'],
    whyLuma:
      'The practice plans to offer Frisco families continuity with one pediatrician, longer appointment times, and same-day sick visits when capacity allows after opening.',
  },
  {
    slug: 'allen',
    name: 'Allen',
    distanceMi: 7,
    driveMinutes: '12–15 min',
    intro:
      'Allen families will be able to reach the future Luma Pediatrics practice via US-75 in about 12 to 15 minutes.',
    landmarks: ['Watters Creek', 'Twin Creeks', 'Allen ISD schools', 'Allen Premium Outlets'],
    whyLuma:
      'Allen families can reach Luma in under fifteen minutes via US-75. After opening, we plan to reserve capacity for same-day sick visits and keep routine appointments on time.',
  },
  {
    slug: 'prosper',
    name: 'Prosper',
    distanceMi: 9,
    driveMinutes: '15–20 min',
    intro:
      'Prosper families will find the future Luma Pediatrics practice just down 380 in McKinney, with planned newborn and primary pediatric care.',
    landmarks: ['Windsong Ranch', 'Light Farms', 'Prosper ISD schools', 'Gates of Prosper'],
    whyLuma:
      'For Prosper families delivering at Baylor Scott & White Medical Center in McKinney, Luma plans to offer in-hospital newborn rounds and coordinated outpatient follow-up after opening.',
  },
  {
    slug: 'melissa',
    name: 'Melissa',
    distanceMi: 8,
    driveMinutes: '10–15 min',
    intro:
      'Melissa families will find the future Luma Pediatrics practice a short trip south on US-75 in McKinney.',
    landmarks: ['Liberty', 'North Creek', 'Melissa ISD schools', 'Zadow Park'],
    whyLuma:
      'Luma is planned as a nearby option for Melissa families seeking one pediatrician for newborn care, routine checkups, sick visits, and care through adolescence.',
  },
  {
    slug: 'anna',
    name: 'Anna',
    distanceMi: 14,
    driveMinutes: '20–25 min',
    intro:
      'Anna families will be able to reach Luma Pediatrics by traveling south on US-75 to our future McKinney location.',
    landmarks: ['Anna Town Square', 'Slayter Creek Park', 'Hurricane Creek', 'Anna ISD schools'],
    whyLuma:
      'Luma plans to offer Anna families a consistent relationship with one pediatrician and appointments with time for questions.',
  },
  {
    slug: 'princeton',
    name: 'Princeton',
    distanceMi: 12,
    driveMinutes: '20–25 min',
    intro:
      'Princeton families will find Luma Pediatrics west of town in McKinney, with planned care for newborns, children, and teens.',
    landmarks: ['Lake Lavon', 'Bridgewater', 'Princeton ISD schools', 'J.M. Caldwell Sr. Community Park'],
    whyLuma:
      'Luma will offer Princeton families a physician-led pediatric option focused on clear communication and continuity, from newborn and well-child care to planned sick visits, vaccines, physicals, and adolescent health.',
  },
  {
    slug: 'celina',
    name: 'Celina',
    distanceMi: 16,
    driveMinutes: '20–30 min',
    intro:
      'Celina families will be able to reach Luma Pediatrics in McKinney for planned, relationship-centered care from the newborn years through adolescence.',
    landmarks: ['Downtown Celina', 'Light Farms', 'Mustang Lakes', 'Celina ISD schools'],
    whyLuma:
      'As Celina grows, Luma will provide another pediatric option for families who value seeing the same physician, having time for questions, and receiving evidence-based guidance in a calm setting.',
  },
  {
    slug: 'van-alstyne',
    name: 'Van Alstyne',
    distanceMi: 20,
    driveMinutes: '25–30 min',
    intro:
      'Van Alstyne families can travel south on US-75 to reach Luma Pediatrics at our future McKinney location.',
    landmarks: ['Downtown Van Alstyne', 'Central Social District', 'Mantua', 'Van Alstyne ISD schools'],
    whyLuma:
      'For families in the growing Van Alstyne community, Luma will offer a physician-led pediatric option along the US-75 corridor, with planned care from the newborn years through adolescence.',
  },
  {
    slug: 'fairview',
    name: 'Fairview',
    distanceMi: 9,
    driveMinutes: '15–20 min',
    intro:
      'Fairview families will find the future Luma Pediatrics practice a convenient drive north in McKinney.',
    landmarks: ['Fairview Town Center', 'Heritage Ranch', 'Sloan Creek', 'Lovejoy ISD schools'],
    whyLuma:
      'Luma is being designed for Fairview families who value continuity with one pediatrician, evidence-based guidance, and visits with enough time to discuss questions and concerns.',
  },
  {
    slug: 'lucas',
    name: 'Lucas',
    distanceMi: 15,
    driveMinutes: '20–25 min',
    intro:
      'Lucas families will be able to reach Luma Pediatrics in McKinney for planned pediatric care in a calm, relationship-centered setting.',
    landmarks: ['Lovejoy ISD schools', 'Lake Lavon', 'Brockdale Park', 'Lucas Community Park'],
    whyLuma:
      'For Lucas families seeking a consistent pediatric relationship, Luma will provide a future option for preventive care, sick visits, vaccines, physicals, and support through adolescence.',
  },
  {
    slug: 'sherman',
    name: 'Sherman',
    distanceMi: 32,
    driveMinutes: '35–45 min',
    intro:
      'Sherman and southern Grayson County families who travel to McKinney for care will be welcome at Luma Pediatrics after the practice opens.',
    landmarks: ['Sherman Town Center', 'Austin College', 'Pecan Grove Park', 'Sherman ISD schools'],
    whyLuma:
      'Luma will offer Sherman-area families another physician-led pediatric option along US-75, with continuity and a long-term relationship with one pediatrician.',
  },
  {
    slug: 'howe',
    name: 'Howe',
    distanceMi: 25,
    driveMinutes: '30–35 min',
    intro:
      'Howe families who travel south along US-75 will be welcome at the future Luma Pediatrics practice in McKinney.',
    landmarks: ['Downtown Howe', 'Howe Community Library', 'Howe ISD schools', 'US-75 corridor'],
    whyLuma:
      'Luma will provide Howe-area families another pediatric option along the US-75 corridor, with a focus on continuity, clear guidance, and time for parent questions.',
  },
  {
    slug: 'new-hope',
    name: 'New Hope',
    distanceMi: 9,
    driveMinutes: '15–20 min',
    intro:
      'New Hope families will be close to Luma Pediatrics at our future location in north McKinney.',
    landmarks: ['New Hope Town Hall', 'FM 1827 corridor', 'East McKinney', 'Collin County communities'],
    whyLuma:
      'For families in New Hope and east McKinney, Luma is planned as a nearby practice with one physician and care from infancy through adolescence.',
  },
  {
    slug: 'lowry-crossing',
    name: 'Lowry Crossing',
    distanceMi: 11,
    driveMinutes: '15–20 min',
    intro:
      'Lowry Crossing families will find the future Luma Pediatrics practice nearby in McKinney.',
    landmarks: ['Lowry Crossing City Hall', 'FM 546', 'US-380 corridor', 'East Collin County'],
    whyLuma:
      'Luma will give Lowry Crossing families a nearby physician-led option for planned newborn care, preventive visits, sick care, vaccines, physicals, and adolescent health.',
  },
  {
    slug: 'farmersville',
    name: 'Farmersville',
    distanceMi: 21,
    driveMinutes: '30–35 min',
    intro:
      'Farmersville families will be able to travel west to Luma Pediatrics at our future McKinney location.',
    landmarks: ['Historic Downtown Farmersville', 'Chaparral Trail', 'Onion Shed', 'Farmersville ISD schools'],
    whyLuma:
      'For Farmersville families seeking a long-term pediatric relationship in the McKinney area, Luma will offer planned care with clear communication and time to discuss each child’s needs.',
  },
  {
    slug: 'aubrey',
    name: 'Aubrey',
    distanceMi: 30,
    driveMinutes: '40–50 min',
    intro:
      'Aubrey-area families who travel to McKinney for care will be welcome at Luma Pediatrics after the future practice opens.',
    landmarks: ['Downtown Aubrey', 'Sandbrock Ranch', 'Union Park', 'Aubrey ISD schools'],
    whyLuma:
      'Luma will provide Aubrey-area families another physician-led pediatric option for those who value continuity, evidence-based guidance, and a calm visit experience.',
  },
  {
    slug: 'little-elm',
    name: 'Little Elm',
    distanceMi: 25,
    driveMinutes: '35–45 min',
    intro:
      'Little Elm families who travel toward McKinney will be welcome at the future Luma Pediatrics practice.',
    landmarks: ['Little Elm Park', 'The Lakefront', 'Lake Lewisville', 'Little Elm ISD schools'],
    whyLuma:
      'For Little Elm families seeking care in the greater McKinney area, Luma will offer a future pediatric option centered on a consistent physician relationship and clear guidance.',
  },
  {
    slug: 'plano',
    name: 'Plano',
    distanceMi: 20,
    driveMinutes: '25–35 min',
    intro:
      'Plano families looking north toward McKinney will be welcome at Luma Pediatrics after the future practice opens.',
    landmarks: ['Downtown Plano', 'Legacy West', 'Oak Point Park', 'Plano ISD schools'],
    whyLuma:
      'Luma will offer Plano families another pediatric option for those seeking one consistent physician, longer conversations, and planned care spanning newborn visits through adolescence.',
  },
];
