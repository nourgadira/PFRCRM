import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api'
})

// Add a request interceptor
axiosInstance.interceptors.request.use(function (config) {
  // Do something before request is sent
  const authToken = localStorage.getItem('token');
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }

  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

axiosInstance.interceptors.response.use(function (response) {

  console.log(response)
  return response;
}, function (error) {

  return Promise.reject(error);
});