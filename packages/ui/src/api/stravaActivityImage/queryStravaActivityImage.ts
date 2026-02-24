import client from '../client';
import { API_ENDPOINTS } from '../constants';
import { Input, Response } from './types';

/**
 * Generates a Strava activity image.
 * @param {Input} input - The input parameters for generating the image.
 * @param {string} input.activityId - The ID of the activity to generate an image for.
 * @param {string} input.prompt - The prompt to use for image generation.
 * @returns {Promise<string | null>} The generated image data or null if not available.
 */
const queryStravaActivityImage = async ({
  activityId,
  prompt,
}: Input): Promise<string | null> => {
  const response = await client<Response>(
    API_ENDPOINTS.STRAVA_ACTIVITY_IMAGE_GENERATOR(activityId, prompt),
  );

  return response?.image?.imageData ?? null;
}

export default queryStravaActivityImage;
