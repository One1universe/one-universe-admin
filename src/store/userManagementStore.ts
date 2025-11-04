import { UserManagementStatusBadgeProp } from "@/app/admin/users-management/UserManagementStatusBadge";
import { create } from "zustand";

type ModalType = "openBuyer" | "openSeller" | "openAdmin" | null;

export type UserType = {
  name: string;
  email: string;
  phone: string;
  location?: string;
  status: UserManagementStatusBadgeProp["status"];
  createdAt: string | Date;
  updatedAt: string | Date;
  avatar: string;
  role?: string;
  isVerified?: boolean;
};

interface ModalState {
  modalType: ModalType;
  selectedUser: UserType | null;
  openModal: (type: ModalType, user?: UserType) => void;
  closeModal: () => void;

  
}

export const userManagementStore = create<ModalState>((set) => ({
  modalType: null,
  selectedUser: null,

  openModal: (type, user) =>
    set({ modalType: type, selectedUser: user || null }),

  closeModal: () => set({ modalType: null, selectedUser: null }),
}));
