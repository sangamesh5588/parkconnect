import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Clock, ArrowRight, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function HostApprovalWaiting() {
  const [isSkipping, setIsSkipping] = useState(false);
  const navigate = useNavigate();

  const handleSkipDemo = async () => {
    setIsSkipping(true);
    // Simulate a brief loading state
    await new Promise(resolve => setTimeout(resolve, 1000));
    navigate('/host/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm mx-auto">
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
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-8 px-2">
            Your application is being reviewed. You'll receive an email notification once approved.
          </p>

          {/* Primary Action Button */}
          <div className="space-y-4">
            <Button
              onClick={handleSkipDemo}
              disabled={isSkipping}
              className="w-full h-12 sm:h-14 bg-primary hover:bg-primary/90 text-primary-foreground text-base font-semibold rounded-xl shadow-sm"
            >
              {isSkipping ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Setting up demo...
                </>
              ) : (
                <>
                  Skip for Demo
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>

            {/* Secondary Action */}
            <Link to="/" className="block">
              <Button
                variant="outline"
                className="w-full h-12 text-base font-medium rounded-xl"
              >
                Back to Home
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
