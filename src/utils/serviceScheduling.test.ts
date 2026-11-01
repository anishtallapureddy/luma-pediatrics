import assert from 'node:assert/strict';
import test from 'node:test';
import { getMedicalScheduling, getServiceScheduling } from './serviceScheduling.ts';

const disabled = { enabled: false, url: '', plannedLaunchDate: '2000-01-01' };
const enabled = { enabled: true, url: 'https://booking.example.test/well-child' };

test('well-child planning does not activate on a date or on the presence of a URL', () => {
  for (const config of [disabled, { ...enabled, enabled: false }]) {
    assert.deepEqual(getServiceScheduling(config, 'well-child'), {
      enabled: false,
      href: '/new-patients/',
      label: "Plan Your Child's Visit",
    });
  }
});

test('well-child activation uses its own approved workflow and label', () => {
  assert.deepEqual(getServiceScheduling(enabled, 'well-child'), {
    enabled: true,
    href: enabled.url,
    label: 'Schedule a Well-Child Visit',
  });
});

test('medical service activation remains independent and shared notices recognize either service', () => {
  const state = getMedicalScheduling({ newbornScheduling: disabled, wellChildScheduling: enabled });
  assert.equal(state.enabled, true);
  assert.equal(state.newborn.enabled, false);
  assert.equal(state.newborn.href, '/new-patients/');
  assert.equal(state.wellChild.href, enabled.url);
  assert.equal(getMedicalScheduling({
    newbornScheduling: disabled, wellChildScheduling: disabled,
  }).enabled, false);
});

test('rejects unsafe well-child URLs and preserves the original parsing error', () => {
  for (const url of ['', 'not-a-url', 'http://booking.example.test', 'https://user:pass@booking.example.test']) {
    assert.throws(() => getServiceScheduling({ enabled: true, url }, 'well-child'), /approved/);
  }
  assert.throws(
    () => getMedicalScheduling({ newbornScheduling: disabled, wellChildScheduling: { enabled: true, url: '' } }),
    (err) => err instanceof Error && err.cause instanceof TypeError,
  );
});
