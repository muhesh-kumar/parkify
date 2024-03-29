import { ReactElement } from 'react';
import { useEffect, useState } from 'react';

type ProgressProviderProps = {
  valueStart: number;
  valueEnd: number;
  children: (value: number) => ReactElement;
};

const ProgressProvider = ({
  valueStart,
  valueEnd,
  children,
}: ProgressProviderProps) => {
  const [value, setValue] = useState(valueStart);
  useEffect(() => {
    setValue(valueEnd);
  }, [valueEnd]);

  return children(value);
};

export default ProgressProvider;
