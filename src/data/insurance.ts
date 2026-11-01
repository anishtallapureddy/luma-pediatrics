// Display sizes balance visual weight; the image styles preserve SVG proportions.
export const insurancePlans = [
  {
    name: 'Blue Cross Blue Shield of Texas (BCBS)',
    logo: '/images/insurance/bcbstx.svg',
    width: 240,
    height: 34,
  },
  {
    name: 'Anthem',
    logo: '/images/insurance/anthem.svg',
    width: 170,
    height: 38,
  },
  {
    name: 'Aetna',
    logo: '/images/insurance/aetna.svg',
    width: 185,
    height: 36,
  },
  {
    name: 'Cigna / Great-West',
    logo: '/images/insurance/cigna.svg',
    width: 112,
    height: 59,
  },
  {
    name: 'UnitedHealthcare',
    logo: '/images/insurance/unitedhealthcare.svg',
    width: 180,
    height: 56,
  },
  {
    name: 'Baylor Scott & White Health Plan',
    logo: '/images/insurance/bsw-health-plan.svg',
    width: 240,
    height: 43,
  },
] as const;

export const additionalInsurancePlans = [
  'Curative',
  'Coventry / First Health (PPO)',
  'PHCS / MultiPlan (PPO)',
  'USA Health Network (PPO)',
  '6 Degrees – Fort Worth Firefighters',
  'QuikTrip (Open Access)',
] as const;

export const insuranceCoverageNote = 'Participation varies by specific plan and network.';
