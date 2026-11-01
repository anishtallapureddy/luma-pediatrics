export interface MedicalSchedulingConfig {
  enabled: boolean;
  url: string;
  plannedLaunchDate?: string;
}

export function getServiceScheduling(
  config: MedicalSchedulingConfig,
  service: 'newborn' | 'well-child',
) {
  const newborn = service === 'newborn';
  const name = newborn ? 'Newborn' : 'Well-child';
  if (!config.enabled) {
    return {
      enabled: false,
      href: '/new-patients/',
      label: newborn ? 'Plan Your First Visit' : "Plan Your Child's Visit",
    };
  }

  let url: URL;
  try {
    url = new URL(config.url);
  } catch (err) {
    throw new Error(`${name} scheduling requires an approved absolute HTTPS booking URL.`, { cause: err });
  }
  if (url.protocol !== 'https:' || url.username || url.password) {
    throw new Error(`${name} scheduling requires an approved HTTPS booking URL without embedded credentials.`);
  }

  return {
    enabled: true,
    href: url.href,
    label: newborn ? 'Schedule a Newborn Visit' : 'Schedule a Well-Child Visit',
  };
}

export function getMedicalScheduling(config: {
  newbornScheduling: MedicalSchedulingConfig;
  wellChildScheduling: MedicalSchedulingConfig;
}) {
  const newborn = getServiceScheduling(config.newbornScheduling, 'newborn');
  const wellChild = getServiceScheduling(config.wellChildScheduling, 'well-child');
  return { newborn, wellChild, enabled: newborn.enabled || wellChild.enabled };
}
