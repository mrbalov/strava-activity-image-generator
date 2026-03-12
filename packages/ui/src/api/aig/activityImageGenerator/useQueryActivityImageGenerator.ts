'use client';

import { useQuery } from '@tanstack/react-query';

import queryActivityImage from './queryActivityImageGenerator';
import { Options } from '../../types';
import { AIG_API_ENDPOINTS } from '../constants';

/**
 * Generates a Strava activity image.
 * @param {string} prompt - The prompt to use for image generation.
 * @param {Options} [options] - Additional options for image generation.
 * @param {boolean} [options.skip] - Whether to skip image generation.
 * @returns {object} An object containing the loading state, loaded state, and the generated image data.
 */
const useQueryActivityImageGenerator = (
  prompt?: string | null,
  {
    skip = false,
  }: Options = {},
) =>
  useQuery<string | null>({
    queryKey: [
      AIG_API_ENDPOINTS.GENERATOR(
        prompt ?? '',
      ),
    ],
    /**
     * Queries Strava activity image generator from the internal API.
     * @returns {Promise<string | null>} Strava activity image.
     */
    queryFn: () => {
      if (prompt) {
        return queryActivityImage(prompt);
      } else {
        return null;
      }
    },
    enabled: (
      Boolean(prompt)
      && !skip
    ),
  });

export default useQueryActivityImageGenerator;
