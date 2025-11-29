import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search as SearchIcon,
  MapPin,
  Filter,
  Navigation,
  Clock,
  DollarSign,
  Star,
  ChevronUp,
  ChevronDown,
  X,
  Map,
  List,
  Locate
} from "lucide-react";

// Mock parking data with better images
const mockParkingSpots = [
  {
    id: '1',
    title: 'Connaught Place Parking',
    address: 'Radial Road 5, Connaught Place',
    distance: '0.8 km',
    price: 30,
    rating: 4.5,
    available: true,
    image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&h=300&fit=crop',
    coordinates: { lat: 28.6315, lng: 77.2167 }
  },
  {
    id: '2',
    title: 'Karol Bagh Multi-level',
    address: 'Pusa Road, Karol Bagh',
    distance: '1.2 km',
    price: 25,
    rating: 4.2,
    available: true,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    coordinates: { lat: 28.6517, lng: 77.1892 }
  },
  {
    id: '3',
    title: 'Rajouri Garden Plaza',
    address: 'Rajouri Garden Main Market',
    distance: '2.1 km',
    price: 35,
    rating: 4.7,
    available: false,
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=400&h=300&fit=crop',
    coordinates: { lat: 28.6478, lng: 77.1234 }
  },
  {
    id: '4',
    title: 'Lajpat Nagar Market',
    address: 'Lajpat Nagar Central Market',
    distance: '3.5 km',
    price: 20,
    rating: 4.0,
    available: true,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop',
    coordinates: { lat: 28.5783, lng: 77.2437 }
  }
];

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [sheetHeight, setSheetHeight] = useState<'collapsed' | 'half' | 'full'>('half');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const mapRef = useRef<HTMLDivElement>(null);

  // Mock location request
  useEffect(() => {
    setTimeout(() => {
      setUserLocation({ lat: 28.6139, lng: 77.2090 });
    }, 1000);
  }, []);

  const filters = [
    { id: 'price', label: 'Price', icon: DollarSign, active: selectedFilters.includes('price') },
    { id: 'distance', label: 'Distance', icon: MapPin, active: selectedFilters.includes('distance') },
    { id: 'availability', label: 'Available Now', icon: Clock, active: selectedFilters.includes('availability') }
  ];

  const toggleFilter = (filterId: string) => {
    setSelectedFilters(prev =>
      prev.includes(filterId)
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  const getSheetHeight = () => {
    switch (sheetHeight) {
      case 'collapsed': return 'translate-y-[calc(100%-80px)]';
      case 'half': return 'translate-y-1/2';
      case 'full': return 'translate-y-0';
      default: return 'translate-y-1/2';
    }
  };

  const ParkingMarker = ({ spot, index }: { spot: any, index: number }) => (
    <div
      className="absolute cursor-pointer group"
      style={{
        left: `${25 + index * 18}%`,
        top: `${35 + index * 20}%`
      }}
    >
      {/* Marker */}
      <div className={`w-8 h-8 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 group-hover:scale-110 ${
        spot.available ? 'bg-green-500' : 'bg-red-500'
      }`}>
        <div className="absolute inset-0 rounded-full bg-black bg-opacity-20"></div>
      </div>

      {/* Price Label */}
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded-md shadow-lg whitespace-nowrap font-medium">
        ₹{spot.price}/hr
      </div>

      {/* Pulsing ring for available spots */}
      {spot.available && (
        <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping opacity-20"></div>
      )}
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Floating Search Header */}
      <div className={`absolute top-4 left-4 right-4 z-20 transition-all duration-300 ${
        isSearchFocused ? 'scale-105' : ''
      }`}>
        {/* Search Bar */}
        <div className="bg-background/95 backdrop-blur-lg border border-border rounded-2xl shadow-soft p-3 mb-3">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search locations, landmarks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="pl-10 border-0 bg-transparent focus:ring-0 text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {filters.map((filter) => {
            const IconComponent = filter.icon;
            return (
              <Badge
                key={filter.id}
                variant={filter.active ? "default" : "secondary"}
                className={`cursor-pointer whitespace-nowrap touch-target transition-all duration-200 hover:scale-105 ${
                  filter.active ? 'bg-primary text-primary-foreground' : 'bg-background/80 text-muted-foreground border-border'
                }`}
                onClick={() => toggleFilter(filter.id)}
              >
                <IconComponent className="h-3 w-3 mr-1" />
                {filter.label}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* View Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <div className="bg-background/95 backdrop-blur-lg border border-border rounded-xl shadow-soft p-1 flex">
          <button
            onClick={() => setViewMode('map')}
            className={`p-2 rounded-lg transition-all duration-200 touch-target ${
              viewMode === 'map' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
            }`}
          >
            <Map className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all duration-200 touch-target ${
              viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
            }`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Map/List Container */}
      <div className="flex-1 relative mt-24">
        {viewMode === 'map' ? (
          <>
            {/* Enhanced Map Background */}
            <div ref={mapRef} className="w-full h-full bg-gradient-to-br from-blue-50 via-blue-100 to-green-50 relative overflow-hidden">
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

                {/* Landmarks */}
                <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>

              {/* Parking Markers */}
              {mockParkingSpots.map((spot, index) => (
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
                  <Navigation className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* List View */
          <div className="h-full bg-background">
            <div className="p-4 space-y-3">
              {mockParkingSpots.map((spot) => (
                <Card key={spot.id} className="overflow-hidden hover:shadow-soft transition-shadow duration-200 cursor-pointer">
                  <div className="flex">
                    {/* Image */}
                    <div className="w-20 h-20 relative overflow-hidden">
                      <img
                        src={spot.image}
                        alt={spot.title}
                        className="w-full h-full object-cover"
                      />
                      <div className={`absolute top-2 right-2 w-3 h-3 rounded-full border border-white ${
                        spot.available ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-3">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold text-sm truncate">{spot.title}</h3>
                        <span className="font-bold text-primary">₹{spot.price}</span>
                      </div>

                      <p className="text-xs text-muted-foreground mb-2 truncate">{spot.address}</p>

                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{spot.distance}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{spot.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Bottom Sheet */}
        {viewMode === 'map' && (
          <div className={`absolute bottom-0 left-0 right-0 bg-background border-t border-border rounded-t-3xl shadow-2xl transition-all duration-300 ease-out ${getSheetHeight()}`}>
            {/* Sheet Handle */}
            <div className="flex justify-center py-4">
              <div className="w-12 h-1.5 bg-muted rounded-full"></div>
            </div>

            {/* Sheet Header */}
            <div className="px-6 pb-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-lg">Nearby Parking</h2>
                  <p className="text-muted-foreground text-sm">
                    {mockParkingSpots.filter(s => s.available).length} spots available • Updated just now
                  </p>
                </div>
                <Button variant="ghost" size="icon" className="touch-target">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Results List */}
            <div className="flex-1 overflow-y-auto max-h-96">
              {mockParkingSpots.map((spot) => (
                <div key={spot.id} className="p-4 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors duration-150 cursor-pointer">
                  <div className="flex gap-4">
                    {/* Spot Image */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={spot.image}
                        alt={spot.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Spot Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-semibold text-sm truncate">{spot.title}</h3>
                        <div className={`flex items-center gap-1 text-xs ${
                          spot.available ? 'text-green-600' : 'text-red-600'
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${
                            spot.available ? 'bg-green-500' : 'bg-red-500'
                          }`} />
                          <span>{spot.available ? 'Available' : 'Occupied'}</span>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground mb-2 truncate">{spot.address}</p>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{spot.distance}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>24/7</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{spot.rating}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">per hour</span>
                        <span className="font-bold text-primary text-lg">₹{spot.price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
