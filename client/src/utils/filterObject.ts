const filterObject = <T>(
  object: Record<string, T>,
  predicate: (val: T, key: string) => boolean,
): Record<string, T> =>
  Object.fromEntries(
    Object.entries(object).filter(([key, val]) => predicate(val, key)),
  );

export default filterObject;
