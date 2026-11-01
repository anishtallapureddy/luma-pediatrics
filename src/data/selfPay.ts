export const selfPayPricing = {
  officeVisit: '$130',
  sportsPhysical: '$40',
  visitFeeNote: 'Patient visit and sports physical fees cover the visit only.',
  additionalCharges: 'Tests, screenings, vaccines, procedures, and applicable add-on charges are billed separately.',
} as const;

export const selfPayServices = [
  {
    name: 'Patient visit (sick or well-child)',
    price: selfPayPricing.officeVisit,
    detail: 'For new and established patients.',
  },
  {
    name: 'Sports physical',
    price: selfPayPricing.sportsPhysical,
    detail: 'A standalone sports physical, not a full well-child visit.',
  },
  {
    name: 'Testing',
    price: 'From $10',
    detail: 'Urine pregnancy testing $10. Flu, COVID-19, RSV, and strep tests from $25 each; cost depends on the test method.',
  },
  {
    name: 'Screenings',
    price: 'From $10',
    detail: 'Developmental screening from $10; vision and hearing screenings from $20 each.',
  },
] as const;
