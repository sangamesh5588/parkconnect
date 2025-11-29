import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Navigation, ArrowRight, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { useOnboardingStore } from "@/hooks/use-onboarding-store";

interface HostAddressSetupProps {
  onNext: () => void;
  onPrevious: () => void;
  isLastStep: boolean;
  onComplete: () => void;
}

export default function HostAddressSetup({
  onNext,
  onPrevious,
  isLastStep,
  onComplete
}: HostAddressSetupProps) {
  const { addressDetails, setAddressDetails } = useOnboardingStore();

  // Local state for form interactions
  const [isLoading, setIsLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!addressDetails.street.trim()) {
      newErrors.street = "Street address is required";
    }

    if (!addressDetails.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!addressDetails.state) {
      newErrors.state = "State selection is required";
    }

    if (!addressDetails.pinCode.trim()) {
      newErrors.pinCode = "PIN code is required";
    } else if (!/^[0-9]{6}$/.test(addressDetails.pinCode)) {
      newErrors.pinCode = "PIN code must be exactly 6 digits";
    }

    if (!addressDetails.location) {
      newErrors.location = "Please pin your location on the map";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsLoading(false);
    onNext();
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrors({ ...errors, location: "Geolocation is not supported by this browser" });
      return;
    }

    setLocationLoading(true);
    setErrors({ ...errors, location: "" });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setAddressDetails({ ...addressDetails, location: newLocation });
        setLocationLoading(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        let errorMessage = "Unable to get your location";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enable location services.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }

        setErrors({ ...errors, location: errorMessage });
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  const handlePinLocation = () => {
    // For demo purposes, set a mock location
    // In a real app, this would open a map interface
    const mockLocation = { lat: 28.6139, lng: 77.2090 }; // Delhi coordinates
    setAddressDetails({ ...addressDetails, location: mockLocation });
    setErrors({ ...errors, location: "" });
  };

  const clearFieldError = (field: string) => {
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Address Fields */}
        <div className="space-y-6">
          {/* Street Address */}
          <div className="space-y-3">
            <Label htmlFor="street" className="text-sm font-semibold text-gray-900">
              Street Address *
            </Label>
            <Input
              id="street"
              type="text"
              placeholder="123 Main Street, Apartment 4B"
              value={addressDetails.street}
              onChange={(e) => {
                setAddressDetails({ ...addressDetails, street: e.target.value });
                clearFieldError('street');
              }}
              className={`h-12 text-base ${errors.street ? 'border-red-300 focus:border-red-500' : ''}`}
            />
            {errors.street && (
              <p className="text-sm text-red-600">{errors.street}</p>
            )}
          </div>

          {/* City */}
          <div className="space-y-3">
            <Label htmlFor="city" className="text-sm font-semibold text-gray-900">
              City *
            </Label>
            <Input
              id="city"
              type="text"
              placeholder="Mumbai"
              value={addressDetails.city}
              onChange={(e) => {
                setAddressDetails({ ...addressDetails, city: e.target.value });
                clearFieldError('city');
              }}
              className={`h-12 text-base ${errors.city ? 'border-red-300 focus:border-red-500' : ''}`}
            />
            {errors.city && (
              <p className="text-sm text-red-600">{errors.city}</p>
            )}
          </div>

          {/* State and PIN Code Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-900">
                State *
              </Label>
              <Select
                value={addressDetails.state}
                onValueChange={(value) => {
                  setAddressDetails({ ...addressDetails, state: value });
                  clearFieldError('state');
                }}
              >
                <SelectTrigger className={`h-12 text-base ${errors.state ? 'border-red-300 focus:border-red-500' : ''}`}>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="delhi">Delhi</SelectItem>
                  <SelectItem value="maharashtra">Maharashtra</SelectItem>
                  <SelectItem value="karnataka">Karnataka</SelectItem>
                  <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                  <SelectItem value="gujarat">Gujarat</SelectItem>
                  <SelectItem value="rajasthan">Rajasthan</SelectItem>
                  <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                  <SelectItem value="west-bengal">West Bengal</SelectItem>
                  <SelectItem value="punjab">Punjab</SelectItem>
                  <SelectItem value="haryana">Haryana</SelectItem>
                </SelectContent>
              </Select>
              {errors.state && (
                <p className="text-sm text-red-600">{errors.state}</p>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="pinCode" className="text-sm font-semibold text-gray-900">
                PIN Code *
              </Label>
              <Input
                id="pinCode"
                type="text"
                placeholder="400001"
                value={addressDetails.pinCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setAddressDetails({ ...addressDetails, pinCode: value });
                  clearFieldError('pinCode');
                }}
                className={`h-12 text-base ${errors.pinCode ? 'border-red-300 focus:border-red-500' : ''}`}
                maxLength={6}
              />
              {errors.pinCode && (
                <p className="text-sm text-red-600">{errors.pinCode}</p>
              )}
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Pin Your Exact Location
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                Help renters find your parking space accurately
              </p>
            </div>
            {addressDetails.location && (
              <div className="flex items-center text-primary bg-secondary px-3 py-1 rounded-full">
                <CheckCircle className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">Location Set</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleGetCurrentLocation}
              disabled={locationLoading}
              className="h-12 border-2 border-border hover:bg-secondary text-primary"
            >
              {locationLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Navigation className="w-4 h-4 mr-2" />
              )}
              {locationLoading ? 'Getting Location...' : 'Use Current Location'}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handlePinLocation}
              className="h-12 border-2 border-border hover:bg-secondary text-primary"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Pin on Map
            </Button>
          </div>

          {addressDetails.location && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                <span>
                  {addressDetails.location.lat.toFixed(6)}, {addressDetails.location.lng.toFixed(6)}
                </span>
              </div>
            </div>
          )}

          {errors.location && (
            <p className="text-sm text-red-600">{errors.location}</p>
          )}
        </div>

        {/* Navigation */}
        <div className="pt-6 border-t border-gray-100">
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onPrevious}
              className="flex-1 h-14 border-gray-300 hover:bg-gray-50 text-gray-700"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>

            <Button
              type="submit"
              className="flex-1 h-14 bg-primary hover:bg-primary/90 text-primary-foreground text-base font-semibold rounded-xl shadow-sm"
              disabled={isLoading || !addressDetails.street.trim() || !addressDetails.city.trim() || !addressDetails.state || !addressDetails.pinCode.trim() || !addressDetails.location}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
