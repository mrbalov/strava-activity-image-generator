import client from '../../client';
import { Response } from './types';
import { STRAVA_API_ENDPOINTS } from '../constants';

/**
 * Query authentication status.
 * @returns {Promise<boolean | null>} Authentication status.
 */
const queryAuthStatus = async (): Promise<boolean | null> => {
  try {
    const response = await client<Response>(
      STRAVA_API_ENDPOINTS.AUTH_STATUS,
      {
        /**
         * Handles 401 Unauthorized response by returning
         * a comparible response instead of throwing an error.
         * @returns {Promise<Response>} Authentication status response.
         */
        on401: () => Promise.resolve({ authenticated: false }),
      },
    );

    return response?.authenticated ?? false;    
  } catch {
    return false;
  }
}

export default queryAuthStatus;
