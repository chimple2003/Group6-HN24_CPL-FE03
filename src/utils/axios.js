import axios from "axios";
import { API_PREFIX } from "../constants/setting";

const instance = axios.create({
  baseURL: API_PREFIX,
  timeout: 5000,
  // withCredentials: true,
});

instance.interceptors.request.use((req) => {
  const token = localStorage.getItem("token") || ""; // Lấy token từ localStorage
  if (token) {
    req.headers.Authorization = `Bearer ${token}`; // Thêm Bearer vào header Authorization
  }
  return req;
});

instance.interceptors.response.use(
  (res) => {
    return res; // Trả về response nếu không có lỗi
  },
  (err) => {
    if (err && err.response && err.response.status === 401) {
      window.location.href = "/"; // Điều hướng về trang đăng nhập nếu lỗi 401
    }
    return Promise.reject(err && err.response && err.response.data); // Trả về lỗi nếu có
  }
);

export default instance;
