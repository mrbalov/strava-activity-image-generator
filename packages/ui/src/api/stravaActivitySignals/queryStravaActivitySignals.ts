import { StravaActivitySignals } from '@torq/get-strava-activity-signals';

import client from '../client';
import { API_ENDPOINTS } from '../constants';

/**
 * Query specific activity signals by activity ID.
 * @param {string} activityId - Activity ID.
 * @returns {Promise<StravaActivitySignals>} Activity signals.
 */
const queryStravaActivitySignals = (
  activityId: string,
): Promise<StravaActivitySignals | null> =>
  client<StravaActivitySignals>(API_ENDPOINTS.STRAVA_ACTIVITY_SIGNALS(activityId));

export default queryStravaActivitySignals;
