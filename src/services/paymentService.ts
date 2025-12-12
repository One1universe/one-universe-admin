// src/services/paymentService.ts
import { getSession } from "next-auth/react";
import getBaseUrl from "./baseUrl";

const baseUrl = getBaseUrl("live");

class PaymentService {
  /**
   * Generic request method with auth
   */
  private async request(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    const session = await getSession();
    
    if (!session?.accessToken) {
      console.error("❌ No access token found in session");
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

      // Handle 401 - Token may have expired even with auto-refresh
      if (response.status === 401) {
        console.error("❌ Unauthorized: Token expired or invalid");
        throw new Error("Unauthorized - Session expired");
      }

      if (response.status === 403) {
        console.error("❌ Forbidden: Access denied");
        throw new Error("Forbidden - Access denied");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `API Error: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`❌ Request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Get all payments with pagination
   */
  async getAllPayments(params?: { page?: number; limit?: number }) {
    const searchParams = new URLSearchParams();
    
    if (params?.page !== undefined) {
      searchParams.append("page", String(params.page));
    }
    if (params?.limit !== undefined) {
      searchParams.append("limit", String(params.limit));
    }

    const query = searchParams.toString();
    const endpoint = `/payments${query ? `?${query}` : ""}`;

    return this.request(endpoint);
  }

  /**
   * Get transaction history for a specific user
   */
  async getUserTransactionHistory(userId: string) {
    return this.request(`/payments/history?userId=${encodeURIComponent(userId)}`);
  }

  /**
   * Get payment details for a specific transaction
   */
  async getPaymentDetails(reference: string) {
    return this.request(`/payments/${encodeURIComponent(reference)}`);
  }
}

export const paymentService = new PaymentService();