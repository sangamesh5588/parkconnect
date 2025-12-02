import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SocialLoginButtons } from "./shared/SocialLoginButtons";
import { AuthForm } from "./shared/AuthForm";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { checkUserTypeConflict, createOrUpdateUserProfile } from "@/utils/userTypeValidation";

interface RenterAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RenterAuthModal = ({ isOpen, onClose }: RenterAuthModalProps) => {
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

      // Store intention to go to renter search after OAuth
      sessionStorage.setItem('auth_redirect', '/renter/search');
      sessionStorage.setItem('user_type', 'renter');
      sessionStorage.setItem('auth_flow', 'renter'); // Track which flow initiated auth

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
        const conflictCheck = await checkUserTypeConflict(email, 'renter');
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
          user_type: 'renter',
          signup_source: 'modal'
        });
      } else {
        // For login, check user type conflict
        const conflictCheck = await checkUserTypeConflict(email, 'renter');
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
        await createOrUpdateUserProfile(result.data.user.id, email, 'renter');
      }

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
        // Redirect to renter search page
        navigate('/renter/search');
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
      <DialogContent className="sm:max-w-md mx-4">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-gray-900 mb-2">
            {isSignupMode ? 'Find Parking Spots' : 'Welcome Back'}
          </DialogTitle>
          <p className="text-center text-gray-600 text-sm">
            {isSignupMode
              ? 'Book parking instantly with ParkConnect'
              : 'Sign in to find and book parking spots'
            }
          </p>
        </DialogHeader>

        <div className="space-y-6">
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
            <a href="#" className="text-primary hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>
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
                Want to earn from your parking spaces?{' '}
                <Link
                  to="/host"
                  onClick={onClose}
                  className="text-primary hover:underline font-medium"
                >
                  Become a host
                </Link>
              </p>
            </div>
          )}

          {/* Demo Skip Button */}
          <div className="pt-4 border-t border-gray-100">
            <Button
              onClick={() => {
                // Mock demo user for testing
                onClose();
                navigate('/renter/search');
              }}
              variant="ghost"
              className="w-full text-gray-500 hover:text-gray-700 hover:bg-gray-50 text-sm"
              disabled={loading}
            >
              Skip for Demo →
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
