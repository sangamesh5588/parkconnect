import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import GoogleIcon from "@/assets/icons/GoogleIcon";
import AppleIcon from "@/assets/icons/AppleIcon";
import FacebookIcon from "@/assets/icons/FacebookIcon";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md card-clean p-8 space-y-6">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Link>

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-responsive-2xl font-bold">Welcome to ParkConnect</h1>
          <p className="text-muted-foreground">Sign in with your preferred method</p>
        </div>

        {/* Social Login */}
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="outline"
              className="w-full touch-target"
              onClick={() => console.log("Google login")}
            >
              <GoogleIcon className="h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              className="w-full touch-target"
              onClick={() => console.log("Apple login")}
            >
              <AppleIcon className="h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              className="w-full touch-target"
              onClick={() => console.log("Facebook login")}
            >
              <FacebookIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Terms */}
        <p className="text-center text-responsive-sm text-muted-foreground">
          By signing in, you agree to our{" "}
          <Link to="/terms" className="underline hover:text-foreground">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="underline hover:text-foreground">
            Privacy Policy
          </Link>
        </p>
      </Card>
    </div>
  );
}
