'use client';

import type { StravaActivity } from '@torqlab/strava-api';
import { useQuery } from '@tanstack/react-query';
import type { StravaActivitySignals } from '@torqlab/get-strava-activity-signals';

import queryStravaActivitySignals from './queryStravaActivitySignals';
import { API_ENDPOINTS } from '../constants';
import { Options } from '../types';

/**
 * Queries Strava activity signals.
 * @param {StravaActivity} [activity] - Strava activity to query signals for.
 * @param {Options} [options] - Query options.
 * @param {boolean} [options.skip=false] - Whether to skip the query.
 * @returns {object} Object containing loading state and activity signals data.
 */
const useQueryStravaActivitySignals = (
  activity?: StravaActivity | null,
  {
    skip = false,
  }: Options = {},
) =>
  useQuery<StravaActivitySignals | null>({
    queryKey: [
      API_ENDPOINTS.STRAVA_ACTIVITY_SIGNALS(
        activity?.id ? String(activity.id) : '',
      ),
    ],
    /**
     * Queries Strava activity signals from the internal API.
     * @returns {Promise<StravaActivitySignals | null>} Strava activity signals.
     */
    queryFn: () => {
      if (activity?.id) {
        return queryStravaActivitySignals(activity);
      } else {
        return null;
      }
    },
    enabled: (
      Boolean(activity?.id)
      && !skip
    ),
  });

export default useQueryStravaActivitySignals;
