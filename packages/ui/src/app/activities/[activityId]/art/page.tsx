import env from '@/env';
import ActivityArtPage from '@/components/pages/ActivityArtPage';

interface PageProps {
  params: Promise<{
    activityId: string;
  }>;
}

/**
 * Activity art page.
 * @param {PageProps} props - Component props.
 * @returns {Promise<JSX.Element>} Activity art page component.
 */
const Page = async ({
  params,
}: PageProps): Promise<JSX.Element> => {
  const { activityId } = await params;
  
  return activityId ? (
    <ActivityArtPage
      activityId={activityId}
      withImageGeneration={env.withImageGeneration}
    />
  ) : <div />;
};

export default Page;
