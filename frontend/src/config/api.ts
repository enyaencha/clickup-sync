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

// Log the current API URL in development
if (import.meta.env.DEV) {
  console.log('🌐 API Base URL:', API_BASE_URL);
  console.log('📝 VITE_API_URL from env:', import.meta.env.VITE_API_URL);
}
