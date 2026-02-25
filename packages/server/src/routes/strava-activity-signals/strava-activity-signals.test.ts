import { describe, test, expect } from 'bun:test';
import type { StravaActivity } from '@torq/get-strava-activity-signals';
import stravaActivitySignals from './strava-activity-signals';

describe('strava-activity-signals', () => {
  type Case = [
    name: string,
    body: string | null,
    expectedStatus: number,
    expectedErrorMessage?: string,
  ];

  const cases: Case[] = [
    [
      'valid activity data returns signals',
      JSON.stringify({
        id: 12345,
        type: 'Run',
        sport_type: 'Run',
        name: 'Morning Run',
        distance: 5000,
        moving_time: 1800,
      } as StravaActivity),
      200,
    ],
    [
      'minimal valid activity data returns signals',
      JSON.stringify({
        id: 67890,
        type: 'Ride',
        sport_type: 'Ride',
      } as StravaActivity),
      200,
    ],
    [
      'invalid JSON returns bad request',
      '{invalid json',
      400,
      'Failed to process activity data.',
    ],
    [
      'null body returns bad request',
      null,
      400,
      'Failed to process activity data.',
    ],
    [
      'empty object returns bad request',
      '{}',
      400,
      'Failed to process activity data.',
    ],
  ];

  test.each<Case>(cases)('%#. %s', async (_, body, expectedStatus, expectedErrorMessage) => {
    const mockRequest = new Request('https://example.com/strava/activities/123/signals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    });

    const response = await stravaActivitySignals(mockRequest);
    const responseBody = await response.json();

    expect(response.status).toBe(expectedStatus);

    if (expectedStatus === 200) {
      expect(responseBody).toHaveProperty('core');
      expect(responseBody).toHaveProperty('derived');
      expect(responseBody.core).toHaveProperty('activityType');
      expect(responseBody.core).toHaveProperty('intensity');
      expect(responseBody.core).toHaveProperty('elevation');
      expect(responseBody.core).toHaveProperty('timeOfDay');
      expect(responseBody.derived).toHaveProperty('mood');
      expect(responseBody.derived).toHaveProperty('style');
      expect(responseBody.derived).toHaveProperty('subject');
      expect(responseBody.derived).toHaveProperty('terrain');
      expect(responseBody.derived).toHaveProperty('environment');
      expect(responseBody.derived).toHaveProperty('atmosphere');
    } else {
      expect(responseBody).toHaveProperty('error');
      expect(responseBody).toHaveProperty('message');
      if (expectedErrorMessage) {
        expect(responseBody.message).toBe(expectedErrorMessage);
      }
    }
  });
});
