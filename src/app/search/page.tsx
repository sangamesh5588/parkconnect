import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { ParkingCard } from "@/components/ParkingCard";
import {
  Search as SearchIcon,
  MapPin,
  Filter,
  Navigation as NavIcon,
  Locate,
  Map,
  List,
  X,
  Clock,
  Star,
  TrendingUp
} from "lucide-react";
import { ParkingSpace } from "@/types";
import { redirectToLogin, isLoggedIn } from "@/utils/auth";

// Mock search results data
const mockSearchResults: ParkingSpace[] = [
  {
    id: '1',
    hostId: 'host1',
    title: 'Connaught Place Parking',
    description: 'Secure underground parking in the heart of Delhi',
    address: {
      street: 'Radial Road 5',
      city: 'New Delhi',
      state: 'Delhi',
      zipCode: '110001',
      country: 'India'
    },
    location: { latitude: 28.6315, longitude: 77.2167 },
    images: ['https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&h=300&fit=crop'],
    features: [],
    pricing: { hourly: 30, daily: 200, monthly: 4000, currency: 'INR' },
    availability: [],
    rating: 4.5,
    reviewCount: 128,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    hostId: 'host2',
    title: 'Karol Bagh Multi-level',
    description: 'Spacious parking with CCTV surveillance',
    address: {
      street: 'Pusa Road',
      city: 'New Delhi',
      state: 'Delhi',
      zipCode: '110005',
      country: 'India'
    },
    location: { latitude: 28.6517, longitude: 77.1892 },
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'],
    features: [],
    pricing: { hourly: 25, daily: 150, monthly: 3000, currency: 'INR' },
    availability: [],
    rating: 4.2,
    reviewCount: 89,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    hostId: 'host3',
    title: 'Rajouri Garden Plaza',
    description: 'Premium parking spot with easy access',
    address: {
      street: 'Rajouri Garden Main Market',
      city: 'New Delhi',
      state: 'Delhi',
      zipCode: '110027',
      country: 'India'
    },
    location: { latitude: 28.6478, longitude: 77.1234 },
    images: ['https://images.unsplash.com/photo-1494526585095-c41746248156?w=400&h=300&fit=crop'],
    features: [],
    pricing: { hourly: 35, daily: 250, monthly: 5000, currency: 'INR' },
    availability: [],
    rating: 4.7,
    reviewCount: 203,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const ParkingMarker = ({ spot, index }: { spot: ParkingSpace, index: number }) => (
  <div
    className="absolute cursor-pointer group"
    style={{
      left: `${25 + index * 15}%`,
      top: `${30 + index * 15}%`
    }}
  >
    {/* Marker */}
    <div className={`w-8 h-8 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 group-hover:scale-110 ${
      spot.status === 'active' ? 'bg-green-500' : 'bg-red-500'
    }`}>
      <div className="absolute inset-0 rounded-full bg-black bg-opacity-20"></div>
    </div>

    {/* Price Label */}
    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded-md shadow-lg whitespace-nowrap font-medium">
      ₹{spot.pricing.hourly}/hr
    </div>

    {/* Pulsing ring for available spots */}
    {spot.status === 'active' && (
      <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping opacity-20"></div>
    )}
  </div>
);

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  // Read search parameters from URL
  const location = searchParams.get('location') || '';
  const dateParam = searchParams.get('date') || '';
  const time = searchParams.get('time') || '';
  const vehicle = searchParams.get('vehicle') || 'car';

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Mock location request
  useEffect(() => {
    setTimeout(() => {
      setUserLocation({ lat: 28.6139, lng: 77.2090 });
    }, 1000);
  }, []);

  const handleBook = (spotId: string) => {
    if (!isLoggedIn()) {
      redirectToLogin(`/parking/${spotId}/book`);
    } else {
      // Navigate to booking page
      window.location.href = `/parking/${spotId}/book`;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Navigation />

      {/* Search Summary Header */}
      <div className="bg-background/95 backdrop-blur-lg border-b border-border p-4">
        <div className="container-mobile">
          {/* Search Parameters Display */}
          <div className="mb-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <SearchIcon className="h-4 w-4" />
              <span>Search results for:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {location && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {location}
                </Badge>
              )}
              {dateParam && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDate(dateParam)}
                </Badge>
              )}
              {vehicle !== 'car' && (
                <Badge variant="outline" className="capitalize">
                  {vehicle}
                </Badge>
              )}
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors whitespace-nowrap">
              <Clock className="h-3 w-3 mr-1" />
              Available Now
            </Badge>
            <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors whitespace-nowrap">
              Under ₹30/hr
            </Badge>
            <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors whitespace-nowrap">
              Top Rated
            </Badge>
            <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors whitespace-nowrap">
              <Filter className="h-3 w-3 mr-1" />
              More Filters
            </Badge>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="bg-background border-b border-border px-4 py-2">
        <div className="container-mobile">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-semibold text-lg">Search Results</h1>
              <p className="text-sm text-muted-foreground">{mockSearchResults.length} spots found</p>
            </div>
            <div className="bg-muted rounded-lg p-1 flex">
              <button
                onClick={() => setViewMode('map')}
                className={`p-2 rounded-md transition-all duration-200 touch-target ${
                  viewMode === 'map' ? 'bg-background shadow-sm' : 'text-muted-foreground'
                }`}
              >
                <Map className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all duration-200 touch-target ${
                  viewMode === 'list' ? 'bg-background shadow-sm' : 'text-muted-foreground'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Map/List Container */}
      <div className="flex-1 relative">
        {viewMode === 'map' ? (
          <>
            {/* Map Background */}
            <div className="w-full h-full bg-gradient-to-br from-blue-50 via-blue-100 to-green-50 relative overflow-hidden">
              {/* Map Grid Pattern */}
              <div className="absolute inset-0 opacity-10">
                <svg width="100%" height="100%" className="w-full h-full">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              {/* Map Elements */}
              <div className="absolute inset-0 opacity-20">
                {/* Roads */}
                <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-400 transform -translate-y-1/2"></div>
                <div className="absolute top-1/3 left-1/4 right-1/4 h-1 bg-gray-300"></div>
                <div className="absolute bottom-1/3 left-1/3 right-1/3 h-1 bg-gray-300"></div>
              </div>

              {/* Parking Markers */}
              {mockSearchResults.map((spot, index) => (
                <ParkingMarker key={spot.id} spot={spot} index={index} />
              ))}

              {/* Current Location Indicator */}
              {userLocation && (
                <div className="absolute w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2">
                  <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
                  <div className="absolute inset-1 bg-white rounded-full"></div>
                </div>
              )}

              {/* Map Controls */}
              <div className="absolute bottom-32 right-4 space-y-2">
                <Button size="icon" className="shadow-lg touch-target bg-background/95 backdrop-blur-lg">
                  <Locate className="h-4 w-4" />
                </Button>
                <Button size="icon" className="shadow-lg touch-target bg-background/95 backdrop-blur-lg">
                  <NavIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* List View */
          <div className="h-full bg-background overflow-y-auto">
            <div className="container-mobile py-4 space-y-4">
              {mockSearchResults.map((spot) => (
                <ParkingCard
                  key={spot.id}
                  spot={spot}
                  onBook={() => handleBook(spot.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Bottom Sheet for Map View */}
        {viewMode === 'map' && (
          <div className="absolute bottom-0 left-0 right-0 bg-background border-t border-border rounded-t-3xl shadow-2xl max-h-[60vh] overflow-hidden">
            {/* Sheet Handle */}
            <div className="flex justify-center py-3">
              <div className="w-12 h-1.5 bg-muted rounded-full"></div>
            </div>

            {/* Results List */}
            <div className="overflow-y-auto max-h-full pb-4">
              <div className="px-4 space-y-3">
                {mockSearchResults.map((spot) => (
                  <Card key={spot.id} className="overflow-hidden cursor-pointer hover:shadow-soft transition-shadow">
                    <div className="flex">
                      {/* Image */}
                      <div className="w-20 h-20 relative overflow-hidden flex-shrink-0">
                        <img
                          src={spot.images?.[0] || "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&h=300&fit=crop"}
                          alt={spot.title}
                          className="w-full h-full object-cover"
                        />
                        <div className={`absolute top-1 right-1 w-2 h-2 rounded-full border border-white ${
                          spot.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-3">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-semibold text-sm truncate">{spot.title}</h3>
                          <span className="font-bold text-primary text-sm">₹{spot.pricing.hourly}/hr</span>
                        </div>

                        <p className="text-xs text-muted-foreground mb-2 truncate">{spot.address.street}, {spot.address.city}</p>

                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>0.8 km</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{spot.rating}</span>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          className="w-full btn-primary"
                          onClick={() => handleBook(spot.id)}
                        >
                          Login to Book
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
