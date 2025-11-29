// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'renter' | 'host' | 'admin';
  avatar?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Host-specific Types
export interface HostProfile {
  id: string;
  userId: string;
  personalDetails: HostPersonalDetails;
  address: HostAddress;
  paymentInfo: HostPaymentInfo;
  kycStatus: KycStatus;
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface HostPersonalDetails {
  fullName: string;
  age?: number;
  email: string;
  profilePhoto?: string;
}

export interface HostAddress {
  street: string;
  city: string;
  state: string;
  pinCode: string;
  location: Location;
}

export interface HostPaymentInfo {
  paymentMethod: 'upi' | 'bank';
  upiId?: string;
  bankDetails?: BankDetails;
}

export interface BankDetails {
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  bankName: string;
}

export interface KycDocument {
  id: string;
  type: 'government_id' | 'address_proof' | 'selfie';
  fileUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt: Date;
  reviewedAt?: Date;
  rejectionReason?: string;
}

export type KycStatus = 'not_started' | 'pending' | 'approved' | 'rejected' | 'needs_reupload';

// Parking Space Types
export interface ParkingSpace {
  id: string;
  hostId: string;
  title: string;
  description: string;
  address: Address;
  location: Location;
  images: string[];
  features: ParkingFeature[];
  pricing: Pricing;
  availability: Availability[];
  rating: number;
  reviewCount: number;
  status: 'active' | 'inactive' | 'pending';
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface ParkingFeature {
  id: string;
  name: string;
  icon: string;
  available: boolean;
}

export interface Pricing {
  hourly: number;
  daily: number;
  monthly: number;
  currency: string;
}

export interface Availability {
  day: string; // 'monday', 'tuesday', etc.
  startTime: string; // '08:00'
  endTime: string; // '18:00'
}

// Booking Types
export interface Booking {
  id: string;
  userId: string;
  spaceId: string;
  startTime: Date;
  endTime: Date;
  totalPrice: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: Date;
  updatedAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'renter' | 'host';
}

export interface BookingForm {
  spaceId: string;
  startTime: Date;
  endTime: Date;
  specialRequests?: string;
}

// Component Props Types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export interface CardProps {
  title?: string;
  description?: string;
  image?: string;
  children?: React.ReactNode;
  className?: string;
}

// Navigation Types
export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
}

// Search Types
export interface SearchFilters {
  location?: string;
  date?: Date;
  startTime?: string;
  endTime?: string;
  priceRange?: [number, number];
  features?: string[];
}

export interface SearchResult {
  spaces: ParkingSpace[];
  total: number;
  filters: SearchFilters;
}

// Theme Types
export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeConfig {
  mode: ThemeMode;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
  };
}
