'use client';

import { StravaActivity } from '@torq/strava-api';

import Item from './Item';

interface ActivitiesListProps {
  activities: StravaActivity[];
}

/**
 * Activities list.
 * @param {ActivitiesListProps} props - Component props.
 * @param {StravaActivity[]} props.activities - List of activities to display.
 * @returns {JSX.Element[]} Activities list view.
 */
const ActivitiesList = ({ activities }: ActivitiesListProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {activities.map((activity) => (
      <Item
        key={activity.id}
        activity={activity}
      />
    ))}
  </div>
);

export default ActivitiesList;
