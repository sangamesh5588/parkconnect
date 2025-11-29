import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car, MapPin, Search, Filter, Clock, Star, Bike } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '@/contexts/SearchContext';
import { format } from 'date-fns';

interface SearchBarLargeProps {
  className?: string;
}

export function SearchBarLarge({ className }: SearchBarLargeProps) {
  const navigate = useNavigate();
  const { filters, updateFilters } = useSearch();
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);

  const handleSearch = () => {
    // Navigate to search results with parameters
    const params = new URLSearchParams();
    if (filters.location) params.set('location', filters.location);
    if (filters.date) params.set('date', format(filters.date, 'yyyy-MM-dd'));
    if (filters.time) params.set('time', filters.time);
    if (filters.vehicleType !== 'car') params.set('vehicle', filters.vehicleType); // Only include if not default

    navigate(`/search?${params.toString()}`);
  };

  const filterChips = [
    { id: 'available-now', label: 'Available Now', icon: Clock },
    { id: 'under-30', label: 'Under ₹30/hr', icon: null },
    { id: 'top-rated', label: 'Top Rated', icon: Star },
    { id: 'more-filters', label: 'More Filters', icon: Filter }
  ];

  return (
    <div className={`w-full max-w-4xl mx-auto px-4 ${className}`}>
      {/* Large Search Bar - Desktop: Segmented, Mobile: Single */}
      <div className="bg-white rounded-full border border-gray-200 shadow-lg p-2 h-14 mb-6">
        {/* Desktop: Segmented Search */}
        <div className="hidden md:flex items-center h-full">
          {/* Where Segment */}
          <div className="flex-1 px-6 py-3 flex items-center gap-3 hover:bg-gray-50 rounded-full transition-colors cursor-pointer group">
            <MapPin className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">Where</div>
              <input
                type="text"
                placeholder="Search for parking in Delhi, Mumbai, Bangalore..."
                value={filters.location}
                onChange={(e) => updateFilters({ location: e.target.value })}
                className="w-full text-sm text-gray-600 placeholder-gray-400 bg-transparent border-0 outline-none"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-gray-200" />

          {/* When Segment - Date Picker */}
          <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
            <PopoverTrigger asChild>
              <div className="flex-1 px-6 py-3 flex items-center gap-3 hover:bg-gray-50 rounded-full transition-colors cursor-pointer group">
                <Calendar className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">When</div>
                  <div className="text-sm text-gray-600">
                    {filters.date ? format(filters.date, 'MMM dd') : 'Select date & time'}
                  </div>
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.date || undefined}
                onSelect={(date) => {
                  updateFilters({ date });
                  setDatePopoverOpen(false);
                }}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* Divider */}
          <div className="w-px h-8 bg-gray-200" />

          {/* Vehicle Type Segment */}
          <Select
            value={filters.vehicleType}
            onValueChange={(value: 'car' | 'bike' | 'any') => updateFilters({ vehicleType: value })}
          >
            <SelectTrigger className="flex-1 px-6 py-3 h-auto border-0 bg-transparent hover:bg-gray-50 rounded-full transition-colors cursor-pointer group">
              <div className="flex items-center gap-3 w-full">
                {filters.vehicleType === 'car' ? (
                  <Car className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                ) : filters.vehicleType === 'bike' ? (
                  <Bike className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                ) : (
                  <Car className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                )}
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium text-gray-900">Vehicle</div>
                  <div className="text-sm text-gray-600 capitalize">
                    {filters.vehicleType === 'any' ? 'Any' : filters.vehicleType}
                  </div>
                </div>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="car">
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  <span>Car</span>
                </div>
              </SelectItem>
              <SelectItem value="bike">
                <div className="flex items-center gap-2">
                  <Bike className="h-4 w-4" />
                  <span>Bike</span>
                </div>
              </SelectItem>
              <SelectItem value="any">
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  <span>Any</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            className="ml-2 h-10 w-10 rounded-full bg-black hover:bg-gray-800 p-0"
          >
            <Search className="h-4 w-4 text-white" />
          </Button>
        </div>

        {/* Mobile: Single Full-Width Search */}
        <div className="md:hidden flex items-center h-full px-4">
          <MapPin className="h-5 w-5 text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Where are you going?"
            value={filters.location}
            onChange={(e) => updateFilters({ location: e.target.value })}
            className="flex-1 text-base text-gray-900 placeholder-gray-500 bg-transparent border-0 outline-none"
          />
          <Button
            onClick={handleSearch}
            className="ml-3 h-8 w-8 rounded-full bg-black hover:bg-gray-800 p-0"
          >
            <Search className="h-4 w-4 text-white" />
          </Button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-3 justify-center">
        {filterChips.map((filter) => {
          const IconComponent = filter.icon;
          return (
            <Badge
              key={filter.id}
              variant="secondary"
              className="cursor-pointer hover:bg-gray-100 transition-colors px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-full shadow-sm"
            >
              {IconComponent && <IconComponent className="h-3 w-3 mr-2" />}
              {filter.label}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
