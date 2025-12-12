// src/utils/paymentUtils.ts

import { BaseTransaction, PaymentFilterState } from "@/store/paymentManagementStore";

export const filterPayments = (
  payments: BaseTransaction[],
  filters: PaymentFilterState,
  searchQuery: string
): BaseTransaction[] => {
  let filtered = [...payments];

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.reference?.toLowerCase().includes(query) ||
        p.serviceTitle?.toLowerCase().includes(query) ||
        p.buyerName?.toLowerCase().includes(query) ||
        p.sellerName?.toLowerCase().includes(query)
    );
  }

  if (filters.status) filtered = filtered.filter((p) => p.status === filters.status);
  if (filters.fromDate) filtered = filtered.filter((p) => new Date(p.createdAt) >= filters.fromDate!);
  if (filters.toDate) filtered = filtered.filter((p) => new Date(p.createdAt) <= filters.toDate!);
  if (filters.minAmount !== undefined) filtered = filtered.filter((p) => p.amount >= filters.minAmount!);
  if (filters.maxAmount !== undefined) filtered = filtered.filter((p) => p.amount <= filters.maxAmount!);
  if (filters.userType) {
    filtered = filtered.filter(
      (p) => p.buyerRole === filters.userType || p.sellerRole === filters.userType
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

// FINAL PERFECT DATE — short, clean, never wraps
export const formatDate = (dateString: string): string => {
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