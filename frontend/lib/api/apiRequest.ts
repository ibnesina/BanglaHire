import { toast } from "sonner";
import userStore from "../store";

interface ApiFetchOptions extends RequestInit {
  url: string;
  params?: Record<string, unknown>;
  data?: unknown;
}

const HOST = process.env.NEXT_PUBLIC_API_HOST;

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

  const token = userStore.token;

  let requestHeaders = {
    ...headers,
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const shouldHaveBody = !["GET", "HEAD"].includes(method.toUpperCase());
  const body = shouldHaveBody && data ? JSON.stringify(data) : undefined;

  try {
    const response = await fetch(urlWithParams, {
      method: method.toUpperCase(),
      headers: requestHeaders,
      body,
      credentials: "omit", // Important: no cookies for Bearer token auth
      ...rest,
    });

    if (response.status === 401) {
      localStorage.removeItem("token");
      userStore.setToken(null);
      toast.error("Unauthorized. Please login again.");
      // Optionally redirect to login page here
    }

    const responseData = await response.json();
    return { data: responseData, status: response.status };
  } catch (error) {
    console.error("API request failed:", error);
    toast.error("Network error: Failed to reach the server");
    throw error;
  }
}
