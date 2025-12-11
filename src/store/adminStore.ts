import { create } from 'zustand';
import { adminService } from '@/services/admin.service';
import { PermissionData, InviteAdminPayload } from '@/types/admin';

export interface RoleOption {
  id: string;
  name: string;
  description: string | null;
}

export interface PermissionOption {
  id: string;
  module: string;
  action: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

interface AdminStore {
  // Data
  roles: RoleOption[];
  permissions: PermissionOption[];
  loading: boolean;
  error: string | null;

  // Methods
  fetchRoles: () => Promise<void>;
  fetchPermissions: () => Promise<void>;
  sendInvite: (payload: InviteAdminPayload) => Promise<any>;
  clearError: () => void;

  // Helpers
  getPermissionsByModule: (module: string) => PermissionOption[];
  getUniqueModules: () => string[];
  getPermissionsByModuleAndAction: (
    module: string,
    action: string
  ) => PermissionOption | undefined;
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  roles: [],
  permissions: [],
  loading: false,
  error: null,

  fetchRoles: async () => {
    set({ loading: true });
    try {
      const data = await adminService.getRoles();
      const roles = (data as RoleOption[]) || [];
      set({ roles, error: null });
    } catch (error: any) {
      const errorMessage = error?.response?.status === 401 
        ? 'Authentication failed. Please log in again.'
        : error?.message || 'Failed to fetch roles';
      set({ error: errorMessage, roles: [] });
    } finally {
      set({ loading: false });
    }
  },

  fetchPermissions: async () => {
    set({ loading: true });
    try {
      const data = await adminService.getPermissions();
      const permissions = (data as PermissionOption[]) || [];
      set({ permissions, error: null });
    } catch (error: any) {
      const errorMessage = error?.response?.status === 401 
        ? 'Authentication failed. Please log in again.'
        : error?.message || 'Failed to fetch permissions';
      set({ error: errorMessage, permissions: [] });
    } finally {
      set({ loading: false });
    }
  },

  sendInvite: async (payload: InviteAdminPayload) => {
    set({ loading: true, error: null });
    try {
      const response = await adminService.sendAdminInvite(payload);
      set({ error: null });
      return response;
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to send invite';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),

  // Helper: Get permissions grouped by module
  getPermissionsByModule: (module: string) => {
    const { permissions } = get();
    return permissions.filter((p) => p.module === module);
  },

  // Helper: Get unique modules
  getUniqueModules: () => {
    const { permissions } = get();
    return Array.from(new Set(permissions.map((p) => p.module)));
  },

  // Helper: Get specific permission
  getPermissionsByModuleAndAction: (module: string, action: string) => {
    const { permissions } = get();
    return permissions.find((p) => p.module === module && p.action === action);
  },
}));