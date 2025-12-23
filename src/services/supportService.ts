// src/services/supportService.ts
import { getSession } from "next-auth/react";
import getBaseUrl from "./baseUrl";

const baseUrl = getBaseUrl("live");

export type SupportTicketStatus = "NEW" | "IN_PROGRESS" | "RESOLVED";

export interface SupportTicketResponse {
  id: string;
  ticketId: string;
  userId: string | null;
  email: string;
  subject: string;
  description: string;
  adminResponse: string | null;
  respondedAt: string | null;
  screenshotUrls: string[];
  status: SupportTicketStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SupportTicketsApiResponse {
  total: number;
  page: number;
  limit: number;
  pages: number;
  data: SupportTicketResponse[];
}

export interface FetchTicketsParams {
  page?: number;
  limit?: number;
  status?: SupportTicketStatus;
}

export interface RespondToTicketParams {
  ticketId: string;
  adminResponse: string;
}

class SupportService {
  /**
   * Generic request method with auth
   */
  private async request(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    const session = await getSession();
    
    if (!session?.accessToken) {
      // console.error("❌ No access token found in session");
      throw new Error("Unauthorized - Please log in again");
    }

    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.accessToken}`,
          ...options.headers,
        },
      });

      // Handle 401 - Token may have expired
      if (response.status === 401) {
        // console.error("❌ Unauthorized: Token expired or invalid");
        throw new Error("Unauthorized - Session expired");
      }

      if (response.status === 403) {
        // console.error("❌ Forbidden: Access denied");
        throw new Error("Forbidden - Access denied");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `API Error: ${response.status}`);
      }

      return data;
    } catch (error) {
      // console.error(`❌ Request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Get all support tickets with pagination and optional status filter
   */
  async getAllTickets(params?: FetchTicketsParams): Promise<SupportTicketsApiResponse> {
    const searchParams = new URLSearchParams();
    
    if (params?.page !== undefined) {
      searchParams.append("page", String(params.page));
    }
    if (params?.limit !== undefined) {
      searchParams.append("limit", String(params.limit));
    }
    if (params?.status) {
      searchParams.append("status", params.status);
    }

    const query = searchParams.toString();
    const endpoint = `/help-support${query ? `?${query}` : ""}`;

    return this.request(endpoint);
  }

  /**
   * Get a specific ticket by ID
   */
  async getTicketById(ticketId: string): Promise<SupportTicketResponse> {
    return this.request(`/help-support/${encodeURIComponent(ticketId)}`);
  }

  /**
   * Respond to a support ticket
   */
  async respondToTicket(params: RespondToTicketParams): Promise<SupportTicketResponse> {
    return this.request(`/help-support/${encodeURIComponent(params.ticketId)}/respond`, {
      method: "PATCH",
      body: JSON.stringify({ response: params.adminResponse }),
    });
  }

  /**
   * Mark ticket as resolved by updating status
   */
  async markAsResolved(ticketId: string): Promise<SupportTicketResponse> {
    return this.request(`/help-support/${encodeURIComponent(ticketId)}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: "RESOLVED" }),
    });
  }

  /**
   * Update ticket status
   */
  async updateTicketStatus(
    ticketId: string, 
    status: SupportTicketStatus
  ): Promise<SupportTicketResponse> {
    return this.request(`/help-support/${encodeURIComponent(ticketId)}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  /**
   * Delete a support ticket
   */
  async deleteTicket(ticketId: string): Promise<void> {
    return this.request(`/help-support/${encodeURIComponent(ticketId)}`, {
      method: "DELETE",
    });
  }
}

export const supportService = new SupportService();