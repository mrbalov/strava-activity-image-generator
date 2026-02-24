'use client';

import { useQuery } from '@tanstack/react-query';

import { API_ENDPOINTS } from '../constants';

/**
 * Checks authentication status.
 * @returns {object} Authentication status data.
 */
const useQueryAuthStatus = () =>
  useQuery({
    queryKey: [API_ENDPOINTS.AUTH_STATUS],
    /**
     * Queries authentication status from the internal API.
     * @returns {Promise<boolean>} Authentication status.
     */
    queryFn: async (): Promise<boolean> => {
      const { default: queryAuthStatus } = await import('./queryAuthStatus');

      return queryAuthStatus();
    },
  });

export default useQueryAuthStatus;
