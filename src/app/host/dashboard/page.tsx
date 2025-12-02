import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Plus, Settings, Clock, Calendar, Car, FileText, BarChart3, X, Eye, TrendingUp, Users, DollarSign, MapPin } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { useMockParkingListings, mockHostId } from "@/hooks/use-mock-parking-listings";
import { useMockBookings } from "@/hooks/use-mock-bookings";
import { useParkingSessions } from "@/hooks/use-parking-sessions";
import ParkingTimer from "@/components/ParkingTimer";

// Loading and Error Components
import { HostErrorBoundary } from "@/components/ui/HostErrorBoundary";
import { DashboardSkeleton, LoadingOverlay, usePullToRefresh } from "@/components/ui/HostLoadingStates";

// Parking Listing Components
import { useParkingListingStore } from "@/hooks/use-parking-listing-store";
import {
  ParkingDetailsStep,
  SlotSetupStep,
  PricingStep,
  AvailabilityStep
} from "@/components/parking-listing";

export default function HostDashboard() {
  const location = useLocation();
  const [showWelcome, setShowWelcome] = useState(!location.state?.listingCreated && !location.state?.approvalSkipped);
  const [showApprovalSuccess, setShowApprovalSuccess] = useState(false);
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [showDailySlots, setShowDailySlots] = useState(false);
  const { getTotalStats, getListingsByHost } = useMockParkingListings();
  const { getTotalStats: getBookingStats } = useMockBookings();
  const { getActiveSessions } = useParkingSessions();

  // Pull to refresh functionality
  const { pullDistance, isRefreshing, canRefresh, touchHandlers } = usePullToRefresh(
    async () => {
      // Simulate data refresh
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Dashboard data refreshed');
    },
    80 // threshold in pixels
  );

  // Get real stats from stored listings
  const bookingStats = getBookingStats(mockHostId);
  const listings = getListingsByHost(mockHostId);

  // Get pending and live listings
  const pendingListings = listings.filter(listing => listing.status === 'pending');
  const liveListings = listings.filter(listing => listing.status === 'live');

  // Get active parking sessions
  const activeSessions = getActiveSessions();

  // Only allow creating new listing if host doesn't already have one
  const canCreateListing = listings.length === 0;

  // Handle success messages
  useEffect(() => {
    if (location.state?.listingCreated) {
      setShowWelcome(false);
    }
    if (location.state?.approvalSkipped || location.state?.listingApproved) {
      setShowApprovalSuccess(true);
      setTimeout(() => setShowApprovalSuccess(false), 5000);
    }
  }, [location.state]);

  return (
    <div
      className="pb-20"
      {...touchHandlers}
      style={{
        transform: pullDistance > 0 ? `translateY(${pullDistance}px)` : undefined,
        transition: pullDistance === 0 ? 'transform 0.3s ease-out' : undefined,
      }}
    >
      {/* Pull to Refresh Indicator */}
      {pullDistance > 0 && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
          <div className="flex items-center justify-center py-4">
            <div className={`flex items-center space-x-2 transition-all duration-200 ${
              canRefresh ? 'text-blue-600' : 'text-gray-400'
            }`}>
              <div className={`transform transition-transform duration-200 ${
                canRefresh ? 'rotate-180' : ''
              }`}>
                ↓
              </div>
              <span className="text-sm font-medium">
                {canRefresh ? 'Release to refresh' : 'Pull to refresh'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      <LoadingOverlay isVisible={isRefreshing} message="Refreshing data..." />

      {/* Mobile-First Dashboard Content */}
      <div className="space-y-6">
        {/* Welcome Message - Only show briefly */}
        {showWelcome && (
          <Card className="mx-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Welcome to ParkConnect! 🎉</h3>
                <p className="text-sm text-gray-600 mb-3">Your host account is ready. Start by listing your parking space.</p>
                <Button size="sm" onClick={() => setShowWelcome(false)} variant="outline" className="text-xs">
                  Got it
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Today's Overview - Key Stats */}
        <div className="mx-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-gray-600" />
            Today's Overview
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {/* Active Sessions */}
            <Card className="p-4 text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="text-2xl font-bold text-blue-900 mb-1">{activeSessions.length}</div>
              <div className="text-xs text-blue-700 font-medium">Active Sessions</div>
            </Card>

            {/* Today's Bookings */}
            <Card className="p-4 text-center bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <div className="text-2xl font-bold text-green-900 mb-1">{bookingStats.totalBookings}</div>
              <div className="text-xs text-green-700 font-medium">Today's Bookings</div>
            </Card>
          </div>
        </div>

        {/* Quick Actions - Touch Friendly */}
        <div className="mx-4">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Quick Actions</h3>

          <div className="grid grid-cols-3 gap-4">
            {/* List Parking Space */}
            {canCreateListing && (
              <Link to="/host/parking/list">
                <Card className="p-4 cursor-pointer hover:shadow-md transition-all duration-200 active:scale-95 bg-white border-2 hover:border-blue-300">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Plus className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-xs font-medium text-gray-900">List Space</div>
                  </div>
                </Card>
              </Link>
            )}

            {/* Manage Parking */}
            {liveListings.length > 0 && (
              <Card
                onClick={() => setShowSlotModal(true)}
                className="p-4 cursor-pointer hover:shadow-md transition-all duration-200 active:scale-95 bg-white border-2 hover:border-gray-300"
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Settings className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="text-xs font-medium text-gray-900">Manage</div>
                </div>
              </Card>
            )}

            {/* View Bookings */}
            <Link to="/host/bookings">
              <Card className="p-4 cursor-pointer hover:shadow-md transition-all duration-200 active:scale-95 bg-white border-2 hover:border-orange-300">
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2 relative">
                    <FileText className="w-6 h-6 text-orange-600" />
                    {bookingStats.totalBookings > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs bg-orange-500">
                        {bookingStats.totalBookings > 9 ? '9+' : bookingStats.totalBookings}
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs font-medium text-gray-900">Bookings</div>
                </div>
              </Card>
            </Link>
          </div>
        </div>

        {/* Status Messages */}
        {pendingListings.length > 0 && (
          <Card className="mx-4 p-4 bg-yellow-50 border-yellow-200">
            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-yellow-900 mb-1">
                  {pendingListings.length} Listing{pendingListings.length > 1 ? 's' : ''} Under Review
                </h4>
                <p className="text-xs text-yellow-700 mb-2">
                  We'll notify you once {pendingListings.length > 1 ? 'they are' : 'it is'} approved.
                </p>
                <Link to="/host/parking/approval">
                  <Button size="sm" variant="outline" className="text-xs h-7 border-yellow-300 text-yellow-700 hover:bg-yellow-100">
                    Check Status
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        )}

        {showApprovalSuccess && (
          <Card className="mx-4 p-4 bg-green-50 border-green-200">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-green-900 mb-1">🎉 Listing Approved!</h4>
                <p className="text-xs text-green-700">Your parking space is now live and accepting bookings.</p>
              </div>
            </div>
          </Card>
        )}

        {/* Active Sessions - If any */}
        {activeSessions.length > 0 && (
          <div className="mx-4">
            <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
              <Clock className="w-4 h-4 mr-2 text-blue-600" />
              Active Sessions ({activeSessions.length})
            </h3>

            <div className="space-y-3">
              {activeSessions.slice(0, 3).map((session) => {
                const now = new Date().getTime();
                const bookedEndTime = session.bookedEndTime.getTime();
                const overtimeMs = Math.max(0, now - bookedEndTime);
                const overtimeMinutes = Math.floor(overtimeMs / (1000 * 60));

                return (
                  <Card key={session.id} className="p-4 bg-white border">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="text-xl">🚗</div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{session.customerName}</div>
                          <div className="text-xs text-gray-500">{session.vehicleNumber}</div>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        overtimeMinutes > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {overtimeMinutes > 0 ? `${overtimeMinutes}m overtime` : 'Active'}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900 mb-1">
                        {Math.floor((bookedEndTime - now) / (1000 * 60))} min left
                      </div>
                      <div className="text-xs text-gray-600">Parking session ends at {session.bookedEndTime.toLocaleTimeString()}</div>
                    </div>
                  </Card>
                );
              })}

              {activeSessions.length > 3 && (
                <Link to="/host/sessions">
                  <Button variant="outline" className="w-full" size="sm">
                    View All {activeSessions.length} Sessions
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Getting Started - For new hosts */}
        {listings.length === 0 && !showWelcome && (
          <div className="mx-4">
            <Card className="p-6 text-center bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Start Earning?</h3>
              <p className="text-sm text-gray-600 mb-4">List your parking space and start accepting bookings in minutes.</p>
              <Link to="/host/parking/list">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  List Your Parking Space
                </Button>
              </Link>
            </Card>
          </div>
        )}

        {/* Parking Space Status - If live listings exist */}
        {liveListings.length > 0 && (
          <div className="mx-4">
            <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-green-600" />
              Your Parking Space
            </h3>

            {liveListings.map((listing) => {
              const utilizationPercent = Math.round(
                ((listing.activeCarSlots + listing.activeBikeSlots) /
                 (listing.totalCarSlots + listing.totalBikeSlots)) * 100
              );

              return (
                <Card key={listing.id} className="p-4 bg-white border">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{listing.name}</h4>
                      <p className="text-sm text-gray-600">{listing.address}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">{utilizationPercent}%</div>
                      <div className="text-xs text-gray-600">Utilized</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Utilization Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${utilizationPercent}%` }}
                      />
                    </div>

                    {/* Slot Counts */}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {listing.activeCarSlots + listing.activeBikeSlots} / {listing.totalCarSlots + listing.totalBikeSlots} slots active
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowSlotModal(true)}
                        className="text-xs h-7"
                      >
                        Manage
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Slot Management Modal */}
      <SlotManagementModal
        isOpen={showSlotModal}
        onClose={() => setShowSlotModal(false)}
        listings={liveListings}
      />
    </div>
  );
}

// Parking Listing Modal Component
function ParkingListingModal({ isOpen, onClose, onComplete }: { isOpen: boolean; onClose: () => void; onComplete: () => void }) {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const parkingListingSteps = [
    { id: 1, title: "Details", subtitle: "Basic Info", icon: MapPin, component: ParkingDetailsStep },
    { id: 2, title: "Capacity", subtitle: "Total Slots", icon: Car, component: SlotSetupStep },
    { id: 3, title: "Pricing", subtitle: "Set Rates", icon: DollarSign, component: PricingStep },
    { id: 4, title: "Schedule", subtitle: "Availability", icon: Clock, component: AvailabilityStep },
  ];

  const {
    currentStep,
    setCurrentStep,
    listingData,
    updateListingData,
    validateStep,
    canAccessStep,
    completeListing,
    reset,
  } = useParkingListingStore();

  const { addListing } = useMockParkingListings();

  const progress = (currentStep / parkingListingSteps.length) * 100;
  const CurrentStepComponent = parkingListingSteps[currentStep - 1].component;

  useEffect(() => {
    // Smooth transition effect
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 150);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < parkingListingSteps.length) {
        setCurrentStep(currentStep + 1);
      } else {
        // Complete the listing
        handleComplete();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    try {
      // Save listing to mock store
      addListing({
        hostId: mockHostId,
        name: listingData.name,
        address: listingData.address,
        location: listingData.location,
        parkingType: listingData.parkingType,
        areaType: listingData.areaType,
        photos: listingData.photos,
        instructions: listingData.instructions,
        totalCarSlots: listingData.totalCarSlots,
        totalBikeSlots: listingData.totalBikeSlots,
        activeCarSlots: listingData.activeCarSlots,
        activeBikeSlots: listingData.activeBikeSlots,
        hourlyCarRate: listingData.hourlyCarRate,
        hourlyBikeRate: listingData.hourlyBikeRate,
        dailyCarRate: listingData.dailyCarRate,
        dailyBikeRate: listingData.dailyBikeRate,
        openTime: listingData.openTime,
        closeTime: listingData.closeTime,
        is24Hours: listingData.is24Hours,
        closedDays: listingData.closedDays,
        status: 'pending',
      });

      console.log("Parking listing saved to mock store:", listingData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      completeListing();
      reset();

      // Close modal and navigate to approval page
      onComplete();
      navigate('/host/parking/approval');

    } catch (error) {
      console.error("Failed to create parking listing:", error);
    }
  };

  const currentStepData = parkingListingSteps[currentStep - 1];
  const IconComponent = currentStepData.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-4 top-4 z-10"
          >
            <X className="w-4 h-4" />
          </Button>

          {/* Progress Section */}
          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Step Indicators */}
            <div className="grid grid-cols-4 gap-2">
              {parkingListingSteps.map((step, index) => {
                const StepIcon = step.icon;
                const isCompleted = currentStep > step.id;
                const isCurrent = step.id === currentStep;

                return (
                  <div key={step.id} className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isCurrent
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-400'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <StepIcon className="w-5 h-5" />
                      )}
                    </div>
                    <div className="text-center mt-2 min-h-[2rem] flex flex-col justify-center">
                      <div className={`text-xs font-medium ${
                        isCurrent ? 'text-blue-600' : 'text-gray-600'
                      }`}>
                        {step.title}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step Header */}
          <div className={`text-center transition-all duration-300 ${isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-3xl mb-4 ${
              currentStep > 0 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
            }`}>
              <IconComponent className="w-7 h-7" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentStepData.title} & {currentStepData.subtitle}
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed max-w-lg mx-auto">
              {currentStep === 1 && "Tell us about your parking space location and basic details."}
              {currentStep === 2 && "Set the total number of parking slots you have available."}
              {currentStep === 3 && "Set competitive pricing for your parking space."}
              {currentStep === 4 && "Configure when your parking space is available for bookings."}
            </p>
          </div>
        </DialogHeader>

        {/* Step Content */}
        <div className={`transition-all duration-300 delay-75 ${isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
          <CurrentStepComponent
            onNext={handleNext}
            onPrevious={handlePrevious}
            isLastStep={currentStep === parkingListingSteps.length}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Slot Management Modal Component
function SlotManagementModal({ isOpen, onClose, listings }: { isOpen: boolean; onClose: () => void; listings: any[] }) {
  const [savingSlots, setSavingSlots] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState<string | null>(null);
  const [dailySlots, setDailySlots] = useState<Record<string, { activeCarSlots: number; activeBikeSlots: number }>>({});
  const { updateActiveSlots } = useMockParkingListings();

  useEffect(() => {
    // Initialize daily slots with current values
    const initialSlots: Record<string, { activeCarSlots: number; activeBikeSlots: number }> = {};
    listings.forEach(listing => {
      initialSlots[listing.id] = {
        activeCarSlots: listing.activeCarSlots,
        activeBikeSlots: listing.activeBikeSlots
      };
    });
    setDailySlots(initialSlots);
  }, [listings]);

  const handleSaveSlots = async (listingId: string) => {
    setSavingSlots(listingId);
    const currentSlots = dailySlots[listingId];

    if (currentSlots) {
      updateActiveSlots(listingId, currentSlots.activeCarSlots, currentSlots.activeBikeSlots);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSavingSlots(null);
      setShowSuccess(listingId);

      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(null), 3000);
    }
  };

  const handleSetFullCapacity = (listingId: string) => {
    const listing = listings.find(l => l.id === listingId);
    if (listing) {
      setDailySlots(prev => ({
        ...prev,
        [listingId]: {
          activeCarSlots: listing.totalCarSlots,
          activeBikeSlots: listing.totalBikeSlots
        }
      }));
    }
  };

  const handleSet80PercentCapacity = (listingId: string) => {
    const listing = listings.find(l => l.id === listingId);
    if (listing) {
      setDailySlots(prev => ({
        ...prev,
        [listingId]: {
          activeCarSlots: Math.floor(listing.totalCarSlots * 0.8),
          activeBikeSlots: Math.floor(listing.totalBikeSlots * 0.8)
        }
      }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white border border-gray-200 shadow-2xl">
        <div>
          <DialogHeader className="text-white">
            <DialogTitle className="text-2xl font-bold text-center mb-2 text-black">
              Manage Active Slots
            </DialogTitle>
            <p className="text-sm text-black text-center">
              Set the number of parking slots available for booking today
            </p>
          </DialogHeader>

          <div className="space-y-6 p-6">
            {listings.map((listing) => {
              const currentSlots = dailySlots[listing.id] || {
                activeCarSlots: listing.activeCarSlots,
                activeBikeSlots: listing.activeBikeSlots
              };
              const utilizationPercent = Math.round(
                ((currentSlots.activeCarSlots + currentSlots.activeBikeSlots) /
                 (listing.totalCarSlots + listing.totalBikeSlots)) * 100
              );

              return (
                <Card key={listing.id} className="relative overflow-hidden border-0 shadow-2xl">
                  {/* Card Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 opacity-95"></div>

                  {/* Animated Border */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-green-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg blur-sm"></div>

                  <div className="relative p-6 z-10">
                    <div className="space-y-6">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 drop-shadow-sm">{listing.name}</h3>
                          <p className="text-sm text-gray-600">{listing.address}</p>
                        </div>
                        {showSuccess === listing.id && (
                          <div className="flex items-center bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                            ✓ Saved!
                          </div>
                        )}
                      </div>

                      {/* Current Status */}
                      <div className="p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 rounded-xl">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">Current Capacity</p>
                            <p className="text-xs text-gray-600">Available for booking today</p>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                              {utilizationPercent}%
                            </div>
                            <div className="text-xs text-gray-600">Utilized</div>
                          </div>
                        </div>

                        {/* Utilization Bar */}
                        <div className="mt-4 w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${
                              utilizationPercent >= 80 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                              utilizationPercent >= 50 ? 'bg-gradient-to-r from-blue-400 to-purple-500' :
                              'bg-gradient-to-r from-yellow-400 to-orange-500'
                            }`}
                            style={{ width: `${utilizationPercent}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Slot Controls */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Car Slots */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">Car Parking Slots</h4>
                              <p className="text-sm text-gray-600">Available: {listing.totalCarSlots} total</p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-blue-600">
                                {currentSlots.activeCarSlots} / {listing.totalCarSlots}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Active slots today
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                min="0"
                                max={listing.totalCarSlots}
                                value={currentSlots.activeCarSlots}
                                onChange={(e) => {
                                  const value = Math.max(0, Math.min(listing.totalCarSlots, parseInt(e.target.value) || 0));
                                  setDailySlots(prev => ({
                                    ...prev,
                                    [listing.id]: {
                                      ...prev[listing.id],
                                      activeCarSlots: value
                                    }
                                  }));
                                }}
                                className="w-full h-14 text-xl text-center font-bold border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 bg-white shadow-sm hover:shadow-md"
                              />
                              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            </div>
                          </div>
                        </div>

                        {/* Bike Slots */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">Bike Parking Slots</h4>
                              <p className="text-sm text-gray-600">Available: {listing.totalBikeSlots} total</p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-green-600">
                                {currentSlots.activeBikeSlots} / {listing.totalBikeSlots}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Active slots today
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                min="0"
                                max={listing.totalBikeSlots}
                                value={currentSlots.activeBikeSlots}
                                onChange={(e) => {
                                  const value = Math.max(0, Math.min(listing.totalBikeSlots, parseInt(e.target.value) || 0));
                                  setDailySlots(prev => ({
                                    ...prev,
                                    [listing.id]: {
                                      ...prev[listing.id],
                                      activeBikeSlots: value
                                    }
                                  }));
                                }}
                                className="w-full h-14 text-xl text-center font-bold border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-300 bg-white shadow-sm hover:shadow-md"
                              />
                              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/5 to-emerald-500/5 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex gap-4">
                        <Button
                          type="button"
                          onClick={() => handleSetFullCapacity(listing.id)}
                          className="flex-1 h-12 bg-black hover:bg-gray-800 text-white rounded-xl font-semibold"
                        >
                          Full Capacity
                        </Button>
                        <Button
                          type="button"
                          onClick={() => handleSet80PercentCapacity(listing.id)}
                          className="flex-1 h-12 bg-black hover:bg-gray-800 text-white rounded-xl font-semibold"
                        >
                          80% Capacity
                        </Button>
                      </div>

                      {/* Save Button */}
                      <Button
                        onClick={() => handleSaveSlots(listing.id)}
                        disabled={savingSlots === listing.id}
                        className="w-full h-14 bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-900 text-white text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                      >
                        {savingSlots === listing.id ? "Saving..." : "Update Today's Availability"}
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
