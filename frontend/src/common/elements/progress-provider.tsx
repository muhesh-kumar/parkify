import { useEffect, useState } from "react";

const ProgressProvider = ({ valueStart, valueEnd, children }: any) => {
  const [value, setValue] = useState(valueStart);
  useEffect(() => {
    setValue(valueEnd);
  }, [valueEnd]);

  return children(value);
};

export default ProgressProvider;