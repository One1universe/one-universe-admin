// src/store/paymentManagementStore.ts
import { create } from "zustand";
import { paymentService } from "@/services/paymentService";

// === Types ===
export type PaymentStatus =
  | "PAID"
  | "PENDING"
  | "DISPUTED"
  | "PENDING REFUND"
  | "REFUNDED"
  | "FAILED";

export type BookingStatus =
  | "BUYER_CONFIRM_COMPLETION"
  | "SELLER_CONFIRM_COMPLETION"
  | "COMPLETED"
  | "CANCELLED"
  | "IN_PROGRESS"
  | "PENDING";

export type JobStatus = "COMPLETED" | "IN_PROGRESS" | "PENDING" | "CANCELLED";
export type RoleType = "BUYER" | "SELLER";

// Legacy format (separate buyer/seller)
export interface LegacyBaseTransaction {
  reference: string;
  serviceTitle: string | null;
  buyerName: string | null;
  buyerUserId: string | null;
  buyerRole: RoleType;
  sellerName: string | null;
  sellerUserId: string | null;
  sellerRole: RoleType;
  amount: number;
  status: PaymentStatus;
  createdAt: string;
}

// New unified format
export interface UnifiedBaseTransaction {
  reference: string;
  serviceTitle: string | null;
  userName: string;
  userEmail: string;
  userPhone: string;
  userId: string | null;
  displayAs: "BUYER" | "SELLER" | "USER" | "SYSTEM";
  role: string;
  amount: number;
  type: string;
  status: PaymentStatus;
  createdAt: string;
}

// Normalized Payment type for table
export interface Payment {
  id: string;
  serviceTitle: string | null;
  userName: string;
  userEmail: string;
  userPhone: string;
  userId: string | null;
  displayAs: "BUYER" | "SELLER" | "USER" | "SYSTEM";
  role: string;
  amount: number;
  type: string;
  status: PaymentStatus;
  createdAt: string | Date;
}

export interface JobDetails {
  buyerArrived: boolean;
  sellerArrived: boolean;
  buyerCompleted: boolean;
  sellerCompleted: boolean;
  payment30Done: boolean;
  payment65Done: boolean;
  agreedPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface DetailedTransaction {
  reference: string;
  amount: number;
  status: PaymentStatus;
  createdAt: string;
  serviceTitle: string;
  bookingId: string;
  bookingStatus: BookingStatus;
  bookingLocation: string;
  bookingDate: string;
  buyerName: string;
  buyerEmail: string | null;
  buyerPhone: string | null;
  buyerRole: RoleType;
  sellerName: string;
  sellerEmail: string | null;
  sellerPhone: string | null;
  sellerRole: RoleType;
  sellerBusinessName: string;
  jobStatus: JobStatus;
  jobDetails: JobDetails;
  // Additional fields from API response for logic
  role: string;
  type: string;
  displayAs: string;
  userName: string;
  userEmail: string;
  userId: string | null;
}

interface BaseTransactionsResponse {
  status: string;
  message: string;
  data: (LegacyBaseTransaction | UnifiedBaseTransaction)[];
  meta: {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev: number | null;
    next: number | null;
  };
}

interface DetailedTransactionsResponse {
  status: string;
  message: string;
  data: DetailedTransaction[];
}

export interface PaymentFilterState {
  status?: PaymentStatus;
  fromDate?: Date;
  toDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  userType?: RoleType;
}

// === Helper: Type guard for HttpError ===
interface HttpError {
  error: true;
  message: string;
}

function isHttpError(response: unknown): response is HttpError {
  return (
    typeof response === "object" &&
    response !== null &&
    "error" in response &&
    (response as any).error === true
  );
}

// === Normalization Helper ===
const normalizeTransaction = (
  tx: LegacyBaseTransaction | UnifiedBaseTransaction,
): Payment => {
  // New unified format
  if ("userName" in tx && "displayAs" in tx) {
    return {
      id: tx.reference,
      serviceTitle: tx.serviceTitle,
      userName: tx.userName,
      userEmail: tx.userEmail || "—",
      userPhone: tx.userPhone || "—",
      userId: tx.userId,
      displayAs: tx.displayAs,
      role: tx.role,
      amount: tx.amount,
      type: tx.type || "UNKNOWN",
      status: tx.status,
      createdAt: tx.createdAt,
    };
  }

  // Legacy format
  const hasBuyer = tx.buyerName && tx.buyerUserId;
  const hasSeller = tx.sellerName && tx.sellerUserId;

  let userName = "—";
  let userId: string | null = null;
  let displayAs: Payment["displayAs"] = "SYSTEM";
  let role = "Unknown";

  if (hasBuyer && hasSeller) {
    userName = `${tx.buyerName} & ${tx.sellerName}`;
    userId = tx.buyerUserId; // Prefer buyer, or handle both if needed
    displayAs = "BUYER";
    role = "Buyer & Seller";
  } else if (hasBuyer) {
    userName = tx.buyerName!;
    userId = tx.buyerUserId;
    displayAs = "BUYER";
    role = tx.buyerRole || "Buyer";
  } else if (hasSeller) {
    userName = tx.sellerName!;
    userId = tx.sellerUserId;
    displayAs = "SELLER";
    role = tx.sellerRole || "Seller";
  }

  return {
    id: tx.reference,
    serviceTitle: tx.serviceTitle,
    userName,
    userEmail: "—",
    userPhone: "—",
    userId,
    displayAs,
    role,
    amount: tx.amount,
    type: "PAYMENT", // Assume for legacy
    status: tx.status,
    createdAt: tx.createdAt,
  };
};

// === Store ===
interface PaymentManagementState {
  allPayments: Payment[];
  allPaymentsLoading: boolean;
  allPaymentsError: string | null;
  allPaymentsMeta: BaseTransactionsResponse["meta"] | null;

