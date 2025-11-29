import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Clock, ArrowRight, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { useParkingListingStore } from "@/hooks/use-parking-listing-store";

interface AvailabilityStepProps {
  onNext: () => void;
  onPrevious: () => void;
  isLastStep: boolean;
}

export default function AvailabilityStep({
  onNext,
  onPrevious,
  isLastStep
}: AvailabilityStepProps) {
  const { listingData, updateListingData } = useParkingListingStore();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!listingData.is24Hours) {
      if (!listingData.openTime) {
        newErrors.openTime = "Please set opening time";
      }
      if (!listingData.closeTime) {
        newErrors.closeTime = "Please set closing time";
      }
      if (listingData.openTime && listingData.closeTime && listingData.openTime >= listingData.closeTime) {
        newErrors.closeTime = "Closing time must be after opening time";
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

  const handle24HoursToggle = (checked: boolean) => {
    updateListingData({ is24Hours: checked });
    if (errors.openTime || errors.closeTime) {
      setErrors({ ...errors, openTime: "", closeTime: "" });
    }
  };

  const handleOpenTimeChange = (value: string) => {
    updateListingData({ openTime: value });
    if (errors.openTime) {
      setErrors({ ...errors, openTime: "" });
    }
  };

  const handleCloseTimeChange = (value: string) => {
    updateListingData({ closeTime: value });
    if (errors.closeTime) {
      setErrors({ ...errors, closeTime: "" });
    }
  };

  const handleDayToggle = (day: string, checked: boolean) => {
    const currentDays = listingData.closedDays || [];
    const newDays = checked
      ? [...currentDays, day]
      : currentDays.filter(d => d !== day);

    updateListingData({ closedDays: newDays });
  };

  const daysOfWeek = [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
  ];

  const dayLabels = {
    monday: 'Mon',
    tuesday: 'Tue',
    wednesday: 'Wed',
    thursday: 'Thu',
    friday: 'Fri',
    saturday: 'Sat',
    sunday: 'Sun'
  };

  return (
    <Card className="bg-white border border-gray-100 shadow-soft p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-3xl mb-4">
            <Clock className="w-8 h-8 text-gray-900" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Operating Hours</h2>
          <p className="text-gray-600 text-base">
            Set when your parking space is available for bookings
          </p>
        </div>

        {/* 24/7 Toggle */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-gray-900" />
              <div>
                <h3 className="text-sm font-semibold text-gray-900">24/7 Available</h3>
                <p className="text-sm text-gray-600">Parking available anytime</p>
              </div>
            </div>
            <Switch
              checked={listingData.is24Hours}
              onCheckedChange={handle24HoursToggle}
            />
          </div>
        </div>

        {/* Time Settings */}
        {!listingData.is24Hours && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Operating Hours *</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="openTime" className="text-sm font-semibold text-gray-900">
                  Opening Time *
                </Label>
                <Input
                  id="openTime"
                  type="time"
                  value={listingData.openTime}
                  onChange={(e) => handleOpenTimeChange(e.target.value)}
                  className={`h-14 text-lg text-center font-semibold ${errors.openTime ? 'border-red-300 focus:border-red-500' : ''}`}
                />
                {errors.openTime && (
                  <p className="text-sm text-red-600">{errors.openTime}</p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="closeTime" className="text-sm font-semibold text-gray-900">
                  Closing Time *
                </Label>
                <Input
                  id="closeTime"
                  type="time"
                  value={listingData.closeTime}
                  onChange={(e) => handleCloseTimeChange(e.target.value)}
                  className={`h-14 text-lg text-center font-semibold ${errors.closeTime ? 'border-red-300 focus:border-red-500' : ''}`}
                />
                {errors.closeTime && (
                  <p className="text-sm text-red-600">{errors.closeTime}</p>
                )}
              </div>
            </div>

            {(listingData.openTime && listingData.closeTime) && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                <div className="flex items-center justify-center space-x-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-900" />
                  <span className="font-medium text-gray-900">
                    Operating: {listingData.openTime} - {listingData.closeTime}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Closed Days */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Days Closed (Optional)</h3>
          <p className="text-sm text-gray-600">Select days when parking is not available</p>

          <div className="grid grid-cols-7 gap-2">
            {daysOfWeek.map((day) => {
              const isClosed = listingData.closedDays?.includes(day) || false;
              return (
                <div key={day} className="flex flex-col items-center space-y-2">
                  <Button
                    type="button"
                    variant={isClosed ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleDayToggle(day, !isClosed)}
                    className={`w-12 h-12 p-0 text-xs font-medium ${
                      isClosed
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {dayLabels[day as keyof typeof dayLabels]}
                  </Button>
                  {isClosed && (
                    <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                  )}
                </div>
              );
            })}
          </div>

          {listingData.closedDays && listingData.closedDays.length > 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">
                Closed on: {listingData.closedDays.map(day =>
                  dayLabels[day as keyof typeof dayLabels]
                ).join(', ')}
              </p>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Availability Summary</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Operating Mode:</span>
              <span className="text-sm font-medium text-gray-900">
                {listingData.is24Hours ? '24/7 Available' : 'Scheduled Hours'}
              </span>
            </div>
            {!listingData.is24Hours && listingData.openTime && listingData.closeTime && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Hours:</span>
                <span className="text-sm font-medium text-gray-900">
                  {listingData.openTime} - {listingData.closeTime}
                </span>
              </div>
            )}
            {listingData.closedDays && listingData.closedDays.length > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Closed Days:</span>
                <span className="text-sm font-medium text-gray-900">
                  {listingData.closedDays.length} day{listingData.closedDays.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
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
                  Creating Listing...
                </>
              ) : (
                <>
                  Complete Setup
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
