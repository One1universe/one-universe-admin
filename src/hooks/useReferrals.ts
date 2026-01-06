// src/hooks/useReferrals.ts
import { useStore } from "zustand";
import { referralManagementStore } from "@/store/referralManagementStore";
import type { Referral } from "@/store/referralManagementStore";

export const useReferrals = () => {
  return useStore(referralManagementStore, (state) => ({
    referrals: state.allReferrals,
    loading: state.allReferralsLoading,
    error: state.allReferralsError,
    meta: state.allReferralsMeta,
    fetchAllReferrals: state.fetchAllReferrals,
  }));
};