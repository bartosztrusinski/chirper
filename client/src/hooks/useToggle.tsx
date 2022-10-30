import { useState } from 'react';

const useToggle = (initialValue = false) => {
  const [value, setValue] = useState<boolean>(initialValue);

  const toggleValue = () => setValue((prevValue) => !prevValue);

  return [value, toggleValue] as const;
};

export default useToggle;
