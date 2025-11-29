import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Car, Bike, ArrowRight, ArrowLeft, Loader2, Settings, TrendingUp } from "lucide-react";
import { useParkingListingStore } from "@/hooks/use-parking-listing-store";

interface ActiveSlotsStepProps {
  onNext: () => void;
  onPrevious: () => void;
  isLastStep: boolean;
}

export default function ActiveSlotsStep({
  onNext,
  onPrevious,
  isLastStep
}: ActiveSlotsStepProps) {
  const { listingData, updateListingData } = useParkingListingStore();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (listingData.parkingType === 'car' || listingData.parkingType === 'both') {
      if (listingData.activeCarSlots < 0) {
        newErrors.activeCarSlots = "Active slots cannot be negative";
      } else if (listingData.activeCarSlots > listingData.totalCarSlots) {
        newErrors.activeCarSlots = `Cannot exceed total car slots (${listingData.totalCarSlots})`;
      }
    }

    if (listingData.parkingType === 'bike' || listingData.parkingType === 'both') {
      if (listingData.activeBikeSlots < 0) {
        newErrors.activeBikeSlots = "Active slots cannot be negative";
      } else if (listingData.activeBikeSlots > listingData.totalBikeSlots) {
        newErrors.activeBikeSlots = `Cannot exceed total bike slots (${listingData.totalBikeSlots})`;
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
    const numValue = Math.max(0, parseInt(value) || 0);
    updateListingData({ activeCarSlots: numValue });
    if (errors.activeCarSlots) {
      setErrors({ ...errors, activeCarSlots: "" });
    }
  };

  const handleBikeSlotsChange = (value: string) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    updateListingData({ activeBikeSlots: numValue });
    if (errors.activeBikeSlots) {
      setErrors({ ...errors, activeBikeSlots: "" });
    }
  };

  const showCarSlots = listingData.parkingType === 'car' || listingData.parkingType === 'both';
  const showBikeSlots = listingData.parkingType === 'bike' || listingData.parkingType === 'both';

  const totalActiveSlots = listingData.activeCarSlots + listingData.activeBikeSlots;
  const totalCapacity = listingData.totalCarSlots + listingData.totalBikeSlots;
  const utilizationRate = totalCapacity > 0 ? Math.round((totalActiveSlots / totalCapacity) * 100) : 0;

  return (
    <Card className="bg-white border border-gray-100 shadow-soft p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-3xl mb-4">
            <Settings className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Today's Active Slots</h2>
          <p className="text-gray-600 text-base">
            Choose how many slots to make available for booking today
          </p>
        </div>

        {/* Important Notice */}
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-start space-x-3">
            <TrendingUp className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-green-800 mb-1">Daily Control</h4>
              <p className="text-sm text-green-700 leading-relaxed">
                You can change these numbers anytime from your dashboard. Set to 0 to temporarily stop accepting bookings for specific vehicle types.
              </p>
            </div>
          </div>
        </div>

        {/* Active Slot Inputs */}
        <div className="space-y-6">
          {showCarSlots && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Car className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Car Slots Today</h3>
                    <p className="text-sm text-gray-600">
                      Available: {listingData.totalCarSlots} total slots
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Active / Total</div>
                  <div className="text-lg font-bold text-blue-600">
                    {listingData.activeCarSlots || 0} / {listingData.totalCarSlots}
                  </div>
                </div>
              </div>

              <div className="ml-15">
                <Label htmlFor="activeCarSlots" className="text-sm font-semibold text-gray-900">
                  Active Car Slots Today *
                </Label>
                <Input
                  id="activeCarSlots"
                  type="number"
                  min="0"
                  max={listingData.totalCarSlots}
                  placeholder="e.g., 25"
                  value={listingData.activeCarSlots || ''}
                  onChange={(e) => handleCarSlotsChange(e.target.value)}
                  className={`h-14 text-lg text-center font-semibold mt-2 ${errors.activeCarSlots ? 'border-red-300 focus:border-red-500' : ''}`}
                />
                {errors.activeCarSlots && (
                  <p className="text-sm text-red-600 mt-1">{errors.activeCarSlots}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Set to 0 to stop accepting car bookings today
                </p>
              </div>
            </div>
          )}

          {showBikeSlots && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Bike className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Bike Slots Today</h3>
                    <p className="text-sm text-gray-600">
                      Available: {listingData.totalBikeSlots} total slots
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Active / Total</div>
                  <div className="text-lg font-bold text-green-600">
                    {listingData.activeBikeSlots || 0} / {listingData.totalBikeSlots}
                  </div>
                </div>
              </div>

              <div className="ml-15">
                <Label htmlFor="activeBikeSlots" className="text-sm font-semibold text-gray-900">
                  Active Bike Slots Today *
                </Label>
                <Input
                  id="activeBikeSlots"
                  type="number"
                  min="0"
                  max={listingData.totalBikeSlots}
                  placeholder="e.g., 15"
                  value={listingData.activeBikeSlots || ''}
                  onChange={(e) => handleBikeSlotsChange(e.target.value)}
                  className={`h-14 text-lg text-center font-semibold mt-2 ${errors.activeBikeSlots ? 'border-red-300 focus:border-red-500' : ''}`}
                />
                {errors.activeBikeSlots && (
                  <p className="text-sm text-red-600 mt-1">{errors.activeBikeSlots}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Set to 0 to stop accepting bike bookings today
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        {(listingData.activeCarSlots > 0 || listingData.activeBikeSlots > 0) && (
          <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Today's Availability Summary</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">{utilizationRate}%</div>
                <div className="text-sm text-gray-600">Capacity Utilized</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">{totalActiveSlots}</div>
                <div className="text-sm text-gray-600">Active Slots Today</div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-green-200">
              {listingData.activeCarSlots > 0 && (
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">🚗 Car slots active:</span>
                  <span className="text-sm font-medium text-blue-600">{listingData.activeCarSlots}</span>
                </div>
              )}
              {listingData.activeBikeSlots > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">🏍️ Bike slots active:</span>
                  <span className="text-sm font-medium text-green-600">{listingData.activeBikeSlots}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => updateListingData({
              activeCarSlots: listingData.totalCarSlots,
              activeBikeSlots: listingData.totalBikeSlots
            })}
            className="flex-1 h-12"
          >
            Use Full Capacity
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => updateListingData({
              activeCarSlots: Math.floor(listingData.totalCarSlots * 0.8),
              activeBikeSlots: Math.floor(listingData.totalBikeSlots * 0.8)
            })}
            className="flex-1 h-12"
          >
            80% Capacity
          </Button>
        </div>

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
