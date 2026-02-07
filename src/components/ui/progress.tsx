'use client';

import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '@/lib/utils';

type ProgressProps = {
  value: number;
  max: number;
  className?: string;
};

function Progress({ value, max, className }: ProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <ProgressPrimitive.Root
      value={percentage}
      className={cn('bg-primary/20 relative h-2 w-full overflow-hidden rounded-full', className)}
    >
      <ProgressPrimitive.Indicator
        className="bg-primary h-full w-full transition-transform"
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
