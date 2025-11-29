import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, MapPin, Car, DollarSign, Clock, Settings, Eye, EyeOff, Edit3, Save, X, Bike, TrendingUp, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useMockParkingListings, mockHostId } from "@/hooks/use-mock-parking-listings";
import { Badge } from "@/components/ui/badge";

export default function ParkingManagement() {
  const { getListingsByHost, updateListing, updateActiveSlots } = useMockParkingListings();
  const listings = getListingsByHost(mockHostId);
  const liveListings = listings.filter(listing => listing.status === 'live');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [dailySlots, setDailySlots] = useState<Record<string, { activeCarSlots: number; activeBikeSlots: number }>>({});
  const [savingSlots, setSavingSlots] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState<string | null>(null);

  // Handle hash navigation for availability section
  useEffect(() => {
    if (window.location.hash === '#availability' && liveListings.length > 0) {
      // Small delay to ensure the page has rendered
      setTimeout(() => {
        const availabilitySection = document.querySelector('[data-section="availability"]');
        if (availabilitySection) {
          availabilitySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 500);
    }
  }, [liveListings.length]);

  const handleEdit = (listing: any) => {
    setEditingId(listing.id);
    setEditData({
      name: listing.name,
      address: listing.address,
      hourlyCarRate: listing.hourlyCarRate,
      hourlyBikeRate: listing.hourlyBikeRate,
      dailyCarRate: listing.dailyCarRate,
      dailyBikeRate: listing.dailyBikeRate,
      openTime: listing.openTime,
      closeTime: listing.closeTime,
      is24Hours: listing.is24Hours,
      totalCarSlots: listing.totalCarSlots,
      totalBikeSlots: listing.totalBikeSlots,
      activeCarSlots: listing.activeCarSlots,
      activeBikeSlots: listing.activeBikeSlots,
      instructions: listing.instructions,
    });
  };

  const handleSave = () => {
    if (editingId) {
      updateListing(editingId, editData);
      setEditingId(null);
      setEditData({});
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const toggleListingStatus = (listingId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'live' ? 'approved' : 'live';
    updateListing(listingId, { status: newStatus });
  };

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
              <h1 className="text-xl font-bold text-gray-900">Manage Parking</h1>
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
              <h1 className="text-xl font-bold text-gray-900">Manage Parking</h1>
              <p className="text-sm text-gray-600">{liveListings.length} Space{liveListings.length > 1 ? 's' : ''}</p>
            </div>

            <div className="w-16"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-mobile py-6">
        <div className="space-y-6">
          {liveListings.map((listing) => (
            <Card key={listing.id} className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      {editingId === listing.id ? (
                        <Input
                          value={editData.name}
                          onChange={(e) => setEditData({...editData, name: e.target.value})}
                          className="text-xl font-bold"
                        />
                      ) : (
                        listing.name
                      )}
                    </h3>
                    <Badge variant={listing.status === 'live' ? 'default' : 'secondary'}>
                      {listing.status === 'live' ? 'Active' : 'Disabled'}
                    </Badge>
                  </div>

                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="w-4 h-4 mr-2" />
                    {editingId === listing.id ? (
                      <Input
                        value={editData.address}
                        onChange={(e) => setEditData({...editData, address: e.target.value})}
                        className="flex-1"
                      />
                    ) : (
                      <span>{listing.address}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={listing.status === 'live'}
                    onCheckedChange={() => toggleListingStatus(listing.id, listing.status)}
                  />
                  <span className="text-sm text-gray-600">
                    {listing.status === 'live' ? 'Enabled' : 'Disabled'}
                  </span>

                  {editingId === listing.id ? (
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancel}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => handleEdit(listing)}>
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </div>
              </div>

              {/* Capacity Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <Car className="w-5 h-5 mr-2" />
                    Capacity
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-gray-600">Car Slots</Label>
                      {editingId === listing.id ? (
                        <Input
                          type="number"
                          value={editData.totalCarSlots}
                          onChange={(e) => setEditData({...editData, totalCarSlots: parseInt(e.target.value)})}
                        />
                      ) : (
                        <p className="text-lg font-semibold">{listing.totalCarSlots} total</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-sm text-gray-600">Bike Slots</Label>
                      {editingId === listing.id ? (
                        <Input
                          type="number"
                          value={editData.totalBikeSlots}
                          onChange={(e) => setEditData({...editData, totalBikeSlots: parseInt(e.target.value)})}
                        />
                      ) : (
                        <p className="text-lg font-semibold">{listing.totalBikeSlots} total</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Pricing Section */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Pricing
                  </h4>

                  <div className="space-y-3">
                    {editingId === listing.id ? (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">Car/Hour</Label>
                          <Input
                            type="number"
                            value={editData.hourlyCarRate}
                            onChange={(e) => setEditData({...editData, hourlyCarRate: parseInt(e.target.value)})}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Bike/Hour</Label>
                          <Input
                            type="number"
                            value={editData.hourlyBikeRate}
                            onChange={(e) => setEditData({...editData, hourlyBikeRate: parseInt(e.target.value)})}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Car/Day</Label>
                          <Input
                            type="number"
                            value={editData.dailyCarRate}
                            onChange={(e) => setEditData({...editData, dailyCarRate: parseInt(e.target.value)})}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Bike/Day</Label>
                          <Input
                            type="number"
                            value={editData.dailyBikeRate}
                            onChange={(e) => setEditData({...editData, dailyBikeRate: parseInt(e.target.value)})}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-600">Car/Hour:</span>
                          <span className="font-semibold ml-2">₹{listing.hourlyCarRate}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Bike/Hour:</span>
                          <span className="font-semibold ml-2">₹{listing.hourlyBikeRate}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Car/Day:</span>
                          <span className="font-semibold ml-2">₹{listing.dailyCarRate}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Bike/Day:</span>
                          <span className="font-semibold ml-2">₹{listing.dailyBikeRate}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Availability Section */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Availability
                </h4>

                {editingId === listing.id ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm">24 Hours</Label>
                      <Switch
                        checked={editData.is24Hours}
                        onCheckedChange={(checked) => setEditData({...editData, is24Hours: checked})}
                      />
                    </div>

                    {!editData.is24Hours && (
                      <>
                        <div>
                          <Label className="text-sm">Open Time</Label>
                          <Input
                            type="time"
                            value={editData.openTime}
                            onChange={(e) => setEditData({...editData, openTime: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label className="text-sm">Close Time</Label>
                          <Input
                            type="time"
                            value={editData.closeTime}
                            onChange={(e) => setEditData({...editData, closeTime: e.target.value})}
                          />
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-gray-600">
                    {listing.is24Hours ? (
                      <span>🕐 Open 24 hours</span>
                    ) : (
                      <span>🕐 {listing.openTime} - {listing.closeTime}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Instructions */}
              {editingId === listing.id && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Label className="text-sm font-semibold text-gray-900">Instructions</Label>
                  <Textarea
                    value={editData.instructions}
                    onChange={(e) => setEditData({...editData, instructions: e.target.value})}
                    placeholder="Special instructions for customers..."
                    className="mt-2"
                  />
                </div>
              )}

              {editingId !== listing.id && listing.instructions && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h5 className="font-semibold text-gray-900 mb-2">Instructions</h5>
                  <p className="text-gray-600 text-sm">{listing.instructions}</p>
                </div>
              )}

              {/* Daily Active Slots Management */}
              <div className="mt-6 pt-6 border-t border-gray-200" data-section="availability">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                    Today's Available Slots
                  </h4>
                  {showSuccess === listing.id && (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">Saved!</span>
                    </div>
                  )}
                </div>

                {/* Current Status */}
                <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Current Capacity</p>
                        <p className="text-xs text-gray-600">Available for booking today</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round(((listing.activeCarSlots + listing.activeBikeSlots) / (listing.totalCarSlots + listing.totalBikeSlots)) * 100)}%
                      </div>
                      <div className="text-xs text-gray-600">Utilized</div>
                    </div>
                  </div>
                </div>

                {/* Slot Controls */}
                <div className="space-y-6 mb-6">
                  {/* Car Slots */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Car className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h5 className="text-sm font-semibold text-gray-900">Car Parking Slots</h5>
                          <p className="text-xs text-gray-600">Available: {listing.totalCarSlots} total</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-blue-600">
                          {listing.activeCarSlots} / {listing.totalCarSlots}
                        </div>
                      </div>
                    </div>

                    <div className="ml-13">
                      <Label htmlFor={`car-slots-${listing.id}`} className="text-sm font-medium text-gray-900">
                        Active slots today
                      </Label>
                      <Input
                        id={`car-slots-${listing.id}`}
                        type="number"
                        min="0"
                        max={listing.totalCarSlots}
                        value={dailySlots[listing.id]?.activeCarSlots ?? listing.activeCarSlots}
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
                          <h5 className="text-sm font-semibold text-gray-900">Bike Parking Slots</h5>
                          <p className="text-xs text-gray-600">Available: {listing.totalBikeSlots} total</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">
                          {listing.activeBikeSlots} / {listing.totalBikeSlots}
                        </div>
                      </div>
                    </div>

                    <div className="ml-13">
                      <Label htmlFor={`bike-slots-${listing.id}`} className="text-sm font-medium text-gray-900">
                        Active slots today
                      </Label>
                      <Input
                        id={`bike-slots-${listing.id}`}
                        type="number"
                        min="0"
                        max={listing.totalBikeSlots}
                        value={dailySlots[listing.id]?.activeBikeSlots ?? listing.activeBikeSlots}
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
                        className="h-12 text-lg text-center font-semibold mt-2 border-gray-200 focus:border-gray-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-3 mb-6">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setDailySlots(prev => ({
                        ...prev,
                        [listing.id]: {
                          activeCarSlots: listing.totalCarSlots,
                          activeBikeSlots: listing.totalBikeSlots
                        }
                      }));
                    }}
                    className="flex-1 border-gray-200 hover:border-gray-900 hover:bg-gray-50"
                  >
                    Full Capacity
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setDailySlots(prev => ({
                        ...prev,
                        [listing.id]: {
                          activeCarSlots: Math.floor(listing.totalCarSlots * 0.8),
                          activeBikeSlots: Math.floor(listing.totalBikeSlots * 0.8)
                        }
                      }));
                    }}
                    className="flex-1 border-gray-200 hover:border-gray-900 hover:bg-gray-50"
                  >
                    80% Capacity
                  </Button>
                </div>

                {/* Save Button */}
                <Button
                  onClick={async () => {
                    setSavingSlots(listing.id);
                    const currentSlots = dailySlots[listing.id] || {
                      activeCarSlots: listing.activeCarSlots,
                      activeBikeSlots: listing.activeBikeSlots
                    };

                    updateActiveSlots(listing.id, currentSlots.activeCarSlots, currentSlots.activeBikeSlots);

                    // Simulate API call
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    setSavingSlots(null);
                    setShowSuccess(listing.id);

                    // Hide success message after 3 seconds
                    setTimeout(() => setShowSuccess(null), 3000);
                  }}
                  disabled={savingSlots === listing.id}
                  className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white text-base font-semibold rounded-lg shadow-soft"
                >
                  {savingSlots === listing.id ? "Saving..." : "Update Today's Availability"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
