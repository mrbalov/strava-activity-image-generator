import { StravaActivity } from '@torq/strava-api';

import { apiRequest } from '../client';
import { API_ENDPOINTS } from '../constants';

/**
 * Fetches Strava activities.
 * @returns {Promise<StravaActivity[]>} Strava activities.
 */
const fetchStravaActivities = (): Promise<StravaActivity[]> =>
  apiRequest<StravaActivity[]>(API_ENDPOINTS.STRAVA_ACTIVITIES);

export default fetchStravaActivities;
