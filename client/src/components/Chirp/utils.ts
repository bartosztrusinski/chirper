const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });

type TimeUnit = 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months';

const time: Record<TimeUnit, number> = {
  seconds: 60,
  minutes: 60,
  hours: 24,
  days: 7,
  weeks: 4.34524,
  months: 12,
} as const;

const formatRelativeTime = (date: Date) => {
  let delta = (date.getTime() - Date.now()) / 1000;

  let unit: TimeUnit;
  for (unit in time) {
    if (Math.abs(delta) < time[unit]) {
      return formatter.format(Math.round(delta), unit);
    }
    delta /= time[unit];
  }
};

export default formatRelativeTime;
