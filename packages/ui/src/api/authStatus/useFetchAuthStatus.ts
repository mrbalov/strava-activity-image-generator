'use client';

import { useQuery } from '@tanstack/react-query';

import { API_ENDPOINTS } from '../constants';

/**
 * Checks authentication status.
 * @returns {object} Authentication status data.
 */
const useFetchAuthStatus = () =>
  useQuery({
    queryKey: [API_ENDPOINTS.AUTH_STATUS],
    /**
     * Fetches authentication status from the internal API.
     * @returns {Promise<boolean>} Authentication status.
     */
    queryFn: async (): Promise<boolean> => {
      const { default: fetchAuthStatus } = await import('./fetchAuthStatus');

      return fetchAuthStatus();
    },
  });

export default useFetchAuthStatus;
