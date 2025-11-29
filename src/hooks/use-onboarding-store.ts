import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PersonalDetails {
  fullName: string;
  age: string;
  email: string;
  profilePhoto: string;
}

interface AddressDetails {
  street: string;
  city: string;
  state: string;
  pinCode: string;
  location: { lat: number; lng: number } | null;
}

interface PaymentSetup {
  paymentMethod: 'upi' | 'bank';
  upiId: string;
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  bankName: string;
}

interface KycDocuments {
  governmentId: File | null;
  addressProof: File | null;
  selfie: File | null;
  governmentIdPreview: string;
  addressProofPreview: string;
  selfiePreview: string;
}

interface OnboardingStore {
  // Personal Details
  personalDetails: PersonalDetails;
  setPersonalDetails: (data: Partial<PersonalDetails>) => void;

  // Address Details
  addressDetails: AddressDetails;
  setAddressDetails: (data: Partial<AddressDetails>) => void;

  // Payment Setup
  paymentSetup: PaymentSetup;
  setPaymentSetup: (data: Partial<PaymentSetup>) => void;

  // KYC Documents
  kycDocuments: KycDocuments;
  setKycDocuments: (data: Partial<KycDocuments>) => void;

  // Progress Tracking
  completedSteps: {
    personal: boolean;
    address: boolean;
    payment: boolean;
    verification: boolean;
  };
  setStepCompleted: (step: 'personal' | 'address' | 'payment' | 'verification', completed: boolean) => void;

  // Current Step
  currentStep: number;
  setCurrentStep: (step: number) => void;

  // Actions
  reset: () => void;
  isStepValid: (step: number) => boolean;
  canAccessStep: (step: number) => boolean;
}

const initialState = {
  personalDetails: {
    fullName: "",
    age: "",
    email: "",
    profilePhoto: "",
  },
  addressDetails: {
    street: "",
    city: "",
    state: "",
    pinCode: "",
    location: null,
  },
  paymentSetup: {
    paymentMethod: 'upi' as const,
    upiId: "",
    accountNumber: "",
    ifscCode: "",
    accountHolderName: "",
    bankName: "",
  },
  kycDocuments: {
    governmentId: null,
    addressProof: null,
    selfie: null,
    governmentIdPreview: "",
    addressProofPreview: "",
    selfiePreview: "",
  },
  completedSteps: {
    personal: false,
    address: false,
    payment: false,
    verification: false,
  },
  currentStep: 1,
};

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setPersonalDetails: (data) =>
        set((state) => ({
          personalDetails: { ...state.personalDetails, ...data },
        })),

      setAddressDetails: (data) =>
        set((state) => ({
          addressDetails: { ...state.addressDetails, ...data },
        })),

      setPaymentSetup: (data) =>
        set((state) => ({
          paymentSetup: { ...state.paymentSetup, ...data },
        })),

      setKycDocuments: (data) =>
        set((state) => ({
          kycDocuments: { ...state.kycDocuments, ...data },
        })),

      setStepCompleted: (step, completed) =>
        set((state) => ({
          completedSteps: { ...state.completedSteps, [step]: completed },
        })),

      setCurrentStep: (step) => set({ currentStep: step }),

      reset: () => set(initialState),

      isStepValid: (step) => {
        const state = get();
        switch (step) {
          case 1:
            return !!(state.personalDetails.fullName.trim().length >= 2 &&
                     state.personalDetails.email.includes('@'));
          case 2:
            return !!(state.addressDetails.street.trim() &&
                     state.addressDetails.city.trim() &&
                     state.addressDetails.state &&
                     state.addressDetails.pinCode.length === 6 &&
                     state.addressDetails.location !== null);
          case 3:
            const payment = state.paymentSetup;
            if (payment.paymentMethod === 'upi') {
              return !!payment.upiId.includes('@');
            } else {
              return !!(payment.accountNumber.length >= 9 &&
                       payment.ifscCode.length === 11 &&
                       payment.accountHolderName.trim() &&
                       payment.bankName.trim());
            }
          case 4:
            return !!(state.kycDocuments.governmentIdPreview &&
                     state.kycDocuments.selfiePreview);
          default:
            return false;
        }
      },

      canAccessStep: (step) => {
        const state = get();
        if (step === 1) return true;
        if (step === 2) return state.completedSteps.personal;
        if (step === 3) return state.completedSteps.personal && state.completedSteps.address;
        if (step === 4) return state.completedSteps.personal && state.completedSteps.address && state.completedSteps.payment;
        return false;
      },
    }),
    {
      name: "parkconnect-onboarding",
      // Only persist these fields, not File objects
      partialize: (state) => ({
        personalDetails: {
          ...state.personalDetails,
          // Don't persist File objects
        },
        addressDetails: state.addressDetails,
        paymentSetup: state.paymentSetup,
        kycDocuments: {
          ...state.kycDocuments,
          governmentId: null,
          addressProof: null,
          selfie: null,
          // Keep previews for display
        },
        completedSteps: state.completedSteps,
        currentStep: state.currentStep,
      }),
    }
  )
);
