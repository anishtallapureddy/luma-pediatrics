export const insurancePlans = [
  {
    name: 'Blue Cross Blue Shield of Texas (BCBS)',
    logo: '/images/insurance/bcbstx.svg',
    width: 276,
    height: 39,
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
    width: 101,
    height: 53,
  },
  {
    name: 'UnitedHealthcare',
    logo: '/images/insurance/unitedhealthcare.svg',
    width: 564,
    height: 177,
  },
  {
    name: 'Baylor Scott & White Health Plan',
    logo: '/images/insurance/bsw-health-plan.svg',
    width: 792,
    height: 141,
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
