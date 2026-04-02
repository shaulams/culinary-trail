'use client';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export default function Skeleton({ className = '', variant = 'rectangular', width, height }: SkeletonProps) {
  const baseClass = 'skeleton-shimmer';
  const variantClass = variant === 'circular' ? 'rounded-full' : variant === 'text' ? 'rounded' : 'rounded-xl';
  
  return (
    <div
      className={`${baseClass} ${variantClass} ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

export function StopCardSkeleton({ variant = 'editorial' }: { variant?: 'compact' | 'editorial' }) {
  if (variant === 'editorial') {
    return (
      <div className="animate-fade-in">
        <div className="overflow-hidden rounded-xl bg-surface-container-low">
          <Skeleton className="w-full" height={256} variant="rectangular" />
          <div className="p-5 space-y-3">
            <Skeleton height={28} width="60%" variant="text" />
            <Skeleton height={16} width="90%" variant="text" />
            <Skeleton height={16} width="70%" variant="text" />
            <div className="flex justify-between pt-4">
              <Skeleton height={40} width={120} variant="rectangular" />
              <Skeleton height={16} width={80} variant="text" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      <Skeleton className="flex-shrink-0" width={80} height={80} />
      <div className="flex flex-col justify-center flex-1 gap-2">
        <Skeleton height={14} width={60} variant="text" />
        <Skeleton height={20} width="80%" variant="text" />
        <Skeleton height={14} width="60%" variant="text" />
      </div>
    </div>
  );
}

export function DayCardSkeleton() {
  return (
    <div className="space-y-4 animate-fade-in">
      <Skeleton height={36} width="70%" variant="text" />
      <Skeleton height={16} width={150} variant="text" />
      <div className="space-y-8 mt-6">
        <StopCardSkeleton variant="editorial" />
        <StopCardSkeleton variant="editorial" />
      </div>
    </div>
  );
}

export function RoutePageSkeleton() {
  return (
    <div className="max-w-[375px] mx-auto min-h-screen pb-32">
      {/* Summary bar skeleton */}
      <div className="px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Skeleton height={16} width={80} variant="text" />
          <Skeleton height={4} width={4} variant="circular" />
          <Skeleton height={16} width={60} variant="text" />
        </div>
        <Skeleton height={32} width={100} />
      </div>
      <div className="px-6 py-8">
        <DayCardSkeleton />
      </div>
      <div className="px-6 py-8">
        <DayCardSkeleton />
      </div>
    </div>
  );
}

export function MapSkeleton() {
  return (
    <div className="w-full h-full min-h-[400px] bg-surface-container-high flex items-center justify-center skeleton-shimmer">
      <span className="material-symbols-outlined text-4xl text-outline/30">map</span>
    </div>
  );
}
