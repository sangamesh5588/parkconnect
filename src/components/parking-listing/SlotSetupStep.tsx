import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Car, Bike, ArrowRight, ArrowLeft, Loader2, Info } from "lucide-react";
import { useParkingListingStore } from "@/hooks/use-parking-listing-store";

interface SlotSetupStepProps {
  onNext: () => void;
  onPrevious: () => void;
  isLastStep: boolean;
}

export default function SlotSetupStep({
  onNext,
  onPrevious,
  isLastStep
}: SlotSetupStepProps) {
  const { listingData, updateListingData } = useParkingListingStore();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (listingData.parkingType === 'car' || listingData.parkingType === 'both') {
      if (!listingData.totalCarSlots || listingData.totalCarSlots <= 0) {
        newErrors.totalCarSlots = "Please enter a valid number of car slots";
      } else if (listingData.totalCarSlots > 1000) {
        newErrors.totalCarSlots = "Maximum 1000 car slots allowed";
      }
    }

    if (listingData.parkingType === 'bike' || listingData.parkingType === 'both') {
      if (!listingData.totalBikeSlots || listingData.totalBikeSlots <= 0) {
        newErrors.totalBikeSlots = "Please enter a valid number of bike slots";
      } else if (listingData.totalBikeSlots > 1000) {
        newErrors.totalBikeSlots = "Maximum 1000 bike slots allowed";
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

  const handleCarSlotsChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    updateListingData({ totalCarSlots: numValue });
    if (errors.totalCarSlots) {
      setErrors({ ...errors, totalCarSlots: "" });
    }
  };

  const handleBikeSlotsChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    updateListingData({ totalBikeSlots: numValue });
    if (errors.totalBikeSlots) {
      setErrors({ ...errors, totalBikeSlots: "" });
    }
  };

  const showCarSlots = listingData.parkingType === 'car' || listingData.parkingType === 'both';
  const showBikeSlots = listingData.parkingType === 'bike' || listingData.parkingType === 'both';

  return (
    <Card className="bg-white border border-gray-100 shadow-soft p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-3xl mb-4">
            <Car className="w-8 h-8 text-gray-900" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Total Parking Capacity</h2>
          <p className="text-gray-600 text-base">
            Set the total number of parking slots you have available
          </p>
        </div>

        {/* Important Notice */}
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-gray-900 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Permanent Setting</h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                These numbers represent your total parking capacity. You can only decrease this number later if needed.
                Increasing the capacity requires admin approval.
              </p>
            </div>
          </div>
        </div>

        {/* Slot Inputs */}
        <div className="space-y-6">
          {showCarSlots && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Car className="w-6 h-6 text-gray-900" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Car Parking Slots</h3>
                  <p className="text-sm text-gray-600">Total number of car parking spaces</p>
                </div>
              </div>

              <div className="ml-15">
                <Label htmlFor="totalCarSlots" className="text-sm font-semibold text-gray-900">
                  Total Car Slots *
                </Label>
                <Input
                  id="totalCarSlots"
                  type="number"
                  min="1"
                  max="1000"
                  placeholder="e.g., 50"
                  value={listingData.totalCarSlots || ''}
                  onChange={(e) => handleCarSlotsChange(e.target.value)}
                  className={`h-14 text-lg text-center font-semibold mt-2 ${errors.totalCarSlots ? 'border-red-300 focus:border-red-500' : ''}`}
                />
                {errors.totalCarSlots && (
                  <p className="text-sm text-red-600 mt-1">{errors.totalCarSlots}</p>
                )}
              </div>
            </div>
          )}

          {showBikeSlots && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Bike className="w-6 h-6 text-gray-900" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Bike Parking Slots</h3>
                  <p className="text-sm text-gray-600">Total number of motorcycle/scooter spaces</p>
                </div>
              </div>

              <div className="ml-15">
                <Label htmlFor="totalBikeSlots" className="text-sm font-semibold text-gray-900">
                  Total Bike Slots *
                </Label>
                <Input
                  id="totalBikeSlots"
                  type="number"
                  min="1"
                  max="1000"
                  placeholder="e.g., 25"
                  value={listingData.totalBikeSlots || ''}
                  onChange={(e) => handleBikeSlotsChange(e.target.value)}
                  className={`h-14 text-lg text-center font-semibold mt-2 ${errors.totalBikeSlots ? 'border-red-300 focus:border-red-500' : ''}`}
                />
                {errors.totalBikeSlots && (
                  <p className="text-sm text-red-600 mt-1">{errors.totalBikeSlots}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        {(listingData.totalCarSlots > 0 || listingData.totalBikeSlots > 0) && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Capacity Summary</h4>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Parking Capacity:</span>
              <span className="text-lg font-bold text-gray-900">
                {listingData.totalCarSlots + listingData.totalBikeSlots} slots
              </span>
            </div>
            {listingData.totalCarSlots > 0 && (
              <div className="flex justify-between items-center mt-1">
                <span className="text-sm text-gray-600">• Car slots:</span>
                <span className="text-sm font-medium text-gray-900">{listingData.totalCarSlots}</span>
              </div>
            )}
            {listingData.totalBikeSlots > 0 && (
              <div className="flex justify-between items-center mt-1">
                <span className="text-sm text-gray-600">• Bike slots:</span>
                <span className="text-sm font-medium text-gray-900">{listingData.totalBikeSlots}</span>
              </div>
            )}
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
