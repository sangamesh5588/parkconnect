import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { checkHostStatus, type HostStatusResult } from '@/utils/hostStatusCheck';

interface HostRouteGuardProps {
  children: React.ReactNode;
}

/**
 * HostRouteGuard - Middleware component for automatic host status redirects
 *
 * This component checks host status and redirects users to the appropriate page
 * based on their onboarding progress, following the host flow specification.
 *
 * Used in main App.tsx for all host routes to ensure proper flow enforcement.
 */
export const HostRouteGuard: React.FC<HostRouteGuardProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const [hostStatus, setHostStatus] = useState<HostStatusResult | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);

  useEffect(() => {
    const checkStatusAndRedirect = async () => {
      if (!user) {
        setStatusLoading(false);
        return;
      }

      try {
        const result = await checkHostStatus(user.id);
        setHostStatus(result);
        setStatusLoading(false);

        // Handle redirects based on current status and location
        handleRedirect(result, location.pathname);
      } catch (error) {
        console.error('Error checking host status:', error);
        setStatusLoading(false);
      }
    };

    checkStatusAndRedirect();
  }, [user, location.pathname]);

  const handleRedirect = (statusResult: HostStatusResult, currentPath: string) => {
    const targetPath = statusResult.redirectTo;

    // Don't redirect if already on the correct page
    if (currentPath === targetPath) {
      return;
    }

    // For approved hosts, allow access to all dashboard routes
    if (statusResult.status === 'approved' && currentPath.startsWith('/host/')) {
      return;
    }

    // For hosts in onboarding, allow access to onboarding routes
    if (statusResult.status === 'onboarding_started' && currentPath.startsWith('/host/onboarding')) {
      return;
    }

    // Redirect to the appropriate page based on status
    window.location.href = targetPath;
  };

  // Show loading while checking auth and status
  if (authLoading || statusLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-sm">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading...</h3>
          <p className="text-sm text-gray-600">Setting up your host experience...</p>
        </Card>
      </div>
    );
  }

  // Not authenticated - redirect handled by individual route guards
  if (!user) {
    return <>{children}</>;
  }

  // No host status yet - show loading
  if (!hostStatus) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-sm">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Checking Status</h3>
          <p className="text-sm text-gray-600">Verifying your host account...</p>
        </Card>
      </div>
    );
  }

  // Render children - individual route guards will handle specific access control
  return <>{children}</>;
};

export default HostRouteGuard;
