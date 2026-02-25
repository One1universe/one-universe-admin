// src/components/Details/PaymentTable.tsx
"use client";

import { useState } from "react";
import { HiOutlineEye } from "react-icons/hi";
import { cn } from "@/lib/utils";
import PaymentDetailsModal from "./PaymentDetailsModal";
import { paymentService } from "@/services/paymentService";

import { DetailedTransaction } from "@/store/paymentManagementStore";

// Updated Payment type based on new backend response
export type Payment = {
  id: string; // reference
  serviceTitle: string | null;
  userName: string; // fullName or "—"
  userEmail: string; // email or "—"
  userPhone: string; // phone or "—"
  userId?: string | null;
  displayAs: "BUYER" | "SELLER" | "USER" | "SYSTEM";
  role: string; // e.g. "Buyer", "Seller", "Wallet Owner (Deposit)"
  amount: number;
  type: string; // DEPOSIT, WITHDRAWAL, PAYMENT, REFERRAL, etc.
  status:
    | "PAID"
    | "PENDING"
    | "DISPUTED"
    | "PENDING REFUND"
    | "REFUNDED"
    | "FAILED";
  createdAt: string | Date;
};

interface PaymentTableProps {
  data: Payment[];
  hideServiceColumn?: boolean;
}

const statusConfig = {
  PAID: {
    label: "Paid",
    color: "bg-[#D7FFE9] text-[#1FC16B] border border-[#A3E9C9]",
  },
  PENDING: {
    label: "Pending",
    color: "bg-[#FFF4D6] text-[#F59E0B] border border-[#FFE8A3]",
  },
  DISPUTED: {
    label: "Disputed",
    color: "bg-[#FDEDED] text-[#D00416] border border-[#F9B7B7]",
  },
  "PENDING REFUND": {
    label: "Pending Refund",
    color: "bg-[#E5E5FF] text-[#6366F1] border border-[#C7C7FF]",
  },
  REFUNDED: {
    label: "Refunded",
    color: "bg-[#E0E0E0] text-[#525252] border border-[#BFBFBF]",
  },
  FAILED: {
    label: "Failed",
    color: "bg-[#FDEDED] text-[#D00416] border border-[#F9B7B7] font-semibold",
  },
};

// Add more types as needed
const getPaymentTypeLabel = (payment: Payment) => {
  const { type, role } = payment;

  if (type === "WITHDRAWAL") return "Withdrawal";

  if (type === "CREDIT") {
    if (role.includes("Deposit") || role.includes("Wallet Owner (Deposit)")) {
      return "Wallet Credit";
    }
    return "Seller Credit";
  }

  if (type === "DEBIT") {
    if (role.includes("Wallet Owner")) {
      return "Platform Charge";
    }
    return "Debit";
  }

  return type; // Fallback
};

const getPaymentTypeColor = (label: string) => {
  switch (label) {
    case "Wallet Credit":
    case "Deposit":
      return "text-green-600";
    case "Withdrawal":
      return "text-red-600";
    case "Seller Credit":
      return "text-blue-600";
    case "Platform Charge":
      return "text-orange-600";
    case "Debit":
      return "text-gray-900";
    case "PAYMENT":
      return "text-blue-600";
    case "REFERRAL":
      return "text-purple-600";
    default:
      return "text-gray-600";
  }
};

