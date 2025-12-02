import { supabase } from './supabase';

export type UserType = 'host' | 'renter';

interface UserTypeCheckResult {
  exists: boolean;
  userType?: UserType;
  conflictMessage?: string;
}

/**
 * Check if an email already exists with a different user type
 * @param email - The email to check
 * @param intendedType - The type the user is trying to register as
 * @returns Object indicating if there's a conflict
 */
export async function checkUserTypeConflict(
  email: string,
  intendedType: UserType
): Promise<UserTypeCheckResult> {
  try {
    // Check if user profile exists with this email
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('user_type')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      console.error('Error checking user profile:', error);
      return { exists: false };
    }

    // No existing profile - user can proceed
    if (!profile) {
      return { exists: false };
    }

    // Profile exists - check if it's the same type
    if (profile.user_type === intendedType) {
      // Same type - user can proceed (this is a login, not signup)
      return { exists: true, userType: profile.user_type as UserType };
    }

    // Different type - conflict!
    const conflictMessage =
      intendedType === 'host'
        ? 'This email is already registered as a Renter account. Please use a different email or sign in as a Renter.'
        : 'This email is already registered as a Host account. Please use a different email or sign in as a Host.';

    return {
      exists: true,
      userType: profile.user_type as UserType,
      conflictMessage,
    };
  } catch (error) {
    console.error('Error in checkUserTypeConflict:', error);
    return { exists: false };
  }
}

/**
 * Create or update user profile after authentication
 * @param userId - The authenticated user's ID
 * @param email - The user's email
 * @param userType - The user type (host or renter)
 */
export async function createOrUpdateUserProfile(
  userId: string,
  email: string,
  userType: UserType
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('id, user_type')
      .eq('user_id', userId)
      .maybeSingle();

    if (existingProfile) {
      // Profile exists - verify type matches
      if (existingProfile.user_type !== userType) {
        return {
          success: false,
          error: `Cannot change account type from ${existingProfile.user_type} to ${userType}`,
        };
      }
      return { success: true };
    }

    // Create new profile
    const { error } = await supabase.from('user_profiles').insert({
      user_id: userId,
      email,
      user_type: userType,
    });

    if (error) {
      console.error('Error creating user profile:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error in createOrUpdateUserProfile:', error);
    return { success: false, error: error.message || 'Unknown error' };
  }
}

/**
 * Get user profile by user ID
 * @param userId - The user's ID
 */
export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return null;
  }
}
