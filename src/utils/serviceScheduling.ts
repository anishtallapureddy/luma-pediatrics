export interface MedicalSchedulingConfig {
  enabled: boolean;
  url: string;
  plannedLaunchDate?: string;
}

function getScheduling(
  config: MedicalSchedulingConfig,
  name: string,
  label: string,
  planningLabel: string,
) {
  if (!config.enabled) {
    return {
      enabled: false,
      href: '/new-patients/',
      label: planningLabel,
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
    label,
  };
}

export function getServiceScheduling(config: MedicalSchedulingConfig, service: 'newborn' | 'well-child') {
  return service === 'newborn'
    ? getScheduling(config, 'Newborn', 'Schedule a Newborn Visit', 'Plan Your First Visit')
    : getScheduling(config, 'Well-child', 'Schedule a Well-Child Visit', "Plan Your Child's Visit");
}

export function getMeetAndGreetScheduling(config: MedicalSchedulingConfig) {
  const state = getScheduling(config, 'Meet & Greet', 'Schedule a Free Meet & Greet', 'Ask About a Meet & Greet');
  return state.enabled ? state : { ...state, href: '/contact/' };
}

export function getMedicalScheduling(config: {
  appointmentScheduling: MedicalSchedulingConfig;
  newbornScheduling: MedicalSchedulingConfig;
  wellChildScheduling: MedicalSchedulingConfig;
}) {
  const appointments = getScheduling(config.appointmentScheduling, 'Medical', 'Schedule an Appointment', 'Plan Your Visit');
  const newborn = getServiceScheduling(config.newbornScheduling, 'newborn');
  const wellChild = getServiceScheduling(config.wellChildScheduling, 'well-child');
  return { appointments, newborn, wellChild, enabled: appointments.enabled || newborn.enabled || wellChild.enabled };
}
