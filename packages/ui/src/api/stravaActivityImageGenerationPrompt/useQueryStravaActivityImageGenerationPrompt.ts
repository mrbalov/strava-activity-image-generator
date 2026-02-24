'use client';

import { useQuery } from '@tanstack/react-query';

import { Input } from './types';
import toBase64 from './toBase64';
import { API_ENDPOINTS } from '../constants';
import queryActivityImageGenerationPrompt from './queryStravaActivityImageGenerationPrompt';

/**
 * Queries Strava activity image generation prompt.
 * @param {Input} input - Input parameters.
 * @param {string} [input.activityId] - Activity ID.
 * @param {StravaActivitySignals} [input.activitySignals] - Activity signals.
 * @returns {object} Object containing loading state and activity image generation prompt data.
 */
const useQueryStravaActivityImageGenerationPrompt = ({
  activityId,
  activitySignals,
}: Partial<Input>) =>
  useQuery<string | null>({
    queryKey: [
      API_ENDPOINTS.STRAVA_ACTIVITY_IMAGE_GENERATION_PROMPT(
        activityId ?? '',
        activitySignals ? toBase64(activitySignals) : '',
      ),
    ],
    /**
     * Queries Strava activity image generation prompt from the internal API.
     * @returns {Promise<string | null>} Activity image generation prompt.
     */
    queryFn: () => {
      if (activityId && activitySignals) {
        return queryActivityImageGenerationPrompt({
          activityId,
          activitySignals,
        });
      } else {
        return null;
      }
    },
    enabled: (
      Boolean(activityId)
      && Boolean(activitySignals)
    ),
  });

export default useQueryStravaActivityImageGenerationPrompt;
