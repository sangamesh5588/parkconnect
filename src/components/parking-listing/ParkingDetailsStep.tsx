import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { MapPin, Camera, Upload, X, ArrowRight, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { useParkingListingStore } from "@/hooks/use-parking-listing-store";

interface ParkingDetailsStepProps {
  onNext: () => void;
  onPrevious: () => void;
  isLastStep: boolean;
}

export default function ParkingDetailsStep({
  onNext,
  onPrevious,
  isLastStep
}: ParkingDetailsStepProps) {
  const { listingData, updateListingData } = useParkingListingStore();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!listingData.name.trim()) {
      newErrors.name = "Parking space name is required";
    }

    if (!listingData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!listingData.location) {
      newErrors.location = "Please select a location on the map";
    }

    if (!listingData.parkingType) {
      newErrors.parkingType = "Please select parking type";
    }

    if (!listingData.areaType) {
      newErrors.areaType = "Please select area type";
    }

    if (listingData.photos.length === 0) {
      newErrors.photos = "Please upload at least one photo";
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

  const handlePhotoUpload = (files: FileList) => {
    const newPhotos = Array.from(files);
    const totalPhotos = listingData.photos.length + newPhotos.length;

    if (totalPhotos > 4) {
      setErrors({ ...errors, photos: "Maximum 4 photos allowed" });
      return;
    }

    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const invalidFiles = newPhotos.filter(file => !validTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      setErrors({ ...errors, photos: "Only JPEG and PNG files are allowed" });
      return;
    }

    // Validate file sizes (5MB max per file)
    const maxSize = 5 * 1024 * 1024;
    const oversizedFiles = newPhotos.filter(file => file.size > maxSize);

    if (oversizedFiles.length > 0) {
      setErrors({ ...errors, photos: "Each photo must be less than 5MB" });
      return;
    }

    updateListingData({ photos: [...listingData.photos, ...newPhotos] });
    setErrors({ ...errors, photos: "" });
  };

  const removePhoto = (index: number) => {
    const newPhotos = listingData.photos.filter((_, i) => i !== index);
    updateListingData({ photos: newPhotos });
  };

  const handleLocationSelect = () => {
    // For demo purposes, set a mock location
    // In real implementation, this would open a map picker
    const mockLocation = { lat: 28.6139, lng: 77.2090 }; // Delhi coordinates
    updateListingData({ location: mockLocation });
    setErrors({ ...errors, location: "" });
  };

  const clearFieldError = (field: string) => {
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  return (
    <Card className="bg-white border border-gray-100 shadow-soft p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="name" className="text-sm font-medium text-gray-900">
              Parking Space Name *
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g., Prime Parking - Connaught Place"
              value={listingData.name}
              onChange={(e) => {
                updateListingData({ name: e.target.value });
                clearFieldError('name');
              }}
              className={`h-12 text-base border-gray-200 focus:border-gray-900 focus:ring-0 transition-colors ${errors.name ? 'border-red-300 focus:border-red-500' : ''}`}
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name}</p>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="address" className="text-sm font-medium text-gray-900">
              Full Address *
            </Label>
            <Textarea
              id="address"
              placeholder="Complete address including landmarks"
              value={listingData.address}
              onChange={(e) => {
                updateListingData({ address: e.target.value });
                clearFieldError('address');
              }}
              className={`min-h-20 text-base resize-none border-gray-200 focus:border-gray-900 focus:ring-0 transition-colors ${errors.address ? 'border-red-300 focus:border-red-500' : ''}`}
            />
            {errors.address && (
              <p className="text-sm text-red-600 mt-1">{errors.address}</p>
            )}
          </div>

          {/* Location Picker */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-semibold text-gray-900">
                  Location on Map *
                </Label>
                <p className="text-sm text-gray-600 mt-1">Pin your exact parking location</p>
              </div>
              {listingData.location && (
                <div className="flex items-center text-gray-900 bg-gray-100 px-3 py-1 rounded-full">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">Location Set</span>
                </div>
              )}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleLocationSelect}
              className="w-full h-12 border border-gray-200 hover:border-gray-900 hover:bg-gray-50 text-gray-900 transition-colors"
            >
              <MapPin className="w-4 h-4 mr-2" />
              {listingData.location ? 'Update Location' : 'Select Location on Map'}
            </Button>

            {listingData.location && (
              <div className="p-4 bg-gray-50 border border-gray-100 rounded-lg">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                  <span>
                    {listingData.location.lat.toFixed(6)}, {listingData.location.lng.toFixed(6)}
                  </span>
                </div>
              </div>
            )}

            {errors.location && (
              <p className="text-sm text-red-600">{errors.location}</p>
            )}
          </div>

          {/* Parking Type Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-900">
                Parking Type *
              </Label>
              <Select
                value={listingData.parkingType}
                onValueChange={(value: 'car' | 'bike' | 'both') => {
                  updateListingData({ parkingType: value });
                  clearFieldError('parkingType');
                }}
              >
                <SelectTrigger className={`h-12 text-base ${errors.parkingType ? 'border-red-300 focus:border-red-500' : ''}`}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="car">Cars Only</SelectItem>
                  <SelectItem value="bike">Bikes Only</SelectItem>
                  <SelectItem value="both">Cars & Bikes</SelectItem>
                </SelectContent>
              </Select>
              {errors.parkingType && (
                <p className="text-sm text-red-600">{errors.parkingType}</p>
              )}
            </div>

            <div className="space-y-3 sm:col-span-2">
              <Label className="text-sm font-semibold text-gray-900">
                Parking Area Type *
              </Label>
              <Select
                value={listingData.areaType}
                onValueChange={(value: 'open' | 'closed' | 'apartment' | 'private') => {
                  updateListingData({ areaType: value });
                  clearFieldError('areaType');
                }}
              >
                <SelectTrigger className={`h-12 text-base ${errors.areaType ? 'border-red-300 focus:border-red-500' : ''}`}>
                  <SelectValue placeholder="Select area type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open Parking</SelectItem>
                  <SelectItem value="closed">Closed/Garage</SelectItem>
                  <SelectItem value="apartment">Apartment Visitor</SelectItem>
                  <SelectItem value="private">Private Home</SelectItem>
                </SelectContent>
              </Select>
              {errors.areaType && (
                <p className="text-sm text-red-600">{errors.areaType}</p>
              )}
            </div>
          </div>

          {/* Photo Upload */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-semibold text-gray-900">
                  Photos ({listingData.photos.length}/4) *
                </Label>
                <p className="text-sm text-gray-600 mt-1">Upload clear photos of your parking space</p>
              </div>
              {listingData.photos.length > 0 && (
                <div className="flex items-center text-gray-900 bg-gray-100 px-3 py-1 rounded-full">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">Photos Added</span>
                </div>
              )}
            </div>

            {/* Photo Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {listingData.photos.map((photo, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={photo instanceof File ? URL.createObjectURL(photo) : photo}
                    alt={`Parking photo ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 bg-white/90 hover:bg-white w-8 h-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              {/* Upload Button */}
              {listingData.photos.length < 4 && (
                <div className="aspect-square">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => e.target.files && handlePhotoUpload(e.target.files)}
                    className="hidden"
                  />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-full border-2 border-dashed border-gray-300 hover:border-gray-900 hover:bg-gray-50 flex flex-col items-center justify-center text-gray-600 transition-colors"
            >
              <Camera className="w-6 h-6 mb-2" />
              <span className="text-sm font-medium">Add Photo</span>
            </Button>
                </div>
              )}
            </div>

            {errors.photos && (
              <p className="text-sm text-red-600">{errors.photos}</p>
            )}
            <p className="text-xs text-gray-500">
              Upload up to 4 photos (JPEG/PNG, max 5MB each). Include entrance, parking area, and signage.
            </p>
          </div>

          {/* Instructions */}
          <div className="space-y-3">
            <Label htmlFor="instructions" className="text-sm font-semibold text-gray-900">
              Instructions (Optional)
            </Label>
            <Textarea
              id="instructions"
              placeholder="How to enter? Where to park? Who to contact? Any special instructions..."
              value={listingData.instructions}
              onChange={(e) => updateListingData({ instructions: e.target.value })}
              className="min-h-20 text-base resize-none"
            />
            <p className="text-xs text-gray-500">
              Help renters understand how to access and use your parking space.
            </p>
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
