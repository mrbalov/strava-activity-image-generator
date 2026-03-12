export interface Response {
  image?: {
    imageData?: string;
    usedFallback?: boolean;
    retriesPerformed?: number;
  };
}
