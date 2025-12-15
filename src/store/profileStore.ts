// store/profileStore.ts

import { create } from "zustand";
import { profileService, UserProfile, UpdateProfilePayload } from "@/services/profileService";

interface ProfileState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  updating: boolean;
  updateError: string | null;
  uploadingImage: boolean;
  uploadError: string | null;
  
  // Actions
  fetchProfile: (userId: string, token: string) => Promise<void>;
  updateProfile: (payload: UpdateProfilePayload, token: string) => Promise<boolean>;
  uploadProfilePicture: (file: File, token: string, email: string) => Promise<string | null>;
  clearError: () => void;
  reset: () => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  loading: false,
  error: null,
  updating: false,
  updateError: null,
  uploadingImage: false,
  uploadError: null,

  /**
   * Fetch user profile
   */
  fetchProfile: async (userId: string, token: string) => {
    set({ loading: true, error: null });
    
    try {
      const profile = await profileService.getUserProfile(userId, token);
      set({ 
        profile, 
        loading: false, 
        error: null 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch profile";
      set({ 
        loading: false, 
        error: errorMessage,
        profile: null 
      });
      console.error("Fetch profile error:", error);
    }
  },

  /**
   * Update user profile
   */
  updateProfile: async (payload: UpdateProfilePayload, token: string) => {
    set({ updating: true, updateError: null });
    
    try {
      const updatedProfile = await profileService.updateProfile(payload, token);
      
      console.log("✅ Profile updated in store:", {
        fullName: updatedProfile.fullName,
        email: updatedProfile.email,
      });
      
      set({ 
        profile: updatedProfile,
        updating: false, 
        updateError: null 
      });
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update profile";
      set({ 
        updating: false, 
        updateError: errorMessage 
      });
      console.error("Update profile error:", error);
      return false;
    }
  },

  /**
   * Upload profile picture
   */
  uploadProfilePicture: async (file: File, token: string, email: string) => {
    set({ uploadingImage: true, uploadError: null });

    try {
      const result = await profileService.uploadProfilePicture(file, token, email);
      
      console.log("📤 Upload result:", result);

      // Refresh the profile to get the updated picture URL from the backend
      const state = get();
      if (state.profile?.id) {
        console.log("🔄 Refreshing profile after upload...");
        try {
          const updatedProfile = await profileService.getUserProfile(state.profile.id, token);
          set({
            profile: updatedProfile,
            uploadingImage: false,
            uploadError: null,
          });
          console.log("✅ Profile refreshed with new picture URL");
          return updatedProfile.profilePicture;
        } catch (refreshError) {
          console.warn("⚠️ Could not refresh profile, using upload response:", refreshError);
          // Fall back to the upload result
          set((state) => ({
            profile: state.profile
              ? { ...state.profile, profilePicture: result.profilePicture }
              : null,
            uploadingImage: false,
            uploadError: null,
          }));
          return result.profilePicture;
        }
      }

      return result.profilePicture;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to upload profile picture";
      set({ 
        uploadingImage: false, 
        uploadError: errorMessage 
      });
      console.error("Profile picture upload error:", error);
      return null;
    }
  },

  /**
   * Clear error messages
   */
  clearError: () => {
    set({ error: null, updateError: null, uploadError: null });
  },

  /**
   * Reset store to initial state
   */
  reset: () => {
    set({
      profile: null,
      loading: false,
      error: null,
      updating: false,
      updateError: null,
      uploadingImage: false,
      uploadError: null,
    });
  },
}));