import { StravaActivity } from '@torq/strava-api';

import env from '@/env';

import { apiRequest } from './client';
import { API_ENDPOINTS } from './constants';

/**
 * Initiate OAuth flow by redirecting to backend auth endpoint.
 * Uses full URL for redirect (can't use relative URL for window.location.href).
 * @returns {void}
 */
export function authorizeStrava(): void {
  window.location.href = `${env.apiUrl}${API_ENDPOINTS.STRAVA_AUTH}`;
}

/**
 * Fetch specific activity by ID.
 * @param {string} id - Activity ID
 * @returns {Promise<StravaActivity>} Activity data
 */
export async function fetchActivity(id: string): Promise<StravaActivity> {
  return apiRequest<StravaActivity>(API_ENDPOINTS.STRAVA_ACTIVITY(id));
}

/**
 * Fetch specific activity signals by activity ID.
 * @param {string} id - Activity ID.
 * @returns {Promise<StravaActivity>} Activity signals.
 */
export async function fetchActivitySignals(id: string): Promise<StravaActivity> {
  return apiRequest<StravaActivity>(API_ENDPOINTS.STRAVA_ACTIVITY_SIGNALS(id));
}
