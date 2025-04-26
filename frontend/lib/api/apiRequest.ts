import { toast } from "sonner";
import userStore from "../store";

interface ApiFetchOptions extends RequestInit {
  url: string;
  params?: Record<string, unknown>; // JSON-friendly object
  data?: unknown;
}

const HOST = "http://127.0.0.1:8000/api";
export default async function apiRequest(meta: ApiFetchOptions) {
  const { url, method = "GET", params, headers, data, ...rest } = meta;

  let urlWithParams = HOST + url;
  if (params) {
    const encodedParams = new URLSearchParams();
    for (const key in params) {
      const value = params[key];
      encodedParams.append(key, JSON.stringify(value));
    }
    urlWithParams += `?${encodedParams.toString()}`;
  }

  // Add auth token to headers
  const token = userStore.token;
  userStore.setToken(token);
  let requestHeaders = {
    ...headers,
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: "",
  };
  if (token) {
    requestHeaders = {
      ...requestHeaders,
      Authorization: `Bearer ${token}`,
    };
  }

  // Only send body for non-GET/HEAD
  const shouldHaveBody = !["GET", "HEAD"].includes(method.toUpperCase());
  const body = shouldHaveBody && data ? JSON.stringify(data) : undefined;

  try {
    const response = await fetch(urlWithParams, {
      method: method.toUpperCase(),
      headers: requestHeaders,
      body,
      credentials: token ? "include" : "omit",
      ...rest,
    });

    if (response.status === 401) {
      localStorage.removeItem("token");
    }
    const responseData = await response.json();

    // Return the JSON data along with the HTTP status code
    return { data:responseData, status: response.status };
  } catch (error) {
    console.error("API request failed:", error);
    toast.error("Network error: Failed to reach the server");
    throw error; // or return a consistent error object if you prefer
  }
}
