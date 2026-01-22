// src/utils/paymentUtils.ts

import { Payment, PaymentFilterState } from "@/store/paymentManagementStore";

export const filterPayments = (
  payments: Payment[],
  filters: PaymentFilterState,
  searchQuery: string
): Payment[] => {
  let filtered = [...payments];

  // Search filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase().trim();
    filtered = filtered.filter((p) =>
      p.id?.toLowerCase().includes(query) ||
      p.serviceTitle?.toLowerCase().includes(query) ||
      p.userName?.toLowerCase().includes(query) ||
      p.userEmail?.toLowerCase().includes(query) ||
      p.userPhone?.toLowerCase().includes(query)
    );
  }

  // Status filter
  if (filters.status) {
    filtered = filtered.filter((p) => p.status === filters.status);
  }

  // Date range
  if (filters.fromDate) {
    filtered = filtered.filter(
      (p) => new Date(p.createdAt) >= filters.fromDate!
    );
  }
  if (filters.toDate) {
    filtered = filtered.filter(
      (p) => new Date(p.createdAt) <= filters.toDate!
    );
  }

  // Amount range
  if (filters.minAmount !== undefined) {
    filtered = filtered.filter((p) => p.amount >= filters.minAmount!);
  }
  if (filters.maxAmount !== undefined) {
    filtered = filtered.filter((p) => p.amount <= filters.maxAmount!);
  }

  // User type filter – safe check for undefined
  if (filters.userType) {
    filtered = filtered.filter(
      (p) =>
        p.displayAs === filters.userType ||
        p.role.toLowerCase().includes(filters.userType!.toLowerCase())
    );
  }

  return filtered;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateString: string | Date): string => {
  if (!dateString) return "N/A";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";

  const day = date.toLocaleDateString("en-GB", { day: "2-digit" });
  const month = date.toLocaleDateString("en-GB", { month: "short" });
  const year = date.getFullYear();
  const time = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return `${day} ${month} ${year}, ${time}`;
};