// src/services/appRatingsService.ts
import { getSession } from "next-auth/react";
import getBaseUrl from "./baseUrl";

const baseUrl = getBaseUrl("live");

export interface AppRatingUser {
  id: string;
  fullName: string;
  email: string;
  profilePicture: string | null;
  devices: Array<{
    platform: string;
    createdAt: string;
  }>;
}

export interface AppRating {
  id: string;
  rating: number;
  message: string;
  createdAt: string;
  updatedAt: string;
  userId: string | null;
  adminReply: string | null;
  repliedAt: string | null;
  user: AppRatingUser | null;
  platform: "ios" | "android" | "UNKNOWN";
}

export interface AppRatingsApiResponse {
  total: number;
  page: number;
  limit: number;
  pages: number;
  data: AppRating[];
}

export interface FetchRatingsParams {
  page?: number;
  limit?: number;
  rating?: number;
  platform?: string;
  fromDate?: string;
  toDate?: string;
}

export interface ReplyToRatingParams {
  ratingId: string;
  adminReply: string;
}

class AppRatingsService {
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

      // Handle 401 - Token may have expired
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
   * Get all app ratings with pagination and filters
   */
  async getAllRatings(params?: FetchRatingsParams): Promise<AppRatingsApiResponse> {
    const searchParams = new URLSearchParams();
    
    if (params?.page !== undefined) {
      searchParams.append("page", String(params.page));
    }
    if (params?.limit !== undefined) {
      searchParams.append("limit", String(params.limit));
    }
    if (params?.rating !== undefined) {
      searchParams.append("rating", String(params.rating));
    }
    if (params?.platform) {
      searchParams.append("platform", params.platform);
    }
    if (params?.fromDate) {
      searchParams.append("fromDate", params.fromDate);
    }
    if (params?.toDate) {
      searchParams.append("toDate", params.toDate);
    }

    const query = searchParams.toString();
    const endpoint = `/app-ratings${query ? `?${query}` : ""}`;

    console.log("📊 Fetching ratings with endpoint:", endpoint);

    return this.request(endpoint);
  }

  /**
   * Reply to a rating
   */
  async replyToRating(params: ReplyToRatingParams): Promise<AppRating> {
    return this.request(`/app-ratings/${encodeURIComponent(params.ratingId)}/reply`, {
      method: "PATCH",
      body: JSON.stringify({ adminReply: params.adminReply }),
    });
  }

  /**
   * Get a specific rating by ID
   */
  async getRatingById(ratingId: string): Promise<AppRating> {
    return this.request(`/app-ratings/${encodeURIComponent(ratingId)}`);
  }
}

export const appRatingsService = new AppRatingsService();