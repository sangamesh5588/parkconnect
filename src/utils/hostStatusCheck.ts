import { supabase } from './supabase';

export type HostStatus =
  | 'no_profile'           // No host_onboarding record
  | 'onboarding_started'   // Onboarding in progress
  | 'submitted'            // Onboarding submitted, awaiting approval
  | 'approved'             // Approved, can access dashboard
  | 'rejected';            // Rejected, needs resubmission

export interface HostStatusResult {
  status: HostStatus;
  currentStep?: number;
  redirectTo: string;
  data?: any;
}

/**
 * THE MASTER HOST STATUS CHECK
 *
 * This is the single source of truth for host status and redirects.
 * Called from:
 * - Login callback
 * - "Become Host" button click
 * - Dashboard page load
 * - Onboarding page load
 * - Any protected host route
 */
export async function checkHostStatus(userId: string): Promise<HostStatusResult> {
  try {
    // Query host_onboarding table
    const { data, error } = await supabase
      .from('host_onboarding')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows, which is fine
      console.error('Error checking host status:', error);
      throw error;
    }

    // STATE 1: No host_profile exists
    if (!data) {
      return {
        status: 'no_profile',
        redirectTo: '/host/onboarding',
        currentStep: 1
      };
    }

    // STATE 4: Host Approved
    if (data.kyc_status === 'approved' && data.is_completed) {
      return {
        status: 'approved',
        redirectTo: '/host/dashboard',
        data
      };
    }

    // STATE 5: Rejected
    if (data.kyc_status === 'rejected') {
      return {
        status: 'rejected',
        redirectTo: '/host/onboarding/approval',
        data
      };
    }

    // STATE 3: Onboarding submitted (waiting for approval)
    if (data.kyc_status === 'pending' && data.is_completed) {
      return {
        status: 'submitted',
        redirectTo: '/host/onboarding/approval',
        data
      };
    }

    // STATE 2: Onboarding in progress
    if (!data.is_completed) {
      return {
        status: 'onboarding_started',
        redirectTo: '/host/onboarding',
        currentStep: data.current_step || 1,
        data
      };
    }

    // Default fallback
    return {
      status: 'no_profile',
      redirectTo: '/host/onboarding',
      currentStep: 1
    };

  } catch (err: any) {
    console.error('Unexpected error in checkHostStatus:', err);
    // On error, default to starting onboarding
    return {
      status: 'no_profile',
      redirectTo: '/host/onboarding',
      currentStep: 1
    };
  }
}

/**
 * Check if user can access onboarding page
 * Returns false if onboarding is already submitted or approved
 */
export async function canAccessOnboarding(userId: string): Promise<boolean> {
  const result = await checkHostStatus(userId);
  return result.status === 'no_profile' || result.status === 'onboarding_started';
}

/**
 * Check if user can access dashboard
 * Returns true only if approved
 */
export async function canAccessDashboard(userId: string): Promise<boolean> {
  const result = await checkHostStatus(userId);
  return result.status === 'approved';
}

/**
 * Get the correct redirect path based on current status
 */
export async function getHostRedirectPath(userId: string): Promise<string> {
  const result = await checkHostStatus(userId);
  return result.redirectTo;
}
