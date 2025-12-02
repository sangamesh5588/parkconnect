import { supabase } from './supabase';

export interface OnboardingData {
  full_name?: string;
  email?: string;
  phone_number?: string;
  profile_photo_url?: string;
  address_line1?: string;
  city?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
  landmark?: string;
  bank_account_number?: string;
  bank_ifsc_code?: string;
  upi_id?: string;
  aadhaar_number?: string;
  pan_number?: string;
  aadhaar_document_url?: string;
  pan_document_url?: string;
  current_step?: number;
  is_completed?: boolean;
}

/**
 * Upload a file to Supabase Storage
 * @param file File to upload
 * @param bucket Storage bucket name
 * @param path Path in the bucket
 * @returns Public URL of the uploaded file
 */
export async function uploadFile(
  file: File,
  bucket: string,
  path: string
): Promise<{ url: string | null; error: string | null }> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error('Upload error:', error);
      return { url: null, error: error.message };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return { url: publicUrl, error: null };
  } catch (err: any) {
    console.error('Unexpected error during file upload:', err);
    return { url: null, error: err.message || 'Failed to upload file' };
  }
}

/**
 * Get or create onboarding record for a user
 */
export async function getOrCreateOnboarding(userId: string) {
  try {
    // Try to get existing record
    const { data: existing, error: fetchError } = await supabase
      .from('host_onboarding')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 is "no rows returned", which is fine
      throw fetchError;
    }

    if (existing) {
      return { data: existing, error: null };
    }

    // Create new record if doesn't exist
    const { data: newRecord, error: createError } = await supabase
      .from('host_onboarding')
      .insert({
        user_id: userId,
        current_step: 1,
        is_completed: false
      })
      .select()
      .single();

    if (createError) {
      throw createError;
    }

    return { data: newRecord, error: null };
  } catch (err: any) {
    console.error('Error getting or creating onboarding:', err);
    return { data: null, error: err.message || 'Failed to get onboarding data' };
  }
}

/**
 * Update onboarding data for a user
 */
export async function updateOnboarding(
  userId: string,
  data: OnboardingData
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase
      .from('host_onboarding')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    return { success: true, error: null };
  } catch (err: any) {
    console.error('Error updating onboarding:', err);
    return { success: false, error: err.message || 'Failed to update onboarding data' };
  }
}

/**
 * Mark onboarding as completed
 */
export async function completeOnboarding(userId: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase
      .from('host_onboarding')
      .update({
        is_completed: true,
        completed_at: new Date().toISOString(),
        current_step: 4
      })
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    return { success: true, error: null };
  } catch (err: any) {
    console.error('Error completing onboarding:', err);
    return { success: false, error: err.message || 'Failed to complete onboarding' };
  }
}

/**
 * Upload KYC documents to Supabase Storage
 */
export async function uploadKycDocuments(
  userId: string,
  documents: {
    aadhaar?: File;
    pan?: File;
  }
): Promise<{ aadhaarUrl?: string; panUrl?: string; error: string | null }> {
  try {
    const results: { aadhaarUrl?: string; panUrl?: string } = {};

    // Upload Aadhaar document if provided
    if (documents.aadhaar) {
      const aadhaarPath = `${userId}/aadhaar_${Date.now()}.${documents.aadhaar.name.split('.').pop()}`;
      const { url, error } = await uploadFile(documents.aadhaar, 'kyc-documents', aadhaarPath);

      if (error) {
        return { error: `Failed to upload Aadhaar: ${error}` };
      }

      results.aadhaarUrl = url || undefined;
    }

    // Upload PAN document if provided
    if (documents.pan) {
      const panPath = `${userId}/pan_${Date.now()}.${documents.pan.name.split('.').pop()}`;
      const { url, error } = await uploadFile(documents.pan, 'kyc-documents', panPath);

      if (error) {
        return { error: `Failed to upload PAN: ${error}` };
      }

      results.panUrl = url || undefined;
    }

    return { ...results, error: null };
  } catch (err: any) {
    console.error('Error uploading KYC documents:', err);
    return { error: err.message || 'Failed to upload KYC documents' };
  }
}

/**
 * Upload profile photo to Supabase Storage
 */
export async function uploadProfilePhoto(
  userId: string,
  file: File
): Promise<{ url: string | null; error: string | null }> {
  const photoPath = `${userId}/profile_${Date.now()}.${file.name.split('.').pop()}`;
  return uploadFile(file, 'profile-photos', photoPath);
}

/**
 * Admin function: Approve or reject a host application
 * In production, this would be called from an admin dashboard
 * For testing, you can call this from browser console:
 *
 * Example usage in browser console:
 * import { approveHostApplication } from '@/utils/onboardingService';
 * approveHostApplication('user-id-here', 'approved');
 */
export async function approveHostApplication(
  userId: string,
  status: 'approved' | 'rejected',
  rejectionReason?: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const updateData: any = {
      kyc_status: status,
      updated_at: new Date().toISOString()
    };

    if (status === 'approved') {
      updateData.is_completed = true;
      updateData.completed_at = new Date().toISOString();
    }

    if (rejectionReason) {
      updateData.rejection_reason = rejectionReason;
    }

    const { error } = await supabase
      .from('host_onboarding')
      .update(updateData)
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    return { success: true, error: null };
  } catch (err: any) {
    console.error('Error updating application status:', err);
    return { success: false, error: err.message || 'Failed to update application status' };
  }
}
