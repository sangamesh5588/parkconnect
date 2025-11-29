import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Check, MapPin, CreditCard, Shield, User, Home, ChevronRight, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useOnboardingStore } from "@/hooks/use-onboarding-store";
import HostPersonalDetails from "@/components/onboarding/HostPersonalDetails";
import HostAddressSetup from "@/components/onboarding/HostAddressSetup";
import HostPaymentSetup from "@/components/onboarding/HostPaymentSetup";
import HostKycVerification from "@/components/onboarding/HostKycVerification";

const steps = [
  { id: 1, title: "Personal", subtitle: "Details", icon: User, component: HostPersonalDetails },
  { id: 2, title: "Address", subtitle: "& Location", icon: Home, component: HostAddressSetup },
  { id: 3, title: "Payment", subtitle: "Setup", icon: CreditCard, component: HostPaymentSetup },
  { id: 4, title: "Verification", subtitle: "Complete", icon: Shield, component: HostKycVerification },
];

export default function HostOnboarding() {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const {
    currentStep,
    setCurrentStep,
    completedSteps,
    setStepCompleted,
    isStepValid,
    canAccessStep,
    reset,
    personalDetails,
    setPersonalDetails,
    addressDetails,
    setAddressDetails,
    paymentSetup,
    setPaymentSetup,
    kycDocuments,
    setKycDocuments
  } = useOnboardingStore();

  const progress = (currentStep / steps.length) * 100;
  const CurrentStepComponent = steps[currentStep - 1].component;
  const navigate = useNavigate();

  useEffect(() => {
    // Smooth transition effect
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 150);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const handleNext = () => {
    // Validate current step before proceeding
    if (isStepValid(currentStep)) {
      // Mark current step as completed
      const stepKey = getStepKey(currentStep);
      setStepCompleted(stepKey, true);

      // Move to next step
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepKey = (stepNumber: number): 'personal' | 'address' | 'payment' | 'verification' => {
    switch (stepNumber) {
      case 1: return 'personal';
      case 2: return 'address';
      case 3: return 'payment';
      case 4: return 'verification';
      default: return 'personal';
    }
  };

  const handleComplete = () => {
    console.log("Host onboarding completed");
    // Clear data after successful completion
    reset();
    // Navigate to approval waiting page
    navigate('/host/onboarding/approval');
  };

  // Transform store data to match component props
  const getFormDataForStep = () => {
    switch (currentStep) {
      case 1:
        return { personalDetails };
      case 2:
        return { addressSetup: addressDetails };
      case 3:
        return { paymentSetup };
      case 4:
        return { kycDocuments };
      default:
        return {};
    }
  };

  // Calculate completed steps count for progress
  const completedStepsCount = Object.values(completedSteps).filter(Boolean).length;

  const currentStepData = steps[currentStep - 1];
  const IconComponent = currentStepData.icon;

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile-First Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-20">
        <div className="container-mobile">
          {/* Top Navigation */}
          <div className="flex items-center justify-between py-4">
            <Link
              to="/"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors min-h-[44px] px-2"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="hidden sm:inline">Back to Home</span>
            </Link>

            <div className="text-center">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Become a Host</h1>
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
            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const stepKey = getStepKey(step.id);
                const isCompleted = completedSteps[stepKey];
                const isCurrent = step.id === currentStep;
                const isAccessible = canAccessStep(step.id);

                return (
                  <div key={step.id} className="flex flex-col items-center">
                    <div className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      isCompleted
                        ? 'bg-green-500 text-white shadow-lg'
                        : isCurrent
                          ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                          : isAccessible
                            ? 'bg-white border-2 border-gray-200 text-gray-400 hover:border-gray-300'
                            : 'bg-gray-50 border-2 border-gray-100 text-gray-300'
                    }`}>
                      {isCompleted ? (
                        <Check className="w-5 h-5 sm:w-6 sm:h-6" />
                      ) : (
                        <StepIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                      )}

                      {/* Connector lines removed as requested */}
                    </div>

                    <div className="text-center mt-2 min-h-[2.5rem] flex flex-col justify-center">
                      <div className={`text-xs sm:text-sm font-medium leading-tight ${
                        isCurrent ? 'text-primary' : 'text-gray-600'
                      }`}>
                        {step.title}
                      </div>
                      <div className={`text-xs leading-tight ${
                        isCurrent ? 'text-primary/80' : 'text-gray-500'
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
        <div className="max-w-lg mx-auto">
          {/* Step Header */}
          <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-3xl mb-4 ${
                completedStepsCount > 0
                  ? 'bg-secondary text-primary'
                  : 'bg-muted text-muted-foreground'
              }`}>
                <IconComponent className="w-7 h-7 sm:w-9 sm:h-9" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {currentStepData.title} {currentStepData.subtitle}
              </h2>

              <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-sm mx-auto px-4">
                {currentStep === 1 && "Let's start with your basic information to create your host profile."}
                {currentStep === 2 && "Tell us about your parking location and availability details."}
                {currentStep === 3 && "Set up your payment method to receive earnings from bookings."}
                {currentStep === 4 && "Complete identity verification to build trust with renters."}
              </p>
            </div>
          </div>

          {/* Step Content */}
          <div className={`transition-all duration-300 delay-75 ${isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
            <CurrentStepComponent
              onNext={handleNext}
              onPrevious={handlePrevious}
              isLastStep={currentStep === steps.length}
              onComplete={handleComplete}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
