'use client';

import { Sheet, SheetContent } from '@/components/ui/sheet';
import StravaActivityImageGenerator from '@/components/organisms/StravaActivityImageGenerator';

import Title from './Title';

interface ImageGenerationDrawerProps {
  onClose: () => void;
  withImageGeneration: boolean;
  activityId?: string | null;
}

/**
 * Image generation drawer.
 * Uses shadcn Sheet (Radix Dialog) instead of Geist Drawer.
 * @param {ImageGenerationDrawerProps} props Component props.
 * @param {string | null} [props.activityId] ID of the activity.
 * @param {Function} props.onClose Function to handle sheet close.
 * @param {boolean} props.withImageGeneration Whether to allow image generation.
 * @returns {JSX.Element} Image generation drawer.
 */
const ImageGenerationDrawer = ({
  activityId,
  onClose,
  withImageGeneration,
}: ImageGenerationDrawerProps) => (
  <Sheet open={Boolean(activityId)} onOpenChange={onClose}>
    <SheetContent side="right" className="w-full p-0 overflow-y-auto">
      <StravaActivityImageGenerator
        activityId={activityId}
        withImageGeneration={withImageGeneration}
        Header={({ isLoading, isLoaded }) => (
          <Title
            isLoading={isLoading}
            isLoaded={isLoaded}
            onClose={onClose}
          />
        )}
      />
    </SheetContent>
  </Sheet>
);

export default ImageGenerationDrawer;
