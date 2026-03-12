/**
 * Base API client with cookie-based authentication.
 * Communicates with /packages/server backend.
 */

import env from '@/env';

import { STATUS_CODES } from './constants';

interface Options<T> {
  init?: RequestInit;
  on401?: () => Promise<T | null>;
}

/**
 * Handles 401 Unauthorized responses by logging out the user
 * and redirecting to the homepage.
 * @returns {Promise<null>} Null after handling unauthorized response.
 */
const handle401 = async (): Promise<null> => {
  const { logout } = await import('./strava/logout');

  await logout();
  window.location.replace('/');

  return null;
};

/**
 * Makes an authenticated API request to the backend.
 * 
 * By default, handles unauthorized responses by
 * logging out the user and redirecting to the homepage.
 * 
 * @param {string} endpoint - API endpoint.
 * @param {Options<T>} [options] - Fetch options.
 * @throws {Error} If the request fails with a non-401 error.
 * @returns {Promise<T | null>} Response data.
 */
const client = async <T>(
  endpoint: string,
  options?: Options<T>,
): Promise<T | null> => {
  const response = await fetch(endpoint, {
    ...options?.init,
    credentials: 'include', // Include cookies.
    headers: {
      'Content-Type': 'application/json',
      ...options?.init?.headers,
    },
  });
  const isUnauthorized = (
    !response.ok
    && response.status === STATUS_CODES.UNAUTHORIZED
  );

  if (isUnauthorized) {
    console.error('Unauthorized!');

    if (options?.on401) {
      return await options.on401();
    } else {
      return await handle401();
    }
  } else if (!response.ok) {
    throw new Error(
      `Request to "${endpoint}" failed: ${response.status} ${response.statusText}`,
    );
  } else {
    return response.json() as Promise<T>;
  }
};

export default client;
