// @/services/DisputeService.ts
import { getSession } from "next-auth/react";
import getBaseUrl from "./baseUrl";

const baseUrl = getBaseUrl("live");

/**
 * Dispute Resolution Actions
 */
export enum DisputeResolutionAction {
  REFUND_BUYER = "REFUND_BUYER",
  PAY_SELLER = "PAY_SELLER",
  SPLIT_PAYMENT = "SPLIT_PAYMENT",
  REQUEST_REWORK = "REQUEST_REWORK",
}

/**
 * Admin Resolve Dispute DTO
 */
export interface AdminResolveDisputeDto {
  action: DisputeResolutionAction;
  resolveComment?: string;
  buyerPercentage?: number; // Max 70% for SPLIT_PAYMENT
}

/**
 * Dispute Resolution Response
 */
export interface DisputeResolutionResponse {
  message: string;
  paidAmount?: number;
  maxRefund?: number;
  action: DisputeResolutionAction;
}

/**
 * Dispute Service Class - Following PaymentService Pattern
 */
class DisputeServiceClass {
  /**
   * Generic request method with NextAuth session - CRITICAL: Ensure token is sent
   */
  private async request(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    const session = await getSession();

    // 🔴 CRITICAL: Check for access token
    if (!session?.accessToken) {
      console.error("❌ No access token found in session");
      throw new Error("Unauthorized - Please log in again");
    }

    console.log("✅ Using access token:", session.accessToken.substring(0, 20) + "...");

    try {
      // 🔴 CRITICAL: Must merge headers properly
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.accessToken}`,
        ...options.headers, // User-provided headers override defaults
      };

      console.log("📤 Request headers:", {
        "Content-Type": headers["Content-Type"],
        "Authorization": headers["Authorization"] ? "Bearer [TOKEN]" : "MISSING!",
      });

      const response = await fetch(`${baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      console.log(`📍 Response status for ${endpoint}:`, response.status);

      // Handle 401 - Token may have expired
      if (response.status === 401) {
        console.error("❌ Unauthorized (401): Token expired or invalid");
        throw new Error("Unauthorized - Session expired");
      }

      // Handle 403 - Forbidden (Missing permissions)
      // if (response.status === 403) {
      //   console.error("❌ Forbidden (403): Access denied - Check permissions");
      //   const errorData = await response.json().catch(() => ({}));
      //   throw new Error(errorData.message || "Forbidden - Access denied. Missing DISPUTE_ADMIN_RESOLVE permission?");
      // }

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
   * Get all disputes with pagination and filters
   */
  async getDisputes(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<any> {
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
    const endpoint = `/disputes${query ? `?${query}` : ""}`;

    return this.request(endpoint);
  }

  /**
   * Get single dispute details
   */
  async getDisputeById(disputeId: string): Promise<any> {
    const endpoint = `/disputes/${encodeURIComponent(disputeId)}`;
    return this.request(endpoint);
  }

  /**
   * Admin resolve dispute with action and optional split percentage
   * 🔴 CRITICAL: This method MUST send the access token via request()
   */
  async resolveDispute(
    disputeId: string,
    action: DisputeResolutionAction | string,
    resolveComment?: string,
    buyerPercentage?: number
  ): Promise<DisputeResolutionResponse> {
    const endpoint = `/disputes/${encodeURIComponent(disputeId)}/resolve`;

    const dto: AdminResolveDisputeDto = {
      action: action as DisputeResolutionAction,
      resolveComment,
      buyerPercentage,
    };

    console.log("🚀 Resolving dispute:", {
      disputeId,
      action,
      endpoint,
      dto,
    });

    // 🔴 CRITICAL: Use this.request() which handles token
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(dto),
    });
  }

  /**
   * Refund buyer (70% of paid amount)
   */
  async refundBuyer(
    disputeId: string,
    comment?: string
  ): Promise<DisputeResolutionResponse> {
    return this.resolveDispute(
      disputeId,
      DisputeResolutionAction.REFUND_BUYER,
      comment
    );
  }

  /**
   * Pay seller (release 65% escrow)
   */
  async paySeller(
    disputeId: string,
    comment?: string
  ): Promise<DisputeResolutionResponse> {
    return this.resolveDispute(
      disputeId,
      DisputeResolutionAction.PAY_SELLER,
      comment
    );
  }

  /**
   * Split payment between buyer and seller
   */
  async splitPayment(
    disputeId: string,
    buyerPercentage: number = 50,
    comment?: string
  ): Promise<DisputeResolutionResponse> {
    // Ensure buyer percentage doesn't exceed 70%
    const percentage = Math.min(buyerPercentage, 70);

    return this.resolveDispute(
      disputeId,
      DisputeResolutionAction.SPLIT_PAYMENT,
      comment,
      percentage
    );
  }

  /**
   * Request seller to rework job
   */
  async requestRework(
    disputeId: string,
    comment?: string
  ): Promise<DisputeResolutionResponse> {
    return this.resolveDispute(
      disputeId,
      DisputeResolutionAction.REQUEST_REWORK,
      comment
    );
  }
}

// Export singleton instance
export const disputeService = new DisputeServiceClass();

// For backward compatibility
export default disputeService;