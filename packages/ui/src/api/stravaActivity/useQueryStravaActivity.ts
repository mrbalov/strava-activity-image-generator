import { useQuery } from '@tanstack/react-query';
import { StravaActivity } from '@torq/strava-api';

import { API_ENDPOINTS } from '../constants';

/**
 * Queries a specific Strava activity.
 * @param {string} activityId - Activity ID to query.
 * @returns {object} Strava activity data.
 */
const useQueryStravaActivity = (activityId: string) =>
  useQuery<StravaActivity | null>({
    queryKey: [API_ENDPOINTS.STRAVA_ACTIVITY(activityId)],
    /**
     * Queries a specific Strava activity from the internal API.
     * @returns {Promise<StravaActivity | null>} Strava activity.
     */
    queryFn: async () => {
      const { default: queryStravaActivity } = await import('./queryStravaActivity');

      return queryStravaActivity(activityId);
    },
  });

export default useQueryStravaActivity;
