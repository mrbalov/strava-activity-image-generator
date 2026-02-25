'use client';

import { Fragment, useMemo } from 'react';
import { StravaActivitySignals } from '@torq/get-strava-activity-signals';

import prettifySignals from './prettifySignals';
import ExpandableCard from '../ExpandableCard';

interface SignalsProps {
  isLoading: boolean;
  isError: boolean;
  signals?: StravaActivitySignals | null;
}

/**
 * Strava activity signals.
 * @param {SignalsProps} props - Component props.
 * @param {boolean} props.isLoading - Whether the signals are loading.
 * @param {boolean} props.isError - Whether there was an error loading the signals.
 * @param {StravaActivitySignals} [props.signals] - The loaded signals.
 * @returns {JSX.Element} The signals component.
 */
const Signals = ({ isLoading, isError, signals }: SignalsProps) => {
  const prettySignals = useMemo<[string, string][] | null>(() => (
    signals ? prettifySignals(signals) : null
  ), [signals]);

  return (
    <ExpandableCard
      isLoading={isLoading}
      isError={isError}
      hasContent={(prettySignals?.length ?? 0) > 0}
      title="Step 2: Extracting AI signals from your activity"
      pendingMessage="Pending AI signals extraction..."
      loadingMessage="Extracting AI signals..."
      errorMessage="No activity signals available..."
      withExpander
    >
      {prettySignals && (
        <p className="text-sm text-emerald-950 dark:text-emerald-800">
          {prettySignals?.map(([key, value]) => (
            <Fragment key={key}>
              <strong>{key}:</strong> {value};{' '}
            </Fragment>
          ))}
        </p>
      )}
    </ExpandableCard>
  );
};

export default Signals;
