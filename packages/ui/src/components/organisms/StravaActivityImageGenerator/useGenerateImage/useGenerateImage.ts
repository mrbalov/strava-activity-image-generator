'use client';

import { useEffect } from 'react';

import {
  useQueryStravaActivityImage,
  useQueryStravaActivityImageGenerationPrompt,
  useQueryStravaActivitySignals,
} from '@/api';

/**
 * Generates Strava activity image.
 * @param {boolean} withImageGeneration - Whether to allow image generation.
 * @param {string} [activityId] - Strava activity ID.
 * @returns {object} Image generation state and data.
 */
const useGenerateImage = (withImageGeneration: boolean, activityId?: string) => {
  const signalsData = useQueryStravaActivitySignals(activityId);
  const promptData = useQueryStravaActivityImageGenerationPrompt({
    activitySignals: signalsData.data ?? undefined,
    activityId: activityId ?? undefined,
  });
  const shouldSkipImageGeneration = (
    !withImageGeneration
    || !activityId
    || !signalsData.data
    || !promptData.data
  );
  const imageData = useQueryStravaActivityImage({
    activityId: activityId ?? undefined,
    prompt: promptData.data ?? undefined,
  }, {
    skip: shouldSkipImageGeneration,
  });

  useEffect(() => {
    if (!withImageGeneration) {
      console.warn('Image generation is disabled by env settings.');
    }
  }, [withImageGeneration]);

  return {
    isLoading: signalsData.isLoading || promptData.isLoading || imageData.isLoading,
    isError: signalsData.isError || promptData.isError || imageData.isError,
    signals: signalsData.data,
    prompt: promptData.data,
    image: imageData.data,
    isSignalsLoading: signalsData.isLoading,
    isPromptLoading: promptData.isLoading,
    isImageLoading: imageData.isLoading,
    isSignalsError: signalsData.isError,
    isPromptError: promptData.isError,
    isImageError: imageData.isError,
  };
};

export default useGenerateImage;
