import axios from "axios";

export const api = axios.create({
  baseURL: "https://rocketnotes-backend-81u9.onrender.com",
});
