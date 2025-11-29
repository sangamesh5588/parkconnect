import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Booking } from '@/types';

export interface MockBooking extends Booking {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  vehicleType: 'car' | 'bike';
  vehicleNumber: string;
  specialRequests?: string;
  spaceName: string;
  spaceAddress: string;
}

interface MockBookingsStore {
  bookings: MockBooking[];

  // Actions
  addBooking: (booking: Omit<MockBooking, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBooking: (id: string, updates: Partial<MockBooking>) => void;
  getBookingsByHost: (hostId: string) => MockBooking[];
  getBookingById: (id: string) => MockBooking | undefined;
  getBookingsByStatus: (hostId: string, status: Booking['status']) => MockBooking[];
  getUpcomingBookings: (hostId: string, hours?: number) => MockBooking[];
  getTodaysBookings: (hostId: string) => MockBooking[];
  getTotalStats: (hostId: string) => {
    totalBookings: number;
    pendingBookings: number;
    confirmedBookings: number;
    activeBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    totalRevenue: number;
  };
}

// Mock host ID for demo purposes
const mockHostId = 'host-demo-123';

// Helper to create a serializable version of bookings for storage
const serializeBookings = (bookings: MockBooking[]) => {
  return bookings.map(booking => ({
    ...booking,
    startTime: booking.startTime.toISOString(),
    endTime: booking.endTime.toISOString(),
    createdAt: booking.createdAt.toISOString(),
    updatedAt: booking.updatedAt.toISOString(),
  }));
};

// Helper to deserialize bookings from storage
const deserializeBookings = (bookings: any[]): MockBooking[] => {
  return bookings.map(booking => ({
    ...booking,
    startTime: new Date(booking.startTime),
    endTime: new Date(booking.endTime),
    createdAt: new Date(booking.createdAt),
    updatedAt: new Date(booking.updatedAt),
  }));
};

// Generate mock booking data
const generateMockBookings = (): MockBooking[] => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const mockBookings: MockBooking[] = [
    {
      id: 'booking-001',
      userId: 'user-001',
      spaceId: 'listing-demo-123',
      customerName: 'Rahul Sharma',
      customerPhone: '+91 9876543210',
      customerEmail: 'rahul.sharma@email.com',
      vehicleType: 'car',
      vehicleNumber: 'HR26 DK 1234',
      startTime: new Date(today.getTime() + 2 * 60 * 60 * 1000), // Today 2 hours from now
      endTime: new Date(today.getTime() + 4 * 60 * 60 * 1000), // 2 hours later
      totalPrice: 80,
      currency: 'INR',
      status: 'confirmed',
      paymentStatus: 'paid',
      spaceName: 'Prime Parking - Connaught Place',
      spaceAddress: 'Connaught Place, New Delhi',
      createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 day ago
      updatedAt: new Date(),
    },
    {
      id: 'booking-002',
      userId: 'user-002',
      spaceId: 'listing-demo-123',
      customerName: 'Priya Patel',
      customerPhone: '+91 8765432109',
      customerEmail: 'priya.patel@email.com',
      vehicleType: 'bike',
      vehicleNumber: 'DL 12 AB 5678',
      startTime: new Date(today.getTime() + 6 * 60 * 60 * 1000), // Today 6 hours from now
      endTime: new Date(today.getTime() + 8 * 60 * 60 * 1000), // 2 hours later
      totalPrice: 30,
      currency: 'INR',
      status: 'pending',
      paymentStatus: 'pending',
      spaceName: 'Prime Parking - Connaught Place',
      spaceAddress: 'Connaught Place, New Delhi',
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
      updatedAt: new Date(),
    },
    {
      id: 'booking-003',
      userId: 'user-003',
      spaceId: 'listing-demo-123',
      customerName: 'Amit Kumar',
      customerPhone: '+91 7654321098',
      customerEmail: 'amit.kumar@email.com',
      vehicleType: 'car',
      vehicleNumber: 'UP 32 XY 9012',
      startTime: new Date(today.getTime() - 3 * 60 * 60 * 1000), // 3 hours ago (past)
      endTime: new Date(today.getTime() + 1 * 60 * 60 * 1000), // 1 hour from now
      totalPrice: 120,
      currency: 'INR',
      status: 'active',
      paymentStatus: 'paid',
      spaceName: 'Prime Parking - Connaught Place',
      spaceAddress: 'Connaught Place, New Delhi',
      specialRequests: 'Please park near entrance',
      createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000), // 6 hours ago
      updatedAt: new Date(),
    },
    {
      id: 'booking-004',
      userId: 'user-004',
      spaceId: 'listing-demo-123',
      customerName: 'Sneha Gupta',
      customerPhone: '+91 6543210987',
      customerEmail: 'sneha.gupta@email.com',
      vehicleType: 'car',
      vehicleNumber: 'MH 12 PQ 3456',
      startTime: new Date(today.getTime() - 8 * 60 * 60 * 1000), // Yesterday
      endTime: new Date(today.getTime() - 6 * 60 * 60 * 1000), // Yesterday
      totalPrice: 60,
      currency: 'INR',
      status: 'completed',
      paymentStatus: 'paid',
      spaceName: 'Prime Parking - Connaught Place',
      spaceAddress: 'Connaught Place, New Delhi',
      createdAt: new Date(now.getTime() - 48 * 60 * 60 * 1000), // 2 days ago
      updatedAt: new Date(now.getTime() - 6 * 60 * 60 * 1000),
    },
    {
      id: 'booking-005',
      userId: 'user-005',
      spaceId: 'listing-demo-123',
      customerName: 'Vikram Singh',
      customerPhone: '+91 5432109876',
      customerEmail: 'vikram.singh@email.com',
      vehicleType: 'bike',
      vehicleNumber: 'RJ 14 RS 7890',
      startTime: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Tomorrow
      endTime: new Date(today.getTime() + 26 * 60 * 60 * 1000), // Tomorrow
      totalPrice: 40,
      currency: 'INR',
      status: 'confirmed',
      paymentStatus: 'paid',
      spaceName: 'Prime Parking - Connaught Place',
      spaceAddress: 'Connaught Place, New Delhi',
      createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000), // 12 hours ago
      updatedAt: new Date(),
    },
  ];

  return mockBookings;
};

