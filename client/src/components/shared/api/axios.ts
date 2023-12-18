import axios from 'axios';

export const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(function (config) {
  const getCookie = (name: string) => {
    try {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift() ?? '';
    } catch (error) {
      console.log(`Error reading cookies: ${error}`);
    }
    return '';
  };
  const token = getCookie('jwt');
  config.headers.common['Authorization'] = token
    ? `Bearer ${token}`
    : undefined;
  return config;
});
