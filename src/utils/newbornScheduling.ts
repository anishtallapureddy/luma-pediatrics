import { getServiceScheduling } from './serviceScheduling.ts';
import type { MedicalSchedulingConfig } from './serviceScheduling.ts';

export function getNewbornScheduling(config: MedicalSchedulingConfig) {
  return getServiceScheduling(config, 'newborn');
}