export default function PaymentTable({
  data,
  hideServiceColumn,
}: PaymentTableProps) {
  const [selectedPaymentDetails, setSelectedPaymentDetails] =
    useState<DetailedTransaction | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const handleOpenDetails = async (payment: Payment) => {
    if (!payment.userId) {
      alert(
        "Cannot view details: No user information is available for this transaction. This might be a system-generated transaction.",
      );
      return;
    }

    setIsLoadingDetails(true);
    setSelectedPaymentDetails(null);

    try {
      const response = await paymentService.getUserTransactionHistory(
        payment.userId,
      );

      if (response.status === "success" && Array.isArray(response.data)) {
        const match = response.data.find(
          (tx: DetailedTransaction) => tx.reference === payment.id,
        );
        if (match) {
          setSelectedPaymentDetails(match);
        } else {
          alert("Transaction details not found in user's history.");
        }
      } else {
        alert("Failed to load transaction details from the server.");
      }
    } catch (error) {
      console.error("Error loading payment details:", error);
      alert("Failed to load transaction details. Please try again later.");
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleCloseModal = () => setSelectedPaymentDetails(null);

  return (
    <>
      {/* DESKTOP TABLE */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#E8E3E3] text-[#646264] text-sm font-medium">
              <th className="py-4 px-6">Reference</th>
              <th className="py-4 px-6">Type</th>
              <th className="py-4 px-6">User</th>
              {!hideServiceColumn && <th className="py-4 px-6">Service</th>}
              <th className="py-4 px-6">Amount</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 min-w-[170px]">Date</th>
              <th className="py-4 px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((payment) => {
              const status = statusConfig[payment.status] || {
                label: payment.status,
                color: "bg-gray-100 text-gray-800",
              };
              const txLabel = getPaymentTypeLabel(payment);
              const txColor = getPaymentTypeColor(txLabel);

              return (
                <tr
                  key={payment.id}
                  className="border-b border-[#E8E3E3] hover:bg-gray-50 transition-colors"
                >
                  <td className="py-5 px-6 text-sm font-medium text-[#171417] break-all">
                    {payment.id}
                  </td>
                  <td className="py-5 px-6">
                    <span className={cn("font-medium", txColor)}>
                      {txLabel}
                    </span>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex flex-col">
                      <span className="font-medium text-[#171417]">
                        {payment.userName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {payment.role} ({payment.displayAs})
                      </span>
                      {payment.userEmail !== "—" && (
                        <span className="text-xs text-gray-500">
                          {payment.userEmail}
                        </span>
                      )}
                    </div>
                  </td>
                  {!hideServiceColumn && (
                    <td className="py-5 px-6 text-[#303237] line-clamp-2 max-w-[220px]">
                      {payment.serviceTitle || "—"}
                    </td>
                  )}
                  <td className="py-5 px-6 font-semibold text-[#171417]">
                    {new Intl.NumberFormat("en-NG", {
                      style: "currency",
                      currency: "NGN",
                    }).format(payment.amount)}
                  </td>
                  <td className="py-5 px-6">
                    <span
                      className={cn(
                        "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium",
                        status.color,
                      )}
                    >
                      {status.label}
                    </span>
                  </td>
                  <td className="py-5 px-6 text-[#303237] whitespace-nowrap text-sm font-medium">
                    {new Date(payment.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="py-5 px-6 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDetails(payment);
                      }}
                      className="p-2 hover:bg-[#E8E3E3] rounded-lg transition group"
                      aria-label="View details"
                    >
                      <HiOutlineEye
                        size={20}
                        className="text-[#646264] group-hover:text-[#04171F]"
                      />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-4 px-4 pb-6">
        {data.map((payment) => {
          const status = statusConfig[payment.status] || {
            label: payment.status,
            color: "bg-gray-100 text-gray-800",
          };
          const txLabel = getPaymentTypeLabel(payment);
          const txColor = getPaymentTypeColor(txLabel);

          return (
            <div
              key={payment.id}
              onClick={() => handleOpenDetails(payment)}
              className="bg-white border border-[#E8E3E3] rounded-2xl p-5 shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-xs text-[#646264] font-medium">
                    Reference
                  </p>
                  <p className="font-semibold text-[#171417] text-sm break-all">
                    {payment.id}
                  </p>
                </div>
                <span
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium",
                    status.color,
                  )}
                >
                  {status.label}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-[#646264]">Type</p>
                  <p className={cn("font-medium", txColor)}>{txLabel}</p>
                </div>

                <div>
                  <p className="text-xs text-[#646264]">User</p>
                  <p className="font-medium text-[#171417]">
                    {payment.userName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {payment.role} ({payment.displayAs})
                  </p>
                  {payment.userEmail !== "—" && (
                    <p className="text-xs text-gray-500">{payment.userEmail}</p>
                  )}
                </div>

                {!hideServiceColumn && (
                  <div>
                    <p className="text-xs text-[#646264]">Service</p>
                    <p className="font-medium text-[#303237] line-clamp-2">
                      {payment.serviceTitle || "—"}
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-end pt-2 border-t border-[#E8E3E3]">
                  <div>
                    <p className="text-xs text-[#646264]">Amount</p>
                    <p className="font-bold text-[#171417] text-lg">
                      {new Intl.NumberFormat("en-NG", {
                        style: "currency",
                        currency: "NGN",
                      }).format(payment.amount)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#646264] whitespace-nowrap">
                      {new Date(payment.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDetails(payment);
                      }}
                      className="p-2 hover:bg-[#F0F0F0] rounded-lg transition"
                      aria-label="View details"
                    >
                      <HiOutlineEye size={20} className="text-[#646264]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {(isLoadingDetails || selectedPaymentDetails) && (
        <PaymentDetailsModal
          isOpen={true}
          onClose={handleCloseModal}
          payment={selectedPaymentDetails}
          isLoading={isLoadingDetails}
        />
      )}
    </>
  );
}
