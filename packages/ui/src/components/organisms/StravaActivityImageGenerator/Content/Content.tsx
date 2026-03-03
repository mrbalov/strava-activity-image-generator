'use client';

import type { StravaActivity } from '@torqlab/strava-api';
import type { StravaActivitySignals } from '@torqlab/get-strava-activity-signals';

import { cn } from '@/lib/utils';

import Activity from './Activity';
import Signals from './Signals';
import Prompt from './Prompt';
import Image from './Image';

interface ContentProps {
  isActivityLoading: boolean;
  isSignalsLoading: boolean;
  isPromptLoading: boolean;
  isImageLoading: boolean;
  isActivityError: boolean;
  isSignalsError: boolean;
  isPromptError: boolean;
  isImageError: boolean;
  activity?: StravaActivity | null;
  signals?: StravaActivitySignals | null;
  prompt?: string | null;
  image?: string | null;
  className?: string;
}

/**
 * Image generation content.
 * Replaced Geist Drawer.Content/Grid/Card with a scrollable div + Tailwind grid.
 * @param {ContentProps} props - Component props.
 * @param {boolean} props.isActivityLoading - Whether the activity is loading.
 * @param {boolean} props.isSignalsLoading - Whether the signals are loading.
 * @param {boolean} props.isPromptLoading - Whether the prompt is loading.
 * @param {boolean} props.isImageLoading - Whether the image is loading.
 * @param {boolean} props.isActivityError - Whether there was an error loading the activity.
 * @param {boolean} props.isSignalsError - Whether there was an error loading the signals.
 * @param {boolean} props.isPromptError - Whether there was an error loading the prompt.
 * @param {boolean} props.isImageError - Whether there was an error loading the image.
 * @param {StravaActivity | null} [props.activity] The activity data.
 * @param {StravaActivitySignals | null} [props.signals] The activity signals.
 * @param {string | null} [props.prompt] The generated prompt.
 * @param {string | null} [props.image] The generated image (base64).
 * @param {string} [props.className] Additional class name for the root.
 * @returns {JSX.Element} Image generation content component.
 */
const Content = ({
  isActivityLoading,
  isSignalsLoading,
  isPromptLoading,
  isImageLoading,
  isActivityError,
  isSignalsError,
  isPromptError,
  isImageError,
  activity,
  signals,
  prompt,
  image,
  className,
}: ContentProps) => {
  const rootClassList = cn('flex flex-col gap-4', className);

  return (
    <div className={rootClassList}>
      <div className="rounded-lg border bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800 p-3">
        <p className="text-xs text-amber-800 dark:text-amber-300">
          The activity image is being generated using an external AI service.{' '}
          <strong>AI is not a human, so it makes mistakes.</strong> Please make sure the generated
          image is appropriate before publishing it to your Strava profile.
        </p>
      </div>
      <Activity
        isLoading={isActivityLoading}
        isError={isActivityError}
        activity={activity}
      />
      <Signals
        isLoading={isSignalsLoading}
        isError={isSignalsError}
        signals={signals}
      />
      <Prompt
        isLoading={isPromptLoading}
        isError={isPromptError}
        prompt={prompt}
      />
      <Image
        isLoading={isImageLoading}
        isError={isImageError}
        image={image}
      />
    </div>
  );
};

export default Content;
