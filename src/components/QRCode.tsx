import { useMemo, useRef, useEffect, useState } from 'react';
import QRCode from 'qrcode';
import QrScanner from 'qr-scanner';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  className?: string;
}

export default function QRCodeDisplay({ value, size = 200, className = '' }: QRCodeDisplayProps) {
  const qrCodeUrl = useMemo(() => {
    try {
      // Generate QR code as data URL
      const options = {
        width: size,
        margin: 1,
        color: {
          dark: '#000000',  // Black
          light: '#FFFFFF'  // White
        }
      };

      // For demo purposes, we'll create a simple data URL
      // In a real app, you'd use QRCode.toDataURL()
      return `data:image/svg+xml;base64,${btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
          <rect width="${size}" height="${size}" fill="white"/>
          <rect x="20" y="20" width="${size-40}" height="${size-40}" fill="black"/>
          <rect x="40" y="40" width="${size-80}" height="${size-80}" fill="white"/>
          <rect x="60" y="60" width="${size-120}" height="${size-120}" fill="black"/>
          <text x="${size/2}" y="${size-20}" text-anchor="middle" font-size="12" fill="white">QR</text>
        </svg>
      `)}`;
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      return '';
    }
  }, [value, size]);

  return (
    <div className={`flex flex-col items-center space-y-3 ${className}`}>
      <div className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-sm">
        <img
          src={qrCodeUrl}
          alt="Booking QR Code"
          className="block"
          style={{ width: size, height: size }}
        />
      </div>
      <p className="text-xs text-gray-600 text-center max-w-xs">
        Scan this QR code at the parking entry gate
      </p>
    </div>
  );
}

// Hook for generating booking QR data
export const useBookingQR = (bookingId: string, customerName: string, vehicleNumber: string) => {
  const qrData = useMemo(() => {
    return JSON.stringify({
      type: 'parking_booking',
      bookingId,
      customerName,
      vehicleNumber,
      timestamp: new Date().toISOString(),
      // Add checksum or signature for validation
      checksum: btoa(bookingId + customerName).substring(0, 8)
    });
  }, [bookingId, customerName, vehicleNumber]);

  return qrData;
};

// QR Scanner Component for real-time camera scanning
interface QRScannerProps {
  onScanSuccess: (result: string) => void;
  onScanError?: (error: string) => void;
  className?: string;
}

export function QRScanner({ onScanSuccess, onScanError, className = '' }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>('');
  const scannerRef = useRef<QrScanner | null>(null);

  useEffect(() => {
    // Check if camera is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Camera not supported on this device');
      return;
    }

    // Request camera permission and start scanning
    const startScanning = async () => {
      try {
        setIsScanning(true);

        const qrScanner = new QrScanner(
          videoRef.current!,
          (result) => {
            // Successfully scanned QR code
            onScanSuccess(result.data);
            qrScanner.stop();
            setIsScanning(false);
          },
          {
            onDecodeError: (err) => {
              // Ignore decode errors, just continue scanning
              console.debug('QR decode error:', err);
            },
            highlightScanRegion: true,
            highlightCodeOutline: true,
          }
        );

        scannerRef.current = qrScanner;

        // Start scanning
        await qrScanner.start();

        setHasCamera(true);
        setError('');

      } catch (err) {
        console.error('Camera access error:', err);
        setError('Camera access denied or unavailable');
        setHasCamera(false);
        setIsScanning(false);

        if (onScanError) {
          onScanError('Camera access failed');
        }
      }
    };

    startScanning();

    // Cleanup function
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop();
        scannerRef.current.destroy();
        scannerRef.current = null;
      }
    };
  }, [onScanSuccess, onScanError]);

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.stop();
      setIsScanning(false);
    }
  };

  const restartScanning = async () => {
    if (scannerRef.current) {
      try {
        setIsScanning(true);
        await scannerRef.current.start();
        setError('');
      } catch (err) {
        setError('Failed to restart camera');
        setIsScanning(false);
      }
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Camera Feed */}
      <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
          style={{ transform: 'scaleX(-1)' }} // Mirror the camera feed
        />

        {/* Scanning Overlay */}
        {isScanning && (
          <div className="absolute inset-0 border-2 border-blue-500 rounded-lg">
            <div className="absolute inset-4 border border-white rounded">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-16 h-16 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center">
            <div className="text-center text-white p-4">
              <div className="text-red-400 mb-2">⚠️</div>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* No Camera State */}
        {!hasCamera && !error && (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
            <div className="text-center text-white p-4">
              <div className="text-gray-400 mb-2">📷</div>
              <p className="text-sm">Initializing camera...</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-4 flex justify-center space-x-2">
        {isScanning && (
          <button
            onClick={stopScanning}
            className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
          >
            Stop Scanning
          </button>
        )}

        {!isScanning && hasCamera && (
          <button
            onClick={restartScanning}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
          >
            Start Scanning
          </button>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-3 text-center">
        <p className="text-xs text-gray-600">
          {isScanning
            ? "Position QR code within the frame"
            : "Click 'Start Scanning' to begin"
          }
        </p>
      </div>
    </div>
  );
}
