import { StravaActivitySignals } from '@torq/get-strava-activity-signals';

import { apiRequest } from '../client';
import { API_ENDPOINTS } from '../constants';

/**
 * Fetch specific activity signals by activity ID.
 * @param {string} activityId - Activity ID.
 * @returns {Promise<StravaActivitySignals>} Activity signals.
 */
const fetchActivitySignals = (activityId: string): Promise<StravaActivitySignals> =>
  apiRequest<StravaActivitySignals>(API_ENDPOINTS.STRAVA_ACTIVITY_SIGNALS(activityId));

export default fetchActivitySignals;
