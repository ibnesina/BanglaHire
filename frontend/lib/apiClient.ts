// lib/apiClient.ts (or similar)
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,  // this ensures cookies are sent with requests
});

export default apiClient;
