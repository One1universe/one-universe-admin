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

export interface Referral {
  // Core properties from backend
  id: string;
  referrerId: string;
  referredId: string;
  signupDate: string;
  firstTransactionAmount: string | null;
  firstTransactionStatus: string | null;
  status: ReferralStatus;
  rewardAmount: string | null;
  rewardPaidAt: string | null;
  rewardPaid: boolean;
  rewardTransactionId: string | null;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  referralCodeUsed: string | null;

  // Nested objects – now nullable!
  referrer: {
    id: string;
    fullName: string;
    email: string;
  } | null;

  referred: {
    id: string;
    fullName: string;
    email: string;
  } | null;

  rewardTransaction: any;
  events: Array<{
    id: string;
    referralId: string;
    type: string;
    payload: Record<string, any>;
    createdAt: string;
  }>;

  // Computed / Display properties
  referrerName: string;
  referredName: string;
  signDate: string;
  rewardEarned: boolean;
}

// Helper: Safe string fallback
const getSafeName = (user: { fullName: string } | null | undefined): string =>
  user?.fullName?.trim() || "—";

// === Validation ===
const isValidReferralItem = (item: any): item is ReferralItem => {
  if (!item || typeof item !== "object") return false;

  // Required fields
  if (!item.id || typeof item.id !== "string") return false;
  if (!item.referrerId || !item.referredId) return false;
  if (!item.status || !["PENDING", "PROCESSING", "PAID", "INELIGIBLE"].includes(item.status)) {
    return false;
  }

  // referrer and referred are allowed to be null now
  // But if they exist, they must have the required fields
  if (item.referrer && (!item.referrer.id || !item.referrer.fullName || !item.referrer.email)) {
    return false;
  }
  if (item.referred && (!item.referred.id || !item.referred.fullName || !item.referred.email)) {
    return false;
  }

  return true;
};

