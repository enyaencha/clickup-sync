/**
 * API Configuration
 * Centralized configuration for API endpoints
 */

// Get the API URL from environment variables, fallback to localhost
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// API endpoint helpers
export const getApiUrl = (path: string): string => {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const fullUrl = `${API_BASE_URL}${normalizedPath}`;

  // Log API calls in development for debugging
  if (import.meta.env.DEV) {
    console.log(`🔌 API Call: ${fullUrl}`);
  }

  return fullUrl;
};

/**
 * Authenticated fetch wrapper
 * Automatically includes Authorization header from localStorage
 */
const decodeJwtPayload = (token: string): any | null => {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    const decoded = atob(padded);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

const isTokenExpired = (token: string): boolean => {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== 'number') return false;
  return Date.now() >= payload.exp * 1000;
};

const clearSessionAndRedirect = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

export const authFetch = async (path: string, options: RequestInit = {}): Promise<Response> => {
  const token = localStorage.getItem('token');
  const headers = new Headers(options.headers || {});
  const isFormData = options.body instanceof FormData;

  if (!isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (isFormData && headers.has('Content-Type')) {
    headers.delete('Content-Type');
  }

  // Add Authorization header if token exists
  if (token) {
    if (isTokenExpired(token)) {
      clearSessionAndRedirect();
      return Promise.reject(new Error('Session expired'));
    }
    headers.set('Authorization', `Bearer ${token}`);
  }

  const url = path.startsWith('http://') || path.startsWith('https://')
    ? path
    : getApiUrl(path);

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // 401 means authentication is invalid/expired; clear session.
  // 403 is authorization (permission) and should not force logout.
  if (response.status === 401) {
    clearSessionAndRedirect();
  }

  return response;
};

// Log the current API URL in development
if (import.meta.env.DEV) {
  console.log('🌐 API Base URL:', API_BASE_URL);
  console.log('📝 VITE_API_URL from env:', import.meta.env.VITE_API_URL);
}
