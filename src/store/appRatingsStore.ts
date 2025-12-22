// src/store/appRatingsStore.ts
import { create } from "zustand";
import { appRatingsService, AppRating, AppRatingsApiResponse, FetchRatingsParams } from "@/services/appRatingsService";

interface RatingsFilters {
  rating?: number;
  platform?: string;
  fromDate?: string;
  toDate?: string;
}

interface AppRatingsState {
  // Ratings data
  ratings: AppRating[];
  ratingsLoading: boolean;
  ratingsError: string | null;
  totalRatings: number;
  currentPage: number;
  totalPages: number;
  limit: number;

  // Selected rating for detail view
  selectedRating: AppRating | null;
  selectedRatingLoading: boolean;
  selectedRatingError: string | null;

  // Filters
  filters: RatingsFilters;

  // Reply submission state
  replyingToRating: boolean;
  replyError: string | null;

  // Actions
  fetchRatings: (page?: number, limit?: number) => Promise<void>;
  fetchRatingById: (ratingId: string) => Promise<void>;
  setSelectedRating: (rating: AppRating | null) => void;
  replyToRating: (ratingId: string, adminReply: string) => Promise<boolean>;
  setFilters: (filters: RatingsFilters) => void;
  applyFilters: () => Promise<void>;
}

export const appRatingsStore = create<AppRatingsState>((set, get) => ({
  ratings: [],
  ratingsLoading: false,
  ratingsError: null,
  totalRatings: 0,
  currentPage: 1,
  totalPages: 1,
  limit: 10,

  selectedRating: null,
  selectedRatingLoading: false,
  selectedRatingError: null,

  filters: {},

  replyingToRating: false,
  replyError: null,

  fetchRatings: async (page = 1, limit = 10) => {
    set({ ratingsLoading: true, ratingsError: null });

    try {
      const { filters } = get();

      console.log("📊 Fetching ratings:", { page, limit, filters });

      const params: FetchRatingsParams = {
        page,
        limit,
        ...filters,
      };

      const response = await appRatingsService.getAllRatings(params);

      console.log("✅ Fetched ratings:", {
        total: response.total,
        page: response.page,
        count: response.data.length,
      });

      set({
        ratings: response.data,
        totalRatings: response.total,
        currentPage: response.page,
        totalPages: response.pages,
        limit: response.limit,
        ratingsError: null,
      });
    } catch (err: any) {
      console.error("❌ Failed to fetch ratings:", err);
      set({
        ratings: [],
        ratingsError: err.message || "Failed to load app ratings",
      });
    } finally {
      set({ ratingsLoading: false });
    }
  },

  fetchRatingById: async (ratingId: string) => {
    set({ selectedRatingLoading: true, selectedRatingError: null });

    try {
      console.log("📊 Fetching rating:", ratingId);

      const rating = await appRatingsService.getRatingById(ratingId);

      set({
        selectedRating: rating,
        selectedRatingError: null,
      });
    } catch (err: any) {
      console.error("❌ Failed to fetch rating details:", err);
      set({
        selectedRating: null,
        selectedRatingError: err.message || "Failed to load rating details",
      });
    } finally {
      set({ selectedRatingLoading: false });
    }
  },

  setSelectedRating: (rating) => set({ selectedRating: rating }),

  replyToRating: async (ratingId: string, adminReply: string) => {
    set({ replyingToRating: true, replyError: null });

    try {
      console.log("💬 Sending reply to rating:", ratingId);

      const response = await appRatingsService.replyToRating({
        ratingId,
        adminReply,
      });

      console.log("✅ Reply sent successfully");

      // ✅ FIXED: Merge response with existing rating to preserve user data
      set((state) => ({
        ratings: state.ratings.map((r) => {
          if (r.id === response.id) {
            // Merge: use response data but preserve user if it's missing in response
            return {
              ...r,
              ...response,
              // Explicitly preserve user data if response doesn't have it
              user: response.user || r.user,
            };
          }
          return r;
        }),
        selectedRating: state.selectedRating?.id === response.id
          ? {
              ...state.selectedRating,
              ...response,
              // Preserve user data
              user: response.user || state.selectedRating.user,
            }
          : state.selectedRating,
        replyError: null,
      }));

      return true;
    } catch (err: any) {
      console.error("❌ Failed to send reply:", err);
      set({
        replyError: err.message || "Failed to send reply",
      });
      return false;
    } finally {
      set({ replyingToRating: false });
    }
  },

  setFilters: (filters) => {
    console.log("🔧 Setting filters:", filters);
    set({ filters });
  },

  applyFilters: async () => {
    console.log("🔍 Applying filters");
    // Fetch with page 1 when filters are applied
    const { fetchRatings } = get();
    await fetchRatings(1, 10);
  },
}));