import { useState, useEffect, useCallback, useRef } from 'react';

interface OnboardingData {
  personalDetails?: {
    fullName?: string;
    email?: string;
    age?: number;
    profilePhoto?: string; // base64 data URL
  };
  addressSetup?: {
    street?: string;
    city?: string;
    state?: string;
    pinCode?: string;
    location?: { lat: number; lng: number };
  };
  paymentSetup?: {
    paymentMethod?: 'upi' | 'bank';
    upiId?: string;
    accountNumber?: string;
    ifscCode?: string;
    accountHolderName?: string;
    bankName?: string;
  };
  kycDocuments?: Array<{
    type: 'government_id' | 'address_proof' | 'selfie';
    file?: string; // base64 data URL
    preview?: string;
    status: 'pending' | 'uploaded';
  }>;
}

const STORAGE_KEY = 'parkconnect_onboarding_data';
const STORAGE_TIMESTAMP_KEY = 'parkconnect_onboarding_timestamp';

// Clear data older than 24 hours
const EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export function useOnboardingPersistence() {
  const [formData, setFormData] = useState<OnboardingData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Convert File to base64 data URL
  const fileToBase64 = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }, []);

  // Load data from localStorage
  const loadData = useCallback(() => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      const storedTimestamp = localStorage.getItem(STORAGE_TIMESTAMP_KEY);

      if (storedData && storedTimestamp) {
        const timestamp = parseInt(storedTimestamp, 10);
        const now = Date.now();

        // Check if data is expired (older than 24 hours)
        if (now - timestamp > EXPIRY_TIME) {
          // Clear expired data
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(STORAGE_TIMESTAMP_KEY);
          localStorage.removeItem('parkconnect_completed_steps');
          setFormData({});
          setIsLoading(false);
          return;
        }

        const parsedData = JSON.parse(storedData);
        setFormData(parsedData);
      } else {
        console.log('Persistence: No stored data found');
        setFormData({});
      }
    } catch (error) {
      console.error('Error loading onboarding data:', error);
      // Clear corrupted data
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_TIMESTAMP_KEY);
    }

    setIsLoading(false);
  }, []);

  // Save data to localStorage
  const saveData = useCallback((data: OnboardingData) => {
    try {
      const timestamp = Date.now().toString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      localStorage.setItem(STORAGE_TIMESTAMP_KEY, timestamp);
    } catch (error) {
      console.error('Error saving onboarding data:', error);
    }
  }, []);

  // Save step data with file handling
  const saveStepData = useCallback(async (stepKey: keyof OnboardingData, stepData: any) => {
    const newFormData = { ...formData };

    // Handle file uploads by converting to base64
    if (stepKey === 'personalDetails' && stepData.profilePhoto instanceof File) {
      try {
        const base64Data = await fileToBase64(stepData.profilePhoto);
        stepData.profilePhoto = base64Data;
      } catch (error) {
        console.error('Error converting profile photo to base64:', error);
      }
    }

    // Handle KYC documents
    if (stepKey === 'kycDocuments' && Array.isArray(stepData)) {
      for (const doc of stepData) {
        if (doc.file instanceof File) {
          try {
            const base64Data = await fileToBase64(doc.file);
            doc.file = base64Data;
            doc.preview = base64Data; // Use same data for preview
          } catch (error) {
            console.error(`Error converting ${doc.type} to base64:`, error);
          }
        }
      }
    }

    newFormData[stepKey] = stepData;
    setFormData(newFormData);
    saveData(newFormData);
  }, [formData, saveData, fileToBase64]);

  // Debounced auto-save for real-time updates
  const debouncedSave = useCallback((stepKey: keyof OnboardingData, stepData: any) => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set auto-saving indicator
    setIsAutoSaving(true);

    // Set new timer for 500ms delay
    debounceTimerRef.current = setTimeout(async () => {
      await saveStepData(stepKey, stepData);
      setIsAutoSaving(false);
    }, 500);
  }, [saveStepData]);

  // Immediate save for navigation (no debounce)
  const saveOnNavigate = useCallback(async (stepKey: keyof OnboardingData, stepData: any) => {
    // Clear any pending debounced save
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    await saveStepData(stepKey, stepData);
    setIsAutoSaving(false);
  }, [saveStepData]);

  // Clear all data
  const clearData = useCallback(() => {
    // Clear any pending debounced save
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    setFormData({});
    setIsAutoSaving(false);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_TIMESTAMP_KEY);
    localStorage.removeItem('parkconnect_completed_steps');
  }, []);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    formData,
    isLoading,
    isAutoSaving,
    saveStepData,
    debouncedSave,
    saveOnNavigate,
    clearData,
  };
}
