// @/stores/useServiceStore.ts
import { create } from "zustand";
import { Service, ServiceStatus, fetchServicesByStatus } from "@/services/serviceManagement";
import { isWithinInterval } from "date-fns";

interface DateRange {
  start: Date | null;
  end: Date | null;
}

interface ServiceStore {
  // State
  services: Service[];
  activeTab: ServiceStatus;
  selectedServices: string[];
  searchQuery: string;
  dateRange: DateRange;
  loading: boolean;
  error: string | null;

  // Actions
  fetchServices: () => Promise<void>;
  setActiveTab: (tab: ServiceStatus) => void;
  toggleService: (id: string) => void;
  toggleAllServices: () => void;
  setSearchQuery: (query: string) => void;
  setDateRange: (range: DateRange) => void;
  clearSelection: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Computed getter for filtered services
  getFilteredServices: () => Service[];
}

export const useServiceStore = create<ServiceStore>((set, get) => ({
  // Initial state
  services: [],
  activeTab: "Pending",
  selectedServices: [],
  searchQuery: "",
  dateRange: { start: null, end: null },
  loading: false,
  error: null,

  // Fetch services from API
  fetchServices: async () => {
    set({ loading: true, error: null });
    try {
      const fetchedServices = await fetchServicesByStatus();
      set({ services: fetchedServices, loading: false });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load services";
      set({ error: errorMessage, loading: false });
    }
  },

  // Set active tab (Pending, Approved, Rejected)
  setActiveTab: (tab: ServiceStatus) => {
    set({ activeTab: tab, selectedServices: [] });
  },

  // Toggle individual service selection
  toggleService: (id: string) => {
    set((state) => ({
      selectedServices: state.selectedServices.includes(id)
        ? state.selectedServices.filter((serviceId) => serviceId !== id)
        : [...state.selectedServices, id],
    }));
  },

  // Toggle all services on current page
  toggleAllServices: () => {
    const filtered = get().getFilteredServices();
    const allIds = filtered.map((service) => service.id);

    set((state) =>
      state.selectedServices.length === allIds.length
        ? { selectedServices: [] }
        : { selectedServices: allIds }
    );
  },

  // Set search query
  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  // Set date range for filtering
  setDateRange: (dateRange: DateRange) => {
    set({ dateRange });
  },

  // Clear all selections
  clearSelection: () => {
    set({ selectedServices: [] });
  },

  // Set loading state
  setLoading: (loading: boolean) => {
    set({ loading });
  },

  // Set error message
  setError: (error: string | null) => {
    set({ error });
  },

  // Computed: filter services based on active tab, search, and date range
  getFilteredServices: (): Service[] => {
    const state = get();

    // First filter by status (tab)
    const statusMap: Record<ServiceStatus, string> = {
      Pending: "PENDING",
      Approved: "APPROVED",
      Rejected: "REJECTED",
    };

    let filtered: Service[] = state.services.filter((service: Service) => {
      return service.status === statusMap[state.activeTab];
    });

    // Then filter by search query
    if (state.searchQuery.trim()) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter((service: Service) => {
        const sellerUser = service.sellerProfiles[0]?.user;
        const fullName = sellerUser?.fullName?.toLowerCase() || "";
        const email = sellerUser?.email?.toLowerCase() || "";
        const phone = sellerUser?.phone || "";
        const title = service.title.toLowerCase();

        return (
          title.includes(query) ||
          fullName.includes(query) ||
          email.includes(query) ||
          phone.includes(query)
        );
      });
    }

    // Finally filter by date range
    if (state.dateRange.start && state.dateRange.end) {
      filtered = filtered.filter((service: Service) => {
        const serviceDate = new Date(service.createdAt);
        return isWithinInterval(serviceDate, {
          start: state.dateRange.start!,
          end: state.dateRange.end!,
        });
      });
    }

    return filtered;
  },
}));

// Optional: Create a separate hook for filtered services if preferred
export const useFilteredServices = () => {
  return useServiceStore((state) => state.getFilteredServices());
};