import { StravaActivity } from '@torq/strava-api';

import { API_ENDPOINTS } from '../constants';
import client from '../client';

/**
 * Query specific activity by ID.
 * @param {string} id - Activity ID
 * @returns {Promise<StravaActivity>} Activity data
 */
const queryStravaActivity = (id: string): Promise<StravaActivity | null> =>
  client<StravaActivity>(API_ENDPOINTS.STRAVA_ACTIVITY(id));

export default queryStravaActivity;
