import type { StravaActivity } from '@torqlab/strava-api';

import client from '../../client';
import { STRAVA_API_ENDPOINTS } from '../constants';

/**
 * Queries Strava activities.
 * @returns {Promise<StravaActivity[] | null>} Strava activities.
 */
const queryStravaActivities = (): Promise<StravaActivity[] | null> =>
  client<StravaActivity[]>(STRAVA_API_ENDPOINTS.STRAVA_ACTIVITIES);

export default queryStravaActivities;
