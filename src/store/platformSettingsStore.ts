// src/store/platformSettingsStore.ts
import { create } from "zustand";
import { platformSettingsService, PlatformSettings, UpdatePlatformFeePayload } from "@/services/platformSettingsService";

// === Types ===
interface HttpError {
  error: true;
  message: string;
}

function isHttpError(response: unknown): response is HttpError {
  return (
    typeof response === "object" &&
    response !== null &&
    "error" in response &&
    (response as any).error === true
  );
}

// === Store ===
interface PlatformSettingsState {
  // Platform Settings Data
  platformSettings: PlatformSettings | null;
  loading: boolean;
  error: string | null;

  // Update Fee Specific
  updatingFee: boolean;
  updateError: string | null;
  updateSuccess: boolean;

  // Actions
  fetchPlatformSettings: (settingsId: string) => Promise<void>;
  updatePlatformFee: (settingsId: string, feePercentage: number) => Promise<boolean>;
  clearError: () => void;
  clearUpdateSuccess: () => void;
  reset: () => void;
}

export const platformSettingsStore = create<PlatformSettingsState>((set) => ({
  platformSettings: null,
  loading: false,
  error: null,

  updatingFee: false,
  updateError: null,
  updateSuccess: false,

  /**
   * Fetch platform settings by ID
   */
  fetchPlatformSettings: async (settingsId: string) => {
    set({ loading: true, error: null });

    try {
      const response: unknown = await platformSettingsService.getPlatformSettings(settingsId);

      if (isHttpError(response)) {
        throw new Error(response.message);
      }

      // Type assertion - handle response structure
      let settings: PlatformSettings;
      
      if (response && typeof response === "object" && "data" in response) {
        const typedResponse = response as { data: PlatformSettings };
        settings = typedResponse.data;
      } else {
        settings = response as PlatformSettings;
      }

      console.log("✅ Platform settings fetched successfully:", settings);

      set({
        platformSettings: settings,
        error: null,
      });
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch platform settings";
      console.error("❌ Failed to fetch platform settings:", errorMessage);
      set({
        platformSettings: null,
        error: errorMessage,
      });
    } finally {
      set({ loading: false });
    }
  },

  /**
   * Update platform fee
   * @returns boolean indicating success
   */
  updatePlatformFee: async (settingsId: string, feePercentage: number) => {
    // Validate input
    if (feePercentage < 1 || feePercentage > 100) {
      const errorMessage = "Platform fee must be between 1 and 100";
      set({ updateError: errorMessage });
      console.error("❌", errorMessage);
      return false;
    }

    set({ updatingFee: true, updateError: null, updateSuccess: false });

    try {
      const payload: UpdatePlatformFeePayload = { platformFeePercentage: feePercentage };
      const response: unknown = await platformSettingsService.updatePlatformFee(
        settingsId,
        payload
      );

      if (isHttpError(response)) {
        throw new Error(response.message);
      }

      // Type assertion - handle response structure
      let settings: PlatformSettings;
      
      if (response && typeof response === "object" && "data" in response) {
        const typedResponse = response as { data: PlatformSettings };
        settings = typedResponse.data;
      } else {
        settings = response as PlatformSettings;
      }

      console.log("✅ Platform fee updated successfully:", settings);

      set({
        platformSettings: settings,
        updateError: null,
        updateSuccess: true,
      });

      return true;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to update platform fee";
      console.error("❌ Failed to update platform fee:", errorMessage);
      set({
        updateError: errorMessage,
        updateSuccess: false,
      });
      return false;
    } finally {
      set({ updatingFee: false });
    }
  },

  /**
   * Clear error message
   */
  clearError: () => set({ error: null, updateError: null }),

  /**
   * Clear update success flag
   */
  clearUpdateSuccess: () => set({ updateSuccess: false }),

  /**
   * Reset the entire store
   */
  reset: () =>
    set({
      platformSettings: null,
      loading: false,
      error: null,
      updatingFee: false,
      updateError: null,
      updateSuccess: false,
    }),
}));