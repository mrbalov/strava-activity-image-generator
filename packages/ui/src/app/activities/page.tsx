import ActivitiesPage from '@/components/pages/ActivitiesPage';
import env from '@/env';

/**
 * Activities page.
 * @returns {JSX.Element} Activities page.
 */
const Page = (): JSX.Element => (
  <ActivitiesPage
    withImageGeneration={env.withImageGeneration}
  />
);

export default Page;