// === Transformation with null-safety ===
const transformReferralItem = (item: ReferralItem): Referral => {
  return {
    // Core fields
    id: item.id,
    referrerId: item.referrerId,
    referredId: item.referredId,
    signupDate: item.signupDate,
    firstTransactionAmount: item.firstTransactionAmount,
    firstTransactionStatus: item.firstTransactionStatus,
    status: item.status,
    rewardAmount: item.rewardAmount,
    rewardPaidAt: item.rewardPaidAt,
    rewardPaid: !!item.rewardPaid,
    rewardTransactionId: item.rewardTransactionId,
    note: item.note,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    referralCodeUsed: item.referralCodeUsed,

    // Nested objects – safe assignment
    referrer: item.referrer ?? null,
    referred: item.referred ?? null,

    rewardTransaction: item.rewardTransaction ?? null,
    events: Array.isArray(item.events) ? item.events : [],

    // Computed fields with safe fallbacks
    referrerName: getSafeName(item.referrer),
    referredName: getSafeName(item.referred),
    signDate: item.signupDate
      ? new Date(item.signupDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "—",
    rewardEarned: !!item.rewardPaid,
  };
};

// === Store ===
interface ReferralManagementState {
  // Referrals list
  allReferrals: Referral[];
  allReferralsLoading: boolean;
  allReferralsError: string | null;
  allReferralsMeta: {
    total: number;
    page: number;
    limit: number;
  } | null;

  // Stats
  stats: ReferralStats | null;
  statsLoading: boolean;
  statsError: string | null;

  // Settings
  settings: ReferralProgramSettings | null;
  settingsLoading: boolean;
  settingsError: string | null;

  // Selected
  selectedReferral: Referral | null;

  // UI
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

  markAsPaid: (referralId: string, rewardTransactionId: string, rewardAmount: number) => Promise<void>;
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
      const response = await referralService.getAllReferrals(page, limit);

      if (!response?.items || !Array.isArray(response.items)) {
        throw new Error("Invalid response: missing items array");
      }

      const transformedReferrals = response.items
        .filter(isValidReferralItem)
        .map(transformReferralItem);

      let errorMessage: string | null = null;
      if (transformedReferrals.length === 0 && response.items.length > 0) {
        errorMessage = "No valid referrals could be loaded (data missing or invalid)";
      }

      set({
        allReferrals: transformedReferrals,
        allReferralsMeta: {
          total: response.total ?? 0,
          page: response.page ?? page,
          limit: response.limit ?? limit,
        },
        allReferralsError: errorMessage,
      });
    } catch (err: any) {
      console.error("Failed to fetch referrals:", err);
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
      const stats = await referralService.getReferralStats();
      set({ stats, statsError: null });
    } catch (err: any) {
      set({ stats: null, statsError: err.message || "Failed to load stats" });
    } finally {
      set({ statsLoading: false });
    }
  },

  fetchSettings: async () => {
    set({ settingsLoading: true, settingsError: null });
    try {
      const settings = await referralService.getReferralSettings();
      set({ settings, settingsError: null });
    } catch (err: any) {
      set({ settings: null, settingsError: err.message || "Failed to load settings" });
    } finally {
      set({ settingsLoading: false });
    }
  },

  fetchReferralDetails: async (referralId: string) => {
    set({ allReferralsLoading: true, allReferralsError: null });
    try {
      const response = await referralService.getReferralDetails(referralId);

      if (!isValidReferralItem(response)) {
        throw new Error("Referral data is invalid or incomplete");
      }

      const transformed = transformReferralItem(response);

      set({
        selectedReferral: transformed,
        allReferralsError: null,
      });
    } catch (err: any) {
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
      let response: ReferralItem;

      if (status === "PAID") {
        response = await referralService.markAsPaid(
          referralId,
          data?.rewardTransactionId || "",
          data?.rewardAmount || 0
        );
      } else {
        response = await referralService.markAsIneligible(referralId, data?.reason);
      }

      if (!isValidReferralItem(response)) {
        throw new Error("Resolved referral has invalid data");
      }

      const transformed = transformReferralItem(response);

      set((state) => ({
        selectedReferral: transformed,
        allReferrals: state.allReferrals.map((ref) =>
          ref.id === referralId ? transformed : ref
        ),
        allReferralsError: null,
      }));
    } catch (err: any) {
      set({ allReferralsError: err.message || "Failed to resolve referral" });
      throw err;
    } finally {
      set({ allReferralsLoading: false });
    }
  },

  markAsPaid: async (referralId, rewardTransactionId, rewardAmount) => {
    set({ allReferralsLoading: true, allReferralsError: null });
    try {
      const response = await referralService.markAsPaid(
        referralId,
        rewardTransactionId,
        rewardAmount
      );

      if (!isValidReferralItem(response)) {
        throw new Error("Paid referral has invalid data");
      }

      const transformed = transformReferralItem(response);

      set((state) => ({
        selectedReferral: transformed,
        allReferrals: state.allReferrals.map((ref) =>
          ref.id === referralId ? transformed : ref
        ),
        allReferralsError: null,
      }));

      // Refresh stats
      const stats = await referralService.getReferralStats().catch(() => null);
      if (stats) set({ stats });
    } catch (err: any) {
      set({ allReferralsError: err.message || "Failed to mark as paid" });
      throw err;
    } finally {
      set({ allReferralsLoading: false });
    }
  },

  markAsIneligible: async (referralId, reason) => {
    set({ allReferralsLoading: true, allReferralsError: null });
    try {
      const response = await referralService.markAsIneligible(referralId, reason);

      if (!isValidReferralItem(response)) {
        throw new Error("Ineligible referral has invalid data");
      }

      const transformed = transformReferralItem(response);

      set((state) => ({
        selectedReferral: transformed,
        allReferrals: state.allReferrals.map((ref) =>
          ref.id === referralId ? transformed : ref
        ),
        allReferralsError: null,
      }));
    } catch (err: any) {
      set({ allReferralsError: err.message || "Failed to mark as ineligible" });
      throw err;
    } finally {
      set({ allReferralsLoading: false });
    }
  },

  updateSettings: async (settings: any) => {
    set({ settingsLoading: true, settingsError: null });
    try {
      const updated = await referralService.updateSettings(settings);
      set({ settings: updated, settingsError: null });
    } catch (err: any) {
      set({ settingsError: err.message || "Failed to update settings" });
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