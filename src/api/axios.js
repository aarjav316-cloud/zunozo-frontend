import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "https://zunozo-backend.onrender.com/api/v1" : "http://localhost:5000/api/v1"),
  withCredentials: true,
});

export default axiosInstance;
