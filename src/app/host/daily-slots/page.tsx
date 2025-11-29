import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ArrowLeft, Car, CheckCircle, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { useMockParkingListings, mockHostId } from "@/hooks/use-mock-parking-listings";

export default function DailySlotsPage() {
  const { getListingsByHost, updateActiveSlots } = useMockParkingListings();
  const listings = getListingsByHost(mockHostId);
  const liveListings = listings.filter(listing => listing.status === 'live');

  const [dailySlots, setDailySlots] = useState<Record<string, { activeCarSlots: number; activeBikeSlots: number }>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [savingSlots, setSavingSlots] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Initialize daily slots with current values
  useEffect(() => {
    const initialSlots: Record<string, { activeCarSlots: number; activeBikeSlots: number }> = {};
    liveListings.forEach(listing => {
      initialSlots[listing.id] = {
        activeCarSlots: listing.activeCarSlots,
        activeBikeSlots: listing.activeBikeSlots
      };
    });
    setDailySlots(initialSlots);
  }, [liveListings]);

  // Check for changes
  useEffect(() => {
    let hasAnyChanges = false;
    liveListings.forEach(listing => {
      const current = dailySlots[listing.id];
      if (current &&
          (current.activeCarSlots !== listing.activeCarSlots ||
           current.activeBikeSlots !== listing.activeBikeSlots)) {
        hasAnyChanges = true;
      }
    });
    setHasChanges(hasAnyChanges);
  }, [dailySlots, liveListings]);

  const handleSaveAllSlots = async () => {
    setSavingSlots(true);

    try {
      // Save all changes
      const savePromises = liveListings.map(listing => {
        const currentSlots = dailySlots[listing.id];
        if (currentSlots) {
          return updateActiveSlots(listing.id, currentSlots.activeCarSlots, currentSlots.activeBikeSlots);
        }
        return Promise.resolve();
      });

      await Promise.all(savePromises);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSavingSlots(false);
      setShowConfirmDialog(false);
      setShowSuccess(true);
      setHasChanges(false);

      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to save slot changes:", error);
      setSavingSlots(false);
      setShowConfirmDialog(false);
    }
  };

  const handleQuickAction = (listingId: string, type: 'full' | '80') => {
    const listing = liveListings.find(l => l.id === listingId);
    if (listing) {
      const multiplier = type === 'full' ? 1 : 0.8;
      setDailySlots(prev => ({
        ...prev,
        [listingId]: {
          activeCarSlots: Math.floor(listing.totalCarSlots * multiplier),
          activeBikeSlots: Math.floor(listing.totalBikeSlots * multiplier)
        }
      }));
    }
  };

  const totalActiveSlots = liveListings.reduce((total, listing) => {
    const current = dailySlots[listing.id];
    return total + (current ? current.activeCarSlots + current.activeBikeSlots : listing.activeCarSlots + listing.activeBikeSlots);
  }, 0);

  const totalCapacity = liveListings.reduce((total, listing) => {
    return total + listing.totalCarSlots + listing.totalBikeSlots;
  }, 0);

  if (liveListings.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50">
        <header className="bg-white/95 backdrop-blur-md border-b border-gray-100">
          <div className="container-mobile py-4">
            <div className="flex items-center justify-between">
              <Link
                to="/host/dashboard"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-all duration-200 min-h-[44px] px-2 rounded-md hover:bg-gray-50"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span className="font-medium">Back to Dashboard</span>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Active Slots for Today</h1>
              <div className="w-16"></div>
            </div>
          </div>
        </header>

        <main className="container-mobile py-12">
          <div className="text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Car className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Parking Spaces</h2>
            <p className="text-gray-600 mb-6">
              You don't have any active parking spaces to manage. Create your first parking space to get started.
            </p>
            <Link to="/host/parking/list">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Create Parking Space
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-20">
        <div className="container-mobile py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/host/dashboard"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-all duration-200 min-h-[44px] px-2 rounded-md hover:bg-gray-50"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="font-medium">Back to Dashboard</span>
            </Link>

            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-900">Active Slots for Today</h1>
              <p className="text-sm text-gray-600">{liveListings.length} Space{liveListings.length > 1 ? 's' : ''}</p>
            </div>

            <div className="w-16"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-mobile py-6">
        {/* Summary Card */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Today's Availability</h3>
              <p className="text-sm text-gray-600">Total active slots across all your spaces</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{totalActiveSlots}</div>
              <div className="text-sm text-gray-600">of {totalCapacity} total slots</div>
            </div>
          </div>
        </Card>

        {/* Success Message */}
        {showSuccess && (
          <Card className="p-4 mb-6 bg-green-50 border-green-200">
            <div className="flex items-center text-green-700">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-medium">All slot changes saved successfully!</span>
            </div>
          </Card>
        )}

        {/* Parking Spaces - Icon Grid Layout */}
        <div className="space-y-6">
          {liveListings.map((listing) => {
            const currentSlots = dailySlots[listing.id] || {
              activeCarSlots: listing.activeCarSlots,
              activeBikeSlots: listing.activeBikeSlots
            };
            const hasChangesForThisListing =
              currentSlots.activeCarSlots !== listing.activeCarSlots ||
              currentSlots.activeBikeSlots !== listing.activeBikeSlots;

            return (
              <Card key={listing.id} className="p-6">
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">{listing.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{listing.address}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-gray-600">Total Capacity:</span>
                        <span className="font-medium">{listing.totalCarSlots} cars, {listing.totalBikeSlots} bikes</span>
                      </div>
                    </div>
                    {hasChangesForThisListing && (
                      <div className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-medium">
                        Unsaved changes
                      </div>
                    )}
                  </div>

                  {/* Icon Grid for Slot Types */}
                  <div className="grid grid-cols-2 gap-6">
                    {/* Car Slots */}
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                          <Car className="w-8 h-8 text-blue-600" />
                        </div>
                        <h4 className="text-sm font-semibold text-gray-900">Car Parking</h4>
                        <p className="text-xs text-gray-600">Available slots</p>
                      </div>

                      <div className="space-y-3">
                        <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="text-2xl font-bold text-blue-600">
                            {currentSlots.activeCarSlots}
                          </div>
                          <div className="text-xs text-blue-700">of {listing.totalCarSlots} active</div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-xs"
                            onClick={() => handleQuickAction(listing.id, '80')}
                          >
                            80%
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-xs"
                            onClick={() => handleQuickAction(listing.id, 'full')}
                          >
                            Full
                          </Button>
                        </div>

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
                          className="w-full h-10 text-center font-semibold border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    {/* Bike Slots */}
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                          <Car className="w-8 h-8 text-green-600" />
                        </div>
                        <h4 className="text-sm font-semibold text-gray-900">Bike Parking</h4>
                        <p className="text-xs text-gray-600">Available slots</p>
                      </div>

                      <div className="space-y-3">
                        <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                          <div className="text-2xl font-bold text-green-600">
                            {currentSlots.activeBikeSlots}
                          </div>
                          <div className="text-xs text-green-700">of {listing.totalBikeSlots} active</div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-xs"
                            onClick={() => handleQuickAction(listing.id, '80')}
                          >
                            80%
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-xs"
                            onClick={() => handleQuickAction(listing.id, 'full')}
                          >
                            Full
                          </Button>
                        </div>

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
                          className="w-full h-10 text-center font-semibold border border-gray-200 rounded-lg focus:border-green-500 focus:ring-0"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Save All Button */}
        {hasChanges && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
            <Button
              onClick={() => setShowConfirmDialog(true)}
              className="px-8 py-3 h-14 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Save All Changes
            </Button>
          </div>
        )}
      </main>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <DialogTitle className="text-left">Confirm Changes</DialogTitle>
                <DialogDescription className="text-left">
                  Are you sure you want to update the active slots for {liveListings.length} parking space{liveListings.length > 1 ? 's' : ''}?
                  This will change what renters see as available parking.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="py-4">
            <div className="space-y-2">
              {liveListings.map((listing) => {
                const current = dailySlots[listing.id];
                const original = { activeCarSlots: listing.activeCarSlots, activeBikeSlots: listing.activeBikeSlots };
                const hasChanges = current &&
                  (current.activeCarSlots !== original.activeCarSlots ||
                   current.activeBikeSlots !== original.activeBikeSlots);

                if (!hasChanges) return null;

                return (
                  <div key={listing.id} className="flex justify-between text-sm">
                    <span className="font-medium">{listing.name}</span>
                    <span className="text-gray-600">
                      {original.activeCarSlots + original.activeBikeSlots} → {current.activeCarSlots + current.activeBikeSlots} slots
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={savingSlots}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveAllSlots}
              disabled={savingSlots}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {savingSlots ? "Saving..." : "Confirm & Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
