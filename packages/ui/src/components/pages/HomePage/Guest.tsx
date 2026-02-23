'use client';

import { Activity } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

interface GuestProps {
  authUrl: string;
}

/**
 * Guest view.
 * @param {GuestProps} props - Component props.
 * @param {string} props.authUrl - URL to authorize.
 * @returns {JSX.Element} Guest view.
 */
const Guest = ({ authUrl }: GuestProps) => (
  <div className="flex flex-col items-center justify-center gap-8 text-center">
    <h1 className="text-4xl font-bold text-primary">
      Welcome to TORQ!
    </h1>
    <p className="text-lg font-bold leading-relaxed text-muted-foreground max-w-xl">
      <strong>TORQ</strong> is a{' '}
      <span className="font-bold text-primary tracking-wider">
        Training Orbit Research Qernel
      </span>
      . It helps you create beautiful visualizations of your athletic activities. Connect your
      Strava account to get started and transform your workout data into stunning images!
    </p>
    <Link href={authUrl} passHref>
      <Button variant="outline">
        <Activity />
        Authorize with Strava
      </Button>
    </Link>
  </div>
);

export default Guest;
