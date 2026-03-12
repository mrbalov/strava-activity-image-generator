import { STRAVA_API_ENDPOINTS } from '@/api/strava';
import HomePage from '@/components/pages/HomePage';

/**
 * Home page.
 * @returns {JSX.Element} Home page.
 */
const Page = (): JSX.Element => (
  <HomePage
    authUrl={STRAVA_API_ENDPOINTS.STRAVA_AUTH}
  />
);

export default Page;
  