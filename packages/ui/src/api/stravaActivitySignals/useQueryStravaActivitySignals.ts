'use client';

import { useEffect, useState } from 'react';
import { StravaActivitySignals } from '@torq/get-strava-activity-signals';
import queryStravaActivitySignals from './queryStravaActivitySignals';

/**
 * Queries Strava activity signals.
 * @param {string} [activityId] - Strava activity ID to query signals for.
 * @returns {object} Object containing loading state and activity signals data.
 */
const useQueryStravaActivitySignals = (activityId?: string | null) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [data, setData] = useState<StravaActivitySignals | null>(null);

  useEffect(() => {
    if (!isLoading && !isLoaded && activityId) {
      setIsLoading(true);

      queryStravaActivitySignals(activityId)
        .then((response) => {
          setData(response);
          setIsLoaded(true);
        })
        .catch((error) => {
          console.error('Error querying Strava activity signals:', error);
          setData(null);
        })
        .finally(() => {
          setIsLoading(false);
          setIsLoaded(true);
        });
    }
  }, [activityId]);

  return {
    isLoading,
    isLoaded,
    data,
  };
};

export default useQueryStravaActivitySignals;
