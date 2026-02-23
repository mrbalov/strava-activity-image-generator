import { apiRequest } from '../client';
import { API_ENDPOINTS } from '../constants';

/**
 * Logs out the user by calling the backend logout endpoint.
 * This will clear HTTP-only cookies on the server side.
 * @returns {Promise<void>} Promise that resolves when logout is complete.
 */
const logout = async (): Promise<void> => {
  await apiRequest<void>(API_ENDPOINTS.STRAVA_LOGOUT, {
    method: 'POST',
    credentials: 'include', // Include cookies.
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export default logout;
