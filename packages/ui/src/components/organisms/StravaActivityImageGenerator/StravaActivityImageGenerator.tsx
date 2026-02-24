'use client';

import Content from './Content';
import useGenerateImage from './useGenerateImage';

interface HeaderProps {
  isLoading: boolean;
  isError: boolean;
}

interface StravaActivityImageGeneratorProps {
  withImageGeneration: boolean;
  activityId?: string | null;
  Header?: React.ComponentType<HeaderProps>;
}

/**
 * Strava activity image generator.
 * @param {StravaActivityImageGeneratorProps} props Component props.
 * @param {string | null} [props.activityId] ID of the activity for which the image is being generated.
 * @param {React.ComponentType<HeaderProps>} [props.Header] Header component.
 * @param {boolean} props.withImageGeneration Whether to allow image generation.
 * @returns {JSX.Element} Strava activity image generator component.
 */
const StravaActivityImageGenerator = ({
  activityId,
  Header,
  withImageGeneration,
}: StravaActivityImageGeneratorProps) => {
  const {
    signals,
    prompt,
    image,
    isSignalsLoading,
    isPromptLoading,
    isImageLoading,
    isSignalsError,
    isPromptError,
    isImageError,
    isLoading,
    isError,
  } = useGenerateImage(withImageGeneration, activityId ?? undefined);

  return (
    <div className="flex flex-col gap-4 w-full">
      {Header && <Header isLoading={isLoading} isError={isError} />}
      <Content
        isSignalsLoading={isSignalsLoading}
        isPromptLoading={isPromptLoading}
        isImageLoading={isImageLoading}
        isSignalsError={isSignalsError}
        isPromptError={isPromptError}
        isImageError={isImageError}
        signals={signals}
        prompt={prompt}
        image={image}
      />
    </div>
  );
};

export default StravaActivityImageGenerator;
