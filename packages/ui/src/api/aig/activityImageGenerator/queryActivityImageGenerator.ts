import client from '../../client';
import { AIG_API_ENDPOINTS } from '../constants';
import { Response } from './types';

/**
 * Generates a Strava activity image.
 * @param {string} prompt - The prompt to use for image generation.
 * @returns {Promise<string | null>} The generated image data or null if not available.
 */
const queryActivityImageGenerator = async (
  prompt: string,
): Promise<string | null> => {
  const response = await client<Response>(
    AIG_API_ENDPOINTS.GENERATOR(prompt),
  );

  return response?.image?.imageData ?? null;
}

export default queryActivityImageGenerator;
