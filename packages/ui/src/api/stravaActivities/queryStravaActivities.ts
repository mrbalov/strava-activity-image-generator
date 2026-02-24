import { StravaActivity } from '@torq/strava-api';

import client from '../client';
import { API_ENDPOINTS } from '../constants';

/**
 * Queries Strava activities.
 * @returns {Promise<StravaActivity[]>} Strava activities.
 */
const queryStravaActivities = (): Promise<StravaActivity[] | null> =>
  client<StravaActivity[]>(API_ENDPOINTS.STRAVA_ACTIVITIES);

export default queryStravaActivities;
