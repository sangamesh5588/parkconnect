import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Plus, MapPin, DollarSign, Users, Settings, ArrowRight, Clock, Calendar, ChevronDown, ChevronUp, Car, Wrench, FileText, BarChart3, X, Eye, User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DailySlotManager from "@/components/DailySlotManager";
import { useMockParkingListings, mockHostId } from "@/hooks/use-mock-parking-listings";
import { useMockBookings } from "@/hooks/use-mock-bookings";
import { useParkingSessions } from "@/hooks/use-parking-sessions";
import ParkingTimer from "@/components/ParkingTimer";

// Parking Listing Components
import { useParkingListingStore } from "@/hooks/use-parking-listing-store";
import {
  ParkingDetailsStep,
  SlotSetupStep,
  PricingStep,
  AvailabilityStep
} from "@/components/parking-listing";

export default function HostDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(!location.state?.listingCreated && !location.state?.approvalSkipped);
  const [showApprovalSuccess, setShowApprovalSuccess] = useState(false);
  const [showParkingModal, setShowParkingModal] = useState(false);
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [showDailySlots, setShowDailySlots] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { getTotalStats, getListingsByHost } = useMockParkingListings();
  const { getTotalStats: getBookingStats } = useMockBookings();
  const { getActiveSessions, getTodaysStats: getSessionStats } = useParkingSessions();

  // Get real stats from stored listings
  const listingStats = getTotalStats(mockHostId);
  const bookingStats = getBookingStats(mockHostId);
  const listings = getListingsByHost(mockHostId);

  // Get pending and live listings
  const pendingListings = listings.filter(listing => listing.status === 'pending');
  const liveListings = listings.filter(listing => listing.status === 'live');

  // Get active parking sessions
  const activeSessions = getActiveSessions();
  const sessionStats = getSessionStats();

  // Only allow creating new listing if host doesn't already have one
  const canCreateListing = listings.length === 0;

  // Handle success messages
  useEffect(() => {
    if (location.state?.listingCreated) {
      setShowWelcome(false);
    }
    if (location.state?.approvalSkipped || location.state?.listingApproved) {
      setShowApprovalSuccess(true);
      setTimeout(() => setShowApprovalSuccess(false), 5000);
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="container-mobile py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">P</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ParkConnect</h1>
                <p className="text-sm text-gray-600">Host Dashboard</p>
              </div>
            </div>

            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-mobile py-6">
        {/* Welcome Message */}
        {showWelcome && (
          <Card className="p-6 mb-6 bg-secondary border-border">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Welcome to ParkConnect! 🎉
                </h2>
                <p className="text-gray-700 mb-4">
                  Your host application has been approved in demo mode. You're now ready to start listing your parking spaces and earning money!
                </p>
                <Button
                  onClick={() => setShowWelcome(false)}
                  variant="outline"
                  size="sm"
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Pending Approval Notification */}
        {pendingListings.length > 0 && (
          <Card className="p-4 mb-6 bg-secondary border-border">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-primary mb-1">
                  {pendingListings.length} Parking Space{pendingListings.length > 1 ? 's' : ''} Under Review
                </h3>
                <p className="text-sm text-primary/80 mb-3">
                  Your listing{pendingListings.length > 1 ? 's are' : ' is'} being reviewed by our admin team.
                  You'll receive a notification once {pendingListings.length > 1 ? 'they are' : 'it is'} approved.
                </p>
                <Link to="/host/parking/approval">
                  <Button variant="outline" size="sm" className="border-border text-primary hover:bg-secondary">
                    Check Status
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        )}

        {/* Approval Success Notification */}
        {showApprovalSuccess && (
          <Card className="p-4 mb-6 bg-secondary border-border">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-primary mb-1">
                  🎉 Parking Space Approved!
                </h3>
                <p className="text-sm text-primary/80">
                  Your parking space is now live and visible to renters. You can start managing availability below.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <BarChart3 className="w-6 h-6 mr-3 text-gray-700" />
            Quick Actions
          </h2>

          <div className="space-y-4">
            {/* Action Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Manage Parking Card */}
              {liveListings.length > 0 && (
                <Card
                  onClick={() => setShowSlotModal(true)}
                  className="relative overflow-hidden cursor-pointer h-32 border-0 shadow-2xl bg-gradient-to-br from-black via-gray-900 to-black"
                >
                  {/* Content */}
                  <div className="relative p-6 h-full flex flex-col justify-center items-center text-center z-10">
                    <h3 className="text-xl font-bold text-white">Manage Parking</h3>
                    <p className="text-sm text-gray-300">Update availability & pricing</p>
                    {bookingStats.totalBookings > 0 && (
                      <div className="mt-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        {bookingStats.totalBookings} Active
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* View Bookings Card */}
              <Link to="/host/bookings">
                <Card className="relative overflow-hidden cursor-pointer h-32 border-0 shadow-2xl bg-gradient-to-br from-black via-gray-900 to-black">
                  {/* Content */}
                  <div className="relative p-6 h-full flex flex-col justify-center items-center text-center z-10">
                    <h3 className="text-xl font-bold text-white">View Bookings</h3>
                    <p className="text-sm text-gray-300">Manage reservations & earnings</p>
                    {bookingStats.totalBookings > 0 && (
                      <div className="mt-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        {bookingStats.totalBookings} Bookings
                      </div>
                    )}
                  </div>
                </Card>
              </Link>

              {/* Daily Active Slots Toggle Card */}
              {liveListings.length > 0 && (
                <Card
                  onClick={() => setShowDailySlots(!showDailySlots)}
                  className="relative overflow-hidden cursor-pointer h-32 border-0 shadow-2xl bg-gradient-to-br from-black via-gray-900 to-black"
                >
                  {/* Content */}
                  <div className="relative p-4 h-full flex flex-col items-center justify-center text-center z-10">
                    <h3 className="text-lg font-bold mb-2 text-white">
                      Daily Slots
                    </h3>
                    <div className="text-sm font-medium text-gray-300">
                      {liveListings.reduce((total, listing) => total + listing.activeCarSlots + listing.activeBikeSlots, 0)} Active
                    </div>
                    <div className="mt-3 text-gray-400">
                      ▼
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Daily Active Slots Section - Enhanced Design */}
            {showDailySlots && liveListings.length > 0 && (
              <Card className="bg-gradient-to-br from-slate-50 via-white to-slate-50 border border-slate-200/60 shadow-xl backdrop-blur-sm">
                <div className="p-8">
                  <div className="space-y-8">
                    {/* Enhanced Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                          Daily Active Slots
                        </h3>
                        <p className="text-slate-600 text-sm">Monitor and manage your parking space availability</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-xl font-semibold text-sm shadow-lg">
                          {liveListings.reduce((total, listing) => total + listing.activeCarSlots + listing.activeBikeSlots, 0)} /
                          {liveListings.reduce((total, listing) => total + listing.totalCarSlots + listing.totalBikeSlots, 0)} Active
                        </div>
                        <div className={`w-3 h-3 rounded-full ${
                          liveListings.reduce((total, listing) => total + listing.activeCarSlots + listing.activeBikeSlots, 0) > 0
                            ? 'bg-green-500 animate-pulse'
                            : 'bg-slate-400'
                        }`}></div>
                      </div>
                    </div>

                    {/* Enhanced Parking Spaces Grid */}
              <div className="grid grid-cols-3 gap-4">
                      {liveListings.map((listing, index) => {
                        const utilizationPercent = Math.round(
                          ((listing.activeCarSlots + listing.activeBikeSlots) /
                           (listing.totalCarSlots + listing.totalBikeSlots)) * 100
                        );

                        const getStatusColor = (percent: number) => {
                          if (percent >= 80) return { bg: 'from-emerald-500 to-green-600', text: 'text-emerald-700', light: 'bg-emerald-50', border: 'border-emerald-200' };
                          if (percent >= 50) return { bg: 'from-amber-500 to-orange-600', text: 'text-amber-700', light: 'bg-amber-50', border: 'border-amber-200' };
                          return { bg: 'from-red-500 to-rose-600', text: 'text-red-700', light: 'bg-red-50', border: 'border-red-200' };
                        };

                        const statusStyle = getStatusColor(utilizationPercent);

                        return (
                          <div key={listing.id} className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                            {/* Status Banner */}
                            <div className={`bg-gradient-to-r ${statusStyle.bg} text-white px-4 py-2 text-xs font-semibold uppercase tracking-wide`}>
                              {utilizationPercent >= 80 ? 'High Occupancy' : utilizationPercent >= 50 ? 'Moderate' : 'Low Occupancy'}
                            </div>

                            <div className="p-6 space-y-5">
                              {/* Header */}
                              <div className="space-y-3">
                                <div className="flex items-start justify-between">
                                  <div className="min-w-0 flex-1">
                                    <h4 className="text-lg font-bold text-slate-900 truncate">{listing.name}</h4>
                                    <p className="text-sm text-slate-600 flex items-center gap-1">
                                      <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                                      {listing.address}
                                    </p>
                                  </div>
                                  <div className={`text-right ${statusStyle.light} ${statusStyle.border} border px-3 py-2 rounded-xl`}>
                                    <div className={`text-2xl font-bold ${statusStyle.text}`}>
                                      {utilizationPercent}%
                                    </div>
                                    <div className={`text-xs ${statusStyle.text} font-medium`}>Utilized</div>
                                  </div>
                                </div>
                              </div>

                              {/* Enhanced Utilization Bar */}
                              <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                  <span className="text-slate-700 font-medium">Capacity Usage</span>
                                  <span className="text-slate-500">{listing.activeCarSlots + listing.activeBikeSlots}/{listing.totalCarSlots + listing.totalBikeSlots} slots</span>
                                </div>
                                <div className="relative">
                                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                                    <div
                                      className={`h-full bg-gradient-to-r ${statusStyle.bg} transition-all duration-700 ease-out rounded-full relative`}
                                      style={{ width: `${utilizationPercent}%` }}
                                    >
                                      <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Enhanced Slot Status */}
                              <div className="grid grid-cols-2 gap-4">
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
                                  <div className="text-xs text-blue-700 font-semibold uppercase tracking-wide mb-1">Cars</div>
                                  <div className="text-lg font-bold text-blue-900">
                                    {listing.activeCarSlots}/{listing.totalCarSlots}
                                  </div>
                                  <div className="w-full bg-blue-200 rounded-full h-1 mt-2">
                                    <div
                                      className="bg-blue-600 h-1 rounded-full transition-all duration-500"
                                      style={{ width: `${listing.totalCarSlots > 0 ? (listing.activeCarSlots / listing.totalCarSlots) * 100 : 0}%` }}
                                    ></div>
                                  </div>
                                </div>
                                <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                                  <div className="text-xs text-green-700 font-semibold uppercase tracking-wide mb-1">Bikes</div>
                                  <div className="text-lg font-bold text-green-900">
                                    {listing.activeBikeSlots}/{listing.totalBikeSlots}
                                  </div>
                                  <div className="w-full bg-green-200 rounded-full h-1 mt-2">
                                    <div
                                      className="bg-green-600 h-1 rounded-full transition-all duration-500"
                                      style={{ width: `${listing.totalBikeSlots > 0 ? (listing.activeBikeSlots / listing.totalBikeSlots) * 100 : 0}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>

                              {/* Enhanced Manage Button */}
                              <Button
                                size="sm"
                                className="w-full bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                onClick={() => setShowSlotModal(true)}
                              >
                                Manage Slots
                              </Button>
                            </div>

                            {/* Subtle Background Pattern */}
                            <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                              <div className="w-full h-full bg-gradient-to-br from-slate-900 to-transparent rounded-full transform translate-x-16 -translate-y-16"></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Enhanced Summary */}
                    <div className="bg-gradient-to-r from-slate-100 to-slate-50 border border-slate-200 rounded-2xl p-6">
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">💡</span>
                        </div>
                        <div className="text-slate-700 font-medium">
                          Click "Manage Slots" on any space to update daily availability and pricing
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">{activeSessions.length}</div>
            <div className="text-sm text-gray-600">Active Sessions</div>
          </Card>
        </div>


        {/* Minimal Active Parking Sessions */}
        {activeSessions.length > 0 && (
          <Card className="bg-gradient-to-br from-slate-50 via-white to-slate-50 border border-slate-200/60 shadow-xl backdrop-blur-sm mb-8">
            <div className="p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent flex items-center">
                    <Clock className="w-6 h-6 mr-3 text-blue-600" />
                    Active Parking Sessions
                  </h3>
                  <p className="text-slate-600 text-sm">Monitor real-time parking activities</p>
                </div>
                {activeSessions.length > 10 && (
                  <Link to="/host/sessions">
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      View All ({activeSessions.length})
                    </Button>
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                {activeSessions.slice(0, 10).map((session) => {
                  // Calculate overtime pricing
                  const now = new Date().getTime();
                  const bookedEndTime = session.bookedEndTime.getTime();
                  const overtimeMs = Math.max(0, now - bookedEndTime);
                  const overtimeMinutes = Math.floor(overtimeMs / (1000 * 60));

                  // Pricing logic: 0-30 min = half hourly rate, then continues
                  const halfHourlyRate = session.hourlyRate / 2;
                  const overtimeCharges = overtimeMinutes > 0 ? halfHourlyRate : 0;

                  return (
                    <div key={session.id} className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                      {/* Status Banner - Overtime Indicator */}
                      <div className={`bg-gradient-to-r ${
                        overtimeMinutes > 0
                          ? 'from-orange-500 to-red-600'
                          : session.gateStatus === 'open'
                            ? 'from-emerald-500 to-green-600'
                            : 'from-blue-500 to-indigo-600'
                      } text-white px-4 py-2 text-xs font-semibold uppercase tracking-wide`}>
                        {overtimeMinutes > 0 ? `${overtimeMinutes}min Overtime` : session.gateStatus === 'open' ? 'Active' : 'Parked'}
                      </div>

                  <div className="p-6 space-y-5">
                    {/* Car Image - Visual representation of parked car */}
                    <div className="flex justify-center">
                      <div className="relative">
                        <div className="w-20 h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg border-2 border-blue-300 flex items-center justify-center shadow-md">
                          <div className="text-2xl">🚗</div>
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                          {session.spaceName.slice(0, 3).toUpperCase()}
                        </div>
                      </div>
                    </div>

                    {/* Countdown Timer */}
                    <div className="flex justify-center">
                      <ParkingTimer
                        startTime={session.actualStartTime!}
                        endTime={session.bookedEndTime}
                        bookedDuration={session.bookedDuration}
                        hourlyRate={session.hourlyRate}
                        vehicleNumber={session.vehicleNumber}
                        customerName={session.customerName}
                        className="scale-110"
                      />
                    </div>

                    {/* Price Information */}
                    {overtimeCharges > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                        <div className="text-sm text-red-700 font-medium">Additional Charges</div>
                        <div className="text-xl font-bold text-red-900">${overtimeCharges.toFixed(2)}</div>
                        <div className="text-xs text-red-600">{overtimeMinutes}min @ ${(halfHourlyRate).toFixed(2)}/min</div>
                      </div>
                    )}

                    {/* Call Renter Button */}
                    <Button
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      📞 Call Renter
                    </Button>
                  </div>

                      {/* Subtle Background Pattern */}
                      <div className="absolute top-0 right-0 w-24 h-24 opacity-5">
                        <div className="w-full h-full bg-gradient-to-br from-slate-900 to-transparent rounded-full transform translate-x-12 -translate-y-12"></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {activeSessions.length > 10 && (
                <div className="mt-8 text-center">
                  <div className="inline-flex items-center gap-3 bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <Eye className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-slate-700 font-medium">Showing 10 of {activeSessions.length} active sessions</p>
                      <Link to="/host/sessions">
                        <Button className="mt-2 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white">
                          View All Sessions
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced Footer */}
              <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">💡</span>
                  </div>
                  <div className="text-blue-900 font-medium">
                    Contact renters directly for payment collection when overtime occurs
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}



        {/* Getting Started Guide - Only show when user has no listings */}
        {listings.length === 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-primary" />
              Getting Started as a Host
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              {/* Step 1 */}
              <Card className="p-4 bg-secondary border-border hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-primary-foreground">1</span>
                  </div>
                  <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                    <Plus className="w-4 h-4 text-primary" />
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900 text-sm mb-2">List Your Space</h4>
                <p className="text-xs text-gray-600 leading-tight">Add location, photos, pricing & availability</p>
              </Card>

              {/* Step 2 */}
              <Card className="p-4 bg-secondary border-border hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-primary-foreground">2</span>
                  </div>
                  <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-primary" />
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900 text-sm mb-2">Set Pricing</h4>
                <p className="text-xs text-gray-600 leading-tight">Choose competitive rates & offers</p>
              </Card>

              {/* Step 3 */}
              <Card className="p-4 bg-secondary border-border hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-primary-foreground">3</span>
                  </div>
                  <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-primary" />
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900 text-sm mb-2">Start Earning</h4>
                <p className="text-xs text-gray-600 leading-tight">Receive bookings & earn money</p>
              </Card>
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <Link to="/host/parking/list">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200">
                  <Plus className="w-4 h-4 mr-2" />
                  List Your First Parking Space
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* One Listing Per Host Notice - Show when user already has listings */}
        {listings.length > 0 && (
          <div className="mb-8">
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    One Listing Per Host Policy
                  </h3>
                  <p className="text-gray-700 mb-4">
                    You currently have {listings.length} parking listing{listings.length > 1 ? 's' : ''} active.
                    To maintain quality and fair distribution, each host is limited to one parking listing at a time.
                  </p>
                  <div className="flex items-center text-sm text-blue-700 bg-blue-100 px-3 py-2 rounded-lg">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span className="font-medium">
                      {liveListings.length > 0 ? 'Your listing is live and accepting bookings!' : 'Your listing is under review.'}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-8 flex justify-center">
          <Link to="/">
            <Button variant="outline">
              Back to Home
            </Button>
          </Link>
        </div>
      </main>

      {/* Parking Listing Modal */}
      <ParkingListingModal
        isOpen={showParkingModal}
        onClose={() => setShowParkingModal(false)}
        onComplete={() => {
          setShowParkingModal(false);
          // Refresh the listings data
          window.location.reload();
        }}
      />

      {/* Slot Management Modal */}
      <SlotManagementModal
        isOpen={showSlotModal}
        onClose={() => setShowSlotModal(false)}
        listings={liveListings}
      />
    </div>
  );
}

// Parking Listing Modal Component
function ParkingListingModal({ isOpen, onClose, onComplete }: { isOpen: boolean; onClose: () => void; onComplete: () => void }) {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const parkingListingSteps = [
    { id: 1, title: "Details", subtitle: "Basic Info", icon: MapPin, component: ParkingDetailsStep },
    { id: 2, title: "Capacity", subtitle: "Total Slots", icon: Car, component: SlotSetupStep },
    { id: 3, title: "Pricing", subtitle: "Set Rates", icon: DollarSign, component: PricingStep },
    { id: 4, title: "Schedule", subtitle: "Availability", icon: Clock, component: AvailabilityStep },
  ];

  const {
    currentStep,
    setCurrentStep,
    listingData,
    updateListingData,
    validateStep,
    canAccessStep,
    completeListing,
    reset,
  } = useParkingListingStore();

  const { addListing } = useMockParkingListings();

  const progress = (currentStep / parkingListingSteps.length) * 100;
  const CurrentStepComponent = parkingListingSteps[currentStep - 1].component;

  useEffect(() => {
    // Smooth transition effect
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 150);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < parkingListingSteps.length) {
        setCurrentStep(currentStep + 1);
      } else {
        // Complete the listing
        handleComplete();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    try {
      // Save listing to mock store
      addListing({
        hostId: mockHostId,
        name: listingData.name,
        address: listingData.address,
        location: listingData.location,
        parkingType: listingData.parkingType,
        areaType: listingData.areaType,
        photos: listingData.photos,
        instructions: listingData.instructions,
        totalCarSlots: listingData.totalCarSlots,
        totalBikeSlots: listingData.totalBikeSlots,
        activeCarSlots: listingData.activeCarSlots,
        activeBikeSlots: listingData.activeBikeSlots,
        hourlyCarRate: listingData.hourlyCarRate,
        hourlyBikeRate: listingData.hourlyBikeRate,
        dailyCarRate: listingData.dailyCarRate,
        dailyBikeRate: listingData.dailyBikeRate,
        openTime: listingData.openTime,
        closeTime: listingData.closeTime,
        is24Hours: listingData.is24Hours,
        closedDays: listingData.closedDays,
        status: 'pending',
      });

      console.log("Parking listing saved to mock store:", listingData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      completeListing();
      reset();

      // Close modal and navigate to approval page
      onComplete();
      navigate('/host/parking/approval');

    } catch (error) {
      console.error("Failed to create parking listing:", error);
    }
  };

  const currentStepData = parkingListingSteps[currentStep - 1];
  const IconComponent = currentStepData.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-4 top-4 z-10"
          >
            <X className="w-4 h-4" />
          </Button>

          {/* Progress Section */}
          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Step Indicators */}
            <div className="grid grid-cols-4 gap-2">
              {parkingListingSteps.map((step, index) => {
                const StepIcon = step.icon;
                const isCompleted = currentStep > step.id;
                const isCurrent = step.id === currentStep;

                return (
                  <div key={step.id} className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isCurrent
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-400'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <StepIcon className="w-5 h-5" />
                      )}
                    </div>
                    <div className="text-center mt-2 min-h-[2rem] flex flex-col justify-center">
                      <div className={`text-xs font-medium ${
                        isCurrent ? 'text-blue-600' : 'text-gray-600'
                      }`}>
                        {step.title}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step Header */}
          <div className={`text-center transition-all duration-300 ${isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-3xl mb-4 ${
              currentStep > 0 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
            }`}>
              <IconComponent className="w-7 h-7" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentStepData.title} & {currentStepData.subtitle}
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed max-w-lg mx-auto">
              {currentStep === 1 && "Tell us about your parking space location and basic details."}
              {currentStep === 2 && "Set the total number of parking slots you have available."}
              {currentStep === 3 && "Set competitive pricing for your parking space."}
              {currentStep === 4 && "Configure when your parking space is available for bookings."}
            </p>
          </div>
        </DialogHeader>

        {/* Step Content */}
        <div className={`transition-all duration-300 delay-75 ${isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
          <CurrentStepComponent
            onNext={handleNext}
            onPrevious={handlePrevious}
            isLastStep={currentStep === parkingListingSteps.length}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Slot Management Modal Component
function SlotManagementModal({ isOpen, onClose, listings }: { isOpen: boolean; onClose: () => void; listings: any[] }) {
  const [savingSlots, setSavingSlots] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState<string | null>(null);
  const [dailySlots, setDailySlots] = useState<Record<string, { activeCarSlots: number; activeBikeSlots: number }>>({});
  const { updateActiveSlots } = useMockParkingListings();

  useEffect(() => {
    // Initialize daily slots with current values
    const initialSlots: Record<string, { activeCarSlots: number; activeBikeSlots: number }> = {};
    listings.forEach(listing => {
      initialSlots[listing.id] = {
        activeCarSlots: listing.activeCarSlots,
        activeBikeSlots: listing.activeBikeSlots
      };
    });
    setDailySlots(initialSlots);
  }, [listings]);

  const handleSaveSlots = async (listingId: string) => {
    setSavingSlots(listingId);
    const currentSlots = dailySlots[listingId];

    if (currentSlots) {
      updateActiveSlots(listingId, currentSlots.activeCarSlots, currentSlots.activeBikeSlots);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSavingSlots(null);
      setShowSuccess(listingId);

      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(null), 3000);
    }
  };

  const handleSetFullCapacity = (listingId: string) => {
    const listing = listings.find(l => l.id === listingId);
    if (listing) {
      setDailySlots(prev => ({
        ...prev,
        [listingId]: {
          activeCarSlots: listing.totalCarSlots,
          activeBikeSlots: listing.totalBikeSlots
        }
      }));
    }
  };

  const handleSet80PercentCapacity = (listingId: string) => {
    const listing = listings.find(l => l.id === listingId);
    if (listing) {
      setDailySlots(prev => ({
        ...prev,
        [listingId]: {
          activeCarSlots: Math.floor(listing.totalCarSlots * 0.8),
          activeBikeSlots: Math.floor(listing.totalBikeSlots * 0.8)
        }
      }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white border border-gray-200 shadow-2xl">
        <div>
          <DialogHeader className="text-white">
            <DialogTitle className="text-2xl font-bold text-center mb-2 text-black">
              Manage Active Slots
            </DialogTitle>
            <p className="text-sm text-black text-center">
              Set the number of parking slots available for booking today
            </p>
          </DialogHeader>

          <div className="space-y-6 p-6">
            {listings.map((listing) => {
              const currentSlots = dailySlots[listing.id] || {
                activeCarSlots: listing.activeCarSlots,
                activeBikeSlots: listing.activeBikeSlots
              };
              const utilizationPercent = Math.round(
                ((currentSlots.activeCarSlots + currentSlots.activeBikeSlots) /
                 (listing.totalCarSlots + listing.totalBikeSlots)) * 100
              );

              return (
                <Card key={listing.id} className="relative overflow-hidden border-0 shadow-2xl">
                  {/* Card Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 opacity-95"></div>

                  {/* Animated Border */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-green-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg blur-sm"></div>

                  <div className="relative p-6 z-10">
                    <div className="space-y-6">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 drop-shadow-sm">{listing.name}</h3>
                          <p className="text-sm text-gray-600">{listing.address}</p>
                        </div>
                        {showSuccess === listing.id && (
                          <div className="flex items-center bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                            ✓ Saved!
                          </div>
                        )}
                      </div>

                      {/* Current Status */}
                      <div className="p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 rounded-xl">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">Current Capacity</p>
                            <p className="text-xs text-gray-600">Available for booking today</p>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                              {utilizationPercent}%
                            </div>
                            <div className="text-xs text-gray-600">Utilized</div>
                          </div>
                        </div>

                        {/* Utilization Bar */}
                        <div className="mt-4 w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${
                              utilizationPercent >= 80 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                              utilizationPercent >= 50 ? 'bg-gradient-to-r from-blue-400 to-purple-500' :
                              'bg-gradient-to-r from-yellow-400 to-orange-500'
                            }`}
                            style={{ width: `${utilizationPercent}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Slot Controls */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Car Slots */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">Car Parking Slots</h4>
                              <p className="text-sm text-gray-600">Available: {listing.totalCarSlots} total</p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-blue-600">
                                {currentSlots.activeCarSlots} / {listing.totalCarSlots}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Active slots today
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                min="0"
                                max={listing.totalCarSlots}
                                value={currentSlots.activeCarSlots}
                                onChange={(e) => {
                                  const value = Math.max(0, Math.min(listing.totalCarSlots, parseInt(e.target.value) || 0));
                                  setDailySlots(prev => ({
                                    ...prev,
                                    [listing.id]: {
                                      ...prev[listing.id],
                                      activeCarSlots: value
                                    }
                                  }));
                                }}
                                className="w-full h-14 text-xl text-center font-bold border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 bg-white shadow-sm hover:shadow-md"
                              />
                              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            </div>
                          </div>
                        </div>

                        {/* Bike Slots */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">Bike Parking Slots</h4>
                              <p className="text-sm text-gray-600">Available: {listing.totalBikeSlots} total</p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-green-600">
                                {currentSlots.activeBikeSlots} / {listing.totalBikeSlots}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Active slots today
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                min="0"
                                max={listing.totalBikeSlots}
                                value={currentSlots.activeBikeSlots}
                                onChange={(e) => {
                                  const value = Math.max(0, Math.min(listing.totalBikeSlots, parseInt(e.target.value) || 0));
                                  setDailySlots(prev => ({
                                    ...prev,
                                    [listing.id]: {
                                      ...prev[listing.id],
                                      activeBikeSlots: value
                                    }
                                  }));
                                }}
                                className="w-full h-14 text-xl text-center font-bold border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-300 bg-white shadow-sm hover:shadow-md"
                              />
                              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/5 to-emerald-500/5 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex gap-4">
                        <Button
                          type="button"
                          onClick={() => handleSetFullCapacity(listing.id)}
                          className="flex-1 h-12 bg-black hover:bg-gray-800 text-white rounded-xl font-semibold"
                        >
                          Full Capacity
                        </Button>
                        <Button
                          type="button"
                          onClick={() => handleSet80PercentCapacity(listing.id)}
                          className="flex-1 h-12 bg-black hover:bg-gray-800 text-white rounded-xl font-semibold"
                        >
                          80% Capacity
                        </Button>
                      </div>

                      {/* Save Button */}
                      <Button
                        onClick={() => handleSaveSlots(listing.id)}
                        disabled={savingSlots === listing.id}
                        className="w-full h-14 bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-900 text-white text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                      >
                        {savingSlots === listing.id ? "Saving..." : "Update Today's Availability"}
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
