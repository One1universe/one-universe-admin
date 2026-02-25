"use client";

import { X, User, Mail, Calendar, Briefcase, MapPin } from "lucide-react";
import { DetailedTransaction } from "@/store/paymentManagementStore";

interface PaymentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: DetailedTransaction | null;
  isLoading?: boolean;
}

const statusConfig = {
  PAID: { bg: "bg-[#D7FFE9]", text: "text-[#1FC16B]", label: "Paid" },
  PENDING: { bg: "bg-[#FFF4D6]", text: "text-[#F59E0B]", label: "Pending" },
  DISPUTED: { bg: "bg-[#FDEDED]", text: "text-[#D00416]", label: "Disputed" },
  "PENDING REFUND": {
    bg: "bg-[#E5E5FF]",
    text: "text-[#6366F1]",
    label: "Refund Pending",
  },
  REFUNDED: { bg: "bg-[#E0E0E0]", text: "text-[#525252]", label: "Refunded" },
  FAILED: { bg: "bg-[#FDEDED]", text: "text-[#D00416]", label: "Failed" },
};

const bookingStatusConfig = {
  BUYER_CONFIRM_COMPLETION: {
    bg: "bg-[#D7FFE9]",
    text: "text-[#1FC16B]",
    label: "Completed",
  }, // ✅ FIXED
  SELLER_CONFIRM_COMPLETION: {
    bg: "bg-[#E5F3FF]",
    text: "text-[#0066CC]",
    label: "In Progress",
  },
  COMPLETED: { bg: "bg-[#D7FFE9]", text: "text-[#1FC16B]", label: "Completed" },
  CANCELLED: { bg: "bg-[#FFF2B9]", text: "text-[#9D7F04]", label: "Cancelled" },
  IN_PROGRESS: {
    bg: "bg-[#E5F3FF]",
    text: "text-[#0066CC]",
    label: "In Progress",
  },
  PENDING: { bg: "bg-[#FFF4D6]", text: "text-[#F59E0B]", label: "Pending" },
};

const jobStatusConfig = {
  COMPLETED: { bg: "bg-[#D7FFE9]", text: "text-[#1FC16B]", label: "Completed" },
  IN_PROGRESS: {
    bg: "bg-[#E5F3FF]",
    text: "text-[#0066CC]",
    label: "In Progress",
  },
  PENDING: { bg: "bg-[#FFF4D6]", text: "text-[#F59E0B]", label: "Pending" },
  CANCELLED: { bg: "bg-[#FFF2B9]", text: "text-[#9D7F04]", label: "Cancelled" },
  DISPUTED: { bg: "bg-[#FDEDED]", text: "text-[#D00416]", label: "Disputed" },
};

