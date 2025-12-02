import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="pb-20 space-y-6">
      {/* Welcome Message Skeleton */}
      <Card className="mx-4 p-4">
        <div className="flex items-start space-x-3">
          <Skeleton className="w-6 h-6 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-8 w-20 rounded" />
          </div>
        </div>
      </Card>

      {/* Stats Grid Skeleton */}
      <div className="mx-4">
        <Skeleton className="h-5 w-32 mb-4" />
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <Skeleton className="h-6 w-16 mb-2 mx-auto" />
            <Skeleton className="h-4 w-20 mx-auto" />
          </Card>
          <Card className="p-4">
            <Skeleton className="h-6 w-16 mb-2 mx-auto" />
            <Skeleton className="h-4 w-20 mx-auto" />
          </Card>
        </div>
      </div>

      {/* Quick Actions Skeleton */}
      <div className="mx-4">
        <Skeleton className="h-5 w-24 mb-3" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4">
              <Skeleton className="w-12 h-12 rounded-full mx-auto mb-2" />
              <Skeleton className="h-3 w-12 mx-auto" />
            </Card>
          ))}
        </div>
      </div>

      {/* Status Messages Skeleton */}
      <div className="mx-4 space-y-3">
        <Card className="p-4">
          <div className="flex items-start space-x-3">
            <Skeleton className="w-5 h-5 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-7 w-24 rounded" />
            </div>
          </div>
        </Card>
      </div>

      {/* Active Sessions Skeleton */}
      <div className="mx-4">
        <Skeleton className="h-5 w-36 mb-3" />
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <Card key={i} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-6 h-6 rounded" />
                  <div>
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <div className="text-center">
                <Skeleton className="h-5 w-20 mx-auto mb-1" />
                <Skeleton className="h-3 w-32 mx-auto" />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Parking Space Skeleton */}
      <div className="mx-4">
        <Skeleton className="h-5 w-28 mb-3" />
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-3 w-32" />
            </div>
            <div className="text-right">
              <Skeleton className="h-5 w-12 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <Skeleton className="h-2 w-full rounded mb-3" />
          <div className="flex justify-between">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-6 w-12 rounded" />
          </div>
        </Card>
      </div>
    </div>
  );
};

export const StatsCardSkeleton: React.FC = () => {
  return (
    <Card className="p-4">
      <Skeleton className="h-6 w-16 mb-2 mx-auto" />
      <Skeleton className="h-4 w-20 mx-auto" />
    </Card>
  );
};

export const ActionCardSkeleton: React.FC = () => {
  return (
    <Card className="p-4">
      <Skeleton className="w-12 h-12 rounded-full mx-auto mb-2" />
      <Skeleton className="h-3 w-12 mx-auto" />
    </Card>
  );
};

export const SessionCardSkeleton: React.FC = () => {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <Skeleton className="w-6 h-6 rounded" />
          <div>
            <Skeleton className="h-4 w-16 mb-1" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="text-center">
        <Skeleton className="h-5 w-20 mx-auto mb-1" />
        <Skeleton className="h-3 w-32 mx-auto" />
      </div>
    </Card>
  );
};

// Loading overlay component
export const LoadingOverlay: React.FC<{ message?: string; isVisible: boolean }> = ({
  message = "Loading...",
  isVisible
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="p-6 text-center max-w-sm">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-900 font-medium">{message}</p>
      </Card>
    </div>
  );
};

// Pull to refresh hook
export const usePullToRefresh = (
  onRefresh: () => Promise<void>,
  threshold: number = 80
) => {
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [pullDistance, setPullDistance] = React.useState(0);
  const [startY, setStartY] = React.useState(0);
  const [canRefresh, setCanRefresh] = React.useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY === 0 || window.scrollY > 0) return;

    const currentY = e.touches[0].clientY;
    const distance = Math.max(0, currentY - startY);

    if (distance > 0) {
      setPullDistance(distance);
      setCanRefresh(distance > threshold);
    }
  };

  const handleTouchEnd = async () => {
    if (canRefresh && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }

    setPullDistance(0);
    setStartY(0);
    setCanRefresh(false);
  };

  return {
    pullDistance,
    isRefreshing,
    canRefresh,
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    }
  };
};

export default DashboardSkeleton;
