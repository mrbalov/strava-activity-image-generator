import { describe, test, expect } from 'bun:test';

import getStatus from './getStatus';
import { Status } from '../types';
import { Input } from './types';

type Case = [string, Input, Status];

describe('getStatus', () => {
  test.each<Case>([
    [
      'loading state showing spinner',
      {
        isLoading: true,
        isError: false,
        hasContent: false,
      },
      'loading',
    ],
    [
      'loading state even when error occurred with content',
      {
        isLoading: true,
        isError: true,
        hasContent: true,
      },
      'loading',
    ],
    [
      'loading state even when error occurred without content',
      {
        isLoading: true,
        isError: true,
        hasContent: false,
      },
      'loading',
    ],
    [
      'loading state even when no error but has content',
      {
        isLoading: true,
        isError: false,
        hasContent: true,
      },
      'loading',
    ],
    [
      'successful completion showing content',
      {
        isLoading: false,
        isError: false,
        hasContent: true,
      },
      'loaded',
    ],
    [
      'failed operation showing error',
      {
        isLoading: false,
        isError: true,
        hasContent: false,
      },
      'error',
    ],
    [
      'waiting for operation to start',
      {
        isLoading: false,
        isError: false,
        hasContent: false,
      },
      'pending',
    ],
    [
      'waiting for operation even with available content',
      {
        isLoading: false,
        isError: false,
        hasContent: true,
      },
      'loaded',
    ],
  ])('%#. %s', (_name, input, expected) => {
    const result = getStatus(input);

    expect(result).toBe(expected);
  });
});