export default function PaymentDetailsModal({
  isOpen,
  onClose,
  payment,
  isLoading = false,
}: PaymentDetailsModalProps) {
  if (!isOpen) return null;

  if (isLoading) {
    return (
      <>
        <div
          className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-[775px] max-h-[90vh] overflow-y-auto flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-[#154751] border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </>
    );
  }

  if (!payment) {
    return (
      <>
        <div
          className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-[775px] max-h-[90vh] overflow-y-auto p-8 text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Transaction Details Not Found
            </h3>
            <p className="text-gray-600 mb-6">
              The transaction details could not be found in the user&apos;s
              history. This might be a system-generated transaction or data is
              missing.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#04171F] text-white rounded-lg hover:bg-[#04171F]/90 transition"
            >
              Close
            </button>
          </div>
        </div>
      </>
    );
  }

  // Get status styles
  const statusStyle =
    statusConfig[payment.status as keyof typeof statusConfig] ||
    statusConfig.PENDING;
  const bookingStyle =
    bookingStatusConfig[
      payment.bookingStatus as keyof typeof bookingStatusConfig
    ] || bookingStatusConfig.PENDING;
  const jobStyle =
    jobStatusConfig[payment.jobStatus as keyof typeof jobStatusConfig] ||
    jobStatusConfig.PENDING;

  // Format date
  const formatDate = (dateString: string | Date | null) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  // Format amount
  const formatAmount = (amount: number) => {
    if (typeof amount !== "number" || isNaN(amount)) return "0.00";
    return amount.toFixed(2);
  };

  // Check if it's a booking-related transaction
  const isBookingTransaction = !!payment.bookingId || !!payment.serviceTitle;
  const isSellerCredit = payment.type === "CREDIT" && isBookingTransaction;
  const isPlatformCharge =
    payment.type === "DEBIT" && payment.role?.includes("Wallet Owner");
  const isWalletCredit = payment.type === "CREDIT" && !isBookingTransaction;
  const isWithdrawal = payment.type === "WITHDRAWAL";

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl w-[775px] max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-[#E8FBF7] border-b border-[#E8E3E3] px-6 pt-8 pb-4 flex justify-between items-center">
            <h2 className="font-dm-sans font-bold text-xl leading-[140%] text-[#171417]">
              {isSellerCredit
                ? `Seller Credit – ${payment.reference}`
                : isPlatformCharge
                  ? `Platform Charge – ${payment.reference}`
                  : isWalletCredit
                    ? `Wallet Credit – ${payment.reference}`
                    : isWithdrawal
                      ? `Withdrawal – ${payment.reference}`
                      : "Payment Details"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/60 rounded-lg transition"
              aria-label="Close modal"
            >
              <X size={24} className="text-[#171417]" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4 space-y-6">
            {isWalletCredit || isWithdrawal ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <User size={20} className="text-[#454345]" />
                  <h3 className="font-dm-sans font-bold text-base text-[#646264]">
                    User Information
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-8">
                    <p className="font-dm-sans font-medium text-base text-[#171417] w-16">
                      Name
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="font-dm-sans font-medium text-base text-[#454345]">
                        {payment.userName || payment.buyerName || "N/A"}
                      </p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          payment.displayAs === "SELLER"
                            ? "bg-[#00D084] text-white"
                            : "bg-[#E0E0E0] text-[#525252]"
                        }`}
                      >
                        {payment.displayAs === "SELLER" ? "Seller" : "Buyer"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="font-dm-sans font-medium text-base text-[#171417] w-16">
                      Email
                    </p>
                    <p className="text-base text-[#454345] break-all">
                      {payment.userEmail || payment.buyerEmail || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Seller (Left for Seller Credit/Platform Charge, Right for others) */}
                <div
                  className={`space-y-4 ${
                    isSellerCredit || isPlatformCharge ? "order-1" : "order-2"
                  } ${isPlatformCharge ? "col-span-2" : ""}`}
                >
                  <div className="flex items-center gap-2">
                    <User size={20} className="text-[#454345]" />
                    <h3 className="font-dm-sans font-bold text-base text-[#646264]">
                      Seller Information
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-8">
                      <p className="font-dm-sans font-medium text-base text-[#171417] w-16">
                        Name
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="font-dm-sans font-medium text-base text-[#454345]">
                          {payment.sellerName || payment.userName || "N/A"}
                        </p>
                        {(isSellerCredit || isPlatformCharge) && (
                          <span className="bg-[#00D084] text-white text-xs px-2 py-0.5 rounded-full font-medium">
                            Seller
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="font-dm-sans font-medium text-base text-[#171417] w-16">
                        Email
                      </p>
                      {/* <Mail size={20} className="text-[#454345]" /> */}
                      <p className="text-base text-[#454345] break-all">
                        {payment.sellerEmail || payment.userEmail || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Buyer (Right for Seller Credit, Left for others, Hidden for Platform Charge) */}
                {!isPlatformCharge && (
                  <div
                    className={`space-y-4 ${
                      isSellerCredit ? "order-2" : "order-1"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <User size={20} className="text-[#454345]" />
                      <h3 className="font-dm-sans font-bold text-base text-[#646264]">
                        Buyer Information
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-8">
                        <p className="font-dm-sans font-medium text-base text-[#171417] w-16">
                          Name
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="font-dm-sans font-medium text-base text-[#171417]">
                            {payment.buyerName || "N/A"}
                          </p>
                          {isSellerCredit && (
                            <span className="bg-[#E0E0E0] text-[#525252] text-xs px-2 py-0.5 rounded-full font-medium">
                              Buyer
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="font-dm-sans font-medium text-base text-[#171417] w-16">
                          Email
                        </p>
                        {/* <Mail size={20} className="text-[#454345]" /> */}
                        <p className="text-base text-[#454345] break-all">
                          {payment.buyerEmail || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="h-px bg-[#B5B1B1]" />

            {isWalletCredit || isWithdrawal ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="font-dm-sans font-medium text-base text-[#171417]">
                    Amount
                  </p>
                  <p className="font-dm-sans font-bold text-xl text-[#171417]">
                    ₦{formatAmount(payment.amount)}
                  </p>
                </div>
                {isWalletCredit && (
                  <div className="flex justify-between items-center">
                    <p className="font-dm-sans font-medium text-base text-[#171417]">
                      Payment method
                    </p>
                    <p className="font-dm-sans text-base text-[#454345]">
                      Bank Transfer
                    </p>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <p className="font-dm-sans font-medium text-base text-[#171417]">
                    Status
                  </p>
                  <span
                    className={`px-2 py-1 rounded-lg text-sm font-normal ${statusStyle.bg} ${statusStyle.text}`}
                  >
                    {statusStyle.label}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-dm-sans font-medium text-base text-[#171417]">
                    Date
                  </p>
                  <p className="font-dm-sans text-base text-[#454345]">
                    {formatDate(payment.createdAt)}
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Job / Transaction Details */}
                <div className="space-y-4 px-6">
                  <div className="flex items-center gap-2">
                    <Briefcase size={20} className="text-[#454345]" />
                    <h3 className="font-dm-sans font-bold text-base text-[#646264]">
                      {isBookingTransaction || isPlatformCharge
                        ? "Job Details"
                        : "Transaction Details"}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {(isBookingTransaction || isPlatformCharge) && (
                      <>
                        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                          <p className="font-dm-sans font-medium text-base text-[#171417]">
                            Booking ID
                          </p>
                          <p className="font-dm-sans font-bold text-base text-[#171417]">
                            #{payment.bookingId || "N/A"}
                          </p>
                        </div>

                        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                          <p className="font-dm-sans font-medium text-base text-[#171417]">
                            Booking Status
                          </p>
                          <div>
                            <span
                              className={`inline-flex px-2 py-1 rounded-lg text-sm font-normal ${bookingStyle.bg} ${bookingStyle.text}`}
                            >
                              {bookingStyle.label}
                            </span>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                      <p className="font-dm-sans font-medium text-base text-[#171417]">
                        Job Status
                      </p>
                      <div className="flex gap-2">
                        {(isSellerCredit || isPlatformCharge) &&
                        payment.jobDetails ? (
                          <>
                            {payment.jobDetails.sellerCompleted && (
                              <span className="inline-flex px-2 py-1 rounded-lg text-sm font-normal bg-[#E5F3FF] text-[#0066CC]">
                                Work Completed
                              </span>
                            )}
                            {payment.jobDetails.buyerCompleted && (
                              <span className="inline-flex px-2 py-1 rounded-lg text-sm font-normal bg-[#D7FFE9] text-[#1FC16B]">
                                Buyer Confirmed
                              </span>
                            )}
                          </>
                        ) : (
                          <span
                            className={`inline-flex px-2 py-1 rounded-lg text-sm font-normal ${jobStyle.bg} ${jobStyle.text}`}
                          >
                            {jobStyle.label}
                          </span>
                        )}
                      </div>
                    </div>

                    {!isPlatformCharge && (
                      <div className="grid grid-cols-[140px_1fr] items-start gap-4">
                        <p className="font-dm-sans font-medium text-base text-[#171417]">
                          Business Name
                        </p>
                        <p className="font-dm-sans font-normal text-base text-[#454345]">
                          {payment.sellerBusinessName || "N/A"}
                        </p>
                      </div>
                    )}

                    {!isPlatformCharge && (
                      <div className="grid grid-cols-[140px_1fr] items-start gap-4">
                        <p className="font-dm-sans font-medium text-base text-[#171417]">
                          Services
                        </p>
                        <p className="font-dm-sans font-normal text-base text-[#454345]">
                          {payment.serviceTitle || "N/A"}
                        </p>
                      </div>
                    )}

                    {!isPlatformCharge && (
                      <div className="grid grid-cols-[140px_1fr] items-start gap-4">
                        <p className="font-dm-sans font-medium text-base text-[#171417]">
                          Location
                        </p>
                        <p className="font-dm-sans font-normal text-base text-[#454345] flex items-center gap-1">
                          <MapPin size={16} />
                          {payment.bookingLocation || "N/A"}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-[140px_1fr] items-start gap-4">
                      <p className="font-dm-sans font-medium text-base text-[#171417]">
                        Date
                      </p>
                      <p className="font-dm-sans font-normal text-base text-[#454345]">
                        {formatDate(payment.bookingDate || payment.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-[#B5B1B1]" />

                {/* Payment Breakdown */}
                <div className="space-y-4 px-6">
                  <div className="flex justify-between items-center">
                    <h3 className="font-dm-sans font-bold text-base text-[#646264] flex items-center gap-2">
                      {/* Icon could go here */}
                      Payment Breakdown
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-lg text-sm font-normal ${statusStyle.bg} ${statusStyle.text}`}
                    >
                      {statusStyle.label}
                    </span>
                  </div>

                  {isSellerCredit ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <p className="font-dm-sans font-medium text-base text-[#171417]">
                          Service Fee Amount
                        </p>
                        <p className="font-dm-sans font-medium text-base text-[#171417]">
                          ₦
                          {formatAmount(
                            payment.jobDetails?.agreedPrice || payment.amount,
                          )}
                        </p>
                      </div>

                      {/* Calculate Platform Fee if we have agreedPrice */}
                      {payment.jobDetails?.agreedPrice && (
                        <div className="flex justify-between items-center">
                          <p className="font-dm-sans font-medium text-base text-[#171417]">
                            Platform Fee
                            {/* Calculate percentage if possible, e.g. (Fee / Total) * 100 */}
                            {payment.jobDetails.agreedPrice >
                              payment.amount && (
                              <span className="text-[#454345] ml-1">
                                (
                                {Math.round(
                                  ((payment.jobDetails.agreedPrice -
                                    payment.amount) /
                                    payment.jobDetails.agreedPrice) *
                                    100,
                                )}
                                %)
                              </span>
                            )}
                          </p>
                          <p className="font-dm-sans font-medium text-base text-[#D00416]">
                            -₦
                            {formatAmount(
                              payment.jobDetails.agreedPrice - payment.amount,
                            )}
                          </p>
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-2">
                        <p className="font-dm-sans font-medium text-base text-[#171417]">
                          Net Payout to Seller
                        </p>
                        <p className="font-dm-sans font-bold text-base text-[#1FC16B]">
                          ₦{formatAmount(payment.amount)}
                        </p>
                      </div>

                      <div className="pt-2 text-xs text-[#454345]">
                        Released: {formatDate(payment.createdAt)}
                      </div>
                    </div>
                  ) : isPlatformCharge ? (
                    // Platform Charge Breakdown
                    <div className="flex justify-between items-center">
                      <p className="font-dm-sans font-medium text-base text-[#171417]">
                        Platform Charge
                        {payment.jobDetails?.agreedPrice &&
                          payment.jobDetails.agreedPrice > 0 && (
                            <span className="text-[#454345] ml-1">
                              (
                              {Math.round(
                                (payment.amount /
                                  payment.jobDetails.agreedPrice) *
                                  100,
                              )}
                              %)
                            </span>
                          )}
                      </p>
                      <div className="flex items-center gap-4">
                        <p className="font-bold text-base text-right text-[#171417]">
                          ₦{formatAmount(payment.amount)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    // Default Payment Breakdown
                    <div className="flex justify-between items-center">
                      <p className="font-dm-sans font-medium text-base text-[#171417]">
                        Amount
                      </p>
                      <div className="flex items-center gap-4">
                        <p className="font-normal text-base text-right text-[#454345]">
                          NGN {formatAmount(payment.amount)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
