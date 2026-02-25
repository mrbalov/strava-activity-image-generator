'use client';

import { StravaActivity } from '@torq/strava-api';

import ExpandableCard from '../ExpandableCard';

interface ActivityProps {
  isLoading: boolean;
  isError: boolean;
  activity?: StravaActivity | null;
}

/**
 * Activity component.
 * @param {ActivityProps} props - Component props.
 * @param {boolean} props.isLoading - Whether the activity is loading.
 * @param {boolean} props.isError - Whether there was an error loading the activity.
 * @param {StravaActivity | null} [props.activity] - Strava activity data.
 * @returns {JSX.Element} The activity component.
 */
const Activity = ({
  isLoading,
  isError,
  activity,
}: ActivityProps) => (
  <ExpandableCard
    isLoading={isLoading}
    isError={isError}
    hasContent={Boolean(activity)}
    loadingMessage="Querying activity..."
    errorMessage="No activity available... Let's cry together."
    pendingMessage="Pending activity querying..."
    title="Step 1: Querying your activity..."
    withExpander
  >
    <p className="text-sm text-emerald-950 dark:text-emerald-800">
      {activity && (
        <>
          <strong>{activity.name}</strong>:
          {' '}
          type: {activity.type}; distance: {activity.distance}m; moving time: {activity.moving_time}s
        </>
      )}
    </p>
  </ExpandableCard>
);

export default Activity;
