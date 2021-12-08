import { useState } from 'react';

const useInputs = (initialValue) => {
  const [value, setValue] = useState(initialValue);
  const onChange = (e) => {
    const { value } = e.target;
    setValue(value);
  };
  return { value, onChange };
};

export default useInputs;
