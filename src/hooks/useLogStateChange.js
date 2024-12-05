import {useEffect} from 'react';

const useLogStateChange = (stateName, stateValue) => {
  useEffect(() => {
    console.log(`${stateName} has changed to:`, stateValue);
  }, [stateValue]);
};

export default useLogStateChange;
