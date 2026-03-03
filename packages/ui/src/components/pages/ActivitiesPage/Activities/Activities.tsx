'use client';

import type { StravaActivity } from '@torqlab/strava-api';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import ActivitiesList from './ActivitiesList';

interface ActivitiesProps {
  activities: StravaActivity[];
}

/**
 * Activities list view.
 * @param {ActivitiesProps} props - Component props.
 * @param {StravaActivity[]} props.activities - List of activities to display.
 * @returns {JSX.Element} Activities list view.
 */
const Activities = ({
  activities,
}: ActivitiesProps) => (
  <div className="flex flex-col gap-4 w-full">
    <h1 className="text-3xl font-bold">Your Last 30 Activities</h1>
    {activities.length > 0 ? (
      <ActivitiesList activities={activities} />
    ) : (
      <Alert>
        <AlertTitle>No Activities</AlertTitle>
        <AlertDescription>
          You don&apos;t have any activities yet. Start tracking your workouts on Strava!
        </AlertDescription>
      </Alert>
    )}
  </div>
);

export default Activities;
