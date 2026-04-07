// Central API config and utility for frontend

export const API_BASE_URL = 'http://localhost:8080/api';

interface ApiFetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

export async function apiFetch(endpoint: string, options: ApiFetchOptions = {}) {
  const sessionToken = sessionStorage.getItem('rentwise_token');
  const localToken = localStorage.getItem('rentwise_token');
  const token = sessionToken || localToken;
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  let data = await res.json().catch(() => ({}));

  // If both stores have different tokens, retry once with the alternate token on auth failures.
  if (!res.ok && (res.status === 401 || res.status === 403) && sessionToken && localToken && sessionToken !== localToken) {
    const fallbackToken = token === sessionToken ? localToken : sessionToken;
    const retryHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${fallbackToken}`,
      ...(options.headers || {}),
    };

    const retryRes = await fetch(`${API_BASE_URL}${endpoint}`, {
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
