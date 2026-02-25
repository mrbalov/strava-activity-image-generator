import { StravaActivitySignals } from '@torq/get-strava-activity-signals';

import client from '../client';
import { API_ENDPOINTS } from '../constants';
import { StravaActivity } from '@torq/strava-api';

/**
 * Query specific activity signals.
 * @param {StravaActivity} activity - Strava activity data.
 * @returns {Promise<StravaActivitySignals>} Activity signals.
 */
const queryStravaActivitySignals = (
  activity: StravaActivity,
): Promise<StravaActivitySignals | null> =>
  client<StravaActivitySignals>(
    API_ENDPOINTS.STRAVA_ACTIVITY_SIGNALS(
      activity.id ? String(activity.id) : '',
    ),
    {
      init: {
        method: 'POST',
        body: JSON.stringify(activity),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    },
  );

export default queryStravaActivitySignals;
