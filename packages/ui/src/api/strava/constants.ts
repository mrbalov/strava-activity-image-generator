import env from '@/env';

export const STRAVA_API_ENDPOINTS = {
  AUTH_STATUS: `${env.api.gateway}/strava/auth/status`,

  STRAVA_LOGOUT: `${env.api.gateway}/strava/logout`,
  STRAVA_AUTH_STATUS: `${env.api.gateway}/strava/auth/status`,
  STRAVA_AUTH: `${env.api.gateway}/strava/auth`,
  STRAVA_ACTIVITIES: `${env.api.gateway}/strava/activities`,

  /**
   * Builds endpoint for fetching specific activity by ID.
   * @param {string} id - Activity ID.
   * @returns {string} Endpoint URL.
   */
  STRAVA_ACTIVITY: (id: string) =>
    `${env.api.gateway}/strava/activity/${id}`,

  /**
   * Builds endpoint for fetching activity signals by activity ID.
   * @param {string} id - Activity ID.
   * @returns {string} Endpoint URL.
   */
  STRAVA_ACTIVITY_SIGNALS: (id: string) =>
    `${env.api.gateway}/strava/activities/${id}/signals`,
};
