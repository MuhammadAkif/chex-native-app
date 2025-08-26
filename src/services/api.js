import axios from 'axios';
import {store} from '../Store';
import {API_BASE_URL} from '../Constants';

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

// ❌ Response error interceptor (normalize all errors)
api.interceptors.response.use(
  response => response,
  error => {
    if (axios.isAxiosError(error)) {
      const safeError = new Error(error.response?.data?.message || error.message || 'Unknown network error');

      // Preserve useful fields
      safeError.isAxiosError = true;
      safeError.code = error.code;
      safeError.config = error.config;
      safeError.request = error.request;
      safeError.response = error.response;

      return Promise.reject(safeError);
    }

    // Non-Axios errors → wrap safely
    if (!(error instanceof Error)) {
      return Promise.reject(new Error(String(error)));
    }

    return Promise.reject(error);
  },
);

export default api;
