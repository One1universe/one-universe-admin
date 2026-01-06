// src/store/referralManagementStore.ts
import { create } from "zustand";
import { referralService, ReferralItem, ReferralStats, ReferralProgramSettings } from "@/services/referralService";

// === Types ===
export type ReferralStatus = "PENDING" | "PROCESSING" | "PAID" | "INELIGIBLE";

export interface ReferralFilterState {
  status?: ReferralStatus;
  fromDate?: Date;
  toDate?: Date;
  minReward?: number;
  maxReward?: number;
  rewardPaid?: boolean;
}

// ✅ FIXED: Explicit Referral interface without extends
export interface Referral {
  // Core properties from backend
  id: string;
  referrerId: string;
  referredId: string;
  signupDate: string;
  firstTransactionAmount: string | null;
  firstTransactionStatus: string | null; // ✅ CRITICAL: Must be explicitly here
  status: "PENDING" | "PROCESSING" | "PAID" | "INELIGIBLE";
  rewardAmount: string | null;
  rewardPaidAt: string | null;
  rewardPaid: boolean;
  rewardTransactionId: string | null;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  referralCodeUsed: string | null;
  
  // Nested objects
  referrer: {
    id: string;
    fullName: string;
    email: string;
  };
  referred: {
    id: string;
    fullName: string;
    email: string;
  };
  rewardTransaction: any;
  events: Array<{
    id: string;
    referralId: string;
    type: string;
    payload: Record<string, any>;
    createdAt: string;
  }>;
  
  // Computed/Display properties
  referrerName: string;
  referredName: string;
  signDate: string;
  rewardEarned: boolean;
}

// ✅ Helper function to transform ReferralItem to Referral
const transformReferralItem = (item: ReferralItem): Referral => {
  console.log("🔄 TRANSFORM DEBUG - Input item:", {
    id: item.id.substring(0, 8) + '...',
    referrer: item.referrer.fullName,
    referred: item.referred.fullName,
    firstTransactionAmount: item.firstTransactionAmount,
    firstTransactionStatus: item.firstTransactionStatus,
    allKeys: Object.keys(item).filter(k => k.includes('Transaction'))
  });

  // ✅ EXPLICIT property mapping - every property listed
  const transformed: Referral = {
    // Core properties from backend
    id: item.id,
    referrerId: item.referrerId,
    referredId: item.referredId,
    signupDate: item.signupDate,
    firstTransactionAmount: item.firstTransactionAmount,
    firstTransactionStatus: item.firstTransactionStatus, // ✅ EXPLICITLY mapped
    status: item.status,
    rewardAmount: item.rewardAmount,
    rewardPaidAt: item.rewardPaidAt,
    rewardPaid: item.rewardPaid,
    rewardTransactionId: item.rewardTransactionId,
    note: item.note,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    referralCodeUsed: item.referralCodeUsed,
    
    // Nested objects
    referrer: item.referrer,
    referred: item.referred,
    rewardTransaction: item.rewardTransaction,
    events: item.events,
    
    // Computed/Display properties
    referrerName: item.referrer.fullName,
    referredName: item.referred.fullName,
    signDate: new Date(item.signupDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }),
    rewardEarned: item.rewardPaid
  };

  console.log("✅ TRANSFORM DEBUG - Output:", {
    id: transformed.id.substring(0, 8) + '...',
    firstTransactionStatus: transformed.firstTransactionStatus,
    hasProperty: 'firstTransactionStatus' in transformed,
    type: typeof transformed.firstTransactionStatus,
    value: JSON.stringify(transformed.firstTransactionStatus)
  });

  return transformed;
};

// === Store ===
interface ReferralManagementState {
  // Referrals list state
  allReferrals: Referral[];
  allReferralsLoading: boolean;
  allReferralsError: string | null;
  allReferralsMeta: {
    total: number;
    page: number;
    limit: number;
  } | null;

  // Stats state
  stats: ReferralStats | null;
  statsLoading: boolean;
  statsError: string | null;

  // Settings state
  settings: ReferralProgramSettings | null;
  settingsLoading: boolean;
  settingsError: string | null;

  // Selected referral
  selectedReferral: Referral | null;

  // UI state
  searchQuery: string;
  filters: ReferralFilterState;

