'use client';

import { useQuery } from '@tanstack/react-query';

import { STRAVA_API_ENDPOINTS } from '../constants';

/**
 * Checks authentication status.
 * @returns {object} Authentication status data.
 */
const useQueryAuthStatus = () =>
  useQuery<boolean | null>({
    queryKey: [STRAVA_API_ENDPOINTS.AUTH_STATUS],
    /**
     * Queries authentication status from the internal API.
     * @returns {Promise<boolean | null>} Authentication status.
     */
    queryFn: async (): Promise<boolean | null> => {
      const { default: queryAuthStatus } = await import('./queryAuthStatus');

      return queryAuthStatus();
    },
  });

export default useQueryAuthStatus;
