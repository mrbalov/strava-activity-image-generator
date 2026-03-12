import { StravaActivitySignals } from '@torqlab/get-strava-activity-signals';

import client from '../../client';
import { AIG_API_ENDPOINTS } from '../constants';
import toBase64 from './toBase64';
import { Response } from './types';

/**
 * Query specific activity image generation prompt by activity signals.
 * @param {StravaActivitySignals} activitySignals - Activity signals.
 * @returns {Promise<string | null>} Activity image generation prompt.
 */
const queryActivityImageGenerationPrompt = async (
  activitySignals: StravaActivitySignals,
): Promise<string | null> => {
  const response = await client<Response>(
    AIG_API_ENDPOINTS.PROMPT(
      toBase64(activitySignals),
    ),
  );

  return response?.prompt || null;
};

export default queryActivityImageGenerationPrompt;
