import { useQuery } from '@tanstack/react-query';

import { API_ENDPOINTS } from '../constants';

/**
 * Queries Strava activities.
 * @returns {object} Strava activities data.
 */
const useQueryStravaActivities = () =>
  useQuery({
    queryKey: [API_ENDPOINTS.STRAVA_ACTIVITIES],
    /**
     * Queries Strava activities from the internal API.
     * @returns {Promise<StravaActivity[]>} Strava activities.
     */
    queryFn: async () => {
      const { default: queryStravaActivities } = await import('./queryStravaActivities');

      return queryStravaActivities();
    },
  });

export default useQueryStravaActivities;
