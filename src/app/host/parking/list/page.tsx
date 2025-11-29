import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, MapPin, Car, Settings, DollarSign, Clock, ChevronRight, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useParkingListingStore } from "@/hooks/use-parking-listing-store";
import { useMockParkingListings, mockHostId } from "@/hooks/use-mock-parking-listings";

// Step Components
import {
  ParkingDetailsStep,
  SlotSetupStep,
  PricingStep,
  AvailabilityStep
} from "@/components/parking-listing";

const steps = [
  { id: 1, title: "Details", subtitle: "Basic Info", icon: MapPin, component: ParkingDetailsStep },
  { id: 2, title: "Capacity", subtitle: "Total Slots", icon: Car, component: SlotSetupStep },
  { id: 3, title: "Pricing", subtitle: "Set Rates", icon: DollarSign, component: PricingStep },
  { id: 4, title: "Schedule", subtitle: "Availability", icon: Clock, component: AvailabilityStep },
];

export default function ParkingListFlow() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();

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

  const { getListingsByHost } = useMockParkingListings();
  const listings = getListingsByHost(mockHostId);
  const liveListings = listings.filter(listing => listing.status === 'live');

  // Redirect if user already has a live listing
  if (liveListings.length > 0) {
    navigate('/host/dashboard');
    return null;
  }

  const progress = (currentStep / steps.length) * 100;
  const CurrentStepComponent = steps[currentStep - 1].component;

  useEffect(() => {
    // Smooth transition effect
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 150);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length) {
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

  const { addListing } = useMockParkingListings();

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

      // Navigate to approval waiting page
      navigate('/host/parking/approval');

    } catch (error) {
      console.error("Failed to create parking listing:", error);
    }
  };

  const currentStepData = steps[currentStep - 1];
  const IconComponent = currentStepData.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50/50 to-slate-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-20 shadow-soft">
        <div className="container-mobile">
          {/* Top Navigation */}
          <div className="flex items-center justify-between py-4">
            <Link
              to="/host/dashboard"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-all duration-200 min-h-[44px] px-2 rounded-md hover:bg-gray-50"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="hidden sm:inline font-medium">Back to Dashboard</span>
            </Link>

            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">ParkConnect</h1>
              <p className="text-sm text-gray-600">
                Step {currentStep} of {steps.length}
              </p>
            </div>

            <div className="w-16 sm:w-20"></div> {/* Spacer */}
          </div>

          {/* Progress Section */}
          <div className="pb-6">
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-600 mb-2">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-3 bg-gray-100" />
            </div>

            {/* Step Indicators - Mobile Optimized */}
            <div className="grid grid-cols-5 gap-1 sm:gap-2">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isCompleted = currentStep > step.id;
                const isCurrent = step.id === currentStep;
                const isAccessible = canAccessStep(step.id);

                return (
                  <div key={step.id} className="flex flex-col items-center">
                    <div className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      isCompleted
                        ? 'bg-green-500 text-white shadow-lg'
                        : isCurrent
                          ? 'bg-blue-600 text-white shadow-lg scale-105'
                          : isAccessible
                            ? 'bg-white border-2 border-gray-200 text-gray-400 hover:border-gray-300'
                            : 'bg-gray-50 border-2 border-gray-100 text-gray-300'
                    }`}>
                      {isCompleted ? (
                        <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <StepIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </div>

                    <div className="text-center mt-1 min-h-[2rem] flex flex-col justify-center">
                      <div className={`text-xs font-medium leading-tight ${
                        isCurrent ? 'text-blue-600' : 'text-gray-600'
                      }`}>
                        {step.title}
                      </div>
                      <div className={`text-xs leading-tight hidden sm:block ${
                        isCurrent ? 'text-blue-500' : 'text-gray-500'
                      }`}>
                        {step.subtitle}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Mobile Optimized */}
      <main className="flex-1 container-mobile py-6 sm:py-8">
        <div className="max-w-2xl mx-auto">
          {/* Step Header */}
          <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-3xl mb-4 ${
                currentStep > 0 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
              }`}>
                <IconComponent className="w-7 h-7 sm:w-9 sm:h-9" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {currentStepData.title} & {currentStepData.subtitle}
              </h2>

              <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-lg mx-auto px-4">
                {currentStep === 1 && "Tell us about your parking space location and basic details."}
                {currentStep === 2 && "Set the total number of parking slots you have available."}
                {currentStep === 3 && "Set competitive pricing for your parking space."}
                {currentStep === 4 && "Configure when your parking space is available for bookings."}
              </p>
            </div>
          </div>

          {/* Step Content */}
          <div className={`transition-all duration-300 delay-75 ${isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
            <CurrentStepComponent
              onNext={handleNext}
              onPrevious={handlePrevious}
              isLastStep={currentStep === steps.length}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
