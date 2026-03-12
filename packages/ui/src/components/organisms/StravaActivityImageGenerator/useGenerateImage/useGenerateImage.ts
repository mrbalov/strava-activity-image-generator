'use client';

import { useEffect } from 'react';

import {
  useQueryStravaActivity,
  useQueryStravaActivitySignals,
} from '@/api/strava';
import {
  useQueryActivityImageGenerator,
  useQueryActivityImageGenerationPrompt,
} from '@/api/aig';

/**
 * Generates Strava activity image.
 * @param {boolean} withImageGeneration - Whether to allow image generation.
 * @param {string} [activityId] - Strava activity ID.
 * @returns {object} Image generation state and data.
 */
const useGenerateImage = (
  withImageGeneration: boolean,
  activityId?: string,
) => {
  const activityData = useQueryStravaActivity(
    activityId ?? '',
    {
      skip: !activityId,
    },
  );
  const signalsData = useQueryStravaActivitySignals(
    activityData.data,
    {
      skip: !activityData.data,
    },
  );
  const promptData = useQueryActivityImageGenerationPrompt(
    signalsData.data,
    {
      skip: !signalsData.data,
    },
  );
  const imageData = useQueryActivityImageGenerator(
    promptData.data,
    {
      skip: (
        !promptData.data
        || !withImageGeneration
      ),
    },
  );

  useEffect(() => {
    if (!withImageGeneration) {
      console.warn('Image generation is disabled by env settings.');
    }
  }, [withImageGeneration]);

  return {
    isLoading: (
      activityData.isLoading
      || signalsData.isLoading
      || promptData.isLoading
      || imageData.isLoading
    ),
    isError: (
      activityData.isError
      || signalsData.isError
      || promptData.isError
      || imageData.isError
    ),
    activity: activityData.data,
    signals: signalsData.data,
    prompt: promptData.data,
    image: imageData.data,
    isActivityLoading: activityData.isLoading,
    isSignalsLoading: signalsData.isLoading,
    isPromptLoading: promptData.isLoading,
    isImageLoading: imageData.isLoading,
    isActivityError: activityData.isError,
    isSignalsError: signalsData.isError,
    isPromptError: promptData.isError,
    isImageError: imageData.isError,
  };
};

export default useGenerateImage;
