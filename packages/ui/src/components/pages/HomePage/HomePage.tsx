'use client';

import Preloader from '@/components/atoms/Preloader';
import Deferred from '@/components/atoms/Deferred';
import { useQueryAuthStatus } from '@/api';

import useRemoveAuthUrlParams from './useRemoveAuthParams';
import Guest from './Guest';
import Member from './Member';

interface HomePageProps {
  authUrl: string;
}

/**
 * Home page.
 * @param {object} props - Component props.
 * @param {string} props.authUrl - URL to authorize.
 * @returns {JSX.Element} Home page.
 */
const HomePage = ({
  authUrl,
}: HomePageProps): JSX.Element => {
  const authStatusData = useQueryAuthStatus();

  useRemoveAuthUrlParams();

  return (
    <Deferred ready={!authStatusData.isLoading} fallback={<Preloader />}>
      {authStatusData.data ? (
        <Member />
      ) : (
        <Guest
          authUrl={authUrl}
        />
      )}
    </Deferred>
  );
};

export default HomePage;
