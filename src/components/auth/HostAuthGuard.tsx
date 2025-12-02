import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Shield, AlertTriangle } from 'lucide-react';
import { checkHostStatus, type HostStatusResult } from '@/utils/hostStatusCheck';

interface HostAuthGuardProps {
  children: React.ReactNode;
  requireApproval?: boolean; // Whether to require approved status
}

export const HostAuthGuard: React.FC<HostAuthGuardProps> = ({
  children,
  requireApproval = true
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [hostStatus, setHostStatus] = useState<HostStatusResult | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [statusError, setStatusError] = useState<string | null>(null);

  useEffect(() => {
    const checkHostAccess = async () => {
      if (!user) {
        setStatusLoading(false);
        return;
      }

      try {
        const result = await checkHostStatus(user.id);
        setHostStatus(result);
        setStatusLoading(false);
      } catch (error) {
        console.error('Error checking host status:', error);
        setStatusError('Failed to verify host status');
        setStatusLoading(false);
      }
    };

    checkHostAccess();
  }, [user]);

  // Show loading state while checking authentication and status
  if (loading || statusLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-sm">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Verifying Access</h3>
          <p className="text-sm text-gray-600">Please wait while we check your permissions...</p>
        </Card>
      </div>
    );
  }

  // User not authenticated - redirect to login
  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // Status error - show error state
  if (statusError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Access Error</h3>
          <p className="text-gray-600 mb-6">{statusError}</p>
          <div className="space-y-3">
            <Button
              onClick={() => window.location.reload()}
              className="w-full"
            >
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/'}
              className="w-full"
            >
              Go to Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Handle different host statuses
  if (hostStatus) {
    switch (hostStatus.status) {
      case 'no_profile':
        // Redirect to onboarding start
        return (
          <Navigate
            to="/host/onboarding"
            state={{ from: location.pathname }}
            replace
          />
        );

      case 'onboarding_started':
        // Allow access to continue onboarding
        return <>{children}</>;

      case 'submitted':
        // Onboarding submitted, waiting for approval
        if (requireApproval) {
          return (
            <Navigate
              to="/host/onboarding/approval"
              state={{ from: location.pathname }}
              replace
            />
          );
        }
        return <>{children}</>;

      case 'approved':
        // Fully approved host - allow access
        return <>{children}</>;

      case 'rejected':
        // Application rejected - show rejection page
        return (
          <Navigate
            to="/host/onboarding/approval"
            state={{ from: location.pathname }}
            replace
          />
        );

      default:
        // Unknown status - redirect to onboarding
        return (
          <Navigate
            to="/host/onboarding"
            state={{ from: location.pathname }}
            replace
          />
        );
    }
  }

  // Fallback - not a host
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="p-8 text-center max-w-md">
        <Shield className="w-12 h-12 text-orange-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Host Access Required</h3>
        <p className="text-gray-600 mb-6">
          You need to complete host registration to access this area.
        </p>
        <div className="space-y-3">
          <Button
            onClick={() => window.location.href = '/host'}
            className="w-full"
          >
            Become a Host
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="w-full"
          >
            Back to Home
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default HostAuthGuard;
