import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/utils/supabase';
import { Loader2 } from 'lucide-react';
import { checkUserTypeConflict, createOrUpdateUserProfile } from '@/utils/userTypeValidation';
import { checkHostStatus } from '@/utils/hostStatusCheck';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the hash from the URL (Supabase returns tokens in the hash)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        if (accessToken && refreshToken) {
          // Set the session with the tokens
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            throw error;
          }

          if (data.user) {
            // Check for stored redirect preference
            const authRedirect = sessionStorage.getItem('auth_redirect');
            const storedUserType = sessionStorage.getItem('user_type') as 'host' | 'renter' | null;

            // Get user email
            const userEmail = data.user.email;

            if (userEmail && storedUserType) {
              // Check for user type conflict
              const conflictCheck = await checkUserTypeConflict(userEmail, storedUserType);

              if (conflictCheck.conflictMessage) {
                // User trying to login with wrong account type
                setError(conflictCheck.conflictMessage);

                // Sign out the user
                await supabase.auth.signOut();

                // Clear session storage
                sessionStorage.removeItem('auth_redirect');
                sessionStorage.removeItem('user_type');
                sessionStorage.removeItem('auth_flow');

                // Redirect to home after showing error
                setTimeout(() => {
                  navigate('/');
                }, 3000);
                return;
              }

              // No conflict - create or update user profile
              await createOrUpdateUserProfile(data.user.id, userEmail, storedUserType);
            }

            // Clear session storage
            sessionStorage.removeItem('auth_redirect');
            sessionStorage.removeItem('user_type');
            sessionStorage.removeItem('auth_flow');

            // Use master host status check for hosts
            if (storedUserType === 'host') {
              const hostStatus = await checkHostStatus(data.user.id);
              navigate(hostStatus.redirectTo);
              return;
            }

            // For renters, redirect to search
            if (storedUserType === 'renter') {
              navigate('/renter/search');
              return;
            }

            // Fallback: use auth_redirect if provided, otherwise home
            if (authRedirect) {
              navigate(authRedirect);
            } else {
              navigate('/');
            }
          }
        } else {
          // If no tokens, check for error in URL
          const errorDescription = hashParams.get('error_description');
          if (errorDescription) {
            throw new Error(errorDescription);
          }

          // No tokens and no error, redirect to home
          navigate('/');
        }
      } catch (err: any) {
        console.error('Auth callback error:', err);
        setError(err.message || 'Authentication failed');

        // Redirect to home after showing error briefly
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="text-center space-y-4">
        {error ? (
          <>
            <div className="text-red-500 text-lg font-semibold">
              Authentication Error
            </div>
            <p className="text-gray-600">{error}</p>
            <p className="text-sm text-gray-500">Redirecting to home...</p>
          </>
        ) : (
          <>
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
            <div className="text-lg font-semibold text-gray-900">
              Completing sign in...
            </div>
            <p className="text-gray-600">Please wait while we authenticate you</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
