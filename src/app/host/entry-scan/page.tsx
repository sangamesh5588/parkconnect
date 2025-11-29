import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Camera,
  CheckCircle,
  XCircle,
  Car,
  Bike,
  Clock,
  MapPin,
  User,
  AlertCircle,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import { useMockBookings, mockHostId } from "@/hooks/use-mock-bookings";
import { useParkingSessions } from "@/hooks/use-parking-sessions";
import { useMockParkingListings } from "@/hooks/use-mock-parking-listings";

export default function EntryScanPage() {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [scanError, setScanError] = useState<string>("");
  const [confirmingEntry, setConfirmingEntry] = useState(false);
  const [entryConfirmed, setEntryConfirmed] = useState(false);

  const { getBookingsByHost } = useMockBookings();
  const { startSession, openGate } = useParkingSessions();
  const { getListingsByHost } = useMockParkingListings();

  const bookings = getBookingsByHost(mockHostId);
  const listings = getListingsByHost(mockHostId);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Mock QR scanning simulation
  const mockScanQR = () => {
    setScanning(true);
    setScanError("");

    // Simulate scanning delay
    setTimeout(() => {
      // Mock finding the first "confirmed" booking (Amit Kumar)
      const mockBooking = bookings.find(b =>
        b.status === 'confirmed' && b.customerName === 'Rahul Sharma'
      );

      if (mockBooking) {
        const qrData = {
          type: 'parking_booking',
          bookingId: mockBooking.id,
          customerName: mockBooking.customerName,
          vehicleNumber: mockBooking.vehicleNumber,
          timestamp: new Date().toISOString(),
          checksum: btoa(mockBooking.id + mockBooking.customerName).substring(0, 8)
        };
        setScanResult({ qrData, booking: mockBooking });
      } else {
        setScanError("No valid booking found. Please check the QR code.");
      }
      setScanning(false);
    }, 2000);
  };

  const handleConfirmEntry = async () => {
    if (!scanResult?.booking) return;

    setConfirmingEntry(true);

    try {
      // Validate booking is still valid
      const booking = scanResult.booking;
      const now = new Date();

      if (booking.status !== 'confirmed') {
        setScanError("Booking is not valid for entry.");
        return;
      }

      if (booking.startTime > new Date(now.getTime() + 60 * 60 * 1000)) { // More than 1 hour early
        setScanError("Booking time is too early. Please arrive closer to your booking time.");
        return;
      }

      // Start parking session
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
        hourlyRate: booking.hourlyCarRate || 40,
        paymentStatus: booking.paymentStatus,
      });

      // Open gate
      openGate(sessionId, 'entry');

      setEntryConfirmed(true);

      // Auto redirect after success
      setTimeout(() => {
        window.location.href = '/host/dashboard';
      }, 3000);

    } catch (error) {
      setScanError("Failed to start parking session. Please try again.");
    } finally {
      setConfirmingEntry(false);
    }
  };

  const resetScanning = () => {
    setScanResult(null);
    setScanError("");
    setEntryConfirmed(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-20 shadow-soft">
        <div className="container-mobile">
          <div className="flex items-center justify-between py-4">
            <Link
              to="/host/dashboard"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-all duration-200 min-h-[44px] px-2 rounded-md hover:bg-gray-50"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="hidden sm:inline font-medium">Back to Dashboard</span>
            </Link>

            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-900">ParkConnect</h1>
              <p className="text-sm text-gray-600">Entry Scanner</p>
            </div>

            <div className="w-16 sm:w-20"></div> {/* Spacer */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-mobile py-6">
        <div className="max-w-md mx-auto">
          {/* Status Card */}
          <Card className="p-6 mb-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              {entryConfirmed ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : scanning ? (
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Camera className="w-8 h-8 text-blue-600" />
              )}
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {entryConfirmed ? "Entry Confirmed!" : "Scan Customer QR Code"}
            </h2>

            <p className="text-gray-600 text-sm">
              {entryConfirmed
                ? "The parking session has started and the gate is opening."
                : "Position the QR code within the camera frame to verify customer booking."
              }
            </p>
          </Card>

          {/* Camera Area */}
          {!entryConfirmed && (
            <Card className="p-4 mb-6">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
                {scanning && (
                  <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                    <div className="text-white text-lg font-semibold">Scanning...</div>
                  </div>
                )}

                {scanResult && (
                  <div className="absolute inset-0 bg-green-500 bg-opacity-20 flex items-center justify-center">
                    <CheckCircle className="w-16 h-16 text-white" />
                  </div>
                )}

                {/* Mock QR code overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-white rounded-lg opacity-50">
                    <div className="w-full h-full border-2 border-dashed border-white rounded-lg flex items-center justify-center">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          {!entryConfirmed && (
            <div className="space-y-4">
              {!scanResult ? (
                <Button
                  onClick={mockScanQR}
                  disabled={scanning}
                  className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold"
                >
                  {scanning ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Scanning QR Code...
                    </>
                  ) : (
                    <>
                      <Camera className="w-5 h-5 mr-2" />
                      Start Scanning
                    </>
                  )}
                </Button>
              ) : (
                <div className="space-y-4">
                  {/* Booking Details */}
                  <Card className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Booking Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Customer:</span>
                        <span className="font-medium">{scanResult.booking.customerName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Vehicle:</span>
                        <span className="font-medium">{scanResult.booking.vehicleNumber}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium">{scanResult.booking.startTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Status:</span>
                        <Badge className="bg-green-100 text-green-800">
                          {scanResult.booking.status}
                        </Badge>
                      </div>
                    </div>
                  </Card>

                  <Button
                    onClick={handleConfirmEntry}
                    disabled={confirmingEntry}
                    className="w-full h-14 bg-green-600 hover:bg-green-700 text-white text-base font-semibold"
                  >
                    {confirmingEntry ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Starting Session...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 mr-2" />
                        Confirm Entry & Open Gate
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={resetScanning}
                    variant="outline"
                    className="w-full h-12"
                  >
                    Scan Different QR Code
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Error Display */}
          {scanError && (
            <Card className="p-4 mb-6 bg-red-50 border-red-200">
              <div className="flex items-start space-x-3">
                <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="text-red-800 font-medium">Scan Error</p>
                  <p className="text-red-700 text-sm">{scanError}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Success Message */}
          {entryConfirmed && (
            <Card className="p-4 mb-6 bg-green-50 border-green-200">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-green-800 font-medium">Entry Successful!</p>
                  <p className="text-green-700 text-sm">
                    Parking session started. The gate is opening. Redirecting to dashboard...
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Info Card */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 mb-2">How Entry Works</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Customer shows QR code from booking confirmation</li>
              <li>• Scan and verify booking details</li>
              <li>• Confirm entry to start parking timer</li>
              <li>• Gate opens automatically</li>
            </ul>
          </Card>
        </div>
      </main>
    </div>
  );
}
