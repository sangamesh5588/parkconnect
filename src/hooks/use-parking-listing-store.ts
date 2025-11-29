import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ParkingListingData {
  // Step 1: Basic Details
  name: string;
  address: string;
  location: { lat: number; lng: number } | null;
  parkingType: 'car' | 'bike' | 'both';
  areaType: 'open' | 'closed' | 'apartment' | 'private';
  photos: File[];
  instructions: string;

  // Step 2: Total Slots (Permanent)
  totalCarSlots: number;
  totalBikeSlots: number;

  // Step 3: Active Slots (Daily changeable)
  activeCarSlots: number;
  activeBikeSlots: number;

  // Step 4: Pricing
  hourlyCarRate: number;
  hourlyBikeRate: number;
  dailyCarRate: number;
  dailyBikeRate: number;

  // Step 5: Availability
  openTime: string;
  closeTime: string;
  is24Hours: boolean;
  closedDays: string[];
}

interface ParkingListingStore {
  currentStep: number;
  isComplete: boolean;
  listingData: ParkingListingData;

  // Actions
  setCurrentStep: (step: number) => void;
  updateListingData: (data: Partial<ParkingListingData>) => void;
  reset: () => void;
  completeListing: () => void;
  validateStep: (step: number) => boolean;
  canAccessStep: (step: number) => boolean;
}

const initialListingData: ParkingListingData = {
  // Step 1
  name: '',
  address: '',
  location: null,
  parkingType: 'car',
  areaType: 'open',
  photos: [],
  instructions: '',

  // Step 2
  totalCarSlots: 0,
  totalBikeSlots: 0,

  // Step 3
  activeCarSlots: 0,
  activeBikeSlots: 0,

  // Step 4
  hourlyCarRate: 0,
  hourlyBikeRate: 0,
  dailyCarRate: 0,
  dailyBikeRate: 0,

  // Step 5
  openTime: '06:00',
  closeTime: '22:00',
  is24Hours: false,
  closedDays: [],
};

export const useParkingListingStore = create<ParkingListingStore>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      isComplete: false,
      listingData: initialListingData,

      setCurrentStep: (step) => set({ currentStep: step }),

      updateListingData: (data) =>
        set((state) => ({
          listingData: { ...state.listingData, ...data }
        })),

      reset: () => set({
        currentStep: 1,
        isComplete: false,
        listingData: initialListingData
      }),

      completeListing: () => set({ isComplete: true }),

      validateStep: (step) => {
        const { listingData } = get();

        switch (step) {
          case 1:
            return !!(
              listingData.name.trim() &&
              listingData.address.trim() &&
              listingData.location &&
              listingData.parkingType &&
              listingData.areaType &&
              listingData.photos.length > 0
            );

          case 2:
            return !!(
              (listingData.parkingType === 'car' || listingData.parkingType === 'both') ?
                listingData.totalCarSlots > 0 : true
            ) && !!(
              (listingData.parkingType === 'bike' || listingData.parkingType === 'both') ?
                listingData.totalBikeSlots > 0 : true
            );

          case 3:
            return !!(
              (listingData.parkingType === 'car' || listingData.parkingType === 'both') ?
                listingData.activeCarSlots >= 0 && listingData.activeCarSlots <= listingData.totalCarSlots : true
            ) && !!(
              (listingData.parkingType === 'bike' || listingData.parkingType === 'both') ?
                listingData.activeBikeSlots >= 0 && listingData.activeBikeSlots <= listingData.totalBikeSlots : true
            );

          case 4:
            return !!(
              (listingData.parkingType === 'car' || listingData.parkingType === 'both') ?
                listingData.hourlyCarRate > 0 : true
            ) && !!(
              (listingData.parkingType === 'bike' || listingData.parkingType === 'both') ?
                listingData.hourlyBikeRate > 0 : true
            );

          case 5:
            if (listingData.is24Hours) return true;
            return !!(listingData.openTime && listingData.closeTime);

          default:
            return false;
        }
      },

      canAccessStep: (step) => {
        if (step === 1) return true;

        // Can access step N only if steps 1 to N-1 are valid
        for (let i = 1; i < step; i++) {
          if (!get().validateStep(i)) return false;
        }
        return true;
      },
    }),
    {
      name: 'parking-listing-storage',
      partialize: (state) => ({
        currentStep: state.currentStep,
        isComplete: state.isComplete,
        listingData: state.listingData,
      }),
    }
  )
);
