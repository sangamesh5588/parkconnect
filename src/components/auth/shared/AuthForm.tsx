import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock, Loader2 } from "lucide-react";

interface AuthFormProps {
  mode: 'signup' | 'signin';
  email: string;
  password: string;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: () => void;
  isSignup?: boolean;
  loading?: boolean;
  error?: string;
  onForgotPassword?: () => void;
}

export const AuthForm = ({
  mode,
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  isSignup = false,
  loading = false,
  error = "",
  onForgotPassword
}: AuthFormProps) => {
  return (
    <>
      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-gray-500">Or</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600 leading-relaxed">{error}</p>
        </div>
      )}

      {/* Email Signup Form */}
      <div className="space-y-4 sm:space-y-5">
        <div className="space-y-2">
          <Label htmlFor={`${mode}-email`} className="text-sm font-medium text-gray-700 block">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 flex-shrink-0" />
            <Input
              id={`${mode}-email`}
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              className="pl-10 h-12 sm:h-11 text-base touch-target"
              disabled={loading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${mode}-password`} className="text-sm font-medium text-gray-700 block">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 flex-shrink-0" />
            <Input
              id={`${mode}-password`}
              type="password"
              placeholder={isSignup ? "Create a password (min 6 chars)" : "Enter your password"}
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              className="pl-10 h-12 sm:h-11 text-base touch-target"
              disabled={loading}
            />
          </div>
        </div>

        {!isSignup && onForgotPassword && (
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <button
                onClick={onForgotPassword}
                className="text-primary hover:underline font-medium"
                disabled={loading}
              >
                Forgot password?
              </button>
            </div>
          </div>
        )}

        <Button
          onClick={onSubmit}
          className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold"
          disabled={!email || !password || loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isSignup ? 'Creating Account...' : 'Signing In...'}
            </>
          ) : (
            isSignup ? 'Create Account' : 'Sign In'
          )}
        </Button>
      </div>
    </>
  );
};
