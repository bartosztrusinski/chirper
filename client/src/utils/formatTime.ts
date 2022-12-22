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

  return { formattedTime, formattedDate };
};

export default formatTime;
