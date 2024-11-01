import axios from 'axios';
import {store} from '../Store';
import {API_BASE_URL} from '../Constants';

export const deleteRequest = async endPoint => {
  const {token} = store.getState().auth.user;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  };

  return await axios
    .delete(endPoint, config)
    .then(response => {
      return response;
    })
    .catch(err => err);
};

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor (optional, for adding auth tokens)
api.interceptors.request.use(
  config => {
    const {token} = store.getState().auth.user;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

export default api;
