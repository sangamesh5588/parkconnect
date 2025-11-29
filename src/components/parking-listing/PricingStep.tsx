import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Car, Bike, ArrowRight, ArrowLeft, Loader2, DollarSign, TrendingUp } from "lucide-react";
import { useParkingListingStore } from "@/hooks/use-parking-listing-store";

interface PricingStepProps {
  onNext: () => void;
  onPrevious: () => void;
  isLastStep: boolean;
}

export default function PricingStep({
  onNext,
  onPrevious,
  isLastStep
}: PricingStepProps) {
  const { listingData, updateListingData } = useParkingListingStore();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (listingData.parkingType === 'car' || listingData.parkingType === 'both') {
      if (!listingData.hourlyCarRate || listingData.hourlyCarRate <= 0) {
        newErrors.hourlyCarRate = "Please enter a valid hourly rate for cars";
      } else if (listingData.hourlyCarRate > 1000) {
        newErrors.hourlyCarRate = "Maximum rate is ₹1000 per hour";
      }
    }

    if (listingData.parkingType === 'bike' || listingData.parkingType === 'both') {
      if (!listingData.hourlyBikeRate || listingData.hourlyBikeRate <= 0) {
        newErrors.hourlyBikeRate = "Please enter a valid hourly rate for bikes";
      } else if (listingData.hourlyBikeRate > 200) {
        newErrors.hourlyBikeRate = "Maximum rate is ₹200 per hour";
      }
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

  const handleCarHourlyRateChange = (value: string) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    updateListingData({ hourlyCarRate: numValue });
    if (errors.hourlyCarRate) {
      setErrors({ ...errors, hourlyCarRate: "" });
    }
  };

  const handleBikeHourlyRateChange = (value: string) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    updateListingData({ hourlyBikeRate: numValue });
    if (errors.hourlyBikeRate) {
      setErrors({ ...errors, hourlyBikeRate: "" });
    }
  };

  const handleCarDailyRateChange = (value: string) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    updateListingData({ dailyCarRate: numValue });
  };

  const handleBikeDailyRateChange = (value: string) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    updateListingData({ dailyBikeRate: numValue });
  };

  const showCarPricing = listingData.parkingType === 'car' || listingData.parkingType === 'both';
  const showBikePricing = listingData.parkingType === 'bike' || listingData.parkingType === 'both';

  return (
    <Card className="bg-white border border-gray-100 shadow-soft p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-3xl mb-4">
            <DollarSign className="w-8 h-8 text-gray-900" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Set Your Pricing</h2>
          <p className="text-gray-600 text-base">
            Choose competitive rates to attract more bookings
          </p>
        </div>

        {/* Pricing Strategy Notice */}
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
          <div className="flex items-start space-x-3">
            <TrendingUp className="w-5 h-5 text-gray-900 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Pricing Tips</h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                Set rates 10-20% below competitors for more bookings. You can adjust prices anytime from your dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* Hourly Rates */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Hourly Rates *</h3>

          {showCarPricing && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Car className="w-6 h-6 text-gray-900" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Car Parking Rate</h3>
                  <p className="text-sm text-gray-600">Per hour pricing for cars</p>
                </div>
              </div>

              <div className="ml-15">
                <Label htmlFor="hourlyCarRate" className="text-sm font-semibold text-gray-900">
                  ₹ per hour *
                </Label>
                <div className="relative mt-2">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₹</span>
                  <Input
                    id="hourlyCarRate"
                    type="number"
                    min="1"
                    max="1000"
                    placeholder="e.g., 20"
                    value={listingData.hourlyCarRate || ''}
                    onChange={(e) => handleCarHourlyRateChange(e.target.value)}
                    className={`h-14 text-lg text-center font-semibold pl-8 ${errors.hourlyCarRate ? 'border-red-300 focus:border-red-500' : ''}`}
                  />
                </div>
                {errors.hourlyCarRate && (
                  <p className="text-sm text-red-600 mt-1">{errors.hourlyCarRate}</p>
                )}
              </div>
            </div>
          )}

          {showBikePricing && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Bike className="w-6 h-6 text-gray-900" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Bike Parking Rate</h3>
                  <p className="text-sm text-gray-600">Per hour pricing for bikes</p>
                </div>
              </div>

              <div className="ml-15">
                <Label htmlFor="hourlyBikeRate" className="text-sm font-semibold text-gray-900">
                  ₹ per hour *
                </Label>
                <div className="relative mt-2">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₹</span>
                  <Input
                    id="hourlyBikeRate"
                    type="number"
                    min="1"
                    max="200"
                    placeholder="e.g., 10"
                    value={listingData.hourlyBikeRate || ''}
                    onChange={(e) => handleBikeHourlyRateChange(e.target.value)}
                    className={`h-14 text-lg text-center font-semibold pl-8 ${errors.hourlyBikeRate ? 'border-red-300 focus:border-red-500' : ''}`}
                  />
                </div>
                {errors.hourlyBikeRate && (
                  <p className="text-sm text-red-600 mt-1">{errors.hourlyBikeRate}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Daily Rates (Optional) */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Daily Rates (Optional)</h3>
          <p className="text-sm text-gray-600">Offer discounted rates for full-day parking</p>

          {showCarPricing && (
            <div className="ml-15">
              <Label htmlFor="dailyCarRate" className="text-sm font-semibold text-gray-900">
                Car daily rate (₹)
              </Label>
              <div className="relative mt-2">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₹</span>
                <Input
                  id="dailyCarRate"
                  type="number"
                  min="0"
                  placeholder="e.g., 150"
                  value={listingData.dailyCarRate || ''}
                  onChange={(e) => handleCarDailyRateChange(e.target.value)}
                  className="h-12 text-center pl-8"
                />
              </div>
            </div>
          )}

          {showBikePricing && (
            <div className="ml-15">
              <Label htmlFor="dailyBikeRate" className="text-sm font-semibold text-gray-900">
                Bike daily rate (₹)
              </Label>
              <div className="relative mt-2">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₹</span>
                <Input
                  id="dailyBikeRate"
                  type="number"
                  min="0"
                  placeholder="e.g., 50"
                  value={listingData.dailyBikeRate || ''}
                  onChange={(e) => handleBikeDailyRateChange(e.target.value)}
                  className="h-12 text-center pl-8"
                />
              </div>
            </div>
          )}
        </div>

        {/* Pricing Preview */}
        {(listingData.hourlyCarRate > 0 || listingData.hourlyBikeRate > 0) && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Rate Summary</h4>
            <div className="space-y-2">
              {listingData.hourlyCarRate > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">🚗 Car (per hour):</span>
                  <span className="text-sm font-medium text-gray-900">₹{listingData.hourlyCarRate}</span>
                </div>
              )}
              {listingData.dailyCarRate > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">🚗 Car (per day):</span>
                  <span className="text-sm font-medium text-gray-900">₹{listingData.dailyCarRate}</span>
                </div>
              )}
              {listingData.hourlyBikeRate > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">🏍️ Bike (per hour):</span>
                  <span className="text-sm font-medium text-gray-900">₹{listingData.hourlyBikeRate}</span>
                </div>
              )}
              {listingData.dailyBikeRate > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">🏍️ Bike (per day):</span>
                  <span className="text-sm font-medium text-gray-900">₹{listingData.dailyBikeRate}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="pt-6 border-t border-gray-100">
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onPrevious}
              className="flex-1 h-14 border-gray-300 hover:bg-gray-50 text-gray-700"
              disabled={isLoading}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>

            <Button
              type="submit"
              className="flex-1 h-14 bg-gray-900 hover:bg-gray-800 text-white text-base font-semibold rounded-lg shadow-soft transition-colors"
              disabled={isLoading}
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
    </Card>
  );
}
