import getStravaActivitySignals from '@torqlab/get-strava-activity-signals';
import type { StravaActivity } from '@torqlab/get-strava-activity-signals';
import checkForbiddenContent from '@torq/check-forbidden-content';

/**
 * Handles POST /strava/activities/:id/signals - Generates signals from Strava activity data.
 * @param {Request} request - HTTP request with Strava activity data in JSON body
 * @returns {Promise<Response>} JSON response with activity signals or error
 */
const stravaActivitySignals = async (request: Request): Promise<Response> => {
  try {
    const activity = (await request.json()) as StravaActivity;
    const signals = getStravaActivitySignals(activity, checkForbiddenContent);

    return new Response(JSON.stringify(signals), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch {
    return new Response(
      JSON.stringify({
        error: 'Bad Request',
        message: 'Failed to process activity data.',
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }
};

export default stravaActivitySignals;
