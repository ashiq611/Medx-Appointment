import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3006/api/v1", // your backend base URL
  withCredentials: true, // allow sending cookies (important for session auth)
});

export default axiosInstance;



