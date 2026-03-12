import env from '@/env';

export const AIG_API_ENDPOINTS = {
  /**
   * Builds endpoint for fetching activity image generation prompt.
   * @param {string} signalsBase64 - Base64 encoded activity signals.
   * @returns {string} Endpoint URL.
   */
  PROMPT: (signalsBase64: string) =>
    `${env.api.aig}/api/v1/prompt?signals=${signalsBase64}`,

  /**
   * Builds endpoint for generating an activity image.
   * @param {string} prompt - Image generation prompt.
   * @returns {string} Endpoint URL.
   */
  GENERATOR: (prompt: string) =>
    `${env.api.aig}/api/v1/generator?prompt=${encodeURIComponent(prompt)}`,
};
