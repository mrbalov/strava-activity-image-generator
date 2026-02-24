'use client';

import StravaActivityImageGenerator from '@/components/organisms/StravaActivityImageGenerator';

import Title from './Title';

interface ActivityArtPageProps {
  withImageGeneration: boolean;
  activityId: string;
}

/**
 * Activity art page.
 * @param {ActivityArtPageProps} props - Component props.
 * @param {boolean} props.withImageGeneration - Whether to allow image generation.
 * @param {string} props.activityId - Strava activity ID.
 * @returns {JSX.Element} Activity art page component.
 */
const ActivityArtPage = ({
  withImageGeneration,
  activityId,
}: ActivityArtPageProps) => (
  <StravaActivityImageGenerator
    activityId={activityId}
    withImageGeneration={withImageGeneration}
    Header={({ isLoading, isError }) => (
      <Title
        isLoading={isLoading}
        isError={isError}
      />
    )}
  />
);

export default ActivityArtPage;
