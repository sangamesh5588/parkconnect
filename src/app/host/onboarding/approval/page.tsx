import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Clock, Shield, ArrowRight, Loader2 } from "lucide-react";
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
      <div className="max-w-lg w-full">
        {/* Main Content Card */}
        <Card className="p-8 sm:p-10 text-center shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-secondary rounded-full mb-6">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>

          {/* Main Heading */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Application Submitted Successfully! 🎉
          </h1>

          {/* Status Message */}
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-secondary border border-border rounded-full mb-4">
              <Clock className="w-4 h-4 text-primary mr-2" />
              <span className="text-sm font-medium text-primary">Under Review</span>
            </div>

            <p className="text-gray-600 text-lg leading-relaxed">
              Your host application and documents have been submitted for verification.
              We're reviewing your information to ensure everything is in order.
            </p>
          </div>

          {/* Timeline */}
          <div className="mb-8">
            <div className="flex items-center justify-between max-w-xs mx-auto">
              {/* Step 1 - Completed */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mb-2">
                  <CheckCircle className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xs text-gray-600">Submitted</span>
              </div>

              {/* Connector */}
              <div className="flex-1 h-0.5 bg-primary mx-2"></div>

              {/* Step 2 - Current */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mb-2 animate-pulse">
                  <Clock className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xs text-primary font-medium">Reviewing</span>
              </div>

              {/* Connector */}
              <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>

              {/* Step 3 - Future */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mb-2">
                  <Shield className="w-5 h-5 text-gray-500" />
                </div>
                <span className="text-xs text-gray-500">Approved</span>
              </div>
            </div>
          </div>

          {/* Information Cards */}
          <div className="space-y-4 mb-8">
            <div className="p-4 bg-secondary border border-border rounded-xl">
              <h3 className="font-semibold text-primary mb-2">What happens next?</h3>
              <p className="text-sm text-primary/80 leading-relaxed">
                Our team will review your documents within 24-48 hours. You'll receive an email notification once your account is approved.
              </p>
            </div>

            <div className="p-4 bg-secondary border border-border rounded-xl">
              <h3 className="font-semibold text-primary mb-2">Ready to start earning?</h3>
              <p className="text-sm text-primary/80 leading-relaxed">
                Once approved, you can immediately start listing your parking spaces and earning from bookings.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            {/* Skip for Demo Button */}
            <Button
              onClick={handleSkipDemo}
              disabled={isSkipping}
              className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground text-base font-semibold rounded-xl shadow-sm"
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

            {/* Alternative Actions */}
            <div className="flex gap-3 justify-center">
              <Link to="/">
                <Button variant="outline" className="px-6">
                  Back to Home
                </Button>
              </Link>
              <Link to="/renter/search">
                <Button variant="outline" className="px-6">
                  Browse Parking
                </Button>
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Questions? Contact us at{' '}
              <a href="mailto:support@parkconnect.com" className="text-primary hover:underline">
                support@parkconnect.com
              </a>
            </p>
          </div>
        </Card>

        {/* Bottom Message */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Thank you for choosing ParkConnect! 🚗✨
          </p>
        </div>
      </div>
    </div>
  );
}
