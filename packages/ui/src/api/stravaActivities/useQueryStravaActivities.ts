import { useQuery } from '@tanstack/react-query';
import { StravaActivity } from '@torq/strava-api';

import { API_ENDPOINTS } from '../constants';

/**
 * Queries Strava activities.
 * @returns {object} Strava activities data.
 */
const useQueryStravaActivities = () =>
  useQuery<StravaActivity[] | null>({
    queryKey: [API_ENDPOINTS.STRAVA_ACTIVITIES],
    /**
     * Queries Strava activities from the internal API.
     * @returns {Promise<StravaActivity[] | null>} Strava activities.
     */
    queryFn: async () => {
      const { default: queryStravaActivities } = await import('./queryStravaActivities');

      return queryStravaActivities();
    },
  });

export default useQueryStravaActivities;
