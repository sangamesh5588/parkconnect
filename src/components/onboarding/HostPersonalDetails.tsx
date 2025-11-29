import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, User, ArrowRight, Loader2 } from "lucide-react";
import { useOnboardingStore } from "@/hooks/use-onboarding-store";

// Convert File to base64 data URL
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

interface HostPersonalDetailsProps {
  onNext: () => void;
  onPrevious: () => void;
  isLastStep: boolean;
  onComplete: () => void;
}

export default function HostPersonalDetails({
  onNext,
  onPrevious,
  isLastStep,
  onComplete
}: HostPersonalDetailsProps) {
  const { personalDetails, setPersonalDetails } = useOnboardingStore();

  // Local state for form interactions
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!personalDetails.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (personalDetails.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }

    if (!personalDetails.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalDetails.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (personalDetails.age && (parseInt(personalDetails.age) < 18 || parseInt(personalDetails.age) > 100)) {
      newErrors.age = "Age must be between 18 and 100";
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

    // Convert file to base64 if uploaded
    let profilePhotoUrl = personalDetails.profilePhoto;
    if (profilePhoto) {
      try {
        profilePhotoUrl = await fileToBase64(profilePhoto);
      } catch (error) {
        console.error('Error converting profile photo:', error);
      }
    }

    // Update store with final data
    setPersonalDetails({
      ...personalDetails,
      profilePhoto: profilePhotoUrl,
    });

    setIsLoading(false);
    onNext();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors({ ...errors, profilePhoto: "File size must be less than 5MB" });
        return;
      }
      setProfilePhoto(file);
      setErrors({ ...errors, profilePhoto: "" });
    }
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Photo Section */}
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-secondary border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
              {profilePhoto ? (
                <img
                  src={URL.createObjectURL(profilePhoto)}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : personalDetails.profilePhoto ? (
                <img
                  src={personalDetails.profilePhoto}
                  alt="Saved Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
              )}
            </div>

            {/* Upload button overlay */}
            <div className="absolute -bottom-2 -right-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="profile-photo"
              />
              <Label
                htmlFor="profile-photo"
                className="inline-flex items-center justify-center w-10 h-10 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full cursor-pointer shadow-lg transition-colors"
              >
                <Upload className="w-4 h-4" />
              </Label>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm font-medium text-gray-900 mb-1">
              {profilePhoto ? 'Profile photo uploaded' : 'Add a profile photo'}
            </p>
            <p className="text-xs text-gray-500 max-w-xs">
              Optional: Upload a photo to build trust with renters
            </p>
            {errors.profilePhoto && (
              <p className="text-xs text-red-600 mt-1">{errors.profilePhoto}</p>
            )}
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          {/* Full Name */}
          <div className="space-y-3">
            <Label htmlFor="fullName" className="text-sm font-semibold text-gray-900">
              Full Name *
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={personalDetails.fullName}
              onChange={(e) => {
                const value = e.target.value;
                setPersonalDetails({ ...personalDetails, fullName: value });
                // Clear error when user starts typing
                if (errors.fullName) setErrors({ ...errors, fullName: "" });
              }}
              className={`h-12 text-base ${errors.fullName ? 'border-red-300 focus:border-red-500' : ''}`}
            />
            {errors.fullName && (
              <p className="text-sm text-red-600">{errors.fullName}</p>
            )}
          </div>

          {/* Age */}
          <div className="space-y-3">
            <Label htmlFor="age" className="text-sm font-semibold text-gray-900">
              Age
            </Label>
            <Input
              id="age"
              type="number"
              placeholder="Your age (optional)"
              value={personalDetails.age}
              onChange={(e) => {
                const value = e.target.value;
                setPersonalDetails({ ...personalDetails, age: value });
                // Clear error when user starts typing
                if (errors.age) setErrors({ ...errors, age: "" });
              }}
              min="18"
              max="100"
              className={`h-12 text-base ${errors.age ? 'border-red-300 focus:border-red-500' : ''}`}
            />
            {errors.age && (
              <p className="text-sm text-red-600">{errors.age}</p>
            )}
            <p className="text-xs text-gray-500">Must be 18 or older to become a host</p>
          </div>

          {/* Email */}
          <div className="space-y-3">
            <Label htmlFor="email" className="text-sm font-semibold text-gray-900">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={personalDetails.email}
              onChange={(e) => {
                const value = e.target.value;
                setPersonalDetails({ ...personalDetails, email: value });
                // Clear error when user starts typing
                if (errors.email) setErrors({ ...errors, email: "" });
              }}
              className={`h-12 text-base ${errors.email ? 'border-red-300 focus:border-red-500' : ''}`}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
            <p className="text-xs text-gray-500">We'll use this for booking confirmations and payments</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="pt-6 border-t border-gray-100">
          <Button
            type="submit"
            className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground text-base font-semibold rounded-xl shadow-sm"
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
      </form>
    </div>
  );
}
