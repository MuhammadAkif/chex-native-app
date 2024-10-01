import axios from 'axios';
import {store} from '../Store';

export const login = async (endPoint, body) => {
  const {token} = store.getState().auth.user;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  };

  return await axios
    .post(endPoint, body, config)
    .then(response => {
      return response;
    })
    .catch(err => err);
};
