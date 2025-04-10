import axios from "axios";
// import { cookies } from "next/headers";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3006/api/v1", // your backend base URL
  withCredentials: true, // allow sending cookies (important for session auth)
});

// (async () => {
//   const cookieStore = await cookies();
//   const token = cookieStore.get("token")?.value;

//   if (token) {
//     // Use the token (e.g., set axios header)
//     axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//   }
// })();

// const token = localStorage.getItem("token");
// if (token) {
//   axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
// }

export default axiosInstance;



