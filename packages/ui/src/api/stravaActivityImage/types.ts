export interface Input {
  activityId: string;
  prompt: string;
}

export interface Response {
  image?: {
    imageData?: string;
    usedFallback?: boolean;
    retriesPerformed?: number;
  };
}
