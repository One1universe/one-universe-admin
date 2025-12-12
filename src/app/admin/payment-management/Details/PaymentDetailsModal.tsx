"use client";

import { X, User, Mail, Calendar, Briefcase, MapPin } from "lucide-react";

interface PaymentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: any;
  isLoading?: boolean;
}

const statusConfig = {
  PAID: { bg: "bg-[#D7FFE9]", text: "text-[#1FC16B]", label: "Paid" },
  PENDING: { bg: "bg-[#FFF4D6]", text: "text-[#F59E0B]", label: "Pending" },
  DISPUTED: { bg: "bg-[#FDEDED]", text: "text-[#D00416]", label: "Disputed" },
  "PENDING REFUND": { bg: "bg-[#E5E5FF]", text: "text-[#6366F1]", label: "Refund Pending" },
  REFUNDED: { bg: "bg-[#E0E0E0]", text: "text-[#525252]", label: "Refunded" },
  FAILED: { bg: "bg-[#FDEDED]", text: "text-[#D00416]", label: "Failed" },
};

const bookingStatusConfig = {
  BUYER_CONFIRM_COMPLETION: { bg: "bg-[#E5F3FF]", text: "text-[#0066CC]", label: "In Progress" },
  SELLER_CONFIRM_COMPLETION: { bg: "bg-[#E5F3FF]", text: "text-[#0066CC]", label: "In Progress" },
  COMPLETED: { bg: "bg-[#D7FFE9]", text: "text-[#1FC16B]", label: "Completed" },
  CANCELLED: { bg: "bg-[#FFF2B9]", text: "text-[#9D7F04]", label: "Cancelled" },
  IN_PROGRESS: { bg: "bg-[#E5F3FF]", text: "text-[#0066CC]", label: "In Progress" },
  PENDING: { bg: "bg-[#FFF4D6]", text: "text-[#F59E0B]", label: "Pending" },
};

