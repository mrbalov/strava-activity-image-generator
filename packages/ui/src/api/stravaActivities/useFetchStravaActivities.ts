import { useQuery } from '@tanstack/react-query';

import { API_ENDPOINTS } from '../constants';

/**
 * Fetches Strava activities.
 * @returns {object} Strava activities data.
 */
const useFetchStravaActivities = () =>
  useQuery({
    queryKey: [API_ENDPOINTS.STRAVA_ACTIVITIES],
    /**
     * Fetches Strava activities from the internal API.
     * @returns {Promise<StravaActivity[]>} Strava activities.
     */
    queryFn: async () => {
      const { default: fetchStravaActivities } = await import('./fetchStravaActivities');

      return fetchStravaActivities();
    },
  });

export default useFetchStravaActivities;
