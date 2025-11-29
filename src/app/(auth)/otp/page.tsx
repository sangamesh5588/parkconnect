import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function OTPVerification() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  // Timer for resend OTP
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits are entered
    if (newOtp.every(digit => digit !== '') && index === 5) {
      handleVerifyOTP(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = (otpCode: string) => {
    // TODO: Implement OTP verification logic
    console.log("Verifying OTP:", otpCode);

    // Mock successful verification
    if (otpCode === '123456') {
      navigate('/renter/search');
    }
  };

  const handleResendOTP = () => {
    setTimeLeft(30);
    // TODO: Implement resend OTP logic
    console.log("Resending OTP");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md card-clean p-8 space-y-6">
        {/* Back Button */}
        <Link to="/login" className="inline-flex items-center text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Link>

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-responsive-2xl font-bold">Verify Your Phone</h1>
          <p className="text-muted-foreground">
            Enter the 6-digit code sent to +91 XXXXXXXX42
          </p>
        </div>

        {/* OTP Input */}
        <div className="flex justify-center gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-xl font-semibold border-2 border-input rounded-lg focus:border-primary focus:ring-0 bg-background"
            />
          ))}
        </div>

        {/* Verify Button */}
        <Button
          onClick={() => handleVerifyOTP(otp.join(''))}
          disabled={otp.some(digit => digit === '')}
          className="w-full btn-primary touch-target"
        >
          Verify OTP
        </Button>

        {/* Resend Option */}
        <div className="text-center">
          {timeLeft > 0 ? (
            <p className="text-muted-foreground">
              Resend OTP in {timeLeft} seconds
            </p>
          ) : (
            <button
              onClick={handleResendOTP}
              className="text-primary hover:underline font-medium"
            >
              Resend OTP
            </button>
          )}
        </div>

        {/* Help Text */}
        <p className="text-center text-responsive-sm text-muted-foreground">
          Didn't receive the code? Check your spam folder or{" "}
          <Link to="/support" className="underline hover:text-foreground">
            contact support
          </Link>
        </p>
      </Card>
    </div>
  );
}
