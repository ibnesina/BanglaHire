interface ApiFetchOptions extends RequestInit {
  url: string;
  params?: Record<string, unknown>; // JSON-friendly object
  data?: unknown;
}

const HOST = "http://localhost:8000/api";
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
  const token = localStorage.getItem("token");
  let requestHeaders = headers || {};
  if (token) {
    requestHeaders = {
      ...headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: "application/json",
    };
  }

  // Only send body for non-GET/HEAD
  const shouldHaveBody = !["GET", "HEAD"].includes(method.toUpperCase());
  const body = shouldHaveBody && data ? JSON.stringify(data) : undefined;

  const response = await fetch(urlWithParams, {
    method:method.toUpperCase(),
    headers: requestHeaders,
    body,
    ...rest,
  });
  if (response.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }
  return response.json();
}
