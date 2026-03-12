import type { StravaActivitySignals } from '@torqlab/get-strava-activity-signals';

/**
 * Converts Strava activity signals to a Base64-encoded string.
 * @param {StravaActivitySignals} input - The activity signals to be encoded.
 * @returns {string} Base64-encoded string.
 */
const toBase64 = (input: StravaActivitySignals): string =>
  btoa(JSON.stringify(input));

export default toBase64;
