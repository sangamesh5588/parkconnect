import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface ParkingSession {
  id: string;
  bookingId: string;
  customerName: string;
  customerPhone: string;
  vehicleNumber: string;
  vehicleType: 'car' | 'bike';
  spaceName: string;
  spaceAddress: string;

  // Booking details
  bookedStartTime: Date;
  bookedEndTime: Date;
  bookedDuration: number; // in hours

  // Actual session
  actualStartTime: Date | null;
  actualEndTime: Date | null;
  status: 'pending_entry' | 'active' | 'completed' | 'overtime';

  // Payment details
  bookingAmount: number; // Base booking amount
  extraCharge: number; // Overtime charges
  totalCharged: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';

  // Billing info
  hourlyRate: number;
  overtimeMinutes: number;
  gateStatus: 'closed' | 'opening' | 'open';
}

interface ParkingSessionsStore {
  sessions: ParkingSession[];

  // Actions
  startSession: (bookingId: string, bookingData: Partial<ParkingSession>) => string;
  completeSession: (sessionId: string) => {
    totalTime: number;
    extraMinutes: number;
    extraCharge: number;
    totalCharge: number;
  };
  updateSession: (id: string, updates: Partial<ParkingSession>) => void;
  getActiveSessions: () => ParkingSession[];
  getSessionById: (id: string) => ParkingSession | undefined;
  getSessionByBooking: (bookingId: string) => ParkingSession | undefined;
  openGate: (sessionId: string, type: 'entry' | 'exit') => void;
  getSessionsByHost: (hostId?: string) => ParkingSession[];

  // Analytics
  getTodaysStats: () => {
    activeSessions: number;
    completedToday: number;
    totalRevenue: number;
  };
}

// Generate mock sessions
const generateMockSessions = (): ParkingSession[] => {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

  const mockSessions: ParkingSession[] = [
    // Active session
    {
      id: 'session-001',
      bookingId: 'booking-003',
      customerName: 'Amit Kumar',
      customerPhone: '+91 7654321098',
      vehicleNumber: 'UP 32 XY 9012',
      vehicleType: 'car',
      spaceName: 'Prime Parking - Connaught Place',
      spaceAddress: 'Connaught Place, New Delhi',
      bookedStartTime: new Date(twoHoursAgo.getTime() - 3 * 60 * 60 * 1000),
      bookedEndTime: new Date(now.getTime() + 1 * 60 * 60 * 1000),
      bookedDuration: 3,
      actualStartTime: twoHoursAgo,
      actualEndTime: null,
      status: 'active',
      bookingAmount: 120,
      extraCharge: 0,
      totalCharged: 0,
      paymentStatus: 'paid',
      hourlyRate: 40,
      overtimeMinutes: 0,
      gateStatus: 'closed',
    },
  ];

  return mockSessions;
};

// Helper functions for overtime calculations
export const calculateOvertimeCharge = (overtimeMinutes: number, hourlyRate: number): number => {
  if (overtimeMinutes <= 0) return 0;

  const minutes = Math.ceil(overtimeMinutes);

  if (minutes <= 30) {
    // 1-30 minutes = half hourly rate
    return hourlyRate / 2;
  } else {
    // More than 30 minutes = full additional hour
    const fullHours = Math.ceil(minutes / 60);
    return fullHours * hourlyRate;
  }
};

export const calculateTotalTime = (startTime: Date, endTime: Date): number => {
  return Math.floor((endTime.getTime() - startTime.getTime()) / (1000 * 60)); // minutes
};

export const calculateEndTime = (startTime: Date, bookedHours: number): Date => {
  return new Date(startTime.getTime() + bookedHours * 60 * 60 * 1000);
};

// Serialize/deserialize helpers
const serializeSessions = (sessions: ParkingSession[]) => {
  return sessions.map(session => ({
    ...session,
    bookedStartTime: session.bookedStartTime.toISOString(),
    bookedEndTime: session.bookedEndTime.toISOString(),
    actualStartTime: session.actualStartTime?.toISOString() || null,
    actualEndTime: session.actualEndTime?.toISOString() || null,
  }));
};

const deserializeSessions = (sessions: any[]): ParkingSession[] => {
  return sessions.map(session => ({
    ...session,
    bookedStartTime: new Date(session.bookedStartTime),
    bookedEndTime: new Date(session.bookedEndTime),
    actualStartTime: session.actualStartTime ? new Date(session.actualStartTime) : null,
    actualEndTime: session.actualEndTime ? new Date(session.actualEndTime) : null,
  }));
};

