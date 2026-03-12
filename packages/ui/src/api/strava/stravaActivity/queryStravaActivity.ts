import type { StravaActivity } from '@torqlab/strava-api';

import { STRAVA_API_ENDPOINTS } from '../constants';
import client from '../../client';

/**
 * Query specific activity by ID.
 * @param {string} id - Activity ID.
 * @throws {Error} If the request fails with a non-401 error.
 * @returns {Promise<StravaActivity | null>} Activity data.
 */
const queryStravaActivity = (id: string): Promise<StravaActivity | null> =>
  client<StravaActivity | null>(STRAVA_API_ENDPOINTS.STRAVA_ACTIVITY(id));

export default queryStravaActivity;
