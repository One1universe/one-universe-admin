import { getSession } from "next-auth/react";
import getBaseUrl from "./baseUrl";

const baseUrl = getBaseUrl("live");

export interface NotificationData {
  ticketId?: string;
  [key: string]: any;
}

export interface NotificationSender {
  id: string;
  fullName: string;
  profilePicture: string;
  email: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  data: NotificationData;
  isRead: boolean;
  createdAt: string;
  type: string;
  sender: NotificationSender;
}

export interface NotificationsResponse {
  total: number;
  notifications: Notification[];
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface UnreadCountResponse {
  count: number;
}

class NotificationsService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
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

  async getMyNotifications(
    params?: PaginationParams
  ): Promise<NotificationsResponse> {
    const searchParams = new URLSearchParams();

    if (params?.limit !== undefined) {
      searchParams.append("limit", String(params.limit));
    }
    if (params?.offset !== undefined) {
      searchParams.append("offset", String(params.offset));
    }

    const query = searchParams.toString();
    const endpoint = `/notifications/my${query ? `?${query}` : ""}`;

    return this.request<NotificationsResponse>(endpoint);
  }

  async getAllNotifications(
    params?: PaginationParams
  ): Promise<NotificationsResponse> {
    const searchParams = new URLSearchParams();

    if (params?.limit !== undefined) {
      searchParams.append("limit", String(params.limit));
    }
    if (params?.offset !== undefined) {
      searchParams.append("offset", String(params.offset));
    }

    const query = searchParams.toString();
    const endpoint = `/notifications${query ? `?${query}` : ""}`;

    return this.request<NotificationsResponse>(endpoint);
  }

  async getUnreadNotifications(
    params?: PaginationParams
  ): Promise<NotificationsResponse> {
    const searchParams = new URLSearchParams();

    if (params?.limit !== undefined) {
      searchParams.append("limit", String(params.limit));
    }
    if (params?.offset !== undefined) {
      searchParams.append("offset", String(params.offset));
    }

    const query = searchParams.toString();
    const endpoint = `/notifications/unread${query ? `?${query}` : ""}`;

    return this.request<NotificationsResponse>(endpoint);
  }

  async getUnreadCount(): Promise<number> {
    const data = await this.request<UnreadCountResponse>("/notifications/unread/count");
    return data.count || 0;
  }

  async getNotificationById(notificationId: string): Promise<Notification> {
    return this.request<Notification>(
      `/notifications/${encodeURIComponent(notificationId)}`
    );
  }

  async markAsRead(notificationId: string): Promise<Notification> {
    return this.request<Notification>(
      `/notifications/${encodeURIComponent(notificationId)}/read`,
      {
        method: "POST",
      }
    );
  }

  async markAllAsRead(): Promise<{ success: boolean; updated: number }> {
    return this.request<{ success: boolean; updated: number }>(
      "/notifications/read-all",
      {
        method: "POST",
      }
    );
  }

  async deleteNotification(
    notificationId: string
  ): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(
      `/notifications/${encodeURIComponent(notificationId)}`,
      {
        method: "DELETE",
      }
    );
  }

  async deleteAllNotifications(): Promise<{ success: boolean; deleted: number }> {
    return this.request<{ success: boolean; deleted: number }>(
      "/notifications/delete-all",
      {
        method: "DELETE",
      }
    );
  }

  isNotificationType(notification: Notification, type: string): boolean {
    return notification.type === type;
  }

  getTicketId(notification: Notification): string | undefined {
    return notification.data?.ticketId;
  }

  formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  }
}

export const notificationsService = new NotificationsService();