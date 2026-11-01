import assert from 'node:assert/strict';
import test from 'node:test';
import { getNewbornScheduling } from './newbornScheduling.ts';

const approvedTestUrl = 'https://booking.example.test/newborn?location=mckinney';

test('keeps planning available until scheduling is explicitly enabled', () => {
  for (const url of ['', approvedTestUrl]) {
    assert.deepEqual(getNewbornScheduling({ enabled: false, url }), {
      enabled: false,
      href: '/new-patients/',
      label: 'Plan Your First Visit',
    });
  }
});

test('a planned launch date never activates booking automatically', () => {
  for (const plannedLaunchDate of ['2000-01-01', '2026-11-16', '2099-01-01']) {
    const result = getNewbornScheduling({
      enabled: false,
      url: approvedTestUrl,
      plannedLaunchDate,
    });
    assert.equal(result.enabled, false);
    assert.equal(result.href, '/new-patients/');
  }
});

test('uses the approved HTTPS handoff only when manually enabled', () => {
  assert.deepEqual(getNewbornScheduling({ enabled: true, url: approvedTestUrl }), {
    enabled: true,
    href: approvedTestUrl,
    label: 'Schedule a Newborn Visit',
  });
});

test('fails explicitly for missing, malformed, insecure, or credentialed enabled URLs', () => {
  for (const url of [
    '',
    'not-a-url',
    '//booking.example.test/newborn',
    'http://booking.example.test/newborn',
    'javascript:alert(1)',
    'https://username:password@booking.example.test/newborn',
  ]) {
    assert.throws(
      () => getNewbornScheduling({ enabled: true, url }),
      /Newborn scheduling requires an approved/,
    );
  }
});
