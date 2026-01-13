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
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(path, {
    ...options,
    headers,
  });

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  return response;
};

// Log the current API URL in development
if (import.meta.env.DEV) {
  console.log('🌐 API Base URL:', API_BASE_URL);
  console.log('📝 VITE_API_URL from env:', import.meta.env.VITE_API_URL);
}