export const useMockBookings = create<MockBookingsStore>()(
  persist(
    (set, get) => ({
      bookings: generateMockBookings(),

      addBooking: (booking) => {
        const newBooking: MockBooking = {
          ...booking,
          id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({
          bookings: [...state.bookings, newBooking]
        }));
      },

      updateBooking: (id, updates) => {
        set((state) => ({
          bookings: state.bookings.map(booking =>
            booking.id === id
              ? { ...booking, ...updates, updatedAt: new Date() }
              : booking
          )
        }));
      },

      getBookingsByHost: (hostId) => {
        // For demo purposes, return all bookings (in real app, filter by host's spaces)
        return get().bookings;
      },

      getBookingById: (id) => {
        return get().bookings.find(booking => booking.id === id);
      },

      getBookingsByStatus: (hostId, status) => {
        return get().getBookingsByHost(hostId).filter(booking => booking.status === status);
      },

      getUpcomingBookings: (hostId, hours = 24) => {
        const now = new Date();
        const futureTime = new Date(now.getTime() + hours * 60 * 60 * 1000);

        return get().getBookingsByHost(hostId).filter(booking =>
          booking.startTime > now && booking.startTime <= futureTime
        );
      },

      getTodaysBookings: (hostId) => {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

        return get().getBookingsByHost(hostId).filter(booking =>
          booking.startTime >= startOfDay && booking.startTime <= endOfDay
        );
      },

      getTotalStats: (hostId) => {
        const hostBookings = get().getBookingsByHost(hostId);

        const stats = hostBookings.reduce(
          (acc, booking) => {
            acc.totalBookings += 1;
            acc.totalRevenue += booking.totalPrice;

            switch (booking.status) {
              case 'pending':
                acc.pendingBookings += 1;
                break;
              case 'confirmed':
                acc.confirmedBookings += 1;
                break;
              case 'active':
                acc.activeBookings += 1;
                break;
              case 'completed':
                acc.completedBookings += 1;
                break;
              case 'cancelled':
                acc.cancelledBookings += 1;
                break;
            }

            return acc;
          },
          {
            totalBookings: 0,
            pendingBookings: 0,
            confirmedBookings: 0,
            activeBookings: 0,
            completedBookings: 0,
            cancelledBookings: 0,
            totalRevenue: 0,
          }
        );

        return stats;
      },
    }),
    {
      name: 'mock-bookings-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        bookings: serializeBookings(state.bookings)
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.bookings = deserializeBookings(state.bookings);
        }
      }
    }
  )
);

export { mockHostId };
