import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Star, Heart, Shield, Zap, Car, Eye, Sparkles, TrendingUp } from "lucide-react";
import { ParkingSpace } from "@/types";
import { isLoggedIn, redirectToLogin } from "@/utils/auth";

interface ParkingCardProps {
  spot: ParkingSpace;
  showFavorite?: boolean;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
  onBook?: (spotId: string) => void;
  compact?: boolean;
}

export const ParkingCard = ({
  spot,
  showFavorite = true,
  isFavorite = false,
  onFavoriteToggle,
  onBook,
  compact = false
}: ParkingCardProps) => {
  const imageUrl = spot.images?.[0] || "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&h=300&fit=crop";
  const distance = "0.8 km"; // Mock distance - would come from user location
  const isAvailable = spot.status === 'active';

  // Generate parking-specific tags based on features
  const getParkingTag = (spot: ParkingSpace) => {
    if (spot.rating >= 4.5) return "Secure Spot";
    if (spot.pricing.hourly <= 20) return "Budget Parking";
    if (spot.status === 'active') return "Instant Booking";
    return "Covered Parking";
  };

  // Get appropriate price display
  const getPriceDisplay = (spot: ParkingSpace) => {
    const price = spot.pricing.hourly;
    if (price <= 30) return `₹${price}/hour`;
    if (price <= 100) return `₹${Math.round(price * 6)} for 6 hours`;
    return `₹${Math.round(price * 24)}/day`;
  };

  if (compact) {
    return (
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 shadow-lg">
        <div className="flex bg-white rounded-2xl overflow-hidden">
          {/* Image */}
          <div className="w-24 h-24 relative overflow-hidden flex-shrink-0">
            <img
              src={imageUrl}
              alt={spot.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            {/* Status indicator */}
            <div className={`absolute top-2 right-2 w-2 h-2 rounded-full border border-white ${
              isAvailable ? 'bg-green-400' : 'bg-red-400'
            }`} />
          </div>

          {/* Content */}
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-base text-gray-900 mb-1 line-clamp-1">
                {spot.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2 line-clamp-1">{spot.title}</p>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{distance}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span>{spot.rating}</span>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <Button
                size="sm"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200"
                asChild
              >
                <Link to={`/parking/${spot.id}`}>Discover</Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-72 h-96 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group border-0 shadow-lg bg-white rounded-2xl">
      <div className="relative">
        {/* Image - 62.5% of card height (16:10 aspect ratio) */}
        <div className="aspect-[16/10] overflow-hidden">
          <img
            src={imageUrl}
            alt={spot.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Tag - Top Left - Standard UI positioning */}
        <div className="absolute top-4 left-4">
          <Badge className="bg-white/95 text-gray-900 border-0 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm">
            {getParkingTag(spot)}
          </Badge>
        </div>

        {/* Heart Icon - Top Right - Standard UI positioning */}
        {showFavorite && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onFavoriteToggle?.();
            }}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200 shadow-sm flex items-center justify-center"
          >
            <Heart className={`h-4 w-4 text-gray-700 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        )}
      </div>

      {/* Content Section - Standard UI/UX Layout */}
      <div className="p-5 flex flex-col flex-1">
        {/* Title & Description - Better Typography Hierarchy */}
        <div className="space-y-2 mb-auto">
          <h3 className="font-bold text-lg text-gray-900 leading-tight line-clamp-2">
            {spot.title}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
            {spot.description}
          </p>
        </div>

        {/* Price & Rating Row - Standard UI Alignment */}
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-xl text-gray-900">{getPriceDisplay(spot)}</span>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold text-gray-900">{spot.rating}</span>
          </div>
        </div>

        {/* Details Row - Standard UI Spacing */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin className="h-3.5 w-3.5" />
            <span className="font-medium">{distance} away</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Car className="h-3.5 w-3.5" />
            <span className="font-medium">Car/Bike</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
