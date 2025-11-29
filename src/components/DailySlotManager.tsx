import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Car, Bike, Settings, TrendingUp, CheckCircle, AlertCircle } from "lucide-react";
import { useMockParkingListings, mockHostId } from "@/hooks/use-mock-parking-listings";

export default function DailySlotManager() {
  const { getListingsByHost, updateActiveSlots } = useMockParkingListings();
  const listings = getListingsByHost(mockHostId);

  // Use the first listing for now (in future, allow selection of which listing to manage)
  const currentListing = listings[0];

  const [activeCarSlots, setActiveCarSlots] = useState(currentListing?.activeCarSlots || 0);
  const [activeBikeSlots, setActiveBikeSlots] = useState(currentListing?.activeBikeSlots || 0);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Update local state when listing data changes
  useEffect(() => {
    if (currentListing) {
      setActiveCarSlots(currentListing.activeCarSlots);
      setActiveBikeSlots(currentListing.activeBikeSlots);
    }
  }, [currentListing]);

  const totalActiveSlots = activeCarSlots + activeBikeSlots;
  const totalCapacity = (currentListing?.totalCarSlots || 0) + (currentListing?.totalBikeSlots || 0);
  const utilizationRate = totalCapacity > 0 ? Math.round((totalActiveSlots / totalCapacity) * 100) : 0;

  const handleSave = async () => {
    if (!currentListing) return;

    setIsSaving(true);

    // Update the listing in the mock store
    updateActiveSlots(currentListing.id, activeCarSlots, activeBikeSlots);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSaving(false);
    setShowSuccess(true);

    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCarSlotsChange = (value: string) => {
    if (!currentListing) return;
    const numValue = Math.max(0, Math.min(currentListing.totalCarSlots, parseInt(value) || 0));
    setActiveCarSlots(numValue);
  };

  const handleBikeSlotsChange = (value: string) => {
    if (!currentListing) return;
    const numValue = Math.max(0, Math.min(currentListing.totalBikeSlots, parseInt(value) || 0));
    setActiveBikeSlots(numValue);
  };

  const setFullCapacity = () => {
    if (!currentListing) return;
    setActiveCarSlots(currentListing.totalCarSlots);
    setActiveBikeSlots(currentListing.totalBikeSlots);
  };

  const set80PercentCapacity = () => {
    if (!currentListing) return;
    setActiveCarSlots(Math.floor(currentListing.totalCarSlots * 0.8));
    setActiveBikeSlots(Math.floor(currentListing.totalBikeSlots * 0.8));
  };

  // If no listings, show empty state
  if (!currentListing) {
    return (
      <Card className="bg-white border border-gray-100 shadow-soft p-6">
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Parking Spaces Listed</h3>
          <p className="text-gray-600 mb-4">
            Create your first parking listing to start managing daily availability.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-white border border-gray-100 shadow-soft p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Today's Available Slots</h3>
            <p className="text-sm text-gray-600">Manage daily capacity for {currentListing.name}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-gray-400" />
            {showSuccess && (
              <div className="flex items-center text-green-600">
                <CheckCircle className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">Saved!</span>
              </div>
            )}
          </div>
        </div>

        {/* Current Status */}
        <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Current Capacity</p>
                <p className="text-xs text-gray-600">Available for booking today</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{utilizationRate}%</div>
              <div className="text-xs text-gray-600">Utilized</div>
            </div>
          </div>
        </div>

        {/* Slot Controls */}
        <div className="space-y-6">
          {/* Car Slots */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Car className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Car Parking Slots</h4>
                  <p className="text-xs text-gray-600">Available: {currentListing.totalCarSlots} total</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-blue-600">
                  {activeCarSlots} / {currentListing.totalCarSlots}
                </div>
              </div>
            </div>

            <div className="ml-13">
              <Label htmlFor="dailyCarSlots" className="text-sm font-medium text-gray-900">
                Active slots today
              </Label>
              <Input
                id="dailyCarSlots"
                type="number"
                min="0"
                max={currentListing.totalCarSlots}
                value={activeCarSlots}
                onChange={(e) => handleCarSlotsChange(e.target.value)}
                className="h-12 text-lg text-center font-semibold mt-2 border-gray-200 focus:border-gray-900"
              />
            </div>
          </div>

          {/* Bike Slots */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Bike className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Bike Parking Slots</h4>
                  <p className="text-xs text-gray-600">Available: {currentListing.totalBikeSlots} total</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-green-600">
                  {activeBikeSlots} / {currentListing.totalBikeSlots}
                </div>
              </div>
            </div>

            <div className="ml-13">
              <Label htmlFor="dailyBikeSlots" className="text-sm font-medium text-gray-900">
                Active slots today
              </Label>
              <Input
                id="dailyBikeSlots"
                type="number"
                min="0"
                max={currentListing.totalBikeSlots}
                value={activeBikeSlots}
                onChange={(e) => handleBikeSlotsChange(e.target.value)}
                className="h-12 text-lg text-center font-semibold mt-2 border-gray-200 focus:border-gray-900"
              />
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Today's Summary</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">{totalActiveSlots}</div>
              <div className="text-sm text-gray-600">Active Slots</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">{totalCapacity - totalActiveSlots}</div>
              <div className="text-sm text-gray-600">Reserved</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={setFullCapacity}
            className="flex-1 h-12 border-gray-200 hover:border-gray-900 hover:bg-gray-50"
          >
            Full Capacity
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={set80PercentCapacity}
            className="flex-1 h-12 border-gray-200 hover:border-gray-900 hover:bg-gray-50"
          >
            80% Capacity
          </Button>
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full h-14 bg-gray-900 hover:bg-gray-800 text-white text-base font-semibold rounded-lg shadow-soft transition-colors"
        >
          {isSaving ? "Saving..." : "Update Today's Availability"}
        </Button>
      </div>
    </Card>
  );
}
