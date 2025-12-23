// src/store/supportTicketStore.ts
import { create } from "zustand";
import { 
  supportService, 
  SupportTicketResponse, 
  SupportTicketStatus,
  SupportTicketsApiResponse 
} from "@/services/supportService";
import useToastStore from "@/store/useToastStore";

// === Types ===
export interface SupportTicketFilters {
  status?: SupportTicketStatus;
  searchQuery?: string;
}

// === Helper: Type guard for HttpError ===
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
interface SupportTicketState {
  tickets: SupportTicketResponse[];
  ticketsLoading: boolean;
  ticketsError: string | null;
  totalTickets: number;
  currentPage: number;
  totalPages: number;
  limit: number;

  selectedTicket: SupportTicketResponse | null;
  selectedTicketLoading: boolean;
  selectedTicketError: string | null;

  filters: SupportTicketFilters;
  
  respondingToTicket: boolean;
  respondError: string | null;

  // Actions
  fetchTickets: (page?: number, limit?: number, status?: SupportTicketStatus) => Promise<void>;
  fetchTicketById: (ticketId: string) => Promise<void>;
  setSelectedTicket: (ticket: SupportTicketResponse | null) => void;
  respondToTicket: (ticketId: string, adminResponse: string) => Promise<boolean>;
  markAsResolved: (ticketId: string) => Promise<boolean>;
  updateTicketStatus: (ticketId: string, status: SupportTicketStatus) => Promise<boolean>;
  deleteTicket: (ticketId: string) => Promise<boolean>;
  setFilters: (filters: SupportTicketFilters) => void;
  clearFilters: () => void;
  clearSelectedTicket: () => void;
  clearRespondError: () => void;
}

