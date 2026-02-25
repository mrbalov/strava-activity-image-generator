'use client';

import ExpandableCard from '../ExpandableCard';

interface PromptProps {
  isLoading: boolean;
  isError: boolean;
  prompt?: string | null;
}

/**
 * Image generation prompt.
 * @param {PromptProps} props - Component props.
 * @param {boolean} props.isLoading - Whether the prompt is being generated.
 * @param {boolean} props.isError - Whether there was an error generating the prompt.
 * @param {string | null} [props.prompt] - Generated prompt text.
 * @returns {JSX.Element} The prompt component.
 */
const Prompt = ({
  isLoading,
  isError,
  prompt,
}: PromptProps) => (
  <ExpandableCard
    isLoading={isLoading}
    isError={isError}
    hasContent={Boolean(prompt)}
    loadingMessage="Preparing AI image generation prompt..."
    errorMessage="No AI image generation prompt available... Let's cry together."
    pendingMessage="Pending AI image generation prompt preparation..."
    title="Step 2: Preparing AI image generation prompt for your activity"
    withExpander
  >
    <p className="text-sm text-emerald-950 dark:text-emerald-800">
      {prompt}
    </p>
  </ExpandableCard>
);

export default Prompt;
