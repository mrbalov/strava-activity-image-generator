export const API_ENDPOINTS = {
  AUTH_STATUS: '/strava/auth/status',

  STRAVA_LOGOUT: '/strava/logout',
  STRAVA_AUTH_STATUS: '/strava/auth/status',
  STRAVA_AUTH: '/strava/auth',
  STRAVA_ACTIVITIES: '/strava/activities',

  /**
   * Builds endpoint for fetching specific activity by ID.
   * @param {string} id - Activity ID.
   * @returns {string} Endpoint URL.
   */
  STRAVA_ACTIVITY: (id: string) => `/strava/activity/${id}`,

  /**
   * Builds endpoint for fetching activity signals by activity ID.
   * @param {string} id - Activity ID.
   * @returns {string} Endpoint URL.
   */
  STRAVA_ACTIVITY_SIGNALS: (id: string) => `/strava/activities/${id}/signals`,

  
  /**
   * Builds endpoint for generating Strava activity image.
   * @param {string} activityId - Activity ID.
   * @param {string} prompt - Image generation prompt.
   * @returns {string} Endpoint URL.
   */
  STRAVA_ACTIVITY_IMAGE_GENERATOR: (activityId: string, prompt: string) =>
    `/strava/activities/${activityId}/image-generator?prompt=${encodeURIComponent(prompt)}`,

  /**
   * Builds endpoint for fetching Strava activity image generation prompt.
   * @param {string} activityId - Activity ID.
   * @param {string} signalsBase64 - Base64 encoded activity signals.
   * @returns {string} Endpoint URL.
   */
  STRAVA_ACTIVITY_IMAGE_GENERATION_PROMPT: (activityId: string, signalsBase64: string) =>
    `/strava/activities/${activityId}/image-generator/prompt?signals=${signalsBase64}`,
};

export const STATUS_CODES = {
  UNAUTHORIZED: 401,
};