export const useParkingSessions = create<ParkingSessionsStore>()(
  persist(
    (set, get) => ({
      sessions: generateMockSessions(),

      startSession: (bookingId, bookingData) => {
        const newSession: ParkingSession = {
          id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          bookingId,
          customerName: bookingData.customerName || '',
          customerPhone: bookingData.customerPhone || '',
          vehicleNumber: bookingData.vehicleNumber || '',
          vehicleType: bookingData.vehicleType || 'car',
          spaceName: bookingData.spaceName || '',
          spaceAddress: bookingData.spaceAddress || '',
          bookedStartTime: bookingData.bookedStartTime || new Date(),
          bookedEndTime: bookingData.bookedEndTime || new Date(),
          bookedDuration: bookingData.bookedDuration || 1,
          actualStartTime: new Date(),
          actualEndTime: null,
          status: 'active',
          bookingAmount: bookingData.bookingAmount || 0,
          extraCharge: 0,
          totalCharged: 0,
          paymentStatus: bookingData.paymentStatus || 'paid',
          hourlyRate: bookingData.hourlyRate || 40,
          overtimeMinutes: 0,
          gateStatus: 'closed',
        };

        set((state) => ({
          sessions: [...state.sessions, newSession]
        }));

        return newSession.id;
      },

      completeSession: (sessionId) => {
        const session = get().getSessionById(sessionId);
        if (!session || !session.actualStartTime) {
          throw new Error('Session not found or not started');
        }

        const actualEndTime = new Date();
        const totalMinutes = calculateTotalTime(session.actualStartTime, actualEndTime);
        const bookedMinutes = session.bookedDuration * 60;

        const overtimeMinutes = Math.max(0, totalMinutes - bookedMinutes);
        const extraCharge = calculateOvertimeCharge(overtimeMinutes, session.hourlyRate);
        const totalCharge = session.bookingAmount + extraCharge;

        // Update session
        const updatedSession: ParkingSession = {
          ...session,
          actualEndTime,
          overtimeMinutes,
          extraCharge,
          totalCharged: totalCharge,
          status: 'completed',
        };

        set((state) => ({
          sessions: state.sessions.map(s => s.id === sessionId ? updatedSession : s)
        }));

        return {
          totalTime: totalMinutes,
          extraMinutes: overtimeMinutes,
          extraCharge,
          totalCharge,
        };
      },

      updateSession: (id, updates) => {
        set((state) => ({
          sessions: state.sessions.map(session =>
            session.id === id ? { ...session, ...updates } : session
          )
        }));
      },

      getActiveSessions: () => {
        return get().sessions.filter(session => session.status === 'active');
      },

      getSessionById: (id) => {
        return get().sessions.find(session => session.id === id);
      },

      getSessionByBooking: (bookingId) => {
        return get().sessions.find(session => session.bookingId === bookingId);
      },

      openGate: (sessionId, type) => {
        // Simulate gate opening
        set((state) => ({
          sessions: state.sessions.map(session =>
            session.id === sessionId
              ? { ...session, gateStatus: 'opening' }
              : session
          )
        }));

        // Simulate gate opening delay
        setTimeout(() => {
          set((state) => ({
            sessions: state.sessions.map(session =>
              session.id === sessionId
                ? { ...session, gateStatus: 'open' }
                : session
            )
          }));
        }, 2000);
      },

      getSessionsByHost: (hostId) => {
        // For demo purposes, return all sessions
        return get().sessions;
      },

      getTodaysStats: () => {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

        const todaysSessions = get().sessions.filter(session => {
          const sessionStart = session.actualStartTime || session.bookedStartTime;
          return sessionStart >= startOfDay && sessionStart <= endOfDay;
        });

        return {
          activeSessions: todaysSessions.filter(s => s.status === 'active').length,
          completedToday: todaysSessions.filter(s => s.status === 'completed').length,
          totalRevenue: todaysSessions.reduce((sum, s) => sum + s.totalCharged, 0),
        };
      },
    }),
    {
      name: 'parking-sessions-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        sessions: serializeSessions(state.sessions)
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.sessions = deserializeSessions(state.sessions);
        }
      }
    }
  )
);
