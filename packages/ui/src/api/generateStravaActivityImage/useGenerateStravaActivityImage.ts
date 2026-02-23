'use client';

import { useState, useEffect } from 'react';

import generateStravaActivityImage from './generateStravaActivityImage';
import { Input, Options, ResponseImage } from './types';

/**
 * Generates a Strava activity image.
 * @param {Input} input - The input parameters for image generation.
 * @param {string} [input.activityId] - The ID of the activity to generate an image for.
 * @param {string} [input.prompt] - The prompt to use for image generation.
 * @param {Options} [options] - Additional options for image generation.
 * @param {boolean} [options.skip] - Whether to skip image generation.
 * @returns {object} An object containing the loading state, loaded state, and the generated image data.
 */
const useGenerateStravaActivityImage = (
  {
    activityId,
    prompt,
  }: Partial<Input>,
  {
    skip = false,
  }: Options = {},
) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [data, setData] = useState<ResponseImage | null>(null);

  useEffect(() => {
    if (!isLoading && !isLoaded && activityId && prompt && !skip) {
      setIsLoading(true);

      generateStravaActivityImage({ activityId, prompt })
        .then((response) => {
          setData(response);
          setIsLoaded(true);
        })
        .catch((error) => {
          console.error('Error generating Strava activity image:', error);
          setData(null);
        })
        .finally(() => {
          setIsLoading(false);
          setIsLoaded(true);
        });
    }
  }, [activityId, prompt, skip]);

  return {
    isLoading,
    isLoaded,
    data,
  };
};

export default useGenerateStravaActivityImage;
