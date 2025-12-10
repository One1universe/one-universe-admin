import React from "react";
import { X, ArrowLeft } from "lucide-react";
import { Referral } from "@/types/Referral";

interface ReferralDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  referral: Referral;
}

const ReferralDetailModal: React.FC<ReferralDetailModalProps> = ({
  isOpen,
  onClose,
  referral,
}) => {
  if (!isOpen) return null;

  const timelineEvents = [
    {
      date: "Dec 15, 2024",
      event: "User signed up via referral link",
    },
    {
      date: "Dec 15, 2024",
      event: "First transaction completed (₦5,000)",
    },
    {
      date: "Dec 15, 2024",
      event: "Referral reward calculated (₦250)",
    },
    {
      date: "Dec 15, 2024",
      event: "Reward credited to referrer's wallet",
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-[60]" onClick={onClose} />

      {/* Detail Modal */}
      <div
        className="fixed inset-0 z-[70] flex items-start justify-center pt-20 md:pt-32 overflow-y-auto"
        style={{ contain: "none" }}
      >
        <div
          className="w-full max-w-[671px] bg-white rounded-2xl shadow-[-1px_8px_12px_0px_#0000001F] overflow-hidden"
          style={{ transform: "translateZ(0)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Teal Header */}
          <div className="bg-[#E8FBF7] px-8 pt-8 pb-4 border-b border-[#E8E3E3] flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/30 rounded-lg transition"
              >
                <ArrowLeft className="w-6 h-6 text-[#171417]" />
              </button>
              <h2 className="font-dm-sans font-bold text-[20px] leading-[140%] text-[#171417]">
                Referral Details
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/30 rounded-lg transition"
            >
              <X className="w-6 h-6 text-[#171417]" />
            </button>
          </div>

          {/* Content */}
          <div className="px-8 py-8 flex flex-col gap-6">
            {/* Details Section */}
            <div className="space-y-5">
              {/* Referral Name */}
              <div className="flex items-center justify-between">
                <span className="font-dm-sans font-medium text-base text-[#171417]">
                  Referral Name
                </span>
                <span className="font-dm-sans font-medium text-base text-[#171417]">
                  {referral.referrerName}
                </span>
              </div>

              {/* Referred Name */}
              <div className="flex items-center justify-between">
                <span className="font-dm-sans font-medium text-base text-[#171417]">
                  Referred Name
                </span>
                <span className="font-dm-sans font-medium text-base text-[#454345]">
                  {referral.referredName}
                </span>
              </div>

              {/* Transaction ID */}
              <div className="flex items-center justify-between">
                <span className="font-dm-sans font-medium text-base text-[#171417]">
                  Transaction ID
                </span>
                <span className="font-dm-sans font-medium text-base text-[#454345]">
                  TXN-789456
                </span>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="font-dm-sans font-medium text-base text-[#171417]">
                  Status
                </span>
                <div className={`flex items-center gap-2 px-2 py-1 rounded-lg ${
                  referral.status === "Paid" 
                    ? "bg-[#E0F5E6]" 
                    : referral.status === "Pending"
                    ? "bg-[#FFF2B9]"
                    : "bg-[#D3E1FF]"
                }`}>
                  <div className={`w-4 h-4 rounded-full ${
                    referral.status === "Paid" 
                      ? "bg-[#1FC16B]" 
                      : referral.status === "Pending"
                      ? "bg-[#9D7F04]"
                      : "bg-[#007BFF]"
                  }`} />
                  <span className={`font-dm-sans font-medium text-sm ${
                    referral.status === "Paid" 
                      ? "text-[#1FC16B]" 
                      : referral.status === "Pending"
                      ? "text-[#9D7F04]"
                      : "text-[#007BFF]"
                  }`}>
                    {referral.status}
                  </span>
                </div>
              </div>

              {/* Service Fee Amount */}
              <div className="flex items-center justify-between">
                <span className="font-dm-sans font-medium text-base text-[#171417]">
                  Service Fee Amount
                </span>
                <span className="font-dm-sans font-medium text-base text-[#454345]">
                  ₦5,000
                </span>
              </div>

              {/* Referral Reward */}
              <div className="flex items-center justify-between">
                <span className="font-dm-sans font-medium text-base text-[#171417]">
                  Referral Reward
                </span>
                <span className="font-dm-sans font-medium text-base text-[#454345]">
                  5%
                </span>
              </div>

              {/* Reward Amount */}
              <div className="flex items-center justify-between">
                <span className="font-dm-sans font-medium text-base text-[#171417]">
                  Reward Amount
                </span>
                <span className="font-dm-sans font-medium text-base text-[#454345]">
                  ₦250
                </span>
              </div>

              {/* Wallet Credit Date */}
              <div className="flex items-center justify-between">
                <span className="font-dm-sans font-medium text-base text-[#171417]">
                  Wallet Credit Date
                </span>
                <span className="font-dm-sans font-medium text-base text-[#454345]">
                  {referral.signDate}
                </span>
              </div>

              {/* Payment Method */}
              <div className="flex items-center justify-between">
                <span className="font-dm-sans font-medium text-base text-[#171417]">
                  Payment Method
                </span>
                <span className="font-dm-sans font-medium text-base text-[#454345]">
                  Wallet Credit
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#B5B1B1]" />

            {/* Timeline Section */}
            <div className="space-y-4">
              <h3 className="font-dm-sans font-medium text-base text-[#171417]">
                Referral Timeline
              </h3>

              <div className="space-y-3">
                {timelineEvents.map((item, index) => (
                  <div
                    key={index}
                    className="bg-[#FFFCFC] rounded-xl p-4 border border-[#E8E3E3]"
                  >
                    <div className="flex items-start gap-3">
                      <span className="font-dm-sans font-medium text-sm text-[#171417] whitespace-nowrap">
                        {item.date}:
                      </span>
                      <span className="font-dm-sans text-base text-[#454345]">
                        {item.event}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReferralDetailModal;