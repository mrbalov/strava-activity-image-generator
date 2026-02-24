import client from '../client';
import { API_ENDPOINTS } from '../constants';
import { Input, Response } from './types';

/**
 * Query specific activity image generation prompt by activity ID.
 * @param {Input} input - Input parameters.
 * @param {string} input.activityId - Activity ID.
 * @param {StravaActivitySignals} input.activitySignals - Activity signals.
 * @returns {Promise<string | null>} Activity image generation prompt.
 */
const queryActivityImageGenerationPrompt = async ({
  activityId,
  activitySignals,
}: Input): Promise<string | null> => {
  const signalsBase64 = btoa(JSON.stringify(activitySignals));
  const response = await client<Response>(
    API_ENDPOINTS.STRAVA_ACTIVITY_IMAGE_GENERATION_PROMPT(activityId, signalsBase64),
  );

  return response?.prompt || null;
};

export default queryActivityImageGenerationPrompt;
