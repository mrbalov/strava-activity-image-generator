const env = {
  api: {
    gateway: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000',
    aig: (
      process.env.NEXT_PUBLIC_ACTIVITY_IMAGE_GENERATOR_URL ?? 'http://localhost:3002'
    ),
  },

  /**
   * Allows to enable or disable image generation feature.
   * Default is `false` (disabled). Save AI costs.
   * Can be set via environment variable `NEXT_PUBLIC_WITH_IMAGE_GENERATION`.
   * Set to 'true' or '1' to enable.
   */
  withImageGeneration: (
    process.env.NEXT_PUBLIC_WITH_IMAGE_GENERATION === 'true'
    || process.env.NEXT_PUBLIC_WITH_IMAGE_GENERATION === '1'
  ),
};

export default env;
