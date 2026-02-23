'use client';

import { useMemo } from 'react';

interface TitleProps {
  isLoading: boolean;
  isLoaded: boolean;
}

/**
 * Page title.
 * @param {TitleProps} props - Component props.
 * @param {boolean} props.isLoading - Whether the image is being generated.
 * @param {boolean} props.isLoaded - Whether the image has been generated.
 * @returns {JSX.Element} Page title component.
 */
const Title = ({ isLoading, isLoaded }: TitleProps) => {
  const title = useMemo(() => {
    if (isLoading) {
      return 'AI is Generating Image...';
    } else if (isLoaded) {
      return 'AI-Generated Image';
    } else {
      return 'AI Image Generation';
    }
  }, [isLoading, isLoaded]);

  return (
    <h1>{title}</h1>
  );
};

export default Title;
