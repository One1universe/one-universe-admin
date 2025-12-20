import { create } from "zustand";
import axios from "axios";
import getBaseUrl from "@/services/baseUrl";
import { FullUserType } from "@/store/userManagementStore";

interface UserDetailsState {
  fullUser: FullUserType | null;
  loading: boolean;
  fetchUser: (userId: string, token: string) => Promise<void>;
  clearUser: () => void;
}

export const userDetailsStore = create<UserDetailsState>((set) => ({
  fullUser: null,
  loading: false,

  // Fetch user with booking stats
  fetchUser: async (userId, token) => {
    set({ loading: true });
    try {
      const BASE = getBaseUrl();
      console.log("🔍 Fetching user from:", `${BASE}/admin/users/${userId}`);
      
      const { data } = await axios.get<FullUserType>(
        `${BASE}/admin/users/${userId}`, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("✅ Raw API response:", data);
      console.log("📊 BookingStats from API:", data.bookingStats);

      // Normalize backend inconsistencies
      const normalized: FullUserType = {
        ...data,
        wallet: data.wallet || data.Wallet || null,
        profile: data.profile || data.sellerProfile || data.buyerProfile || null,
        panicContacts: data.panicContacts || data.PanicContact || [],
        jobDocuments: data.jobDocuments || data.JobDocument || [],
        // Explicitly preserve bookingStats
        bookingStats: data.bookingStats || {
          totalBookings: 0,
          ongoingBookings: 0,
          completedBookings: 0,
          disputedBookings: 0,
        },
      };

      console.log("✅ Normalized user data:", normalized);
      console.log("📊 Normalized bookingStats:", normalized.bookingStats);

      set({ fullUser: normalized, loading: false });
    } catch (err) {
      console.error("❌ Failed to fetch user:", err);
      set({ fullUser: null, loading: false });
    }
  },

  clearUser: () => {
    console.log("🧹 Clearing user data");
    set({ fullUser: null, loading: false });
  },
}));