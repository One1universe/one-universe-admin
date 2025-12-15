// components/Modal/RejectionModal.tsx
import React, { useState } from "react";
import { X, AlertCircle } from "lucide-react";

interface RejectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  serviceName: string;
  providerName: string;
}

export default function RejectionModal({
  isOpen,
  onClose,
  onConfirm,
  serviceName,
  providerName,
}: RejectionModalProps) {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(reason.trim());
    setReason("");
    onClose();
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  // Mobile detection via Tailwind (md breakpoint = 768px)
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-[633px] bg-white rounded-lg border border-[#EBEBEB] shadow-[0px_20px_20px_0px_rgba(0,0,0,0.08),_0px_0px_2px_0px_rgba(0,0,0,0.12)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Desktop Layout */}
        <div className="hidden md:block p-8">
          <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-[#FFD5D0] p-2 flex items-center justify-center">
                  <X className="w-8 h-8 text-[#D84040]" strokeWidth={3} />
                </div>
              </div>
              <div className="flex-1 space-y-3">
                <h2 className="text-xl font-bold text-[#171417] font-['DM_Sans'] leading-[140%]">
                  Reject Service Suggestion
                </h2>
                <p className="text-base text-[#171417] font-['DM_Sans'] leading-[140%]">
                  Are you sure you want to reject the service{" "}
                  <span className="font-bold">&quot;{serviceName}&quot;</span> submitted by{" "}
                  <span className="font-bold">{providerName}</span>?
                </p>
                <p className="text-sm text-[#454345] font-['DM_Sans'] leading-[140%]">
                  You can optionally add a reason for this rejection.
                </p>
              </div>
            </div>

            {/* Reason Input */}
            <div className="space-y-2">
              <label className="text-base font-medium text-[#05060D] font-['DM_Sans']">
                Reason for rejection (optional)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Type your message here"
                rows={4}
                className="w-full px-4 py-3 text-base text-[#171417] placeholder:text-[#B2B2B4] bg-white border border-[#B2B2B4] rounded-xl focus:outline-none focus:border-[#154751] resize-none font-['DM_Sans']"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-8">
              <button
                onClick={handleClose}
                className="flex-1 h-12 rounded-[20px] border border-transparent bg-gradient-to-r from-[#154751] to-[#04171F] text-[#154751] font-medium text-base font-['DM_Sans'] hover:bg-gray-50 transition"
                style={{
                  background: "white",
                  borderImageSource:
                    "radial-gradient(50% 50% at 50% 50%, #154751 37%, #04171F 100%)",
                  borderImageSlice: 1,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 h-12 rounded-[20px] bg-[#D84040] text-white font-medium text-base font-['DM_Sans'] hover:shadow-lg transition"
              >
                Reject Service
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden px-5 pt-6 pb-8">
          <div className="flex flex-col gap-6">
            {/* Centered Icon */}
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-full bg-[#FFD5D0] p-2 flex items-center justify-center">
                <X className="w-8 h-8 text-[#D84040]" strokeWidth={3} />
              </div>
            </div>

            {/* Text Content */}
            <div className="text-center space-y-4">
              <h2 className="text-xl font-bold text-[#171417] font-['DM_Sans'] leading-[140%]">
                Reject Service Suggestion
              </h2>
              <p className="text-base text-[#171417] font-['DM_Sans'] leading-[140%]">
                Are you sure you want to reject the service{" "}
                <span className="font-bold">&quot;{serviceName}&quot;</span> submitted by{" "}
                <span className="font-bold">{providerName}</span>?
              </p>
              <p className="text-sm text-[#454345] font-['DM_Sans'] leading-[140%]">
                You can optionally add a reason for this rejection.
              </p>
            </div>

            {/* Reason Input */}
            <div className="space-y-2">
              <label className="text-base font-medium text-[#05060D] font-['DM_Sans']">
                Reason for rejection (optional)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Type your message here"
                rows={4}
                className="w-full px-4 py-3 text-base text-[#171417] placeholder:text-[#B2B2B4] bg-white border border-[#B2B2B4] rounded-xl focus:outline-none focus:border-[#154751] resize-none font-['DM_Sans']"
              />
            </div>

            {/* Buttons - Stacked, Reject first */}
            <div className="flex flex-col gap-4">
              <button
                onClick={handleConfirm}
                className="w-full h-12 rounded-[20px] bg-[#D84040] text-white font-medium text-base font-['DM_Sans'] hover:shadow-lg transition"
              >
                Reject Service
              </button>
              <button
                onClick={handleClose}
                className="w-full h-12 rounded-[20px] border border-transparent bg-white text-[#154751] font-medium text-base font-['DM_Sans'] hover:bg-gray-50 transition"
                style={{
                  borderImageSource:
                    "radial-gradient(50% 50% at 50% 50%, #154751 37%, #04171F 100%)",
                  borderImageSlice: 1,
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}