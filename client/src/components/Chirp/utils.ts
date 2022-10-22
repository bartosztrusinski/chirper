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

const formatCount = (count: number) => {
  if (count > 10000) {
    const integerPart = Math.floor(count / 1000);
    const remainderHundreds = Math.floor((count % 1000) / 100);
    const fractionalPart = remainderHundreds > 0 ? `.${remainderHundreds}` : '';
    return `${integerPart}${fractionalPart}K`;
  } else if (count > 1000) {
    const countStr = count.toString();
    return `${countStr.slice(0, 1)},${countStr.slice(1)}`;
  }
  return count;
};

export default {
  formatRelativeTime,
  formatCount,
};
