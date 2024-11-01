import api from './api';
import {API_ENDPOINTS} from '../Constants';

const {LOGIN_URL, FORGET_PASSWORD_URL, RESET_PASSWORD_URL} = API_ENDPOINTS;

export const login = async (username, password) => {
  try {
    const {data} = await api.post(LOGIN_URL, {username, password});
    return data || null;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const forgotPassword = async email => {
  try {
    await api.post(FORGET_PASSWORD_URL, {email: email});
    return true;
  } catch (error) {
    console.error('Forgot Password error:', error);
    throw error;
  }
};

export const resetPassword = async (OTP, confirmPassword, email, password) => {
  try {
    const body = {
      OTP,
      confirmPassword,
      email,
      password,
    };
    const response = await api.post(RESET_PASSWORD_URL, body);
    return response || null;
  } catch (error) {
    console.error('Forgot Password error:', error);
    throw error;
  }
};
