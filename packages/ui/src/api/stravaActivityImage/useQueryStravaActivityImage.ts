'use client';

import { useQuery } from '@tanstack/react-query';

import queryStravaActivityImage from './queryStravaActivityImage';
import { Options } from '../types';
import { Input } from './types';
import { API_ENDPOINTS } from '../constants';

/**
 * Generates a Strava activity image.
 * @param {Input} input - The input parameters for image generation.
 * @param {string} [input.activityId] - The ID of the activity to generate an image for.
 * @param {string} [input.prompt] - The prompt to use for image generation.
 * @param {Options} [options] - Additional options for image generation.
 * @param {boolean} [options.skip] - Whether to skip image generation.
 * @returns {object} An object containing the loading state, loaded state, and the generated image data.
 */
const useQueryStravaActivityImage = (
  {
    activityId,
    prompt,
  }: Partial<Input>,
  {
    skip = false,
  }: Options = {},
) =>
  useQuery<string | null>({
    queryKey: [
      API_ENDPOINTS.STRAVA_ACTIVITY_IMAGE_GENERATOR(
        activityId ?? '',
        prompt ?? '',
      ),
    ],
    /**
     * Queries Strava activity image generator from the internal API.
     * @returns {Promise<string | null>} Strava activity image.
     */
    queryFn: () => {
      if (activityId && prompt) {
        return queryStravaActivityImage({
          activityId,
          prompt,
        });
      } else {
        return null;
      }
    },
    enabled: (
      Boolean(activityId)
      && Boolean(prompt)
      && !skip
    ),
  });

export default useQueryStravaActivityImage;
