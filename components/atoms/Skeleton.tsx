import React from 'react';
import { cn } from '../../utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Enable shimmer effect (gradient animation) instead of pulse
   * @default false
   */
  shimmer?: boolean;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, shimmer = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-md bg-gray-700',
          shimmer ? 'animate-shimmer' : 'animate-pulse',
          className
        )}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

export { Skeleton };