  // Actions
  fetchAllReferrals: (page?: number, limit?: number) => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchSettings: () => Promise<void>;
  fetchReferralDetails: (referralId: string) => Promise<void>;
  
  resolveReferral: (
    referralId: string,
    status: "PAID" | "INELIGIBLE",
    data?: { rewardAmount?: number; rewardTransactionId?: string; reason?: string }
  ) => Promise<void>;
  
  markAsPaid: (
    referralId: string,
    rewardTransactionId: string,
    rewardAmount: number
  ) => Promise<void>;
  
  markAsIneligible: (referralId: string, reason?: string) => Promise<void>;
  
  updateSettings: (settings: any) => Promise<void>;
  
  setSelectedReferral: (referral: Referral | null) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: ReferralFilterState) => void;
  clearFilters: () => void;
  clearAllReferrals: () => void;
}

export const referralManagementStore = create<ReferralManagementState>((set) => ({
  // Initial state
  allReferrals: [],
  allReferralsLoading: false,
  allReferralsError: null,
  allReferralsMeta: null,

  stats: null,
  statsLoading: false,
  statsError: null,

  settings: null,
  settingsLoading: false,
  settingsError: null,

  selectedReferral: null,
  searchQuery: "",
  filters: {},

  // === Actions ===

  fetchAllReferrals: async (page = 1, limit = 20) => {
    set({ allReferralsLoading: true, allReferralsError: null });

    try {
      console.log(`\n📦 Store: fetchAllReferrals called with page=${page}, limit=${limit}`);

      const response = await referralService.getAllReferrals(page, limit);

      console.log("📦 RAW BACKEND RESPONSE:", {
        totalItems: response.items.length,
        firstItem: response.items[0],
        firstItemTransactionStatus: response.items[0]?.firstTransactionStatus
      });

      // ✅ Transform ReferralItem[] to Referral[] with computed properties
      const transformedReferrals = response.items.map(transformReferralItem);

      console.log("✅ TRANSFORMED REFERRALS:", {
        totalItems: transformedReferrals.length,
        firstItem: transformedReferrals[0],
        firstItemTransactionStatus: transformedReferrals[0]?.firstTransactionStatus
      });

      set({
        allReferrals: transformedReferrals,
        allReferralsMeta: {
          total: response.total,
          page: response.page,
          limit: response.limit,
        },
        allReferralsError: null,
      });

      console.log(`✅ Store: Fetched ${transformedReferrals.length} referrals and stored in state`);
    } catch (err: any) {
      console.error("❌ Store: Failed to fetch referrals:", err);
      set({
        allReferrals: [],
        allReferralsMeta: null,
        allReferralsError: err.message || "Failed to load referrals",
      });
    } finally {
      set({ allReferralsLoading: false });
    }
  },

  fetchStats: async () => {
    set({ statsLoading: true, statsError: null });

    try {
      console.log("\n📦 Store: fetchStats called");
      const response = await referralService.getReferralStats();
      set({
        stats: response,
        statsError: null,
      });
      console.log("✅ Store: Stats fetched");
    } catch (err: any) {
      console.error("❌ Store: Failed to fetch stats:", err);
      set({
        stats: null,
        statsError: err.message || "Failed to load stats",
      });
    } finally {
      set({ statsLoading: false });
    }
  },

  fetchSettings: async () => {
    set({ settingsLoading: true, settingsError: null });

    try {
      console.log("\n📦 Store: fetchSettings called");
      const response = await referralService.getReferralSettings();
      set({
        settings: response,
        settingsError: null,
      });
      console.log("✅ Store: Settings fetched");
    } catch (err: any) {
      console.error("❌ Store: Failed to fetch settings:", err);
      set({
        settings: null,
        settingsError: err.message || "Failed to load settings",
      });
    } finally {
      set({ settingsLoading: false });
    }
  },

  fetchReferralDetails: async (referralId: string) => {
    set({ allReferralsLoading: true, allReferralsError: null });

    try {
      console.log(`\n📦 Store: fetchReferralDetails called for ${referralId}`);
      const response = await referralService.getReferralDetails(referralId);
      
      // ✅ Transform ReferralItem to Referral
      const transformedReferral = transformReferralItem(response);
      
      set({
        selectedReferral: transformedReferral,
        allReferralsError: null,
      });
      console.log("✅ Store: Referral details fetched");
    } catch (err: any) {
      console.error("❌ Store: Failed to fetch referral details:", err);
      set({
        selectedReferral: null,
        allReferralsError: err.message || "Failed to load referral details",
      });
    } finally {
      set({ allReferralsLoading: false });
    }
  },

  resolveReferral: async (referralId, status, data) => {
    set({ allReferralsLoading: true, allReferralsError: null });

    try {
      console.log(`\n📦 Store: resolveReferral - ${referralId} as ${status}`);

      let response: ReferralItem;

      if (status === "PAID") {
        response = await referralService.markAsPaid(
          referralId,
          data?.rewardTransactionId || "",
          data?.rewardAmount || 0
        );
      } else {
        response = await referralService.markAsIneligible(
          referralId,
          data?.reason
        );
      }

      // ✅ Transform response
      const transformedResponse = transformReferralItem(response);

      set((state) => ({
        selectedReferral: transformedResponse,
        allReferrals: state.allReferrals.map((ref) =>
          ref.id === referralId ? transformedResponse : ref
        ),
        allReferralsError: null,
      }));

      console.log("✅ Store: Referral resolved");
    } catch (err: any) {
      console.error("❌ Store: Failed to resolve referral:", err);
      set({
        allReferralsError: err.message || "Failed to resolve referral",
      });
      throw err;
    } finally {
      set({ allReferralsLoading: false });
    }
  },

  markAsPaid: async (referralId, rewardTransactionId, rewardAmount) => {
    set({ allReferralsLoading: true, allReferralsError: null });

    try {
      console.log(
        `\n📦 Store: markAsPaid - ${referralId} with amount ${rewardAmount}`
      );

      const response = await referralService.markAsPaid(
        referralId,
        rewardTransactionId,
        rewardAmount
      );

      // ✅ Transform response
      const transformedResponse = transformReferralItem(response);

      set((state) => ({
        selectedReferral: transformedResponse,
        allReferrals: state.allReferrals.map((ref) =>
          ref.id === referralId ? transformedResponse : ref
        ),
        allReferralsError: null,
      }));

      console.log("✅ Store: Marked as paid");

      // Refresh stats
      try {
        const stats = await referralService.getReferralStats();
        set({ stats });
      } catch (statsErr) {
        console.warn("⚠️ Store: Failed to refresh stats:", statsErr);
      }
    } catch (err: any) {
      console.error("❌ Store: Failed to mark as paid:", err);
      set({
        allReferralsError: err.message || "Failed to mark as paid",
      });
      throw err;
    } finally {
      set({ allReferralsLoading: false });
    }
  },

  markAsIneligible: async (referralId, reason) => {
    set({ allReferralsLoading: true, allReferralsError: null });

    try {
      console.log(`\n📦 Store: markAsIneligible - ${referralId}`);

      const response = await referralService.markAsIneligible(referralId, reason);

      // ✅ Transform response
      const transformedResponse = transformReferralItem(response);

      set((state) => ({
        selectedReferral: transformedResponse,
        allReferrals: state.allReferrals.map((ref) =>
          ref.id === referralId ? transformedResponse : ref
        ),
        allReferralsError: null,
      }));

      console.log("✅ Store: Marked as ineligible");
    } catch (err: any) {
      console.error("❌ Store: Failed to mark as ineligible:", err);
      set({
        allReferralsError: err.message || "Failed to mark as ineligible",
      });
      throw err;
    } finally {
      set({ allReferralsLoading: false });
    }
  },

  updateSettings: async (settings: any) => {
    set({ settingsLoading: true, settingsError: null });

    try {
      console.log("\n📦 Store: updateSettings - calling POST /referrals/upsert", settings);

      const response = await referralService.updateSettings(settings);

      set({
        settings: response,
        settingsError: null,
      });

      console.log(`✅ Store: Settings updated:`, response);
    } catch (err: any) {
      console.error("❌ Store: Failed to update settings:", err);
      set({
        settingsError: err.message || "Failed to update settings",
      });
      throw err;
    } finally {
      set({ settingsLoading: false });
    }
  },

  setSelectedReferral: (referral) => set({ selectedReferral: referral }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilters: (filters) => set({ filters }),
  clearFilters: () => set({ filters: {} }),
  clearAllReferrals: () =>
    set({
      allReferrals: [],
      allReferralsMeta: null,
      selectedReferral: null,
      allReferralsError: null,
    }),
}));