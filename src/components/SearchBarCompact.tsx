import { Button } from '@/components/ui/button';
import { Calendar, Car, MapPin, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '@/contexts/SearchContext';
import { format } from 'date-fns';

interface SearchBarCompactProps {
  className?: string;
}

export function SearchBarCompact({ className }: SearchBarCompactProps) {
  const navigate = useNavigate();
  const { filters } = useSearch();

  const handleSearch = () => {
    // Navigate to search results with parameters
    const params = new URLSearchParams();
    if (filters.location) params.set('location', filters.location);
    if (filters.date) params.set('date', format(filters.date, 'yyyy-MM-dd'));
    if (filters.time) params.set('time', filters.time);
    if (filters.vehicleType !== 'car') params.set('vehicle', filters.vehicleType); // Only include if not default

    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className={`w-full flex justify-center ${className}`}>
      {/* Compact Search Bar - Improved sizing */}
      <div className="bg-white/90 backdrop-blur-md rounded-full border border-gray-200 shadow-sm px-6 py-3 flex items-center w-96 h-13">
        {/* Where Segment */}
        <div className="flex-1 flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-full transition-colors cursor-pointer group">
          <MapPin className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">
              {filters.location || 'Where'}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200" />

        {/* When Segment */}
        <div className="flex-1 flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-full transition-colors cursor-pointer group">
          <Calendar className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">
              {filters.date ? format(filters.date, 'MMM dd') : 'When'}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200" />

        {/* Vehicle Type Segment */}
        <div className="flex-1 flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-full transition-colors cursor-pointer group">
          <Car className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate capitalize">
              {filters.vehicleType}
            </div>
          </div>
        </div>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          className="ml-3 h-8 w-8 rounded-full bg-black hover:bg-gray-800 p-0"
        >
          <Search className="h-4 w-4 text-white" />
        </Button>
      </div>
    </div>
  );
}
