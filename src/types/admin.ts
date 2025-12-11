// types/admin.ts
export interface PermissionData {
  module: string;
  action: string;
}

export interface InviteAdminPayload {
  fullName: string;
  email: string;
  roleName: string;
  permissions: PermissionData[];
}

export interface InviteResponse {
  success: boolean;
  message: string;
  inviteId?: string;
  email?: string;
}