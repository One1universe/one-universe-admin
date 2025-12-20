// src/services/platformSettingsService.ts
import { getSession } from "next-auth/react";
import getBaseUrl from "./baseUrl";

const baseUrl = getBaseUrl("live");

export interface PlatformSettings {
  id: string;
  active: boolean;
  platformFeePercentage: number;
  maxTransactionAmount: string;
  rewardEligibilityDays: number;
  maxReferralsPerUserPerMonth: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdatePlatformFeePayload {
  platformFeePercentage: number;
}

interface PlatformSettingsResponse {
  status: string;
  message: string;
  data: PlatformSettings;
}

class PlatformSettingsService {
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
          Authorization: `Bearer ${session.accessToken}`,
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
   * Get platform settings by ID
   */
  async getPlatformSettings(settingsId: string) {
    console.log("🔍 Fetching platform settings for ID:", settingsId);
    return this.request(`/referrals/settings/${encodeURIComponent(settingsId)}`);
  }

  /**
   * Update platform fee percentage
   */
  async updatePlatformFee(
    settingsId: string,
    payload: UpdatePlatformFeePayload
  ) {
    console.log("📝 Updating platform fee for ID:", settingsId, "Payload:", payload);
    return this.request(
      `/referrals/settings/${encodeURIComponent(settingsId)}/platform-fee`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      }
    );
  }

}

export const platformSettingsService = new PlatformSettingsService();