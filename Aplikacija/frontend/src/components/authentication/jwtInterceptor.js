import axios from 'axios';

const jwtInterceptor = axios.create({});

jwtInterceptor.interceptors.request.use((config) => {
  let tokensData = localStorage.getItem('token');
  if (tokensData) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${tokensData}`,
    };
  }
  return config;
});

export default jwtInterceptor;
