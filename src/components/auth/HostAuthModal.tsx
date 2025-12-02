import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SocialLoginButtons } from "./shared/SocialLoginButtons";
import { AuthForm } from "./shared/AuthForm";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { checkUserTypeConflict, createOrUpdateUserProfile } from "@/utils/userTypeValidation";
import { checkHostStatus } from "@/utils/hostStatusCheck";

interface HostAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HostAuthModal = ({ isOpen, onClose }: HostAuthModalProps) => {
  const [isSignupMode, setIsSignupMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { signUp, signIn, signInWithProvider } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSocialLogin = async (provider: 'google' | 'apple' | 'facebook') => {
    try {
      setLoading(true);
      setError("");

      // Store intention to go to host landing after OAuth
      sessionStorage.setItem('auth_redirect', '/become-host');
      sessionStorage.setItem('user_type', 'host');
      sessionStorage.setItem('auth_flow', 'host'); // Track which flow initiated auth

      const { error } = await signInWithProvider(provider);
      if (error) {
        throw error;
      }

      // OAuth will redirect, so we don't close the modal here
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with social provider');
      toast({
        title: "Authentication Error",
        description: err.message || 'Failed to sign in with social provider',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Check for user type conflict before signup
      if (isSignupMode) {
        const conflictCheck = await checkUserTypeConflict(email, 'host');
        if (conflictCheck.conflictMessage) {
          setError(conflictCheck.conflictMessage);
          toast({
            title: "Account Already Exists",
            description: conflictCheck.conflictMessage,
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
      }

      let result;
      if (isSignupMode) {
        result = await signUp(email, password, {
          user_type: 'host',
          signup_source: 'modal'
        });
      } else {
        // For login, check user type conflict
        const conflictCheck = await checkUserTypeConflict(email, 'host');
        if (conflictCheck.exists && conflictCheck.conflictMessage) {
          setError(conflictCheck.conflictMessage);
          toast({
            title: "Wrong Account Type",
            description: conflictCheck.conflictMessage,
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        result = await signIn(email, password);
      }

      if (result.error) {
        throw result.error;
      }

      // Create user profile after successful auth
      if (result.data?.user) {
        await createOrUpdateUserProfile(result.data.user.id, email, 'host');

        if (isSignupMode) {
          toast({
            title: "Account Created!",
            description: "Please check your email to confirm your account.",
          });
          // For signup, we might want to keep the modal open or show a confirmation message
        } else {
          toast({
            title: "Welcome back!",
            description: "You've been signed in successfully.",
          });
          onClose();

          // Use master host status check to determine redirect
          const hostStatus = await checkHostStatus(result.data.user.id);
          navigate(hostStatus.redirectTo);
        }
      }

    } catch (err: any) {
      setError(err.message || 'Authentication failed');
      toast({
        title: "Authentication Error",
        description: err.message || 'Authentication failed',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsSignupMode(!isSignupMode);
    setEmail("");
    setPassword("");
    setError("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-md mx-auto h-auto max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="text-center pb-2">
          <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900">
            {isSignupMode ? 'Join ParkConnect' : 'Welcome Back'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          <SocialLoginButtons
            onGoogleLogin={() => handleSocialLogin('google')}
            onFacebookLogin={() => handleSocialLogin('facebook')}
            onAppleLogin={() => handleSocialLogin('apple')}
            loading={loading}
          />

          <AuthForm
            mode={isSignupMode ? 'signup' : 'signin'}
            email={email}
            password={password}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onSubmit={handleEmailAuth}
            isSignup={isSignupMode}
            loading={loading}
            error={error}
          />

          {/* Terms */}
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            By {isSignupMode ? 'signing up' : 'signing in'}, you agree to our{' '}
            <Link
              to="/terms-conditions"
              onClick={onClose}
              className="text-primary hover:underline"
            >
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link
              to="/privacy-policy"
              onClick={onClose}
              className="text-primary hover:underline"
            >
              Privacy Policy
            </Link>
          </p>

          {/* Mode Switch */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {isSignupMode ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={switchMode}
                className="text-primary hover:underline font-medium"
              >
                {isSignupMode ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>

          {/* Cross-promotion */}
          {!isSignupMode && (
            <div className="text-center pt-2 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Looking to rent parking spaces?{' '}
                <Link
                  to="/renter"
                  onClick={onClose}
                  className="text-primary hover:underline font-medium"
                >
                  Visit renter page
                </Link>
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
