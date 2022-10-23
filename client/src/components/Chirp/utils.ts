const relativeTimeFormatter = new Intl.RelativeTimeFormat(undefined, {
  numeric: 'auto',
});

type TimeUnit = 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months';

const time: Record<TimeUnit, number> = {
  seconds: 60,
  minutes: 60,
  hours: 24,
  days: 7,
  weeks: 4.34524,
  months: 12,
} as const;

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

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour12: false,
  dateStyle: 'medium',
  timeStyle: 'short',
});

const formatTime = (isoDateStr: string) => {
  const localDate = new Date(isoDateStr);
  const formattedFull = timeFormatter.format(localDate);

  const index = formattedFull.lastIndexOf(' ');
  const formattedTime = formattedFull.slice(index + 1);
  const formattedDate = formattedFull.slice(0, index).replace(/(,|\s)*$/, '');

  return [formattedTime, formattedDate];
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
  formatTime,
  formatCount,
};
