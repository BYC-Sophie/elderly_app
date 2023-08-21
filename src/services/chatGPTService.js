import axios from 'axios';

const authedRequest = axios.create();

authedRequest.interceptors.request.use(function (config) {
  config.headers.Authorization = `Bearer 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`;
  return config;
}, function (error) {
  return Promise.reject(error);
});

export {
  authedRequest
}