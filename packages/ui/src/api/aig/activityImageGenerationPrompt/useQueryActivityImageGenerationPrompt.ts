'use client';

import { useQuery } from '@tanstack/react-query';
import { StravaActivitySignals } from '@torqlab/get-strava-activity-signals';

import { Options } from '../../types';
import toBase64 from './toBase64';
import { AIG_API_ENDPOINTS } from '../constants';
import queryActivityImageGenerationPrompt from './queryActivityImageGenerationPrompt';

/**
 * Queries Strava activity image generation prompt.
 * @param {StravaActivitySignals | null} activitySignals - Activity signals.
 * @param {Options} [options] - Query options.
 * @param {boolean} [options.skip=false] - Whether to skip the query.
 * @returns {object} Object containing loading state and activity image generation prompt data.
 */
const useQueryActivityImageGenerationPrompt = (
  activitySignals?: StravaActivitySignals | null,
  {
    skip = false,
  }: Options = {},
) =>
  useQuery<string | null>({
    queryKey: [
      AIG_API_ENDPOINTS.PROMPT(
        activitySignals ? toBase64(activitySignals) : '',
      ),
    ],
    /**
     * Queries Strava activity image generation prompt from the internal API.
     * @returns {Promise<string | null>} Activity image generation prompt.
     */
    queryFn: () => {
      if (activitySignals) {
        return queryActivityImageGenerationPrompt(
          activitySignals,
        );
      } else {
        return null;
      }
    },
    enabled: (
      Boolean(activitySignals)
      && !skip
    ),
  });

export default useQueryActivityImageGenerationPrompt;
