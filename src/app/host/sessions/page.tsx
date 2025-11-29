import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Filter, Clock, Car, User, MapPin, DollarSign, CheckCircle, XCircle, AlertTriangle, Eye, Phone, MessageSquare, Settings } from "lucide-react";
import ParkingTimer from "@/components/ParkingTimer";
import { useParkingSessions } from "@/hooks/use-parking-sessions";
import { useMockParkingListings, mockHostId } from "@/hooks/use-mock-parking-listings";

export default function ActiveSessionsPage() {
  const navigate = useNavigate();
  const { getActiveSessions } = useParkingSessions();
  const { getListingsByHost } = useMockParkingListings();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [spaceFilter, setSpaceFilter] = useState("all");

  const activeSessions = getActiveSessions();
  const allListings = getListingsByHost(mockHostId);

  // Get unique spaces for filter dropdown
  const uniqueSpaces = useMemo(() => {
    const spaces = new Set(activeSessions.map(session => session.spaceName));
    return Array.from(spaces).sort();
  }, [activeSessions]);

  // Filter sessions based on search and filters
  const filteredSessions = useMemo(() => {
    return activeSessions.filter(session => {
      // Search filter
      const matchesSearch =
        session.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.spaceName.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === "all" || session.gateStatus === statusFilter;

      // Space filter
      const matchesSpace = spaceFilter === "all" || session.spaceName === spaceFilter;

      return matchesSearch && matchesStatus && matchesSpace;
    });
  }, [activeSessions, searchQuery, statusFilter, spaceFilter]);

  // Calculate summary stats
  const stats = useMemo(() => {
    const total = activeSessions.length;
    const openGates = activeSessions.filter(s => s.gateStatus === 'open').length;
    const closedGates = activeSessions.filter(s => s.gateStatus === 'closed').length;
    const totalRevenue = activeSessions.reduce((sum, session) => sum + (session.hourlyRate * 0.5), 0); // Mock calculation

    return { total, openGates, closedGates, totalRevenue };
  }, [activeSessions]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800 border-green-200';
      case 'closed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <CheckCircle className="w-3 h-3" />;
      case 'closed': return <XCircle className="w-3 h-3" />;
      default: return <AlertTriangle className="w-3 h-3" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="container-mobile py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/host/dashboard">
                <Button variant="ghost" size="sm" className="p-2">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Active Sessions</h1>
                <p className="text-sm text-gray-600">Monitor and manage all parking sessions</p>
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
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">{stats.total}</div>
            <div className="text-sm text-gray-600">Active Sessions</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">{stats.openGates}</div>
            <div className="text-sm text-gray-600">Open Gates</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600 mb-1">{stats.closedGates}</div>
            <div className="text-sm text-gray-600">Closed Gates</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">${stats.totalRevenue.toFixed(2)}</div>
            <div className="text-sm text-gray-600">Revenue Today</div>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by customer name, vehicle number, or space..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Gate Open</SelectItem>
                  <SelectItem value="closed">Gate Closed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={spaceFilter} onValueChange={setSpaceFilter}>
                <SelectTrigger className="w-48">
                  <MapPin className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="All Spaces" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Spaces</SelectItem>
                  {uniqueSpaces.map(space => (
                    <SelectItem key={space} value={space}>{space}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>Showing {filteredSessions.length} of {activeSessions.length} sessions</span>
            {(searchQuery || statusFilter !== 'all' || spaceFilter !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setSpaceFilter("all");
                }}
                className="text-blue-600 hover:text-blue-800"
              >
                Clear filters
              </Button>
            )}
          </div>
        </Card>

        {/* 3-Column Compact Sessions List */}
        <div className="grid grid-cols-3 gap-4">
          {filteredSessions.length === 0 ? (
            <Card className="p-16 text-center bg-gradient-to-br from-slate-50 to-white border border-slate-200">
              <div className="text-slate-400 mb-6">
                <Clock className="w-16 h-16 mx-auto mb-6 opacity-50" />
                <h3 className="text-2xl font-bold text-slate-900 mb-3">No Active Sessions</h3>
                <p className="text-slate-600 text-lg">
                  {activeSessions.length === 0
                    ? "There are no active parking sessions at the moment."
                    : "No sessions match your current filters."
                  }
                </p>
              </div>
              {activeSessions.length > 0 && (
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setSpaceFilter("all");
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Clear Filters
                </Button>
              )}
            </Card>
          ) : (
            filteredSessions.map((session, index) => {
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
                  <div className={`bg-gradient-to-r ${overtimeMinutes > 0 ? 'from-orange-500 to-red-600' : session.gateStatus === 'open' ? 'from-emerald-500 to-green-600' : 'from-blue-500 to-indigo-600'} text-white px-4 py-2 text-xs font-semibold uppercase tracking-wide`}>
                    Session #{index + 1} • {overtimeMinutes > 0 ? `${overtimeMinutes}min Overtime` : session.gateStatus === 'open' ? 'Active' : 'Parked'}
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
                        {session.gateStatus === 'open' && (
                          <div className="absolute -bottom-1 -left-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                            Active
                          </div>
                        )}
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
            })
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-center">
          <Link to="/host/dashboard">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
