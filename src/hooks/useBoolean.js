import {useState, useCallback} from 'react';

/**
 * Custom hook for managing a boolean state.
 * @param {boolean} initialValue - Initial value of the boolean state (defaults to false).
 * @returns {Object} An object containing:
 *   - value: The current boolean value.
 *   - setTrue: Function to set the value to true.
 *   - setFalse: Function to set the value to false.
 *   - toggle: Function to toggle the current value.
 *   - reset: Function to reset the value to the initial value.
 */
const useBoolean = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);

  // Function to set value to true
  const setTrue = useCallback(() => setValue(true), []);

  // Function to set value to false
  const setFalse = useCallback(() => setValue(false), []);

  // Function to toggle the value between true and false
  const toggle = useCallback(() => setValue(prev => !prev), []);

  // Function to reset value to the initial state
  const reset = useCallback(() => setValue(initialValue), [initialValue]);

  return {
    value,
    setTrue,
    setFalse,
    toggle,
    reset,
  };
};

export default useBoolean;
