import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertTriangle, Car } from 'lucide-react';

interface ParkingTimerProps {
  startTime: Date;
  endTime: Date;
  bookedDuration: number; // in hours
  hourlyRate: number;
  vehicleNumber: string;
  customerName: string;
  className?: string;
}

export default function ParkingTimer({
  startTime,
  endTime,
  bookedDuration,
  hourlyRate,
  vehicleNumber,
  customerName,
  className = ''
}: ParkingTimerProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isOvertime, setIsOvertime] = useState(false);
  const [overtimeMinutes, setOvertimeMinutes] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const elapsed = (currentTime.getTime() - startTime.getTime()) / (1000 * 60); // minutes
    const totalBookedMinutes = bookedDuration * 60;
    const remaining = totalBookedMinutes - elapsed;

    setTimeRemaining(Math.max(0, remaining));
    setIsOvertime(elapsed > totalBookedMinutes);

    if (elapsed > totalBookedMinutes) {
      setOvertimeMinutes(elapsed - totalBookedMinutes);
    } else {
      setOvertimeMinutes(0);
    }
  }, [currentTime, startTime, bookedDuration]);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    const secs = Math.floor((minutes % 1) * 60);

    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
  };

  const getTimeStatus = () => {
    if (isOvertime) {
      return { color: 'bg-red-100 text-red-800 border-red-200', icon: AlertTriangle, text: 'Overtime' };
    } else if (timeRemaining < 15) { // Less than 15 minutes remaining
      return { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: AlertTriangle, text: 'Ending Soon' };
    } else {
      return { color: 'bg-green-100 text-green-800 border-green-200', icon: Clock, text: 'Active' };
    }
  };

  const status = getTimeStatus();
  const StatusIcon = status.icon;

  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Car className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-900">{vehicleNumber}</span>
        </div>
        <Badge className={`${status.color} text-xs font-medium px-2 py-1`}>
          <StatusIcon className="w-3 h-3 mr-1" />
          {status.text}
        </Badge>
      </div>

      <div className="text-center">
        <div className={`text-2xl font-bold mb-1 ${isOvertime ? 'text-red-600' : 'text-gray-900'}`}>
          {isOvertime ? (
            <span>+{formatTime(overtimeMinutes)}</span>
          ) : (
            <span>{formatTime(timeRemaining)}</span>
          )}
        </div>

        <div className="text-xs text-gray-600">
          {isOvertime ? 'Overtime Duration' : 'Time Remaining'}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="text-xs text-gray-600 space-y-1">
          <div className="flex justify-between">
            <span>Customer:</span>
            <span className="font-medium">{customerName}</span>
          </div>
          <div className="flex justify-between">
            <span>Started:</span>
            <span className="font-medium">{startTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="flex justify-between">
            <span>Booked:</span>
            <span className="font-medium">{bookedDuration}h</span>
          </div>
        </div>
      </div>

      {isOvertime && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs text-red-800 font-medium">
            ⚠️ Overtime charges: ₹{Math.ceil(overtimeMinutes / 60) * hourlyRate}/hour
          </p>
        </div>
      )}

      {!isOvertime && timeRemaining < 15 && (
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800 font-medium">
            ⏰ Parking time ending soon
          </p>
        </div>
      )}
    </div>
  );
}

// Hook for managing real-time session updates
export const useSessionTimer = (sessionId: string) => {
  const [session, setSession] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isOvertime, setIsOvertime] = useState(false);

  // This would integrate with the parking sessions store
  // For now, just return mock values
  return {
    session,
    timeRemaining,
    isOvertime,
    overtimeMinutes: 0,
    extraCharges: 0
  };
};
