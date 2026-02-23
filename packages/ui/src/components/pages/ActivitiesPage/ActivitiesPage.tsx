'use client';

import Preloader from '@/components/atoms/Preloader';
import Deferred from '@/components/atoms/Deferred';
import {
  useFetchAuthStatus,
  useFetchStravaActivities,
} from '@/api';

import Activities from './Activities';
import Guest from './Guest';
import Error from './Error';

/**
 * Activities page.
 * @returns {JSX.Element} Activities page.
 */
const ActivitiesPage = (): JSX.Element => {
  const authStatusData = useFetchAuthStatus();
  const stravaActivitiesData = useFetchStravaActivities();
  const isLoading = authStatusData.isLoading || stravaActivitiesData.isLoading;

  return (
    <Deferred
      ready={!isLoading}
      fallback={<Preloader message="Loading your activities..." />}
    >
      {(() => {
        if (!authStatusData.data) {
          return <Guest />;
        } else if (stravaActivitiesData.error) {
          return (
            <Error
              error={stravaActivitiesData.error.message}
              refetchActivities={stravaActivitiesData.refetch}
            />
          );
        } else {
          return (
            <Activities
              activities={stravaActivitiesData.data ?? []}
            />
          );
        }
      })()}
    </Deferred>
  );
};

export default ActivitiesPage;
