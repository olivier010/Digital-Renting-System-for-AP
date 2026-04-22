export const API_BASE_URL = import.meta.env.VITE_API_URL;

interface ApiFetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

export async function apiFetch(endpoint: string, options: ApiFetchOptions = {}) {

  // ✅ FIX: keep /api in the path
  const requestPath = endpoint.startsWith('/')
    ? endpoint
    : `/${endpoint}`;

  const sessionToken = sessionStorage.getItem('rentwise_token');
  const localToken = localStorage.getItem('rentwise_token');
  const token = sessionToken || localToken;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_BASE_URL}${requestPath}`, {
    ...options,
    headers,
  });

  let data = await res.json().catch(() => ({}));

  if (!res.ok && (res.status === 401 || res.status === 403) && sessionToken && localToken && sessionToken !== localToken) {
    const fallbackToken = token === sessionToken ? localToken : sessionToken;

    const retryHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${fallbackToken}`,
      ...(options.headers || {}),
    };

    const retryRes = await fetch(`${API_BASE_URL}${requestPath}`, {
      ...options,
      headers: retryHeaders,
    });

    const retryData = await retryRes.json().catch(() => ({}));
    if (retryRes.ok) return retryData;

    data = retryData;
  }

  if (!res.ok) throw new Error(data.message || 'API request failed');

  return data;
}