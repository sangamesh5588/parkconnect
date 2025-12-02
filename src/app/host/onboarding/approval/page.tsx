import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Clock, Shield, Mail, MapPin, FileCheck, UserCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/utils/supabase";

export default function HostApprovalWaiting() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [approvalStatus, setApprovalStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [isChecking, setIsChecking] = useState(true);

  // Check approval status on mount and set up real-time listener
  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const checkApprovalStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('host_onboarding')
          .select('is_completed, kyc_status')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error checking approval status:', error);
          return;
        }

        // Check if admin has approved the application
        // In production, admin would update kyc_status to 'approved'
        if (data?.kyc_status === 'approved') {
          setApprovalStatus('approved');
          // Auto-redirect to dashboard after approval
          setTimeout(() => {
            navigate('/host/dashboard');
          }, 2000);
        } else if (data?.kyc_status === 'rejected') {
          setApprovalStatus('rejected');
        } else {
          setApprovalStatus('pending');
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setIsChecking(false);
      }
    };

    checkApprovalStatus();

    // Set up real-time subscription for approval status changes
    const subscription = supabase
      .channel('host_onboarding_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'host_onboarding',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const newStatus = payload.new.kyc_status;
          if (newStatus === 'approved') {
            setApprovalStatus('approved');
            setTimeout(() => {
              navigate('/host/dashboard');
            }, 2000);
          } else if (newStatus === 'rejected') {
            setApprovalStatus('rejected');
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, navigate]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <Clock className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Checking application status...</p>
        </div>
      </div>
    );
  }

  if (approvalStatus === 'approved') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-6 sm:p-8 text-center shadow-xl border-0 bg-white/95 backdrop-blur-sm max-w-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
            Application Approved! 🎉
          </h1>
          <p className="text-gray-600 mb-6">
            Redirecting to your dashboard...
          </p>
        </Card>
      </div>
    );
  }

  if (approvalStatus === 'rejected') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-6 sm:p-8 text-center shadow-xl border-0 bg-white/95 backdrop-blur-sm max-w-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full mb-6">
            <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
            Application Needs Review
          </h1>
          <p className="text-gray-600 mb-6">
            We need additional information. Please check your email for details.
          </p>
          <Link to="/">
            <Button className="w-full">Back to Home</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        {/* Main Content Card */}
        <Card className="p-6 sm:p-8 text-center shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-secondary rounded-full mb-6">
            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
          </div>

          {/* Main Heading */}
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 px-2">
            Application Submitted Successfully! 🎉
          </h1>

          {/* Status Badge */}
          <div className="inline-flex items-center px-3 py-1.5 bg-secondary border border-border rounded-full mb-6">
            <Clock className="w-4 h-4 text-primary mr-2" />
            <span className="text-sm font-medium text-primary">Under Review</span>
          </div>

          {/* Simple Message */}
          <p className="text-gray-600 text-base leading-relaxed mb-6 px-2">
            Your application is being reviewed. You'll receive an email notification once approved.
          </p>

          {/* Status Badges */}
          <div className="flex items-center justify-center gap-3 mb-8">
            {/* Submitted - Completed */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mb-2">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-gray-600 font-medium">Submitted</span>
            </div>

            {/* Reviewing - Current */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mb-2 animate-pulse">
                <Clock className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xs text-primary font-medium">Reviewing</span>
            </div>

            {/* Approved - Future */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mb-2">
                <Shield className="w-5 h-5 text-gray-500" />
              </div>
              <span className="text-xs text-gray-500">Approved</span>
            </div>
          </div>

          {/* Review Process Details */}
          <div className="text-left bg-gray-50 rounded-xl p-4 mb-6 space-y-3">
            <h3 className="font-semibold text-gray-900 text-sm mb-3">What happens next:</h3>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-700 font-medium">Location Verification</p>
                <p className="text-xs text-gray-500">Admins verify your parking location accuracy</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <FileCheck className="w-3.5 h-3.5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-700 font-medium">Document Review</p>
                <p className="text-xs text-gray-500">KYC documents and compliance check</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Mail className="w-3.5 h-3.5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-700 font-medium">Email Notification</p>
                <p className="text-xs text-gray-500">You'll be notified within 24-48 hours</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <UserCheck className="w-3.5 h-3.5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-700 font-medium">Dashboard Access</p>
                <p className="text-xs text-gray-500">Start listing parking spaces after approval</p>
              </div>
            </div>
          </div>

          {/* Secondary Action */}
          <Link to="/" className="block">
            <Button
              variant="outline"
              className="w-full h-12 text-base font-medium rounded-xl"
            >
              Back to Home
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
