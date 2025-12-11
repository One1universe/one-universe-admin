import { HttpService } from '@/services/httpService';
import { PermissionData, InviteAdminPayload, InviteResponse } from '@/types/admin';

class AdminService {
  private request = new HttpService();

  /**
   * Fetch all roles
   */
  async getRoles() {
    try {
      return await this.request.get('/roles', true);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
      throw error;
    }
  }

  /**
   * Fetch all permissions
   */
  async getPermissions() {
    try {
      return await this.request.get('/permissions', true);
    } catch (error) {
      console.error('Failed to fetch permissions:', error);
      throw error;
    }
  }

  /**
   * Send admin invitation
   */
  async sendAdminInvite(payload: InviteAdminPayload) {
    try {
      return await this.request.post('/auth/send-invite', payload, true);
    } catch (error: any) {
      console.error('Failed to send invite:', error);
      throw error?.response?.data || error;
    }
  }
}

export const adminService = new AdminService();