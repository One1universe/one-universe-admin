import { UserManagementStatusBadgeProp } from "@/app/admin/users-management/UserManagementStatusBadge";
import { create } from "zustand";

type ModalType = "openBuyer" | "openSeller" | "openAdmin" | null;

export type RoleType = {
  id: string;
  name: string;
  description: string;
};

export type UserRole = {
  id: string;
  userId: string;
  roleId: string;
  role: RoleType;
};

export type ProfileType = {
  id: string;
  userId: string;
  bvn?: string;
  serviceDetails?: string;
  businessName?: string;
  businessDescription?: string;
  portfolioGallery?: string[];
  certifications?: string[];
  aboutYou?: string;
  portfolioLink?: string;
  servicesOffered?: string[];
  deliveryTypes?: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type WalletType = {
  id: string;
  userId: string;
  balance: number;
  holdBalance: number;
  createdAt: string;
  updatedAt: string;
};

export type PanicContactType = {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  userId: string;
};

export type BookingStatsType = {
  totalBookings: number;
  ongoingBookings: number;
  completedBookings: number;
  disputedBookings: number;
};

export type UserType = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  location?: string;
  status: UserManagementStatusBadgeProp["status"];
  createdAt: string;
  updatedAt: string;
  profilePicture?: string | null;
  userType: "SELLER" | "BUYER" | "ADMIN";
  profile?: ProfileType;
  wallet?: WalletType;
  verificationStatus?: boolean;
  userRoles?: UserRole[];
  panicContacts?: PanicContactType[];
  bookingStats?: BookingStatsType;
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
