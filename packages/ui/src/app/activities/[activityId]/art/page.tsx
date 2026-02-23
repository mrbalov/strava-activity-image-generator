import env from '@/env';
import ActivityArtPage from '@/components/pages/ActivityArtPage';

interface PageProps {
  params: {
    activityId: string;
  };
}

/**
 * Activity art page.
 * @param {PageProps} props - Component props.
 * @returns {JSX.Element} Activity art page component.
 */
const Page = ({
  params,
}: PageProps) => params.activityId ? (
  <ActivityArtPage
    activityId={params.activityId}
    withImageGeneration={env.withImageGeneration}
  />
) : null;

export default Page;
