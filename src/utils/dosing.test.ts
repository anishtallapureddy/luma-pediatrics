import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateDosing } from './dosing.ts';
import type { DosingInput } from './dosing.ts';

const valid: DosingInput = {
  medication: 'acetaminophen',
  ageYears: 4,
  weight: 36,
  weightUnit: 'lb',
  strengthConfirmed: true,
};

test('uses the verified label bands for both medicines without crossing a boundary early', () => {
  const cases = [
    [24, 5], [35.999, 5], [36, 7.5], [47.999, 7.5], [48, 10],
    [59.999, 10], [60, 12.5], [71.999, 12.5], [72, 15], [95.999, 15],
  ];
  for (const medication of ['acetaminophen', 'ibuprofen']) {
    for (const [weight, volume] of cases) {
      for (const weightUnit of ['lb', 'kg']) {
        const result = calculateDosing({
          ...valid, medication, weightUnit,
          weight: weightUnit === 'kg' ? weight * 0.45359237 : weight,
        });
        assert.equal(result.kind, 'dose', `${medication}, ${weight} lb (${weightUnit})`);
        if (result.kind !== 'dose') throw new Error('Expected a supported dose');
        assert.equal(result.milliliters, volume);
        assert.equal(result.milligrams, volume * (medication === 'acetaminophen' ? 32 : 20));
        assert.equal(result.maximumDoses, medication === 'acetaminophen' ? 5 : 4);
      }
    }
  }
});

test('never extrapolates for infant, teenage, or out-of-chart weights', () => {
  for (const ageYears of [0, 1, 12, 18]) {
    assert.equal(calculateDosing({ ...valid, ageYears }).kind, 'blocked');
  }
  for (const weight of [23.999, 96, 1000]) {
    for (const weightUnit of ['lb', 'kg']) {
      assert.equal(calculateDosing({
        ...valid, weightUnit, weight: weightUnit === 'kg' ? weight * 0.45359237 : weight,
      }).kind, 'blocked');
    }
  }
});

test('rejects invalid values, unsupported medicines/units, and unchecked concentration', () => {
  for (const weight of [0, -1, NaN, Infinity]) {
    assert.equal(calculateDosing({ ...valid, weight }).kind, 'invalid');
  }
  for (const ageYears of [-1, 2.5, NaN, Infinity]) {
    assert.equal(calculateDosing({ ...valid, ageYears }).kind, 'invalid');
  }
  for (const medication of ['', 'diphenhydramine', '__proto__']) {
    assert.equal(calculateDosing({ ...valid, medication }).kind, 'invalid');
  }
  assert.equal(calculateDosing({ ...valid, weightUnit: 'oz' }).kind, 'invalid');
  assert.equal(calculateDosing({ ...valid, strengthConfirmed: false }).kind, 'invalid');
});
