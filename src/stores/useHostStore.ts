import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Types
export interface HostProfile {
  id: string;
  user_id: string;
  onboarding_completed: boolean;
  role: 'host' | 'renter';
  created_at: string;
  updated_at: string;
}

export interface ParkingListing {
  id: string;
  hostId: string;
  name: string;
  address: string;
  location: { lat: number; lng: number };
  parkingType: 'indoor' | 'outdoor' | 'covered';
  areaType: 'residential' | 'commercial' | 'mall';
  photos: string[];
  instructions: string;
  totalCarSlots: number;
  totalBikeSlots: number;
  activeCarSlots: number;
  activeBikeSlots: number;
  hourlyCarRate: number;
  hourlyBikeRate: number;
  dailyCarRate: number;
  dailyBikeRate: number;
  openTime: string;
  closeTime: string;
  is24Hours: boolean;
  closedDays: number[];
  status: 'pending' | 'live' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  listingId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  vehicleNumber: string;
  vehicleType: 'car' | 'bike';
  startTime: Date;
  endTime: Date;
  duration: number; // in hours
  hourlyRate: number;
  totalAmount: number;
  status: 'confirmed' | 'active' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  created_at: string;
}

export interface ParkingSession {
  id: string;
  bookingId: string;
  listingId: string;
  customerName: string;
  customerPhone: string;
  vehicleNumber: string;
  vehicleType: 'car' | 'bike';
  spaceName: string;
  actualStartTime: Date;
  bookedStartTime: Date;
  bookedEndTime: Date;
  bookedDuration: number;
  hourlyRate: number;
  gateStatus: 'open' | 'closed';
  paymentStatus: 'pending' | 'paid' | 'overdue';
  totalAmount: number;
  overtimeCharges: number;
}

export interface HostStats {
  totalListings: number;
  liveListings: number;
  pendingListings: number;
  totalBookings: number;
  todayBookings: number;
  activeSessions: number;
  totalEarnings: number;
  todayEarnings: number;
  averageRating: number;
  totalReviews: number;
}

interface HostState {
  // Profile
  profile: HostProfile | null;
  isLoadingProfile: boolean;
  profileError: string | null;

  // Listings
  listings: ParkingListing[];
  isLoadingListings: boolean;
  listingsError: string | null;

  // Bookings
  bookings: Booking[];
  isLoadingBookings: boolean;
  bookingsError: string | null;

  // Sessions
  sessions: ParkingSession[];
  isLoadingSessions: boolean;
  sessionsError: string | null;

  // Stats
  stats: HostStats | null;
  isLoadingStats: boolean;
  statsError: string | null;

  // UI State
  lastRefresh: Date | null;
  isRefreshing: boolean;

  // Actions
  setProfile: (profile: HostProfile | null) => void;
  setProfileLoading: (loading: boolean) => void;
  setProfileError: (error: string | null) => void;

  setListings: (listings: ParkingListing[]) => void;
  setListingsLoading: (loading: boolean) => void;
  setListingsError: (error: string | null) => void;
  addListing: (listing: ParkingListing) => void;
  updateListing: (id: string, updates: Partial<ParkingListing>) => void;
  removeListing: (id: string) => void;

  setBookings: (bookings: Booking[]) => void;
  setBookingsLoading: (loading: boolean) => void;
  setBookingsError: (error: string | null) => void;
  addBooking: (booking: Booking) => void;
  updateBooking: (id: string, updates: Partial<Booking>) => void;

  setSessions: (sessions: ParkingSession[]) => void;
  setSessionsLoading: (loading: boolean) => void;
  setSessionsError: (error: string | null) => void;
  addSession: (session: ParkingSession) => void;
  updateSession: (id: string, updates: Partial<ParkingSession>) => void;

  setStats: (stats: HostStats | null) => void;
  setStatsLoading: (loading: boolean) => void;
  setStatsError: (error: string | null) => void;

  // Data synchronization
  refreshData: () => Promise<void>;
  setRefreshing: (refreshing: boolean) => void;
  setLastRefresh: (date: Date) => void;

  // Computed getters
  getLiveListings: () => ParkingListing[];
  getPendingListings: () => ParkingListing[];
  getTodayBookings: () => Booking[];
  getActiveSessions: () => ParkingSession[];
  getTodaysStats: () => {
    totalBookings: number;
    activeSessions: number;
    todayEarnings: number;
  };

  // Reset
  reset: () => void;
}

const initialState = {
  profile: null,
  isLoadingProfile: false,
  profileError: null,

  listings: [],
  isLoadingListings: false,
  listingsError: null,

  bookings: [],
  isLoadingBookings: false,
  bookingsError: null,

  sessions: [],
  isLoadingSessions: false,
  sessionsError: null,

  stats: null,
  isLoadingStats: false,
  statsError: null,

  lastRefresh: null,
  isRefreshing: false,
};

