// @/stores/useServiceStore.ts
import { create } from "zustand";
import { Service, ServiceStatus, fetchServicesByStatus } from "@/services/serviceManagement"; // ← ADD IMPORT
import { isWithinInterval } from "date-fns";

interface DateRange {
  start: Date | null;
  end: Date | null;
}

interface ServiceStore {
  services: Service[];
  activeTab: ServiceStatus;
  selectedServices: string[];
  searchQuery: string;
  dateRange: DateRange;
  loading: boolean;
  error: string | null;

  fetchServices: () => Promise<void>;
  setActiveTab: (tab: ServiceStatus) => void;
  toggleService: (id: string) => void;
  toggleAllServices: () => void;
  setSearchQuery: (query: string) => void;
  setDateRange: (range: DateRange) => void;
  clearSelection: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Add computed getter for filtered services inside store
  getFilteredServices: () => Service[];
}

export const useServiceStore = create<ServiceStore>((set, get) => ({
  services: [],
  activeTab: "Pending",
  selectedServices: [],
  searchQuery: "",
  dateRange: { start: null, end: null },
  loading: false,
  error: null,

  fetchServices: async () => {
    set({ loading: true, error: null });
    try {
      const services = await fetchServicesByStatus(); // ← Now recognized
      set({ services, loading: false });
    } catch (err) {
      set({ error: "Failed to load services", loading: false });
    }
  },

  setActiveTab: (tab) => set({ activeTab: tab, selectedServices: [] }),

  toggleService: (id) =>
    set((state) => ({
      selectedServices: state.selectedServices.includes(id)
        ? state.selectedServices.filter((s) => s !== id)
        : [...state.selectedServices, id],
    })),

  toggleAllServices: () => {
    const filtered = get().getFilteredServices(); // ← Use internal getter
    const allIds = filtered.map((s) => s.id);

    set((state) =>
      state.selectedServices.length === allIds.length
        ? { selectedServices: [] }
        : { selectedServices: allIds }
    );
  },

  setSearchQuery: (query) => set({ searchQuery: query }),

  setDateRange: (dateRange) => set({ dateRange }),

  clearSelection: () => set({ selectedServices: [] }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  // Computed: filtered services based on tab, search, and date range
  getFilteredServices: () => {
    const state = get();
    let filtered = state.services.filter((s) => {
      const statusMap = {
        Pending: "PENDING",
        Approved: "APPROVED",
        Rejected: "REJECTED",
      };
      return s.status === statusMap[state.activeTab];
    });

    // Search
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter((s) => {
        const fullName = s.sellerProfiles[0]?.user?.fullName?.toLowerCase() || "";
        const email = s.sellerProfiles[0]?.user?.email?.toLowerCase() || "";
        const phone = s.sellerProfiles[0]?.user?.phone || "";
        return (
          s.title.toLowerCase().includes(query) ||
          fullName.includes(query) ||
          email.includes(query) ||
          phone.includes(query)
        );
      });
    }

    // Date range
    if (state.dateRange.start && state.dateRange.end) {
      filtered = filtered.filter((s) => {
        const date = new Date(s.createdAt);
        return isWithinInterval(date, {
          start: state.dateRange.start!,
          end: state.dateRange.end!,
        });
      });
    }

    return filtered;
  },
}));

// Optional: Keep external selector if you want (but now internal is preferred)
export const useFilteredServices = () => useServiceStore((state) => state.getFilteredServices());