'use client';

import Content from './Content';
import ExpandableCard from '../ExpandableCard';

interface ImageProps {
  isLoading: boolean;
  isError: boolean;
  image?: string | null;
}

/**
 * Image generation progress.
 * @param {ImageProps} props - Component props.
 * @param {boolean} props.isLoading - Whether the image is being generated.
 * @param {boolean} props.isError - Whether there was an error generating the image.
 * @param {string} [props.error] - Error message if generation failed.
 * @param {Function} props.onRetry - Function to retry image generation.
 * @param {string} [props.image] - Generated image data URL.
 * @param {Function} props.setError - Function to set error message.
 * @returns {JSX.Element} Image generation progress component.
 */
const Image = ({
  isLoading,
  isError,
  image,
}: ImageProps) => (
  <ExpandableCard
    isLoading={isLoading}
    isError={isError}
    hasContent={Boolean(image)}
    minHeight="auto"
    title="Step 4: Creating your activity image with AI"
    pendingMessage="Pending AI image generation for your activity..."
    loadingMessage="Creating your activity image with AI..."
    errorMessage="Failed to generate image for your activity... Let's cry together."
  >
    <Content image={image} />
  </ExpandableCard>
);

export default Image;
