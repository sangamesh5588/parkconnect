import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ParkingCard } from '@/components/ParkingCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ParkingSpace } from '@/types';
import { Link } from 'react-router-dom';

interface CategorySectionProps {
  title: string;
  subtitle: string;
  spots: ParkingSpace[];
  onBook?: (spotId: string) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  title,
  subtitle,
  spots,
  onBook
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = direction === 'left'
        ? scrollRef.current.scrollLeft - scrollAmount
        : scrollRef.current.scrollLeft + scrollAmount;

      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const canScrollLeft = scrollRef.current ? scrollRef.current.scrollLeft > 0 : false;
  const canScrollRight = scrollRef.current
    ? scrollRef.current.scrollLeft < scrollRef.current.scrollWidth - scrollRef.current.clientWidth - 10
    : true;

  return (
    <section className="mb-12">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 px-4 sm:px-6 lg:px-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1" style={{ fontWeight: 600, letterSpacing: 'tight' }}>
            {title}
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">{subtitle}</p>
        </div>

        {/* Arrow Buttons */}
        <div className="flex gap-2 ml-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="h-10 w-10 rounded-full border-gray-300 hover:border-gray-400 disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="h-10 w-10 rounded-full border-gray-300 hover:border-gray-400 disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8 pb-4"
          style={{ scrollBehavior: 'smooth' }}
        >
          {spots.map((spot) => (
            <div key={spot.id} className="flex-shrink-0">
              <ParkingCard
                spot={spot}
                onBook={onBook}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
