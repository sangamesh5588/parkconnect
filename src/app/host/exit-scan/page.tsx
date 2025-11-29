import { useState, useRef } from "react";
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
  DollarSign,
  AlertCircle,
  CreditCard,
  Receipt
} from "lucide-react";
import { Link } from "react-router-dom";
import { useMockBookings, mockHostId } from "@/hooks/use-mock-bookings";
import { useParkingSessions, calculateOvertimeCharge, calculateTotalTime } from "@/hooks/use-parking-sessions";

export default function ExitScanPage() {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [scanError, setScanError] = useState<string>("");
  const [processingPayment, setProcessingPayment] = useState(false);
  const [exitConfirmed, setExitConfirmed] = useState(false);
  const [billingDetails, setBillingDetails] = useState<any>(null);

  const { getBookingsByHost } = useMockBookings();
  const { getSessionByBooking, completeSession, openGate } = useParkingSessions();

  const bookings = getBookingsByHost(mockHostId);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Mock QR scanning simulation for exit
  const mockScanExitQR = () => {
    setScanning(true);
    setScanError("");

    // Simulate scanning delay
    setTimeout(() => {
      // Mock finding an active booking (Amit Kumar who we started a session for)
      const mockBooking = bookings.find(b =>
        b.customerName === 'Amit Kumar' && b.status === 'active'
      );

      if (mockBooking) {
        // Get the parking session
        const session = getSessionByBooking(mockBooking.id);

        if (session && session.status === 'active') {
          const qrData = {
            type: 'parking_booking',
            bookingId: mockBooking.id,
            customerName: mockBooking.customerName,
            vehicleNumber: mockBooking.vehicleNumber,
            timestamp: new Date().toISOString(),
            checksum: btoa(mockBooking.id + mockBooking.customerName).substring(0, 8)
          };
          setScanResult({ qrData, booking: mockBooking, session });

          // Calculate billing
          calculateBilling(session);
        } else {
          setScanError("No active parking session found for this booking.");
        }
      } else {
        setScanError("No active booking found. Please check the QR code.");
      }
      setScanning(false);
    }, 2000);
  };

  const calculateBilling = (session: any) => {
    if (!session.actualStartTime) return;

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
  };

  const handleProcessExit = async () => {
    if (!scanResult?.session || !billingDetails) return;

    setProcessingPayment(true);

    try {
      // Complete the parking session
      const result = completeSession(scanResult.session.id);

      // Open exit gate
      openGate(scanResult.session.id, 'exit');

      setExitConfirmed(true);

      // Auto redirect after success
      setTimeout(() => {
        window.location.href = '/host/dashboard';
      }, 3000);

    } catch (error) {
      setScanError("Failed to complete parking session. Please try again.");
    } finally {
      setProcessingPayment(false);
    }
  };

  const resetScanning = () => {
    setScanResult(null);
    setScanError("");
    setExitConfirmed(false);
    setBillingDetails(null);
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
              <p className="text-sm text-gray-600">Exit Scanner</p>
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              {exitConfirmed ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : scanning ? (
                <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Camera className="w-8 h-8 text-green-600" />
              )}
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {exitConfirmed ? "Exit Confirmed!" : "Scan Exit QR Code"}
            </h2>

            <p className="text-gray-600 text-sm">
              {exitConfirmed
                ? "Payment processed and exit gate opened."
                : "Position the QR code within the camera frame to complete parking session."
              }
            </p>
          </Card>

          {/* Camera Area */}
          {!exitConfirmed && (
            <Card className="p-4 mb-6">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
                {scanning && (
                  <div className="absolute inset-0 bg-green-500 bg-opacity-20 flex items-center justify-center">
                    <div className="text-white text-lg font-semibold">Scanning...</div>
                  </div>
                )}

                {scanResult && (
                  <div className="absolute inset-0 bg-emerald-500 bg-opacity-20 flex items-center justify-center">
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
          {!exitConfirmed && (
            <div className="space-y-4">
              {!scanResult ? (
                <Button
                  onClick={mockScanExitQR}
                  disabled={scanning}
                  className="w-full h-14 bg-green-600 hover:bg-green-700 text-white text-base font-semibold"
                >
                  {scanning ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Scanning QR Code...
                    </>
                  ) : (
                    <>
                      <Camera className="w-5 h-5 mr-2" />
                      Start Exit Scan
                    </>
                  )}
                </Button>
              ) : scanResult && billingDetails ? (
                <div className="space-y-4">
                  {/* Session & Billing Details */}
                  <Card className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Parking Session</h3>
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
                        <span className="text-gray-600">Parking Duration:</span>
                        <span className="font-medium">{Math.floor(billingDetails.totalMinutes / 60)}h {billingDetails.totalMinutes % 60}m</span>
                      </div>
                    </div>
                  </Card>

                  {/* Billing Breakdown */}
                  <Card className="p-4 border-amber-200 bg-amber-50">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Receipt className="w-4 h-4 mr-2" />
                      Billing Details
                    </h3>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Base Amount:</span>
                        <span className="font-medium">₹{billingDetails.bookingAmount}</span>
                      </div>

                      {billingDetails.isOvertime && (
                        <div className="flex items-center justify-between text-amber-700">
                          <span>Extra Time ({billingDetails.overtimeMinutes}min):</span>
                          <span className="font-medium">₹{billingDetails.extraCharge}</span>
                        </div>
                      )}

                      <div className="border-t pt-2 flex items-center justify-between font-bold">
                        <span className="text-gray-900">Total Amount:</span>
                        <span className="text-lg text-green-600">₹{billingDetails.totalCharge}</span>
                      </div>
                    </div>

                    {billingDetails.isOvertime && (
                      <div className="mt-3 p-2 bg-amber-100 rounded-lg">
                        <p className="text-xs text-amber-800">
                          ⚠️ Extra charges applied for overtime parking
                        </p>
                      </div>
                    )}
                  </Card>

                  <Button
                    onClick={handleProcessExit}
                    disabled={processingPayment}
                    className="w-full h-14 bg-green-600 hover:bg-green-700 text-white text-base font-semibold"
                  >
                    {processingPayment ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        Process Payment & Open Exit Gate
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
              ) : null}
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
          {exitConfirmed && (
            <Card className="p-4 mb-6 bg-green-50 border-green-200">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-green-800 font-medium">Exit Successful!</p>
                  <p className="text-green-700 text-sm">
                    Payment processed and exit gate opened. Redirecting to dashboard...
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Info Card */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 mb-2">How Exit Works</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Customer shows QR code at exit gate</li>
              <li>• System calculates parking duration and charges</li>
              <li>• Shows overtime charges if applicable</li>
              <li>• Processes payment and opens exit gate</li>
            </ul>

            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-1">Overtime Policy</h4>
              <p className="text-xs text-blue-700">
                1-30 min overtime: ½ hourly rate<br/>
                30+ min overtime: full additional hour
              </p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
