const formatCount = (count: number): string => {
  const countStr = count.toString();

  if (count > 10000) {
    const integerPart = Math.floor(count / 1000);
    const remainderHundreds = Math.floor((count % 1000) / 100);
    const fractionalPart = remainderHundreds > 0 ? `.${remainderHundreds}` : '';
    return `${integerPart}${fractionalPart}K`;
  }

  if (count > 1000) {
    return `${countStr.slice(0, 1)},${countStr.slice(1)}`;
  }

  return countStr;
};

export default formatCount;
