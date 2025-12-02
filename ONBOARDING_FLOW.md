# Host Onboarding Flow Documentation

## Overview
Complete production-ready host onboarding system with admin approval workflow integrated with Supabase.

## Flow Architecture

```
User Signs Up as Host
         ↓
   Login/OAuth
         ↓
Check Onboarding Status
         ↓
   ┌─────┴─────┐
   │           │
Complete   Incomplete
   │           │
   │     ┌─────┴─────┐
   │     │ Step 1-4  │
   │     │ Onboarding│
   │     └─────┬─────┘
   │           │
   │     Submit KYC
   │           ↓
   │    Approval Page
   │     (Real-time)
   │           ↓
   │    ┌─────┴─────┐
   │    │           │
   │ Approved   Pending
   │    │           │
   └────┴──→ Dashboard
```

## 4-Step Onboarding Process

### Step 1: Personal Details
- **Fields**: Full Name, Email, Phone (using age field temporarily), Profile Photo
- **Validation**: Name min 2 chars, valid email format
- **Storage**: Data saved to `host_onboarding` table, photo to `profile-photos` bucket
- **Auto-save**: Progress saved on "Continue"

### Step 2: Address & Location
- **Fields**: Street, City, State, PIN Code, GPS Coordinates, Landmark
- **Validation**: All fields required, PIN must be 6 digits, GPS location required
- **Storage**: Address and coordinates saved to database
- **Auto-save**: Progress saved on "Continue"

### Step 3: Payment Setup
- **Methods**: UPI or Bank Transfer
- **UPI Fields**: UPI ID (format: name@bank)
- **Bank Fields**: Account Number, IFSC Code, Account Holder Name, Bank Name
- **Validation**:
  - UPI: Must contain '@'
  - Bank: Account number min 9 digits, IFSC exactly 11 chars
- **Storage**: Payment details saved to database
- **Auto-save**: Progress saved on "Continue"

### Step 4: KYC Verification
- **Required Documents**:
  - Government ID (Aadhaar Card) - Required
  - Selfie with ID - Required
  - Address Proof (PAN Card) - Optional
- **File Limits**: 5MB per file, JPG/PNG/PDF formats
- **Storage**:
  - Files uploaded to `kyc-documents` bucket (private)
  - Document URLs saved to `host_onboarding` table
  - `kyc_status` set to 'pending'
- **On Complete**: Redirects to approval waiting page

## Approval Page Features

### Production Flow (No Demo Mode)
1. **Real-time Status Checking**: Uses Supabase real-time subscriptions
2. **Status Updates**: Automatically detects when admin approves/rejects
3. **Auto-redirect**: Redirects to dashboard when approved
4. **Clear Communication**: Shows detailed review process steps

### What Admins Review
1. **Location Verification**: Parking location accuracy via GPS
2. **Document Review**: KYC documents and compliance check
3. **Email Notification**: User notified within 24-48 hours
4. **Dashboard Access**: Granted only after admin approval

### Status States
- **Pending**: Application submitted, under review (default)
- **Approved**: Admin verified, auto-redirect to dashboard
- **Rejected**: Needs more info, show email contact

## Database Schema

