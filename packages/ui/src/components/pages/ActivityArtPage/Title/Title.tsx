'use client';

import { useMemo } from 'react';

interface TitleProps {
  isLoading: boolean;
  isError: boolean;
}

/**
 * Page title.
 * @param {TitleProps} props - Component props.
 * @param {boolean} props.isLoading - Whether the image is being generated.
 * @param {boolean} props.isError - Whether there was an error generating the image.
 * @returns {JSX.Element} Page title component.
 */
const Title = ({ isLoading, isError }: TitleProps) => {
  const title = useMemo(() => {
    if (isLoading) {
      return 'AI is Generating Image...';
    } else if (isError) {
      return 'Failed to Generate AI Image';
    } else {
      return 'AI-Generated Image';
    }
  }, [isLoading, isError]);

  return (
    <h1 className="text-3xl font-bold">{title}</h1>
  );
};

export default Title;
