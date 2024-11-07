import {useEffect, useState} from 'react';

/**
 *
 * @param initialSeconds
 * @returns {{timer: number}}
 */

const useTimer = (initialSeconds = 0) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const interval = handleTimeChange();

    return () => clearInterval(interval);
  }, [initialSeconds]);

  function handleTimeChange() {
    return setInterval(() => setSeconds(prev => prev - 1), 1000);
  }

  return {seconds};
};

export default useTimer;