const jobStatusConfig = {
  COMPLETED: { bg: "bg-[#D7FFE9]", text: "text-[#1FC16B]", label: "Completed" },
  IN_PROGRESS: { bg: "bg-[#E5F3FF]", text: "text-[#0066CC]", label: "In Progress" },
  PENDING: { bg: "bg-[#FFF4D6]", text: "text-[#F59E0B]", label: "Pending" },
  CANCELLED: { bg: "bg-[#FFF2B9]", text: "text-[#9D7F04]", label: "Cancelled" },
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
        <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" onClick={onClose} />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-[775px] max-h-[90vh] overflow-y-auto flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-[#154751] border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </>
    );
  }

  if (!payment) {
    return null;
  }

  // Get status styles
  const statusStyle = statusConfig[payment.status as keyof typeof statusConfig] || statusConfig.PENDING;
  const bookingStyle = bookingStatusConfig[payment.bookingStatus as keyof typeof bookingStatusConfig] || bookingStatusConfig.PENDING;
  const jobStyle = jobStatusConfig[payment.jobStatus as keyof typeof jobStatusConfig] || jobStatusConfig.PENDING;

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return "N/A";
    }
  };

  // Format amount
  const formatAmount = (amount: number) => {
    if (typeof amount !== 'number' || isNaN(amount)) return "0.00";
    return amount.toFixed(2);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl w-[775px] max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-[#E8FBF7] border-b border-[#E8E3E3] px-6 pt-8 pb-4 flex justify-between items-center">
            <h2 className="font-dm-sans font-bold text-xl leading-[140%] text-[#171417]">
              Payment Details
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/60 rounded-lg transition"
            >
              <X size={24} className="text-[#171417]" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4 space-y-6">
            {/* Buyer & Seller Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Buyer */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <User size={20} className="text-[#454345]" />
                  <h3 className="font-dm-sans font-bold text-base text-[#646264]">
                    Buyer Information
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-8">
                    <p className="font-dm-sans font-medium text-base text-[#171417] w-16">Name</p>
                    <p className="font-dm-sans font-medium text-base text-[#171417]">
                      {payment.buyerName || "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="font-dm-sans font-medium text-base text-[#171417] w-16">Email</p>
                    <Mail size={20} className="text-[#454345]" />
                    <p className="text-base text-[#454345]">{payment.buyerEmail || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Seller */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <User size={20} className="text-[#454345]" />
                  <h3 className="font-dm-sans font-bold text-base text-[#646264]">
                    Seller Information
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-8">
                    <p className="font-dm-sans font-medium text-base text-[#171417] w-16">Name</p>
                    <p className="font-dm-sans font-medium text-base text-[#454345]">
                      {payment.sellerName || "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="font-dm-sans font-medium text-base text-[#171417] w-16">Email</p>
                    <Mail size={20} className="text-[#454345]" />
                    <p className="text-base text-[#454345]">{payment.sellerEmail || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-[#B5B1B1]" />

            {/* Job Details */}
            <div className="space-y-4 px-6">
              <div className="flex items-center gap-2">
                <Briefcase size={20} className="text-[#454345]" />
                <h3 className="font-dm-sans font-bold text-base text-[#646264]">
                  Job Details
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-8">
                  <p className="font-dm-sans font-medium text-base text-[#171417] w-32">Booking ID</p>
                  <p className="font-dm-sans font-medium text-base text-[#171417]">
                    {payment.bookingId || "N/A"}
                  </p>
                </div>
                
                <div className="flex items-center gap-8">
                  <p className="font-dm-sans font-medium text-base text-[#171417] w-32">Booking Status</p>
                  <span
                    className={`inline-flex px-2 py-1 rounded-lg text-sm font-normal ${bookingStyle.bg} ${bookingStyle.text}`}
                  >
                    {bookingStyle.label}
                  </span>
                </div>

                <div className="flex items-start gap-8">
                  <div className="w-32">
                    <p className="font-dm-sans font-medium text-base text-[#171417]">Business Name</p>
                    <p className="font-dm-sans font-medium text-base text-[#171417] mt-4">Services</p>
                    <p className="font-dm-sans font-medium text-base text-[#171417] mt-4">Location</p>
                  </div>
                  <div className="space-y-4">
                    <p className="font-dm-sans font-normal text-base text-[#454345]">
                      {payment.sellerBusinessName || "N/A"}
                    </p>
                    <p className="font-dm-sans font-normal text-base text-[#454345]">
                      {payment.serviceTitle || "N/A"}
                    </p>
                    <p className="font-dm-sans font-normal text-base text-[#454345] flex items-center gap-2">
                      <MapPin size={16} />
                      {payment.bookingLocation || "N/A"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-8">
                  <p className="font-dm-sans font-medium text-base text-[#171417] w-32">Job Status</p>
                  <span
                    className={`inline-flex px-2 py-1 rounded-lg text-sm font-normal ${jobStyle.bg} ${jobStyle.text}`}
                  >
                    {jobStyle.label}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-[#D00416]" />
                  <p className="font-dm-sans font-normal text-base text-[#454345]">
                    <span className="font-medium text-[#171417]">Date:</span> {formatDate(payment.bookingDate)}
                  </p>
                </div>
              </div>
            </div>

            <div className="h-px bg-[#B5B1B1]" />

            {/* Payment Breakdown */}
            <div className="space-y-4 px-6">
              <h3 className="font-dm-sans font-bold text-base text-[#646264]">
                Payment Breakdown
              </h3>
              <div className="flex justify-between items-center">
                <p className="font-dm-sans font-medium text-base text-[#171417]">
                  Service Fee Amount
                </p>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-2 py-1 rounded-lg text-sm font-normal ${statusStyle.bg} ${statusStyle.text}`}
                  >
                    {statusStyle.label}
                  </span>
                  <p className="font-normal text-base text-right text-[#454345]">
                    NGN{formatAmount(payment.amount)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}