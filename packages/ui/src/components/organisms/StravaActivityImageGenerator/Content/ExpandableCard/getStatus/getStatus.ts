'use client';

import { Status } from '../types';
import { Input } from './types';

/**
 * Determines the appropriate status based on loading and content states.
 * @param {Input} input - The input object containing loading and content states.
 * @param {boolean} input.isLoading - Whether the content is currently loading.
 * @param {boolean} input.isError - Whether there was an error loading the content.
 * @param {boolean} input.hasContent - Whether the loaded content has meaningful data.
 * @returns {Status} The corresponding status.
 */
const getStatus = ({
  isLoading,
  isError,
  hasContent,
}: Input): Status => {
  if (isLoading) {
    return 'loading';
  } if (hasContent) {
    return 'loaded';
  } else if (isError) {
    return 'error';
  } else {
    return 'pending';
  }
};

export default getStatus;
