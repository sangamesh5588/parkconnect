import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Smartphone, ArrowRight, ArrowLeft, Loader2, Shield, CheckCircle } from "lucide-react";
import { useOnboardingStore } from "@/hooks/use-onboarding-store";

interface HostPaymentSetupProps {
  onNext: () => void;
  onPrevious: () => void;
  isLastStep: boolean;
  onComplete: () => void;
}

export default function HostPaymentSetup({
  onNext,
  onPrevious,
  isLastStep,
  onComplete
}: HostPaymentSetupProps) {
  const { paymentSetup, setPaymentSetup } = useOnboardingStore();

  // Local state for form interactions
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (paymentSetup.paymentMethod === 'upi') {
      if (!paymentSetup.upiId.trim()) {
        newErrors.upiId = "UPI ID is required";
      } else if (!paymentSetup.upiId.includes('@')) {
        newErrors.upiId = "Please enter a valid UPI ID (e.g., name@paytm)";
      }
    } else if (paymentSetup.paymentMethod === 'bank') {
      if (!paymentSetup.accountNumber.trim()) {
        newErrors.accountNumber = "Account number is required";
      } else if (!/^[0-9]{9,18}$/.test(paymentSetup.accountNumber.replace(/\s/g, ''))) {
        newErrors.accountNumber = "Account number must be 9-18 digits";
      }

      if (!paymentSetup.ifscCode.trim()) {
        newErrors.ifscCode = "IFSC code is required";
      } else if (!/^[A-Z]{4}[0-9]{7}$/.test(paymentSetup.ifscCode.toUpperCase())) {
        newErrors.ifscCode = "Please enter a valid IFSC code";
      }

      if (!paymentSetup.accountHolderName.trim()) {
        newErrors.accountHolderName = "Account holder name is required";
      }

      if (!paymentSetup.bankName.trim()) {
        newErrors.bankName = "Bank name is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsLoading(false);
    onNext();
  };

  const clearFieldError = (field: string) => {
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Payment Method Selection */}
        <div className="space-y-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CreditCard className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-gray-900">Choose Payment Method</h3>
              </div>
              <p className="text-sm text-gray-600">Select how you'd like to receive your earnings</p>
            </div>

          <div className="space-y-3">
            <div
              className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all ${
                paymentSetup.paymentMethod === 'upi'
                  ? 'border-primary bg-secondary shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
              onClick={() => setPaymentSetup({ ...paymentSetup, paymentMethod: 'upi' })}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setPaymentSetup({ ...paymentSetup, paymentMethod: 'upi' });
                }
              }}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  paymentSetup.paymentMethod === 'upi'
                    ? 'border-primary bg-primary'
                    : 'border-gray-300'
                }`}>
                  {paymentSetup.paymentMethod === 'upi' && (
                    <div className="w-2 h-2 rounded-full bg-primary-foreground"></div>
                  )}
                </div>
                <div className="flex items-center space-x-3 flex-1">
                  <div className={`p-2 rounded-lg ${paymentSetup.paymentMethod === 'upi' ? 'bg-muted' : 'bg-gray-100'}`}>
                    <Smartphone className={`w-5 h-5 ${paymentSetup.paymentMethod === 'upi' ? 'text-primary' : 'text-gray-600'}`} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">UPI Payment</div>
                    <div className="text-sm text-gray-600">Instant transfers to your UPI app</div>
                  </div>
                </div>
                {paymentSetup.paymentMethod === 'upi' && (
                  <CheckCircle className="w-5 h-5 text-primary" />
                )}
              </div>
            </div>

            <div
              className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all ${
                paymentSetup.paymentMethod === 'bank'
                  ? 'border-primary bg-secondary shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
              onClick={() => setPaymentSetup({ ...paymentSetup, paymentMethod: 'bank' })}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setPaymentSetup({ ...paymentSetup, paymentMethod: 'bank' });
                }
              }}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  paymentSetup.paymentMethod === 'bank'
                    ? 'border-primary bg-primary'
                    : 'border-gray-300'
                }`}>
                  {paymentSetup.paymentMethod === 'bank' && (
                    <div className="w-2 h-2 rounded-full bg-primary-foreground"></div>
                  )}
                </div>
                <div className="flex items-center space-x-3 flex-1">
                  <div className={`p-2 rounded-lg ${paymentSetup.paymentMethod === 'bank' ? 'bg-muted' : 'bg-gray-100'}`}>
                    <CreditCard className={`w-5 h-5 ${paymentSetup.paymentMethod === 'bank' ? 'text-primary' : 'text-gray-600'}`} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Bank Transfer</div>
                    <div className="text-sm text-gray-600">Direct deposit to your bank account</div>
                  </div>
                </div>
                {paymentSetup.paymentMethod === 'bank' && (
                  <CheckCircle className="w-5 h-5 text-primary" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* UPI Form */}
        {paymentSetup.paymentMethod === 'upi' && (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="upiId" className="text-sm font-semibold text-gray-900">
                UPI ID *
              </Label>
              <Input
                id="upiId"
                type="text"
                placeholder="yourname@paytm"
                value={paymentSetup.upiId}
                onChange={(e) => {
                  setPaymentSetup({ ...paymentSetup, upiId: e.target.value });
                  clearFieldError('upiId');
                }}
                className={`h-12 text-base ${errors.upiId ? 'border-red-300 focus:border-red-500' : ''}`}
              />
              {errors.upiId && (
                <p className="text-sm text-red-600">{errors.upiId}</p>
              )}
              <p className="text-xs text-gray-500">Example: yourname@paytm, yourname@okhdfcbank</p>
            </div>
          </div>
        )}

        {/* Bank Account Form */}
        {paymentSetup.paymentMethod === 'bank' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="accountNumber" className="text-sm font-semibold text-gray-900">
                  Account Number *
                </Label>
                <Input
                  id="accountNumber"
                  type="text"
                  placeholder="123456789012"
                  value={paymentSetup.accountNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 18);
                    setPaymentSetup({ ...paymentSetup, accountNumber: value });
                    clearFieldError('accountNumber');
                  }}
                  className={`h-12 text-base ${errors.accountNumber ? 'border-red-300 focus:border-red-500' : ''}`}
                />
                {errors.accountNumber && (
                  <p className="text-sm text-red-600">{errors.accountNumber}</p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="ifscCode" className="text-sm font-semibold text-gray-900">
                  IFSC Code *
                </Label>
                <Input
                  id="ifscCode"
                  type="text"
                  placeholder="HDFC0001234"
                  value={paymentSetup.ifscCode}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase().slice(0, 11);
                    setPaymentSetup({ ...paymentSetup, ifscCode: value });
                    clearFieldError('ifscCode');
                  }}
                  className={`h-12 text-base ${errors.ifscCode ? 'border-red-300 focus:border-red-500' : ''}`}
                />
                {errors.ifscCode && (
                  <p className="text-sm text-red-600">{errors.ifscCode}</p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="accountHolderName" className="text-sm font-semibold text-gray-900">
                Account Holder Name *
              </Label>
              <Input
                id="accountHolderName"
                type="text"
                placeholder="John Doe"
                value={paymentSetup.accountHolderName}
                onChange={(e) => {
                  setPaymentSetup({ ...paymentSetup, accountHolderName: e.target.value });
                  clearFieldError('accountHolderName');
                }}
                className={`h-12 text-base ${errors.accountHolderName ? 'border-red-300 focus:border-red-500' : ''}`}
              />
              {errors.accountHolderName && (
                <p className="text-sm text-red-600">{errors.accountHolderName}</p>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="bankName" className="text-sm font-semibold text-gray-900">
                Bank Name *
              </Label>
              <Input
                id="bankName"
                type="text"
                placeholder="HDFC Bank"
                value={paymentSetup.bankName}
                onChange={(e) => {
                  setPaymentSetup({ ...paymentSetup, bankName: e.target.value });
                  clearFieldError('bankName');
                }}
                className={`h-12 text-base ${errors.bankName ? 'border-red-300 focus:border-red-500' : ''}`}
              />
              {errors.bankName && (
                <p className="text-sm text-red-600">{errors.bankName}</p>
              )}
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="p-4 bg-secondary border border-border rounded-xl">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-primary mb-1">Secure & Encrypted</h4>
              <p className="text-sm text-primary/80 leading-relaxed">
                Your payment details are encrypted and stored securely. We only use this information for processing payouts.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="pt-6 border-t border-gray-100">
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onPrevious}
              className="flex-1 h-14 border-gray-300 hover:bg-gray-50 text-gray-700"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>

            <Button
              type="submit"
              className="flex-1 h-14 bg-primary hover:bg-primary/90 text-primary-foreground text-base font-semibold rounded-xl shadow-sm"
              disabled={isLoading || !((paymentSetup.paymentMethod === 'upi' && paymentSetup.upiId.trim() && !errors.upiId) ||
                        (paymentSetup.paymentMethod === 'bank' && paymentSetup.accountNumber.trim() && paymentSetup.ifscCode.trim() &&
                         paymentSetup.accountHolderName.trim() && paymentSetup.bankName.trim() && !Object.keys(errors).length))}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
