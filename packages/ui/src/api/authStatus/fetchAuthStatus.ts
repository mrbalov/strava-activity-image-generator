import { APIError, apiRequest } from '../client';
import { API_ENDPOINTS, STATUS_CODES } from '../constants';

/**
 * Fetch authentication status.
 * @returns {Promise<boolean>} Authentication status.
 */
const fetchAuthStatus = async (): Promise<boolean> => {
  try {
    await apiRequest<{ authenticated: boolean }>('/strava/auth/status');
    
    return true;
  } catch (error) {
    const { status } = error as unknown as APIError;
    const isUnauthorized = status === STATUS_CODES.UNAUTHORIZED;

    if (isUnauthorized) {
      return false;
    } else {
      // Network errors: assume not authenticated.
      return false;
    }
  }
}
  apiRequest<Response>(API_ENDPOINTS.AUTH_STATUS);

export default fetchAuthStatus;
