import axios from "axios";

export const api = axios.create({
  baseURL: "https://blog-backend-2-42r9.onrender.com/api",
});
