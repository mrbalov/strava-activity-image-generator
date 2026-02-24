'use client';

import { useQuery } from '@tanstack/react-query';

import { StravaActivitySignals } from '@torq/get-strava-activity-signals';

import queryStravaActivitySignals from './queryStravaActivitySignals';
import { API_ENDPOINTS } from '../constants';

/**
 * Queries Strava activity signals.
 * @param {string} [activityId] - Strava activity ID to query signals for.
 * @returns {object} Object containing loading state and activity signals data.
 */
const useQueryStravaActivitySignals = (activityId?: string | null) =>
  useQuery<StravaActivitySignals | null>({
    queryKey: [API_ENDPOINTS.STRAVA_ACTIVITY_SIGNALS(activityId ?? '')],
    /**
     * Queries Strava activity signals from the internal API.
     * @returns {Promise<StravaActivitySignals | null>} Strava activity signals.
     */
    queryFn: () => {
      if (activityId) {
        return queryStravaActivitySignals(activityId);
      } else {
        return null;
      }
    },
    enabled: Boolean(activityId),
  });

export default useQueryStravaActivitySignals;
