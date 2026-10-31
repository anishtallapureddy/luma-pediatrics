export const DOSING_BANDS = [
  { minimumLb: 24, maximumLb: 36, label: '24–35 lb', ageHint: '2–3 years', milliliters: 5 },
  { minimumLb: 36, maximumLb: 48, label: '36–47 lb', ageHint: '4–5 years', milliliters: 7.5 },
  { minimumLb: 48, maximumLb: 60, label: '48–59 lb', ageHint: '6–8 years', milliliters: 10 },
  { minimumLb: 60, maximumLb: 72, label: '60–71 lb', ageHint: '9–10 years', milliliters: 12.5 },
  { minimumLb: 72, maximumLb: 96, label: '72–95 lb', ageHint: '11 years', milliliters: 15 },
] as const;

export const DOSING_MEDICINES = {
  acetaminophen: {
    label: "Children's acetaminophen (Tylenol)",
    shortLabel: 'Acetaminophen',
    concentration: '160 mg / 5 mL',
    milligramsPerMl: 32,
    interval: 'Every 4 hours if needed',
    maximumDoses: 5,
  },
  ibuprofen: {
    label: "Children's ibuprofen (Motrin / Advil)",
    shortLabel: 'Ibuprofen',
    concentration: '100 mg / 5 mL',
    milligramsPerMl: 20,
    interval: 'Every 6–8 hours if needed',
    maximumDoses: 4,
  },
} as const;

export interface DosingInput {
  medication: string;
  ageYears: number;
  weight: number;
  weightUnit: string;
  strengthConfirmed: boolean;
}

type InputField = 'medication' | 'ageYears' | 'weight' | 'weightUnit' | 'strengthConfirmed';

export type DosingResult =
  | { kind: 'invalid'; field: InputField; message: string }
  | { kind: 'blocked'; message: string }
  | {
      kind: 'dose';
      medicationLabel: string;
      concentration: string;
      milliliters: number;
      milligrams: number;
      interval: string;
      maximumDoses: number;
      weightBand: string;
    };

// Weight bands and strengths follow the U.S. Children's Tylenol and Motrin
// Drug Facts labels. No infant, adult, or custom-concentration extrapolation.
export function calculateDosing(input: DosingInput): DosingResult {
  if (input.medication !== 'acetaminophen' && input.medication !== 'ibuprofen') {
    return { kind: 'invalid', field: 'medication', message: 'Choose one of the supported medicines.' };
  }
  if (!Number.isFinite(input.ageYears) || !Number.isInteger(input.ageYears) || input.ageYears < 0) {
    return { kind: 'invalid', field: 'ageYears', message: 'Enter your child’s age in completed whole years.' };
  }
  if (input.ageYears < 2 || input.ageYears > 11) {
    return {
      kind: 'blocked',
      message: 'This calculator is only for ages 2–11. Ask your child’s current healthcare provider or pharmacist for guidance outside this range.',
    };
  }
  if (!Number.isFinite(input.weight) || input.weight <= 0) {
    return { kind: 'invalid', field: 'weight', message: 'Enter a current weight greater than zero.' };
  }
  if (input.weightUnit !== 'lb' && input.weightUnit !== 'kg') {
    return { kind: 'invalid', field: 'weightUnit', message: 'Choose pounds or kilograms.' };
  }
  const scale = input.weightUnit === 'kg' ? 0.45359237 : 1;
  const band = DOSING_BANDS.find(
    (item) => input.weight >= item.minimumLb * scale && input.weight < item.maximumLb * scale,
  );
  if (!band) {
    return {
      kind: 'blocked',
      message: 'This weight is outside the supported 24–95 whole-pound chart range. Ask your child’s current healthcare provider or pharmacist; no dose is calculated.',
    };
  }
  if (input.strengthConfirmed !== true) {
    return {
      kind: 'invalid',
      field: 'strengthConfirmed',
      message: 'Check the bottle and confirm the selected medicine and liquid strength before calculating.',
    };
  }
  const medicine = DOSING_MEDICINES[input.medication];
  return {
    kind: 'dose',
    medicationLabel: medicine.label,
    concentration: medicine.concentration,
    milliliters: band.milliliters,
    milligrams: band.milliliters * medicine.milligramsPerMl,
    interval: medicine.interval,
    maximumDoses: medicine.maximumDoses,
    weightBand: band.label,
  };
}
