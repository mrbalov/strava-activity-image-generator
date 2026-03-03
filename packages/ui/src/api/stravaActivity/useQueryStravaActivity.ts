import { useQuery } from '@tanstack/react-query';
import type { StravaActivity } from '@torqlab/strava-api';

import { API_ENDPOINTS } from '../constants';
import { Options } from '../types';

/**
 * Queries a specific Strava activity.
 * @param {string} [activityId] - Activity ID to query.
 * @param {Options} [options] - Query options.
 * @param {boolean} [options.skip=false] - Whether to skip the query.
 * @returns {object} Strava activity data.
 */
const useQueryStravaActivity = (
  activityId?: string,
  {
    skip = false,
  }: Options = {},
) =>
  useQuery<StravaActivity | null>({
    queryKey: [API_ENDPOINTS.STRAVA_ACTIVITY(activityId ?? '')],
    /**
     * Queries a specific Strava activity from the internal API.
     * @returns {Promise<StravaActivity | null>} Strava activity.
     */
    queryFn: async () => {
      if (activityId) {
        const { default: queryStravaActivity } = await import('./queryStravaActivity');

        return queryStravaActivity(activityId);
      } else {
        return null;
      }
    },
    enabled: (
      Boolean(activityId)
      && !skip
    ),
  });

export default useQueryStravaActivity;
