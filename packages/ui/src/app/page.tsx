import env from '@/env';
import { API_ENDPOINTS } from '@/api';
import HomePage from '@/components/pages/HomePage';

/**
 * Home page.
 * @returns {JSX.Element} Home page.
 */
const Page = (): JSX.Element => (
  <HomePage
    authUrl={`${env.apiUrl}${API_ENDPOINTS.STRAVA_AUTH}`}
  />
);

export default Page;
  