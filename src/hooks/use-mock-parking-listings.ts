import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface MockParkingListing {
  id: string;
  hostId: string; // Mock host ID for now
  name: string;
  address: string;
  location: { lat: number; lng: number } | null;
  parkingType: 'car' | 'bike' | 'both';
  areaType: 'open' | 'closed' | 'apartment' | 'private';
  photos: File[];
  instructions: string;

  // Total capacity (permanent)
  totalCarSlots: number;
  totalBikeSlots: number;

  // Active slots (daily changeable)
  activeCarSlots: number;
  activeBikeSlots: number;

  // Pricing
  hourlyCarRate: number;
  hourlyBikeRate: number;
  dailyCarRate: number;
  dailyBikeRate: number;

  // Availability
  openTime: string;
  closeTime: string;
  is24Hours: boolean;
  closedDays: string[];

  // Metadata
  status: 'pending' | 'approved' | 'rejected' | 'live';
  createdAt: Date;
  updatedAt: Date;
}

interface MockParkingListingsStore {
  listings: MockParkingListing[];

  // Actions
  addListing: (listingData: Omit<MockParkingListing, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateListing: (id: string, updates: Partial<MockParkingListing>) => void;
  getListingsByHost: (hostId: string) => MockParkingListing[];
  getListingById: (id: string) => MockParkingListing | undefined;
  updateActiveSlots: (id: string, activeCarSlots: number, activeBikeSlots: number) => void;
  getTotalStats: (hostId: string) => {
    totalListings: number;
    totalCarSlots: number;
    totalBikeSlots: number;
    activeCarSlots: number;
    activeBikeSlots: number;
  };
}

const mockHostId = 'host-demo-123'; // Mock host ID for demo purposes

// Helper to create a serializable version of listings for storage
const serializeListings = (listings: MockParkingListing[]) => {
  return listings.map(listing => ({
    ...listing,
    photos: [], // File objects can't be stored in localStorage
    createdAt: listing.createdAt.toISOString(),
    updatedAt: listing.updatedAt.toISOString(),
  }));
};

// Helper to deserialize listings from storage
const deserializeListings = (listings: any[]): MockParkingListing[] => {
  return listings.map(listing => ({
    ...listing,
    photos: [], // Photos will be empty after refresh
    createdAt: new Date(listing.createdAt),
    updatedAt: new Date(listing.updatedAt),
  }));
};

export const useMockParkingListings = create<MockParkingListingsStore>()(
  persist(
    (set, get) => ({
      listings: [],

      addListing: (listingData) => {
        const existingListings = get().getListingsByHost(listingData.hostId);

        // Check if host already has any listing (pending, live, rejected, etc.)
        if (existingListings.length > 0) {
          console.warn('Host already has a parking listing. Only one listing allowed per host.');
          return;
        }

        const newListing: MockParkingListing = {
          ...listingData,
          id: `listing-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({
          listings: [...state.listings, newListing]
        }));
      },

      updateListing: (id, updates) => {
        set((state) => ({
          listings: state.listings.map(listing =>
            listing.id === id
              ? { ...listing, ...updates, updatedAt: new Date() }
              : listing
          )
        }));
      },

      getListingsByHost: (hostId) => {
        return get().listings.filter(listing => listing.hostId === hostId);
      },

      getListingById: (id) => {
        return get().listings.find(listing => listing.id === id);
      },

      updateActiveSlots: (id, activeCarSlots, activeBikeSlots) => {
        set((state) => ({
          listings: state.listings.map(listing =>
            listing.id === id
              ? {
                  ...listing,
                  activeCarSlots: Math.max(0, Math.min(activeCarSlots, listing.totalCarSlots)),
                  activeBikeSlots: Math.max(0, Math.min(activeBikeSlots, listing.totalBikeSlots)),
                  updatedAt: new Date()
                }
              : listing
          )
        }));
      },

      getTotalStats: (hostId) => {
        const hostListings = get().getListingsByHost(hostId);

        return hostListings.reduce(
          (stats, listing) => ({
            totalListings: stats.totalListings + 1,
            totalCarSlots: stats.totalCarSlots + listing.totalCarSlots,
            totalBikeSlots: stats.totalBikeSlots + listing.totalBikeSlots,
            activeCarSlots: stats.activeCarSlots + listing.activeCarSlots,
            activeBikeSlots: stats.activeBikeSlots + listing.activeBikeSlots,
          }),
          {
            totalListings: 0,
            totalCarSlots: 0,
            totalBikeSlots: 0,
            activeCarSlots: 0,
            activeBikeSlots: 0,
          }
        );
      },
    }),
    {
      name: 'mock-parking-listings-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        listings: serializeListings(state.listings)
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.listings = deserializeListings(state.listings);
        }
      }
    }
  )
);

// Export mock host ID for use in components
export { mockHostId };
