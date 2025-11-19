// Add this interceptor once
axios.interceptors.request.use(config => {
  config.headers['ngrok-skip-browser-warning'] = 'true';
  return config;
});