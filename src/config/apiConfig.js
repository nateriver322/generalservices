const DEV_API_URL = 'http://localhost:8080';
const PROD_API_URL = 'https://generalservices.vercel.app/'; // Replace with your actual deployed domain

export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? PROD_API_URL 
  : DEV_API_URL;

export const API_ENDPOINTS = {
  login: '/user/login',
  microsoftLogin: '/user/microsoft-login',
  register: '/user/register',
  forgotPassword: '/user/forgot_password',
  addUser: '/user/add',
  checkEmail: '/user/checkEmail',
  
};