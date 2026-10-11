/**
 * Formats API errors into user-friendly messages
 */

export const getErrorMessage = (error, fallbackMessage = 'An unexpected error occurred.') => {
  if (!error) return fallbackMessage;

  // Network connection issue
  if (error.code === 'ERR_NETWORK' || !error.response) {
    return 'Unable to connect to the Smart Ration Queue server. Please verify the Spring Boot backend is running on http://localhost:8080.';
  }

  const { status, data } = error.response;

  // Extract message from response if backend provided one
  let serverMessage = '';
  if (typeof data === 'string') {
    serverMessage = data;
  } else if (data && typeof data === 'object') {
    serverMessage = data.message || data.error || data.detail || '';
  }

  // Handle specific HTTP Status codes
  switch (status) {
    case 400:
      return serverMessage || 'Invalid request. Please check your inputs or slot availability.';
    case 401:
      return serverMessage || 'Authentication required. Your session may have expired. Please login again.';
    case 403:
      return serverMessage || 'Access denied. You do not have permission to perform this action.';
    case 404:
      return serverMessage || 'Requested resource, queue slot, or ration card not found.';
    case 409:
      return serverMessage || 'Conflict occurred: Duplicate booking or the selected slot is already full.';
    case 500:
      return 'Server encountered an internal error. Please try again later.';
    default:
      return serverMessage || fallbackMessage;
  }
};
