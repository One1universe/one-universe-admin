import { create } from "zustand";
import { 
  notificationsService, 
  Notification, 
  NotificationsResponse,
  PaginationParams 
} from "@/services/Notificationsservice";

interface NotificationsState {
  notifications: Notification[];
  total: number;
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  currentOffset: number;
  currentLimit: number;
  fetchNotifications: (params?: PaginationParams) => Promise<void>;
  fetchUnreadNotifications: (params?: PaginationParams) => Promise<void>;
  getUnreadCount: () => Promise<void>;
  getNotificationById: (notificationId: string) => Promise<Notification | null>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  deleteAllNotifications: () => Promise<void>;
  setNotifications: (notifications: Notification[]) => void;
  setUnreadCount: (count: number) => void;
  clearError: () => void;
  resetNotifications: () => void;
  loadMore: () => Promise<void>;
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: [],
  total: 0,
  unreadCount: 0,
  isLoading: false,
  error: null,
  currentOffset: 0,
  currentLimit: 10,

  fetchNotifications: async (params?: PaginationParams) => {
    set({ isLoading: true, error: null });
    try {
      const limit = params?.limit ?? get().currentLimit;
      const offset = params?.offset ?? 0;

      const response = await notificationsService.getMyNotifications({
        limit,
        offset,
      });

      const unreadCount = response.notifications.filter(n => !n.isRead).length;

      set({
        notifications: response.notifications,
        total: response.total,
        unreadCount,
        isLoading: false,
        currentOffset: offset,
        currentLimit: limit,
      });
      
      console.log("✅ Notifications fetched successfully:", response.notifications.length);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch notifications";
      set({
        error: errorMessage,
        isLoading: false,
      });
      console.error("❌ Error fetching notifications:", errorMessage);
    }
  },

  fetchUnreadNotifications: async (params?: PaginationParams) => {
    set({ isLoading: true, error: null });
    try {
      const limit = params?.limit ?? get().currentLimit;
      const offset = params?.offset ?? 0;

      const response = await notificationsService.getUnreadNotifications({
        limit,
        offset,
      });

      set({
        notifications: response.notifications,
        total: response.total,
        unreadCount: response.notifications.length,
        isLoading: false,
        currentOffset: offset,
        currentLimit: limit,
      });
      
      console.log("✅ Unread notifications fetched:", response.notifications.length);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch unread notifications";
      set({
        error: errorMessage,
        isLoading: false,
      });
      console.error("❌ Error fetching unread notifications:", errorMessage);
    }
  },

  getUnreadCount: async () => {
    try {
      const count = await notificationsService.getUnreadCount();
      set({ unreadCount: count });
      console.log(`✅ Unread count: ${count}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch unread count";
      set({ error: errorMessage });
      console.error("❌ Error fetching unread count:", errorMessage);
    }
  },

  getNotificationById: async (notificationId: string) => {
    try {
      const notification = await notificationsService.getNotificationById(notificationId);
      return notification;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch notification";
      set({ error: errorMessage });
      console.error("❌ Error fetching notification:", errorMessage);
      return null;
    }
  },

  markAsRead: async (notificationId: string) => {
    try {
      await notificationsService.markAsRead(notificationId);

      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === notificationId ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
      
      console.log(`✅ Notification ${notificationId} marked as read`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to mark as read";
      set({ error: errorMessage });
      console.error("❌ Error marking notification as read:", errorMessage);
    }
  },

  markAllAsRead: async () => {
    try {
      await notificationsService.markAllAsRead();

      set((state) => ({
        notifications: state.notifications.map((n) => ({
          ...n,
          isRead: true,
        })),
        unreadCount: 0,
      }));
      
      console.log("✅ All notifications marked as read");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to mark all as read";
      set({ error: errorMessage });
      console.error("❌ Error marking all as read:", errorMessage);
    }
  },

  deleteNotification: async (notificationId: string) => {
    try {
      await notificationsService.deleteNotification(notificationId);

      set((state) => {
        const deletedNotification = state.notifications.find(n => n.id === notificationId);
        const wasUnread = deletedNotification && !deletedNotification.isRead;

        return {
          notifications: state.notifications.filter((n) => n.id !== notificationId),
          unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
          total: Math.max(0, state.total - 1),
        };
      });
      
      console.log(`✅ Notification ${notificationId} deleted`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete notification";
      set({ error: errorMessage });
      console.error("❌ Error deleting notification:", errorMessage);
    }
  },

  deleteAllNotifications: async () => {
    try {
      await notificationsService.deleteAllNotifications();

      set({
        notifications: [],
        unreadCount: 0,
        total: 0,
      });
      
      console.log("✅ All notifications deleted");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete all notifications";
      set({ error: errorMessage });
      console.error("❌ Error deleting all notifications:", errorMessage);
    }
  },

  loadMore: async () => {
    const state = get();
    if (state.isLoading || state.notifications.length >= state.total) {
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const newOffset = state.currentOffset + state.currentLimit;
      
      const response = await notificationsService.getMyNotifications({
        limit: state.currentLimit,
        offset: newOffset,
      });

      const unreadInNewBatch = response.notifications.filter(n => !n.isRead).length;

      set({
        notifications: [...state.notifications, ...response.notifications],
        unreadCount: state.unreadCount + unreadInNewBatch,
        isLoading: false,
        currentOffset: newOffset,
      });
      
      console.log("✅ More notifications loaded:", response.notifications.length);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load more notifications";
      set({
        error: errorMessage,
        isLoading: false,
      });
      console.error("❌ Error loading more notifications:", errorMessage);
    }
  },

  setNotifications: (notifications: Notification[]) => {
    const unreadCount = notifications.filter(n => !n.isRead).length;
    set({ 
      notifications,
      unreadCount,
    });
  },

  setUnreadCount: (count: number) => {
    set({ unreadCount: count });
  },

  clearError: () => {
    set({ error: null });
  },

  resetNotifications: () => {
    set({
      notifications: [],
      total: 0,
      unreadCount: 0,
      isLoading: false,
      error: null,
      currentOffset: 0,
      currentLimit: 10,
    });
  },
}));