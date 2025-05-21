import axios from 'axios';

import {GEO_NAME_API, GEO_NAME_USER_NAME} from '../Constants';

export const geoNameApi = async (text, country = 'US') => {
  try {
    return await axios.get(
      `${GEO_NAME_API}/searchJSON?name_startsWith=${text}&maxRows=10&cities=cities5000&username=${GEO_NAME_USER_NAME}&countryBias=${country}`,
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUserCurrentLocation = async (
  latitude = null,
  longitude = null,
) => {
  try {
    return await axios.get(
      `${GEO_NAME_API}/findNearbyPlaceNameJSON?lat=${latitude}&lng=${longitude}&username=${GEO_NAME_USER_NAME}`,
    );
  } catch (error) {
    console.log(error);
  }
};

export const getNearbyPopulatedPlace = async (
  latitude = null,
  longitude = null,
) => {
  try {
    return await axios.get(
      `http://api.geonames.org/findNearbyPlaceNameJSON?lat=${latitude}&lng=${longitude}&username=${GEO_NAME_USER_NAME}`,
    );
  } catch (error) {
    console.log(error);
  }
};
