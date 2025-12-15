// components/Modal/ApprovalModal.tsx

import React from 'react';
import { Check, AlertCircle } from 'lucide-react';

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  serviceName: string;
  providerName: string;
}

export default function ApprovalModal({
  isOpen,
  onClose,
  onConfirm,
  serviceName,
  providerName,
}: ApprovalModalProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose(); // Close modal after confirmation
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose} // Close when clicking backdrop
    >
      <div
        className="w-full max-w-[633px] bg-white rounded-lg border border-[#EBEBEB] shadow-[0px_20px_20px_0px_rgba(0,0,0,0.08),_0px_0px_2px_0px_rgba(0,0,0,0.12)]"
        onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside modal
      >
        {/* Desktop Layout (md and up) */}
        <div className="hidden md:block p-8">
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex gap-2 items-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-[#C0F8DA] flex items-center justify-center">
                  <Check className="w-5 h-5 text-[#1FC16B]" strokeWidth={3} />
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <h2 className="text-xl font-bold text-[#171417] font-['DM_Sans'] leading-[140%]">
                  Approve Service Suggestion
                </h2>
                <p className="text-base text-[#171417] font-['DM_Sans'] leading-[140%]">
                  Are you sure you want to approve the service{' '}
                  <span className="font-bold">&quot;{serviceName}&quot;</span> submitted by{' '}
                  <span className="font-bold">{providerName}</span>?
                </p>
                <div className="flex gap-2 items-start mt-2">
                  <AlertCircle className="w-5 h-5 text-[#BA8D07] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-[#454345] font-['DM_Sans'] leading-[140%]">
                    This service will be added to the public services list and made available to all
                    users.
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-8">
              <button
                onClick={onClose}
                className="flex-1 h-12 rounded-[20px] border border-[#154751] bg-white text-[#154751] font-medium font-['DM_Sans'] text-base leading-[140%] hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 h-12 rounded-[20px] bg-gradient-to-r from-[#154751] to-[#04171F] text-white font-medium font-['DM_Sans'] text-base leading-[140%] hover:shadow-lg transition"
                style={{
                  background: 'radial-gradient(50% 50% at 50% 50%, #154751 37%, #04171F 100%)',
                }}
              >
                Approve Service
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Layout (below md) */}
        <div className="md:hidden px-5 pt-6 pb-5">
          <div className="flex flex-col gap-6">
            {/* Centered Icon */}
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-full bg-[#C0F8DA] p-2 flex items-center justify-center">
                <Check className="w-7 h-7 text-[#1FC16B]" strokeWidth={3} />
              </div>
            </div>

            {/* Text Content - Centered */}
            <div className="text-center space-y-4">
              <h2 className="text-xl font-bold text-[#171417] font-['DM_Sans'] leading-[140%]">
                Approve Service Suggestion
              </h2>
              <p className="text-base text-[#171417] font-['DM_Sans'] leading-[140%]">
                Are you sure you want to approve the service{' '}
                <span className="font-bold">&quot;{serviceName}&quot;</span> submitted by{' '}
                <span className="font-bold">{providerName}</span>?
              </p>
              <div className="flex gap-2 items-start">
                <AlertCircle className="w-5 h-5 text-[#BA8D07] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-[#454345] font-['DM_Sans'] leading-[140%] text-left">
                  This service will be added to the public services list and made available to all
                  users.
                </p>
              </div>
            </div>

            {/* Buttons - Stacked, Approve first */}
            <div className="flex flex-col gap-4">
              <button
                onClick={handleConfirm}
                className="w-full h-12 rounded-[20px] bg-gradient-to-r from-[#154751] to-[#04171F] text-white font-medium font-['DM_Sans'] text-base leading-[140%] hover:shadow-lg transition"
                style={{
                  background: 'radial-gradient(50% 50% at 50% 50%, #154751 37%, #04171F 100%)',
                }}
              >
                Approve Service
              </button>
              <button
                onClick={onClose}
                className="w-full h-12 rounded-[20px] border border-[#154751] bg-white text-[#154751] font-medium font-['DM_Sans'] text-base leading-[140%] hover:bg-gray-50 transition"
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