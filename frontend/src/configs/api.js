import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "x-token": "spacedev.vn",
  },
});

axiosInstance.interceptors.response.use((res) => {
  return res.data;
});

export default axiosInstance;