  userTransactions: DetailedTransaction[];
  userTransactionsLoading: boolean;
  userTransactionsError: string | null;
  selectedUserId: string | null;

  selectedTransaction: DetailedTransaction | null;

  searchQuery: string;
  filters: PaymentFilterState;

  fetchAllPayments: (page?: number, perPage?: number) => Promise<void>;
  fetchUserTransactions: (userId: string) => Promise<void>;
  setSelectedTransaction: (tx: DetailedTransaction | null) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: PaymentFilterState) => void;
  clearFilters: () => void;
  clearUserTransactions: () => void;
}

export const paymentManagementStore = create<PaymentManagementState>((set) => ({
  allPayments: [],
  allPaymentsLoading: false,
  allPaymentsError: null,
  allPaymentsMeta: null,

  userTransactions: [],
  userTransactionsLoading: false,
  userTransactionsError: null,
  selectedUserId: null,

  selectedTransaction: null,
  searchQuery: "",
  filters: {},

  fetchAllPayments: async (page = 1, limit = 100) => {
    set({ allPaymentsLoading: true, allPaymentsError: null });

    try {
      const response: unknown = await paymentService.getAllPayments({
        page,
        limit,
      });

      if (isHttpError(response)) {
        throw new Error(response.message);
      }

      const typedResponse = response as BaseTransactionsResponse;

      // Normalize all transactions
      const normalizedPayments = typedResponse.data.map(normalizeTransaction);

      set({
        allPayments: normalizedPayments,
        allPaymentsMeta: typedResponse.meta,
        allPaymentsError: null,
      });
    } catch (err: any) {
      console.error("Failed to fetch all payments:", err);
      set({
        allPayments: [],
        allPaymentsMeta: null,
        allPaymentsError: err.message || "Failed to load payments",
      });
    } finally {
      set({ allPaymentsLoading: false });
    }
  },

  fetchUserTransactions: async (userId: string) => {
    set({
      userTransactionsLoading: true,
      userTransactionsError: null,
      selectedUserId: userId,
    });

    try {
      const response: unknown =
        await paymentService.getUserTransactionHistory(userId);

      if (isHttpError(response)) {
        throw new Error(response.message);
      }

      const typedResponse = response as DetailedTransactionsResponse;

      set({
        userTransactions: typedResponse.data,
        userTransactionsError: null,
      });
    } catch (err: any) {
      console.error("Failed to fetch user transactions:", err);
      set({
        userTransactions: [],
        userTransactionsError: err.message || "Failed to load transactions",
      });
    } finally {
      set({ userTransactionsLoading: false });
    }
  },

  setSelectedTransaction: (tx) => set({ selectedTransaction: tx }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilters: (filters) => set({ filters }),
  clearFilters: () => set({ filters: {} }),
  clearUserTransactions: () =>
    set({
      userTransactions: [],
      selectedUserId: null,
      selectedTransaction: null,
      userTransactionsError: null,
    }),
}));
