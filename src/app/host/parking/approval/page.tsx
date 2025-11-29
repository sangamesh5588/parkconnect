import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Clock, Shield, ArrowRight, Loader2, MapPin, Car, DollarSign } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useMockParkingListings, mockHostId } from "@/hooks/use-mock-parking-listings";

export default function ParkingApprovalWaiting() {
  const [isSkipping, setIsSkipping] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { getListingsByHost, updateListing } = useMockParkingListings();

  // Get the most recently created listing (pending approval)
  const listings = getListingsByHost(mockHostId);
  const pendingListing = listings
    .filter(listing => listing.status === 'pending')
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];

  const handleSkipDemo = async () => {
    setIsSkipping(true);

    // Simulate admin approval for demo purposes
    if (pendingListing) {
      updateListing(pendingListing.id, { status: 'live' });
    }

    // Simulate a brief loading state
    await new Promise(resolve => setTimeout(resolve, 1500));

    navigate('/host/dashboard', {
      state: { approvalSkipped: true, listingApproved: true }
    });
  };

  if (!pendingListing) {
    // No pending listing, redirect to dashboard
    navigate('/host/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Main Content Card */}
        <Card className="p-8 sm:p-10 text-center shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
            <CheckCircle className="w-10 h-10 text-gray-900" />
          </div>

          {/* Main Heading */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Parking Space Submitted! 🎉
          </h1>

          {/* Status Message */}
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-gray-100 border border-gray-200 rounded-full mb-4">
              <Clock className="w-4 h-4 text-gray-900 mr-2" />
              <span className="text-sm font-medium text-gray-900">Under Admin Review</span>
            </div>

            <p className="text-gray-600 text-lg leading-relaxed">
              Your parking space "{pendingListing.name}" has been submitted for admin verification.
              We're checking location accuracy, slot reasonableness, photos, and pricing fairness.
            </p>
          </div>

          {/* Listing Summary */}
          <div className="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-3">Listing Summary</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Location:
                </span>
                <span className="font-medium">{pendingListing.address}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <Car className="w-4 h-4 mr-2" />
                  Total Slots:
                </span>
                <span className="font-medium">
                  {pendingListing.totalCarSlots + pendingListing.totalBikeSlots} slots
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Hourly Rate:
                </span>
                <span className="font-medium">₹{pendingListing.hourlyCarRate}/hr</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-8">
            <div className="flex items-center justify-between max-w-xs mx-auto">
              {/* Step 1 - Completed */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center mb-2">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs text-gray-600">Submitted</span>
              </div>

              {/* Connector */}
              <div className="flex-1 h-0.5 bg-gray-900 mx-2"></div>

              {/* Step 2 - Current */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center mb-2 animate-pulse">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs text-gray-900 font-medium">Reviewing</span>
              </div>

              {/* Connector */}
              <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>

              {/* Step 3 - Future */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                  <Shield className="w-5 h-5 text-gray-600" />
                </div>
                <span className="text-xs text-gray-500">Live</span>
              </div>
            </div>
          </div>

          {/* Information Cards */}
          <div className="space-y-4 mb-8">
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-2">What our admins check?</h3>
              <ul className="text-sm text-gray-700 leading-relaxed text-left space-y-1">
                <li>• 📍 Location accuracy and accessibility</li>
                <li>• 🚗 Slot count reasonableness</li>
                <li>• 📸 Photo quality and authenticity</li>
                <li>• 💰 Pricing competitiveness</li>
              </ul>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-2">Once approved...</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Your parking space goes live and becomes visible to renters immediately.
                You can start managing daily availability and earning from bookings!
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            {/* Skip for Demo Button */}
            <Button
              onClick={handleSkipDemo}
              disabled={isSkipping}
              className="w-full h-14 bg-gray-900 hover:bg-gray-800 text-white text-base font-semibold rounded-xl shadow-sm"
            >
              {isSkipping ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Approving for demo...
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
              <Link to="/host/dashboard">
                <Button variant="outline" className="px-6">
                  Check Status Later
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="px-6">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Need help? Contact us at{' '}
              <a href="mailto:support@parkconnect.com" className="text-gray-900 hover:underline">
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
