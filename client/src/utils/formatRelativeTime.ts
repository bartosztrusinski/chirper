type TimeUnit = 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months';

const time: Record<TimeUnit, number> = {
  seconds: 60,
  minutes: 60,
  hours: 24,
  days: 7,
  weeks: 4.34524,
  months: 12,
} as const;

const relativeTimeFormatter = new Intl.RelativeTimeFormat('en', {
  numeric: 'auto',
});

const formatRelativeTime = (isoDateStr: string) => {
  const localDate = new Date(isoDateStr);
  let timeDelta = (localDate.getTime() - Date.now()) / 1000;

  let unit: TimeUnit;
  for (unit in time) {
    if (Math.abs(timeDelta) < time[unit]) {
      return relativeTimeFormatter.format(Math.round(timeDelta), unit);
    }
    timeDelta /= time[unit];
  }
};

export default formatRelativeTime;