### `host_onboarding` Table
```sql
- id: UUID (primary key)
- user_id: UUID (foreign key to auth.users)
- full_name: TEXT
- email: TEXT
- phone_number: TEXT
- profile_photo_url: TEXT
- address_line1: TEXT
- city: TEXT
- state: TEXT
- latitude: DECIMAL(10, 8)
- longitude: DECIMAL(11, 8)
- landmark: TEXT
- bank_account_number: TEXT
- bank_ifsc_code: TEXT
- upi_id: TEXT
- aadhaar_number: TEXT
- pan_number: TEXT
- aadhaar_document_url: TEXT
- pan_document_url: TEXT
- kyc_status: TEXT (pending/approved/rejected)
- current_step: INTEGER (1-4)
- is_completed: BOOLEAN
- completed_at: TIMESTAMPTZ
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

### Storage Buckets
1. **kyc-documents** (Private)
   - 5MB file limit
   - Formats: JPG, PNG, PDF
   - RLS: Users can only access their own documents

2. **profile-photos** (Public)
   - 5MB file limit
   - Formats: JPG, PNG
   - RLS: Anyone can view, users can only modify their own

## Testing the Flow

### 1. Complete Host Signup
```
1. Navigate to /become-host
2. Click "Get Started" or "List Your Space"
3. Sign up with email or Google OAuth
4. Complete all 4 onboarding steps
5. Upload KYC documents
6. Click "Complete Setup"
```

### 2. Check Approval Status
```
- User lands on /host/onboarding/approval
- Page shows "Under Review" status
- Real-time listener active for status changes
```

### 3. Simulate Admin Approval (For Testing)
```javascript
// Open browser console on approval page
// Get user ID from auth context or Supabase dashboard

// Method 1: Using SQL in Supabase Dashboard
UPDATE host_onboarding
SET kyc_status = 'approved',
    is_completed = true,
    completed_at = NOW()
WHERE user_id = 'your-user-id-here';

// Method 2: Using browser console (if you export the function)
import { approveHostApplication } from './utils/onboardingService';
await approveHostApplication('user-id-here', 'approved');
```

### 4. Verify Auto-redirect
```
- Status changes to 'approved'
- Page shows "Application Approved! 🎉"
- Auto-redirects to /host/dashboard after 2 seconds
```

## Key Files

### Onboarding Components
- `/src/app/host/onboarding/page.tsx` - Main onboarding orchestrator
- `/src/components/onboarding/HostPersonalDetails.tsx` - Step 1 form
- `/src/components/onboarding/HostAddressSetup.tsx` - Step 2 form
- `/src/components/onboarding/HostPaymentSetup.tsx` - Step 3 form
- `/src/components/onboarding/HostKycVerification.tsx` - Step 4 form
- `/src/hooks/use-onboarding-store.ts` - Zustand store for local state

### Approval Page
- `/src/app/host/onboarding/approval/page.tsx` - Real-time approval status

### Backend Integration
- `/src/utils/onboardingService.ts` - Supabase service functions

### Authentication Flow
- `/src/components/auth/HostAuthModal.tsx` - Host login with onboarding check
- `/src/app/(auth)/callback/page.tsx` - OAuth callback with onboarding redirect

## Security Features

1. **Row Level Security (RLS)**: Users can only access their own data
2. **Private KYC Storage**: Documents not publicly accessible
3. **Email Verification**: Required before onboarding
4. **User Type Separation**: Host and renter accounts kept separate
5. **Auth Guards**: Protected routes require authentication

## Production Checklist

- [x] Remove "Skip for Demo" button
- [x] Real-time approval status updates
- [x] Auto-redirect on approval
- [x] Detailed review process communication
- [x] File upload with validation
- [x] Progress tracking and resume capability
- [x] One-time onboarding (no repeat)
- [x] Database persistence at each step
- [x] Admin approval workflow ready
- [ ] Email notifications (configure in production)
- [ ] Admin dashboard for approvals (separate feature)

## Next Steps for Production

1. **Email Service**:
   - Configure SendGrid/AWS SES
   - Send approval/rejection emails
   - Send status update notifications

2. **Admin Dashboard**:
   - Create admin panel at `/admin`
   - View pending applications
   - Review KYC documents
   - Approve/reject with one click

3. **Analytics**:
   - Track onboarding completion rate
   - Monitor drop-off points
   - Average time to complete

4. **Enhancements**:
   - SMS verification for phone
   - Map integration for Step 2
   - Document OCR for auto-fill
   - Progress percentage indicator

---

**Status**: ✅ Production Ready (Email & Admin Dashboard pending)
**Last Updated**: December 1, 2025
