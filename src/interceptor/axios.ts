import Axios from "axios";

const axios = Axios.create({
  baseURL: process.env.BASE_URL_API,
  withCredentials: true,
});

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios;