export const useHostStore = create<HostState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Profile actions
      setProfile: (profile) => set({ profile }),
      setProfileLoading: (isLoadingProfile) => set({ isLoadingProfile }),
      setProfileError: (profileError) => set({ profileError }),

      // Listings actions
      setListings: (listings) => set({ listings }),
      setListingsLoading: (isLoadingListings) => set({ isLoadingListings }),
      setListingsError: (listingsError) => set({ listingsError }),
      addListing: (listing) => set((state) => ({
        listings: [...state.listings, listing]
      })),
      updateListing: (id, updates) => set((state) => ({
        listings: state.listings.map(listing =>
          listing.id === id ? { ...listing, ...updates } : listing
        )
      })),
      removeListing: (id) => set((state) => ({
        listings: state.listings.filter(listing => listing.id !== id)
      })),

      // Bookings actions
      setBookings: (bookings) => set({ bookings }),
      setBookingsLoading: (isLoadingBookings) => set({ isLoadingBookings }),
      setBookingsError: (bookingsError) => set({ bookingsError }),
      addBooking: (booking) => set((state) => ({
        bookings: [...state.bookings, booking]
      })),
      updateBooking: (id, updates) => set((state) => ({
        bookings: state.bookings.map(booking =>
          booking.id === id ? { ...booking, ...updates } : booking
        )
      })),

      // Sessions actions
      setSessions: (sessions) => set({ sessions }),
      setSessionsLoading: (isLoadingSessions) => set({ isLoadingSessions }),
      setSessionsError: (sessionsError) => set({ sessionsError }),
      addSession: (session) => set((state) => ({
        sessions: [...state.sessions, session]
      })),
      updateSession: (id, updates) => set((state) => ({
        sessions: state.sessions.map(session =>
          session.id === id ? { ...session, ...updates } : session
        )
      })),

      // Stats actions
      setStats: (stats) => set({ stats }),
      setStatsLoading: (isLoadingStats) => set({ isLoadingStats }),
      setStatsError: (statsError) => set({ statsError }),

      // Data sync actions
      refreshData: async () => {
        const state = get();
        set({ isRefreshing: true });

        try {
          // Simulate API calls - replace with actual API calls
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Update last refresh timestamp
          set({
            lastRefresh: new Date(),
            isRefreshing: false
          });
        } catch (error) {
          console.error('Failed to refresh data:', error);
          set({ isRefreshing: false });
        }
      },

      setRefreshing: (isRefreshing) => set({ isRefreshing }),
      setLastRefresh: (lastRefresh) => set({ lastRefresh }),

      // Computed getters
      getLiveListings: () => get().listings.filter(listing => listing.status === 'live'),
      getPendingListings: () => get().listings.filter(listing => listing.status === 'pending'),

      getTodayBookings: () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        return get().bookings.filter(booking => {
          const bookingDate = new Date(booking.created_at);
          return bookingDate >= today && bookingDate < tomorrow;
        });
      },

      getActiveSessions: () => get().sessions.filter(session =>
        session.gateStatus === 'open' || session.paymentStatus === 'pending'
      ),

      getTodaysStats: () => {
        const todayBookings = get().getTodayBookings();
        const activeSessions = get().getActiveSessions();

        return {
          totalBookings: todayBookings.length,
          activeSessions: activeSessions.length,
          todayEarnings: todayBookings.reduce((sum, booking) => sum + booking.totalAmount, 0)
        };
      },

      // Reset
      reset: () => set(initialState),
    }),
    {
      name: 'host-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        profile: state.profile,
        listings: state.listings,
        bookings: state.bookings,
        sessions: state.sessions,
        stats: state.stats,
        lastRefresh: state.lastRefresh,
      }),
    }
  )
);

// Selectors for easy access
export const useHostProfile = () => useHostStore((state) => state.profile);
export const useHostListings = () => useHostStore((state) => state.listings);
export const useHostBookings = () => useHostStore((state) => state.bookings);
export const useHostSessions = () => useHostStore((state) => state.sessions);
export const useHostStats = () => useHostStore((state) => state.stats);

// Loading states
export const useHostLoadingStates = () => useHostStore((state) => ({
  isLoadingProfile: state.isLoadingProfile,
  isLoadingListings: state.isLoadingListings,
  isLoadingBookings: state.isLoadingBookings,
  isLoadingSessions: state.isLoadingSessions,
  isLoadingStats: state.isLoadingStats,
  isRefreshing: state.isRefreshing,
}));

// Error states
export const useHostErrors = () => useHostStore((state) => ({
  profileError: state.profileError,
  listingsError: state.listingsError,
  bookingsError: state.bookingsError,
  sessionsError: state.sessionsError,
  statsError: state.statsError,
}));

export default useHostStore;
