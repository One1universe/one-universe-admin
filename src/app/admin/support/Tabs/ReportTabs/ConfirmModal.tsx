"use client";

import React from "react";
import { Trash2, CheckCircle } from "lucide-react";

type ModalType = "delete" | "resolve";

interface ConfirmModalProps {
  type: ModalType;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal = ({ type, isOpen, onConfirm, onCancel }: ConfirmModalProps) => {
  if (!isOpen) return null;

  const isDelete = type === "delete";

  const config = {
    delete: {
      title: "Delete Ticket",
      message: "Are you sure you want to permanently delete this support ticket?",
      warning: "This action cannot be undone.",
      iconBg: "bg-[#FFD5D0]",
      icon: <Trash2 size={32} className="text-[#D84040]" />,
      mobileIcon: <Trash2 size={28} className="text-[#D84040]" />,
      confirmText: "Delete",
      confirmClass: "bg-[#D84040]",
    },
    resolve: {
      title: "Resolve Support Ticket",
      message: "Are you sure you want to mark this ticket as resolved?",
      warning: "The user will be notified.",
      iconBg: "bg-[#FFF4D2]",
      icon: <CheckCircle size={32} className="text-[#154751]" />,
      mobileIcon: <CheckCircle size={28} className="text-[#154751]" />,
      confirmText: "Resolve",
      confirmClass: "bg-gradient-to-br from-[#154751] to-[#04171F]",
    },
  };

  const { title, message, warning, iconBg, icon, mobileIcon, confirmText, confirmClass } = config[type];

  return (
    <>
      {/* DESKTOP */}
      <div className="hidden md:fixed md:inset-0 md:z-[300] md:flex md:items-center md:justify-center md:p-4">
        <div 
          className="absolute inset-0" 
          onClick={onCancel}
          style={{ background: "rgba(0,0,0,0.05)" }}
        />
 Twist        <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-[633px] p-8">
          <div className="flex flex-col items-center gap-8 text-center">
            <div className={`w-20 h-20 rounded-full ${iconBg} flex items-center justify-center p-4`}>
              {icon}
            </div>

            <div className="space-y-4">
              <h2 className="font-dm-sans font-bold text-2xl text-[#171417]">{title}</h2>
              <p className="font-dm-sans text-base text-[#171417] max-w-md">{message}</p>
              <p className="font-dm-sans text-sm text-[#454345]">{warning}</p>
            </div>

            <div className="flex gap-8 w-full max-w-md">
              {/* Cancel Button */}
              <button
                onClick={onCancel}
                className="flex-1 py-4 px-6 rounded-2xl border-2 font-dm-sans font-medium text-base text-[#154751]"
                style={{
                  borderImage: "linear-gradient(to right, #154751, #04171F) 1",
                  borderImageSlice: 1,
                }}
              >
                Cancel
              </button>

              {/* Confirm Button - FIXED: Use className instead of style */}
              <button
                onClick={onConfirm}
                className={`flex-1 py-4 px-6 rounded-2xl font-dm-sans font-medium text-base text-white ${confirmClass}`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE */}
      <div className="md:hidden fixed inset-0 z-[300] flex items-end">
        <div 
          className="absolute inset-0" 
          onClick={onCancel}
          style={{ background: "rgba(0,0,0,0.05)" }}
        />
        <div 
          className="relative w-full bg-white rounded-t-2xl shadow-2xl p-6 max-h-[90vh] animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col items-center gap-6 text-center">
            <div className={`w-16 h-16 rounded-full ${iconBg} flex items-center justify-center`}>
              {mobileIcon}
            </div>

            <div className="space-y-4">
              <h2 className="font-dm-sans font-bold text-xl text-[#171417]">{title}</h2>
              <p className="font-dm-sans text-base text-[#171417] px-4">{message}</p>
              <p className="font-dm-sans text-sm text-[#454345]">{warning}</p>
            </div>

            <div className="w-full space-y-4 pt-4">
              <button
                onClick={onCancel}
                className="w-full py-4 rounded-2xl border-2 font-dm-sans font-medium text-base text-[#154751]"
                style={{
                  borderImage: "linear-gradient(to right, #154751, #04171F) 1",
                  borderImageSlice: 1,
                }}
              >
                Cancel
              </button>

              {/* Confirm Button - FIXED: Use className */}
              <button
                onClick={onConfirm}
                className={`w-full py-4 rounded-2xl font-dm-sans font-medium text-base text-white ${confirmClass}`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.35s ease-out; }
      `}</style>
    </>
  );
};

export default ConfirmModal;