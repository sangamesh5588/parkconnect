import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Search,
  Filter,
  Calendar,
  Clock,
  Phone,
  Mail,
  Car,
  Bike,
  MapPin,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  PlayCircle,
  Eye,
  MoreVertical,
  Camera,
  Zap,
  CreditCard,
  Settings,
  X,
  ArrowUpDown
} from "lucide-react";
import { Link } from "react-router-dom";
import { useMockBookings, mockHostId } from "@/hooks/use-mock-bookings";
import { useParkingSessions, calculateOvertimeCharge, calculateTotalTime } from "@/hooks/use-parking-sessions";
import { MockBooking } from "@/hooks/use-mock-bookings";
import { QRScanner } from "@/components/QRCode";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

type SortOption = 'newest' | 'oldest' | 'startTime' | 'amount';
type StatusFilter = 'all' | 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';

type ViewMode = 'list' | 'calendar';

export default function HostBookingsPage() {
  const { getBookingsByHost, getTotalStats, getTodaysBookings, updateBooking } = useMockBookings();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedBooking, setSelectedBooking] = useState<MockBooking | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Scanning states
  const [entryScanningBooking, setEntryScanningBooking] = useState<MockBooking | null>(null);
  const [exitScanningBooking, setExitScanningBooking] = useState<MockBooking | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string>("");
  const [entryConfirmed, setEntryConfirmed] = useState(false);
  const [exitConfirmed, setExitConfirmed] = useState(false);
  const [billingDetails, setBillingDetails] = useState<any>(null);

  const allBookings = getBookingsByHost(mockHostId);
  const todaysBookings = getTodaysBookings(mockHostId);
  const stats = getTotalStats(mockHostId);

  // Filter and sort bookings
  const filteredBookings = useMemo(() => {
    let filtered = allBookings;

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(booking =>
        booking.customerName.toLowerCase().includes(query) ||
        booking.vehicleNumber.toLowerCase().includes(query) ||
        booking.id.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'oldest':
          return a.createdAt.getTime() - b.createdAt.getTime();
        case 'startTime':
          return a.startTime.getTime() - b.startTime.getTime();
        case 'amount':
          return b.totalPrice - a.totalPrice;
        default:
          return 0;
      }
    });

    return filtered;
  }, [allBookings, statusFilter, searchQuery, sortBy]);

  // Get bookings for selected date (calendar view)
  const selectedDateBookings = useMemo(() => {
    if (!selectedDate) return [];
    return allBookings.filter(booking => {
      const bookingDate = new Date(booking.startTime);
      return bookingDate.toDateString() === selectedDate.toDateString();
    });
  }, [allBookings, selectedDate]);

  // Get dates that have bookings for calendar indicators
  const bookingDates = useMemo(() => {
    return allBookings.map(booking => new Date(booking.startTime));
  }, [allBookings]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-500 text-white border-yellow-500', icon: AlertCircle },
      confirmed: { color: 'bg-blue-500 text-white border-blue-500', icon: CheckCircle },
      active: { color: 'bg-green-500 text-white border-green-500', icon: PlayCircle },
      completed: { color: 'bg-emerald-500 text-white border-emerald-500', icon: CheckCircle },
      cancelled: { color: 'bg-red-500 text-white border-red-500', icon: XCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <Badge className={`${config.color} border text-xs font-bold px-3 py-1 rounded-full shadow-sm`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDateTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (date.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 0) {
      return `Started ${Math.abs(Math.round(diffInHours))}h ago`;
    } else if (diffInHours < 1) {
      return `Starts in ${Math.round(diffInHours * 60)}min`;
    } else if (diffInHours < 24) {
      return `Starts in ${Math.round(diffInHours)}h`;
    } else {
      return date.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const formatDuration = (start: Date, end: Date) => {
    const diffInHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return `${diffInHours}h`;
  };

  // Countdown Timer Component
  const CountdownTimer = ({ targetDate, status }: { targetDate: Date; status: string }) => {
    const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
      const calculateTimeLeft = () => {
        const now = new Date().getTime();
        const target = targetDate.getTime();
        const difference = target - now;

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);

          setTimeLeft({ days, hours, minutes, seconds });
          setIsExpired(false);
        } else {
          setTimeLeft(null);
          setIsExpired(true);
        }
      };

      calculateTimeLeft();
      const timer = setInterval(calculateTimeLeft, 1000);

      return () => clearInterval(timer);
    }, [targetDate]);

    if (isExpired || !timeLeft) {
      if (status === 'confirmed') {
        return (
          <div className="text-center p-2 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-xs font-semibold text-red-700 uppercase tracking-wide">Booking Started</div>
            <div className="text-lg font-bold text-red-900">Ready for Entry</div>
          </div>
        );
      } else if (status === 'active') {
        return (
          <div className="text-center p-2 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="text-xs font-semibold text-orange-700 uppercase tracking-wide">Session Active</div>
            <div className="text-lg font-bold text-orange-900">In Progress</div>
          </div>
        );
      }
      return null;
    }

    const isUrgent = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes <= 30;

    return (
      <div className={`text-center p-2 rounded-lg border ${
        isUrgent
          ? 'bg-red-50 border-red-200'
          : timeLeft.days === 0 && timeLeft.hours === 0
          ? 'bg-orange-50 border-orange-200'
          : 'bg-green-50 border-green-200'
      }`}>
        <div className={`text-xs font-semibold uppercase tracking-wide ${
          isUrgent ? 'text-red-700' : timeLeft.days === 0 && timeLeft.hours === 0 ? 'text-orange-700' : 'text-green-700'
        }`}>
          {status === 'confirmed' ? 'Starts In' : status === 'active' ? 'Ends In' : 'Time Left'}
        </div>

        {timeLeft.days > 0 ? (
          <div className={`text-lg font-bold ${
            isUrgent ? 'text-red-900' : timeLeft.days === 0 && timeLeft.hours === 0 ? 'text-orange-900' : 'text-green-900'
          }`}>
            {timeLeft.days}d {timeLeft.hours}h
          </div>
        ) : (
          <div className={`text-lg font-bold font-mono ${
            isUrgent ? 'text-red-900' : 'text-orange-900'
          }`}>
            {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
          </div>
        )}
      </div>
    );
  };

  // Scanning functions
  const mockEntryScan = async (booking: MockBooking) => {
    setIsScanning(true);
    setScanError("");

    // Simulate scanning delay
    setTimeout(() => {
      // Mock successful scan for the selected booking
      setEntryConfirmed(true);
      setIsScanning(false);

      // Update booking status to active
      updateBooking(booking.id, { status: 'active' });

      // Start parking session
      const { startSession, openGate } = useParkingSessions.getState();
      const sessionId = startSession(booking.id, {
        customerName: booking.customerName,
        customerPhone: booking.customerPhone,
        vehicleNumber: booking.vehicleNumber,
        vehicleType: booking.vehicleType,
        spaceName: booking.spaceName,
        spaceAddress: booking.spaceAddress,
        bookedStartTime: booking.startTime,
        bookedEndTime: booking.endTime,
        bookedDuration: Math.ceil((booking.endTime.getTime() - booking.startTime.getTime()) / (1000 * 60 * 60)),
        bookingAmount: booking.totalPrice,
        hourlyRate: 40, // Default hourly rate - in real app, this would come from the space pricing
        paymentStatus: booking.paymentStatus,
      });

      // Open gate
      openGate(sessionId, 'entry');

      // Auto close modal after 2 seconds
      setTimeout(() => {
        setEntryScanningBooking(null);
        setEntryConfirmed(false);
      }, 2000);
    }, 1500);
  };

  const mockExitScan = async (booking: MockBooking) => {
    setIsScanning(true);
    setScanError("");

    // Simulate scanning delay
    setTimeout(() => {
      // Get the parking session
      const { getSessionByBooking, completeSession, openGate } = useParkingSessions.getState();
      const session = getSessionByBooking(booking.id);

      if (session && session.status === 'active') {
        // Calculate billing
        const now = new Date();
        const totalMinutes = calculateTotalTime(session.actualStartTime, now);
        const bookedMinutes = session.bookedDuration * 60;
        const overtimeMinutes = Math.max(0, totalMinutes - bookedMinutes);
        const extraCharge = calculateOvertimeCharge(overtimeMinutes, session.hourlyRate);
        const totalCharge = session.bookingAmount + extraCharge;

        setBillingDetails({
          totalMinutes,
          overtimeMinutes,
          extraCharge,
          totalCharge,
          bookingAmount: session.bookingAmount,
          isOvertime: overtimeMinutes > 0
        });

        setExitConfirmed(true);
        setIsScanning(false);

        // Update booking status to completed
        updateBooking(exitScanningBooking.id, { status: 'completed' });

        // Complete the session
        completeSession(session.id);
        openGate(session.id, 'exit');

        // Auto close modal after 2 seconds
        setTimeout(() => {
          setExitScanningBooking(null);
          setExitConfirmed(false);
          setBillingDetails(null);
        }, 2000);
      } else {
        setScanError("No active parking session found.");
        setIsScanning(false);
      }
    }, 1500);
  };

  const resetScanning = () => {
    setEntryScanningBooking(null);
    setExitScanningBooking(null);
    setIsScanning(false);
    setScanError("");
    setEntryConfirmed(false);
    setExitConfirmed(false);
    setBillingDetails(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Mobile First */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="container-mobile">
          {/* Mobile: Stacked Layout */}
          <div className="py-4 space-y-3 md:space-y-0 md:flex md:items-center md:justify-between">
            {/* Back Button - Always visible on mobile */}
            <div className="flex items-center justify-between md:justify-start">
              <Link
                to="/host/dashboard"
                className="inline-flex items-center text-gray-700 hover:text-gray-900 transition-colors duration-200 min-h-[44px] px-3 rounded-lg hover:bg-gray-100 touch-manipulation"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
              </Link>

              {/* Mobile: Settings button in header */}
              <Button variant="ghost" size="sm" className="md:hidden p-2">
                <Settings className="w-5 h-5" />
              </Button>
            </div>

            {/* Title Section - Centered */}
            <div className="text-center flex-1">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">Bookings</h1>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-3">
              <Button
                variant={viewMode === 'calendar' ? 'default' : 'outline'}
                size="sm"
                className="h-10"
                onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}
              >
                <Calendar className="w-4 h-4 mr-2" />
                {viewMode === 'calendar' ? 'List View' : 'Calendar View'}
              </Button>
              <Button variant="outline" size="sm" className="h-10 p-2">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-mobile py-6">
        {/* Enhanced Stats Overview - Glassmorphism Design */}
        <div className="grid grid-cols-2 gap-4 mb-8 md:gap-6 md:grid-cols-4">
          <Card className="group relative overflow-hidden p-5 md:p-7 text-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 hover:border-gray-600/70 transition-all duration-500 hover:shadow-2xl hover:shadow-gray-900/20 hover:-translate-y-1 touch-manipulation backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="text-3xl md:text-4xl font-black text-white mb-2 drop-shadow-lg">{stats.totalBookings}</div>
              <div className="text-xs md:text-sm font-semibold text-gray-300 uppercase tracking-widest leading-tight">Total Bookings</div>
            </div>
          </Card>

          <Card className="group relative overflow-hidden p-5 md:p-7 text-center bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 border border-orange-400/50 hover:border-orange-300/70 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/20 hover:-translate-y-1 touch-manipulation backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="text-3xl md:text-4xl font-black text-white mb-2 drop-shadow-lg">{stats.pendingBookings}</div>
              <div className="text-xs md:text-sm font-semibold text-orange-100 uppercase tracking-widest leading-tight">Pending</div>
            </div>
          </Card>

          <Card className="group relative overflow-hidden p-5 md:p-7 text-center bg-gradient-to-br from-green-500 via-green-600 to-green-700 border border-green-400/50 hover:border-green-300/70 transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/20 hover:-translate-y-1 touch-manipulation backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="text-3xl md:text-4xl font-black text-white mb-2 drop-shadow-lg">{stats.activeBookings}</div>
              <div className="text-xs md:text-sm font-semibold text-green-100 uppercase tracking-widest leading-tight">Active Today</div>
            </div>
          </Card>

          <Card className="group relative overflow-hidden p-5 md:p-7 text-center bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 border border-blue-400/50 hover:border-blue-300/70 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1 touch-manipulation backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="text-3xl md:text-4xl font-black text-white mb-2 drop-shadow-lg">₹{stats.totalRevenue}</div>
              <div className="text-xs md:text-sm font-semibold text-blue-100 uppercase tracking-widest leading-tight">Revenue</div>
            </div>
          </Card>
        </div>



        {/* Enhanced Filters and Search */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-white to-gray-50/50 border-2 border-gray-100 hover:border-black/20 transition-all duration-300 shadow-sm hover:shadow-md">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Enhanced Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search by customer name, vehicle number, or booking ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-3 text-sm border-2 border-gray-200 focus:border-black focus:ring-0 rounded-xl bg-white shadow-sm hover:border-gray-300 transition-colors duration-200"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Enhanced Filters */}
            <div className="flex flex-col sm:flex-row gap-4 lg:w-96">
              {/* Status Filter */}
              <div className="flex-1">
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
                  <SelectTrigger className="w-full h-11 border-2 border-gray-200 hover:border-gray-300 focus:border-black focus:ring-0 rounded-xl bg-white shadow-sm transition-colors duration-200">
                    <Filter className="w-4 h-4 mr-2 text-gray-600" />
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-2 border-gray-200">
                    <SelectItem value="all" className="rounded-lg">All Status</SelectItem>
                    <SelectItem value="pending" className="rounded-lg">Pending</SelectItem>
                    <SelectItem value="confirmed" className="rounded-lg">Confirmed</SelectItem>
                    <SelectItem value="active" className="rounded-lg">Active</SelectItem>
                    <SelectItem value="completed" className="rounded-lg">Completed</SelectItem>
                    <SelectItem value="cancelled" className="rounded-lg">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Options */}
              <div className="flex-1">
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                  <SelectTrigger className="w-full h-11 border-2 border-gray-200 hover:border-gray-300 focus:border-black focus:ring-0 rounded-xl bg-white shadow-sm transition-colors duration-200">
                    <SelectValue placeholder="Newest First" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-2 border-gray-200">
                    <SelectItem value="newest" className="rounded-lg">Newest First</SelectItem>
                    <SelectItem value="oldest" className="rounded-lg">Oldest First</SelectItem>
                    <SelectItem value="startTime" className="rounded-lg">Start Time</SelectItem>
                    <SelectItem value="amount" className="rounded-lg">Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          {(searchQuery || statusFilter !== 'all' || sortBy !== 'newest') && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">
                    Showing {filteredBookings.length} of {allBookings.length} bookings
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setSortBy("newest");
                  }}
                  className="text-black hover:text-gray-700 hover:bg-gray-100 rounded-lg px-3 py-1 font-medium"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Bookings Display - List or Calendar View */}
        {viewMode === 'calendar' ? (
          /* Simple Calendar View */
          <div className="space-y-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Calendar View</h2>
                <p className="text-sm text-gray-600">Select a date to view bookings</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setViewMode('list')}
                className="border-gray-300 hover:bg-gray-50"
              >
                <ArrowUpDown className="w-4 h-4 mr-2" />
                List View
              </Button>
            </div>

            {/* Calendar */}
            <Card className="p-6">
              <div className="flex justify-center">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-lg border border-gray-200"
                  modifiers={{
                    hasBooking: bookingDates.map(date => new Date(date.getFullYear(), date.getMonth(), date.getDate())),
                    today: [new Date()]
                  }}
                  modifiersStyles={{
                    hasBooking: {
                      backgroundColor: '#000000',
                      color: 'white',
                      fontWeight: 'bold',
                      borderRadius: '50%'
                    },
                    today: {
                      backgroundColor: '#3B82F6',
                      color: 'white',
                      fontWeight: 'bold',
                      borderRadius: '50%'
                    }
                  }}
                  classNames={{
                    day_selected: "bg-black hover:bg-gray-800 text-white font-bold",
                  }}
                />
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-black rounded-full"></div>
                  <span className="text-gray-700">Has Bookings</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Today</span>
                </div>
              </div>
            </Card>

            {/* Selected Date Bookings */}
            {selectedDate && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedDate.toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </h3>
                  <span className="text-sm text-gray-600 font-medium">
                    {selectedDateBookings.length} booking{selectedDateBookings.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {selectedDateBookings.length > 0 ? (
                  <div className="space-y-4">
                    {selectedDateBookings.map((booking) => (
                      <Card key={booking.id} className="group p-6 hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white hover:border-gray-300">
                        {/* Header Section - Customer Info & Status */}
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-bold text-lg">
                                {booking.customerName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-bold text-gray-900 text-xl truncate">{booking.customerName}</h3>
                              <p className="text-sm text-gray-600 font-medium">Booking #{booking.id.slice(-6)}</p>
                            </div>
                          </div>
                          <div className="flex-shrink-0 ml-4">
                            {getStatusBadge(booking.status)}
                          </div>
                        </div>

                        {/* Details Section - Horizontal Layout */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                          {/* Vehicle */}
                          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            {booking.vehicleType === 'car' ? (
                              <Car className="w-5 h-5 text-gray-600 flex-shrink-0" />
                            ) : (
                              <Bike className="w-5 h-5 text-gray-600 flex-shrink-0" />
                            )}
                            <div className="min-w-0">
                              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Vehicle</p>
                              <p className="text-sm font-semibold text-gray-900 truncate">{booking.vehicleNumber}</p>
                            </div>
                          </div>

                          {/* Time */}
                          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <Clock className="w-5 h-5 text-gray-600 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Time</p>
                              <p className="text-sm font-semibold text-gray-900 truncate">{formatDateTime(booking.startTime)}</p>
                            </div>
                          </div>

                          {/* Location */}
                          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <MapPin className="w-5 h-5 text-gray-600 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Location</p>
                              <p className="text-sm font-semibold text-gray-900 truncate">{booking.spaceAddress}</p>
                            </div>
                          </div>

                          {/* Amount */}
                          <div className="flex items-center space-x-3 p-3 bg-black rounded-lg border border-black">
                            <DollarSign className="w-5 h-5 text-white flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs text-gray-200 font-medium uppercase tracking-wide">Amount</p>
                              <p className="text-lg font-bold text-white">₹{booking.totalPrice}</p>
                            </div>
                          </div>
                        </div>

                        {/* Duration & Payment Status */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 mb-4">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">
                              Duration: {formatDuration(booking.startTime, booking.endTime)}
                            </span>
                          </div>
                          <div className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm font-medium ${
                            booking.paymentStatus === 'paid'
                              ? 'bg-green-100 text-green-800 border border-green-200'
                              : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                          }`}>
                            {booking.paymentStatus === 'paid' ? (
                              <>
                                <CheckCircle className="w-4 h-4" />
                                <span>Paid</span>
                              </>
                            ) : (
                              <>
                                <Clock className="w-4 h-4" />
                                <span>Pending</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Live Countdown Timer */}
                        <div className="mb-6">
                          <CountdownTimer
                            targetDate={booking.status === 'confirmed' ? booking.startTime : booking.endTime}
                            status={booking.status}
                          />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                          {/* Primary Action Buttons */}
                          <div className="flex gap-3 flex-1">
                            {booking.status === 'confirmed' && (
                              <Button
                                onClick={() => setEntryScanningBooking(booking)}
                                className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200"
                              >
                                <Zap className="w-4 h-4 mr-2" />
                                Entry Scan
                              </Button>
                            )}

                            {booking.status === 'active' && (
                              <Button
                                onClick={() => setExitScanningBooking(booking)}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200"
                              >
                                <CreditCard className="w-4 h-4 mr-2" />
                                Exit Scan
                              </Button>
                            )}
                          </div>

                          {/* Secondary Actions */}
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedBooking(booking)}
                              className="px-4 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors duration-200"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-8 text-center">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings on this date</h3>
                    <p className="text-gray-600">
                      There are no parking reservations scheduled for {selectedDate.toLocaleDateString('en-IN', { month: 'long', day: 'numeric' })}.
                    </p>
                  </Card>
                )}
              </div>
            )}

            {/* Show message when no date selected */}
            {!selectedDate && (
              <Card className="p-8 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a date</h3>
                <p className="text-gray-600">
                  Tap on any date in the calendar above to view bookings for that day.
                </p>
              </Card>
            )}
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {filteredBookings.length === 0 ? (
              <Card className="p-8 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings found</h3>
                <p className="text-gray-600">
                  {searchQuery || statusFilter !== 'all'
                    ? "Try adjusting your filters or search query."
                    : "Your bookings will appear here once customers start reserving your parking spaces."
                  }
                </p>
              </Card>
            ) : (
              filteredBookings.map((booking, index) => (
                <Card key={booking.id} className="group relative overflow-hidden p-6 hover:shadow-2xl hover:shadow-gray-900/10 transition-all duration-500 border border-gray-200/80 bg-gradient-to-br from-white to-gray-50/30 hover:border-gray-300/60 hover:-translate-y-1 animate-in fade-in-50 slide-in-from-bottom-4" style={{ animationDelay: `${index * 100}ms` }}>
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gray-900/20 to-transparent rounded-full transform translate-x-16 -translate-y-16"></div>
                  </div>

                  {/* Header Section - Customer Info & Status */}
                  <div className="relative z-10 flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ring-2 ring-gray-900/10 group-hover:ring-gray-900/20 transition-all duration-300 group-hover:scale-105">
                        <span className="text-white font-black text-lg drop-shadow-sm">
                          {booking.customerName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-black text-gray-900 text-xl truncate group-hover:text-gray-800 transition-colors duration-200">{booking.customerName}</h3>
                        <p className="text-sm text-gray-600 font-semibold tracking-wide">Booking #{booking.id.slice(-6)}</p>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-4 transform group-hover:scale-105 transition-transform duration-300">
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>

                  {/* Details Section - Horizontal Layout */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {/* Vehicle */}
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      {booking.vehicleType === 'car' ? (
                        <Car className="w-5 h-5 text-gray-600 flex-shrink-0" />
                      ) : (
                        <Bike className="w-5 h-5 text-gray-600 flex-shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Vehicle</p>
                        <p className="text-sm font-semibold text-gray-900 truncate">{booking.vehicleNumber}</p>
                      </div>
                    </div>

                    {/* Time */}
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <Clock className="w-5 h-5 text-gray-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Time</p>
                        <p className="text-sm font-semibold text-gray-900 truncate">{formatDateTime(booking.startTime)}</p>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <MapPin className="w-5 h-5 text-gray-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Location</p>
                        <p className="text-sm font-semibold text-gray-900 truncate">{booking.spaceAddress}</p>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="flex items-center space-x-3 p-3 bg-black rounded-lg border border-black">
                      <DollarSign className="w-5 h-5 text-white flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-200 font-medium uppercase tracking-wide">Amount</p>
                        <p className="text-lg font-bold text-white">₹{booking.totalPrice}</p>
                      </div>
                    </div>
                  </div>

                  {/* Duration & Payment Status */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 mb-6">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Duration: {formatDuration(booking.startTime, booking.endTime)}
                      </span>
                    </div>
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm font-medium ${
                      booking.paymentStatus === 'paid'
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                    }`}>
                      {booking.paymentStatus === 'paid' ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>Paid</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-4 h-4" />
                          <span>Pending</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Primary Action Buttons */}
                    <div className="flex gap-3 flex-1">
                      {booking.status === 'confirmed' && (
                        <Button
                          onClick={() => setEntryScanningBooking(booking)}
                          className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200"
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          Entry Scan
                        </Button>
                      )}

                      {booking.status === 'active' && (
                        <Button
                          onClick={() => setExitScanningBooking(booking)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200"
                        >
                          <CreditCard className="w-4 h-4 mr-2" />
                          Exit Scan
                        </Button>
                      )}
                    </div>

                    {/* Secondary Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedBooking(booking)}
                        className="px-4 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors duration-200"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Booking Details Modal/Sheet would go here */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md max-h-[80vh] overflow-y-auto shadow-2xl border-2 border-black/10">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-black">Booking Details</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedBooking(null)}
                    className="text-gray-500 hover:text-black hover:bg-gray-100 rounded-full w-8 h-8 p-0"
                  >
                    ✕
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Customer Avatar and Info */}
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-black to-gray-800 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {selectedBooking.customerName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">{selectedBooking.customerName}</h4>
                      <p className="text-sm text-gray-600 font-medium">Booking #{selectedBooking.id.slice(-6)}</p>
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex items-center space-x-3 mb-2">
                        <Phone className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-semibold text-blue-700 uppercase tracking-wide">Phone</span>
                      </div>
                      <p className="text-blue-900 font-bold text-lg">{selectedBooking.customerPhone}</p>
                    </div>

                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                      <div className="flex items-center space-x-3 mb-2">
                        <Mail className="w-5 h-5 text-purple-600" />
                        <span className="text-sm font-semibold text-purple-700 uppercase tracking-wide">Email</span>
                      </div>
                      <p className="text-purple-900 font-medium">{selectedBooking.customerEmail}</p>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-green-700 font-semibold uppercase tracking-wide text-sm">Total Amount</span>
                      <span className="text-2xl font-bold text-green-900">₹{selectedBooking.totalPrice}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-green-700 text-sm font-medium">Payment Status:</span>
                      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-bold ${selectedBooking.paymentStatus === 'paid' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}>
                        {selectedBooking.paymentStatus === 'paid' ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            <span>Paid</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-4 h-4" />
                            <span>Pending</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1 border-black text-black hover:bg-black hover:text-white transition-all duration-300 font-semibold"
                      onClick={() => window.open(`tel:${selectedBooking.customerPhone}`)}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-black text-black hover:bg-black hover:text-white transition-all duration-300 font-semibold"
                      onClick={() => window.open(`mailto:${selectedBooking.customerEmail}`)}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Entry Scan Modal */}
        {entryScanningBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md shadow-2xl border-2 border-black/10">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-black to-gray-800 rounded-full flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-black">Entry Scan</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetScanning}
                    className="text-gray-500 hover:text-black hover:bg-gray-100 rounded-full w-8 h-8 p-0"
                  >
                    ✕
                  </Button>
                </div>

                <div className="text-center">
                  {!entryConfirmed ? (
                    <>
                      {/* Enhanced Booking Details */}
                      <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl mb-6 border border-blue-200">
                        <h5 className="font-bold text-blue-900 mb-4 uppercase tracking-wide text-sm">Booking Details</h5>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100">
                            <span className="text-sm font-semibold text-blue-700">Customer:</span>
                            <span className="text-sm font-bold text-blue-900">{entryScanningBooking.customerName}</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100">
                            <span className="text-sm font-semibold text-blue-700">Vehicle:</span>
                            <span className="text-sm font-bold text-blue-900">{entryScanningBooking.vehicleNumber}</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100">
                            <span className="text-sm font-semibold text-blue-700">Time:</span>
                            <span className="text-sm font-bold text-blue-900">{entryScanningBooking.startTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      </div>

                      {/* Camera Scanner */}
                      <QRScanner
                        onScanSuccess={(result) => {
                          try {
                            const qrData = JSON.parse(result);
                            if (qrData.bookingId === entryScanningBooking.id) {
                              // Valid QR code for this booking
                              mockEntryScan(entryScanningBooking);
                            } else {
                              setScanError("QR code doesn't match this booking");
                            }
                          } catch (error) {
                            setScanError("Invalid QR code format");
                          }
                        }}
                        onScanError={(error) => setScanError(error)}
                        className="mb-4"
                      />

                      {scanError && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                          <p className="text-red-800 text-sm font-medium">{scanError}</p>
                        </div>
                      )}

                      {/* Enhanced Manual confirmation fallback */}
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-4 font-medium">Camera not working? Use manual confirmation:</p>
                        <Button
                          onClick={() => mockEntryScan(entryScanningBooking)}
                          variant="outline"
                          className="w-full h-12 border-black text-black hover:bg-black hover:text-white transition-all duration-300 font-semibold"
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          Manual Confirm Entry
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="py-8">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full mb-6 shadow-lg">
                        <CheckCircle className="w-10 h-10 text-white" />
                      </div>

                      <h4 className="text-2xl font-bold text-gray-900 mb-3">
                        Entry Confirmed!
                      </h4>

                      <p className="text-gray-600 text-base font-medium">
                        Parking session started and gate is opening.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Exit Scan Modal */}
        {exitScanningBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md shadow-2xl border-2 border-black/10">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-black">Exit Scan</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetScanning}
                    className="text-gray-500 hover:text-black hover:bg-gray-100 rounded-full w-8 h-8 p-0"
                  >
                    ✕
                  </Button>
                </div>

                <div className="text-center">
                  {!exitConfirmed ? (
                    <>
                      {/* Enhanced Booking Details */}
                      <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl mb-6 border border-green-200">
                        <h5 className="font-bold text-green-900 mb-4 uppercase tracking-wide text-sm">Booking Details</h5>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-100">
                            <span className="text-sm font-semibold text-green-700">Customer:</span>
                            <span className="text-sm font-bold text-green-900">{exitScanningBooking.customerName}</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-100">
                            <span className="text-sm font-semibold text-green-700">Vehicle:</span>
                            <span className="text-sm font-bold text-green-900">{exitScanningBooking.vehicleNumber}</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-100">
                            <span className="text-sm font-semibold text-green-700">Duration:</span>
                            <span className="text-sm font-bold text-green-900">{formatDuration(exitScanningBooking.startTime, exitScanningBooking.endTime)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Camera Scanner */}
                      <QRScanner
                        onScanSuccess={(result) => {
                          try {
                            const qrData = JSON.parse(result);
                            if (qrData.bookingId === exitScanningBooking.id) {
                              // Valid QR code for this booking
                              mockExitScan(exitScanningBooking);
                            } else {
                              setScanError("QR code doesn't match this booking");
                            }
                          } catch (error) {
                            setScanError("Invalid QR code format");
                          }
                        }}
                        onScanError={(error) => setScanError(error)}
                        className="mb-4"
                      />

                      {scanError && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                          <p className="text-red-800 text-sm font-medium">{scanError}</p>
                        </div>
                      )}

                      {/* Enhanced Manual confirmation fallback */}
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-4 font-medium">Camera not working? Use manual confirmation:</p>
                        <Button
                          onClick={() => mockExitScan(exitScanningBooking)}
                          variant="outline"
                          className="w-full h-12 border-black text-black hover:bg-black hover:text-white transition-all duration-300 font-semibold"
                        >
                          <CreditCard className="w-4 h-4 mr-2" />
                          Manual Process Exit
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="py-8">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full mb-6 shadow-lg">
                        <CheckCircle className="w-10 h-10 text-white" />
                      </div>

                      <h4 className="text-2xl font-bold text-gray-900 mb-3">
                        Exit Confirmed!
                      </h4>

                      <p className="text-gray-600 text-base font-medium">
                        Payment processed and exit gate opened.
                      </p>

                      {billingDetails && (
                        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                          <h5 className="font-semibold text-green-900 mb-2">Billing Summary</h5>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-green-700">Base Amount:</span>
                              <span className="font-medium text-green-900">₹{billingDetails.bookingAmount}</span>
                            </div>
                            {billingDetails.isOvertime && (
                              <div className="flex justify-between">
                                <span className="text-green-700">Overtime Charges:</span>
                                <span className="font-medium text-green-900">₹{billingDetails.extraCharge}</span>
                              </div>
                            )}
                            <div className="border-t border-green-200 pt-1 mt-2">
                              <div className="flex justify-between font-bold">
                                <span className="text-green-900">Total Paid:</span>
                                <span className="text-green-900">₹{billingDetails.totalCharge}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
