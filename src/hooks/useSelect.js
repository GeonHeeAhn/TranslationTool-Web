import { useState, useCallback } from 'react';

const useSelect = (initialValue) => {
  const [value, setValue] = useState(initialValue);
  const onChange = (e) => {
    useCallback((e.target.value) => setValue(e.target), []);
  };
};

export default useSelect;