export const supportTicketStore = create<SupportTicketState>((set, get) => ({
  tickets: [],
  ticketsLoading: false,
  ticketsError: null,
  totalTickets: 0,
  currentPage: 1,
  totalPages: 1,
  limit: 10,

  selectedTicket: null,
  selectedTicketLoading: false,
  selectedTicketError: null,

  filters: {},
  
  respondingToTicket: false,
  respondError: null,

  fetchTickets: async (page = 1, limit = 10, status?: SupportTicketStatus) => {
    set({ ticketsLoading: true, ticketsError: null });

    try {
      const response: unknown = await supportService.getAllTickets({
        page,
        limit,
        status: status || undefined,
      });

      if (isHttpError(response)) {
        throw new Error(response.message);
      }

      const typedResponse = response as SupportTicketsApiResponse;

      set({
        tickets: typedResponse.data,
        totalTickets: typedResponse.total,
        currentPage: typedResponse.page,
        totalPages: typedResponse.pages,
        limit: typedResponse.limit,
        ticketsError: null,
      });
    } catch (err: any) {
      console.error("Failed to fetch tickets:", err);
      set({
        tickets: [],
        ticketsError: err.message || "Failed to load support tickets",
      });
    } finally {
      set({ ticketsLoading: false });
    }
  },

  fetchTicketById: async (ticketId: string) => {
    set({ selectedTicketLoading: true, selectedTicketError: null });

    try {
      const response: unknown = await supportService.getTicketById(ticketId);

      if (isHttpError(response)) {
        throw new Error(response.message);
      }

      const ticket = response as SupportTicketResponse;

      set({
        selectedTicket: ticket,
        selectedTicketError: null,
      });
    } catch (err: any) {
      console.error("Failed to fetch ticket details:", err);
      set({
        selectedTicket: null,
        selectedTicketError: err.message || "Failed to load ticket details",
      });
    } finally {
      set({ selectedTicketLoading: false });
    }
  },

  setSelectedTicket: (ticket) => set({ selectedTicket: ticket }),

  clearRespondError: () => set({ respondError: null }),

  // RESPOND TO TICKET
  respondToTicket: async (ticketId: string, adminResponse: string) => {
    set({ respondingToTicket: true, respondError: null });
    const toast = useToastStore.getState();

    try {
      const { tickets } = get();
      const ticket = tickets.find(t => t.id === ticketId);
      
      if (!ticket) {
        throw new Error("Ticket not found in local list");
      }

      const response: unknown = await supportService.respondToTicket({
        ticketId: ticket.ticketId,
        adminResponse,
      });

      if (isHttpError(response)) {
        throw new Error(response.message);
      }

      const updatedTicket = response as SupportTicketResponse;

      set((state) => ({
        tickets: state.tickets.map((t) =>
          t.id === updatedTicket.id ? updatedTicket : t
        ),
        selectedTicket: state.selectedTicket?.id === updatedTicket.id 
          ? updatedTicket 
          : state.selectedTicket,
        respondError: null,
      }));

      toast.showToast(
        "success",
        "Response Sent",
        "Your message has been sent to the user via email."
      );

      // Refetch full list to ensure table reflects latest response
      await get().fetchTickets(get().currentPage, get().limit);

      return true;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to send response. Please try again.";

      console.error("Failed to respond to ticket:", err);
      set({ respondError: errorMessage });

      toast.showToast("error", "Failed to Send", errorMessage);

      return false;
    } finally {
      set({ respondingToTicket: false });
    }
  },

  // MARK AS RESOLVED
  markAsResolved: async (ticketId: string) => {
    set({ respondingToTicket: true, respondError: null });
    const toast = useToastStore.getState();

    try {
      const { tickets } = get();
      const ticket = tickets.find(t => t.id === ticketId);
      
      if (!ticket) {
        throw new Error("Ticket not found in local list");
      }

      const response: unknown = await supportService.markAsResolved(ticket.ticketId);

      if (isHttpError(response)) {
        throw new Error(response.message);
      }

      const updatedTicket = response as SupportTicketResponse;

      set((state) => ({
        tickets: state.tickets.map((t) =>
          t.id === updatedTicket.id ? updatedTicket : t
        ),
        selectedTicket: state.selectedTicket?.id === updatedTicket.id 
          ? updatedTicket 
          : state.selectedTicket,
        respondError: null,
      }));

      toast.showToast(
        "success",
        "Ticket Resolved",
        "This ticket has been successfully marked as resolved."
      );

      // Refetch to update table immediately with new status
      await get().fetchTickets(get().currentPage, get().limit);

      return true;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to mark as resolved. Please try again.";

      console.error("Failed to mark ticket as resolved:", err);
      set({ respondError: errorMessage });

      toast.showToast("error", "Action Failed", errorMessage);

      return false;
    } finally {
      set({ respondingToTicket: false });
    }
  },

  // UPDATE TICKET STATUS
  updateTicketStatus: async (ticketId: string, status: SupportTicketStatus) => {
    set({ respondingToTicket: true, respondError: null });
    const toast = useToastStore.getState();

    try {
      const { tickets } = get();
      const ticket = tickets.find(t => t.id === ticketId);
      
      if (!ticket) {
        throw new Error("Ticket not found in local list");
      }

      const response: unknown = await supportService.updateTicketStatus(ticket.ticketId, status);

      if (isHttpError(response)) {
        throw new Error(response.message);
      }

      const updatedTicket = response as SupportTicketResponse;

      set((state) => ({
        tickets: state.tickets.map((t) =>
          t.id === updatedTicket.id ? updatedTicket : t
        ),
        selectedTicket: state.selectedTicket?.id === updatedTicket.id 
          ? updatedTicket 
          : state.selectedTicket,
        respondError: null,
      }));

      toast.showToast("success", "Status Updated", `Ticket status changed to ${status.replace("_", " ")}`);

      await get().fetchTickets(get().currentPage, get().limit);

      return true;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to update status";

      console.error("Failed to update ticket status:", err);
      set({ respondError: errorMessage });

      toast.showToast("error", "Update Failed", errorMessage);

      return false;
    } finally {
      set({ respondingToTicket: false });
    }
  },

  // DELETE TICKET
  deleteTicket: async (ticketId: string) => {
    set({ respondingToTicket: true, respondError: null });
    const toast = useToastStore.getState();

    try {
      const { tickets } = get();
      const ticket = tickets.find(t => t.id === ticketId);
      
      if (!ticket) {
        throw new Error("Ticket not found");
      }

      await supportService.deleteTicket(ticket.ticketId);

      set((state) => ({
        tickets: state.tickets.filter((t) => t.id !== ticketId),
        selectedTicket: state.selectedTicket?.id === ticketId ? null : state.selectedTicket,
        respondError: null,
      }));

      toast.showToast("success", "Ticket Deleted", "The ticket has been permanently deleted.");

      await get().fetchTickets(get().currentPage, get().limit);

      return true;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to delete ticket";

      console.error("Failed to delete ticket:", err);
      set({ respondError: errorMessage });

      toast.showToast("error", "Delete Failed", errorMessage);

      return false;
    } finally {
      set({ respondingToTicket: false });
    }
  },

  setFilters: (filters) => set({ filters }),
  clearFilters: () => set({ filters: {} }),
  clearSelectedTicket: () => set({ 
    selectedTicket: null, 
    selectedTicketError: null 
  }),
}));