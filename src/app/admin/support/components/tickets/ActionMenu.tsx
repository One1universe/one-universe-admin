"use client";

import React, { useRef, useEffect, useState } from "react";
import { Eye, CheckCircle, Trash2 } from "lucide-react";
import { SupportTicket } from "@/types/SupportTicket";
import ConfirmModal from "../../Tabs/ReportTabs/ConfirmModal"; // ← Make sure this file exists

interface ActionMenuProps {
  ticket: SupportTicket;
  isOpen: boolean;
  onClose: () => void;
  position: { top: number; left: number };
  onViewDetails: (ticket: SupportTicket) => void;
}

const ActionMenu = ({ ticket, isOpen, onClose, position, onViewDetails }: ActionMenuProps) => {
  const desktopMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Confirmation modal state
  const [confirmType, setConfirmType] = useState<"delete" | "resolve" | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedDesktop = desktopMenuRef.current?.contains(target);
      const clickedMobile = mobileMenuRef.current?.contains(target);

      if (!clickedDesktop && !clickedMobile) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const handleViewDetails = () => {
    onViewDetails(ticket);
    // Parent will close the menu
  };

  const handleResolve = () => {
    setConfirmType("resolve");
  };

  const handleDelete = () => {
    setConfirmType("delete");
  };

  const handleConfirm = () => {
    if (confirmType === "resolve") {
      alert(`Ticket ${ticket.ticketId} marked as resolved!`);
      // Add your real resolve logic here
    } else if (confirmType === "delete") {
      alert(`Ticket ${ticket.ticketId} deleted!`);
      // Add your real delete logic here
    }
    setConfirmType(null);
    onClose();
  };

  return (
    <>
      {/* Desktop Menu */}
      <div
        ref={desktopMenuRef}
        className="hidden md:block fixed z-[100] w-[206px] bg-white rounded-[20px] shadow-[0_8px_29px_rgba(95,94,94,0.19)]"
        style={{ top: `${position.top}px`, left: `${position.left}px` }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleViewDetails}
          className="w-full flex items-center gap-[10px] px-[25px] py-[18px] border-b border-[#E5E7EF] hover:bg-gray-50 transition-colors rounded-t-[20px]"
        >
          <Eye size={18} className="text-[#454345]" />
          <span className="font-dm-sans text-base text-[#454345]">View Details</span>
        </button>

        <button
          onClick={handleResolve}
          className="w-full flex items-center gap-[10px] px-[25px] py-[18px] border-b border-[#E5E7EF] hover:bg-gray-50 transition-colors"
        >
          <CheckCircle size={18} className="text-[#454345]" />
          <span className="font-dm-sans text-base text-[#454345]">Mark as Resolved</span>
        </button>

        <button
          onClick={handleDelete}
          className="w-full flex items-center gap-[10px] px-[25px] py-[18px] hover:bg-gray-50 transition-colors rounded-b-[20px]"
        >
          <Trash2 size={18} className="text-[#D84040]" />
          <span className="font-dm-sans text-base text-[#D84040]">Delete Tickets</span>
        </button>
      </div>

      {/* Mobile Bottom Sheet */}
      <div className="md:hidden fixed inset-0 z-[100] flex items-end">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div
          ref={mobileMenuRef}
          className="relative w-full bg-white rounded-t-[8px] border border-[#E8E3E3] p-5 animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-1">
                <h3 className="font-inter font-medium text-base text-[#171417]">{ticket.username}</h3>
                <span className="font-dm-sans text-sm text-[#454345]">{ticket.ticketId}</span>
              </div>
              <p className="font-dm-sans text-sm text-[#454345] mb-2">{ticket.submittedDate}</p>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12M4 4l8 8" stroke="#454345" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleViewDetails}
              className="w-full flex items-center justify-center gap-2 px-6 py-2 rounded-[20px] font-dm-sans font-medium text-base text-white"
              style={{ background: "radial-gradient(circle at center, #154751 37%, #04171F 100%)" }}
            >
              <Eye size={18} />
              <span>View Details</span>
            </button>

            <button
              onClick={handleResolve}
              className="w-full flex items-center justify-center gap-2 px-6 py-2 rounded-[20px] border border-[#154751] font-dm-sans font-medium text-base text-[#154751]"
            >
              <CheckCircle size={18} />
              <span>Mark as Resolved</span>
            </button>

            <button
              onClick={handleDelete}
              className="w-full flex items-center justify-center gap-2 px-6 py-2 rounded-[20px] font-dm-sans font-medium text-base text-[#D84040]"
            >
              <Trash2 size={18} />
              <span>Delete Tickets</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmType && (
        <ConfirmModal
          type={confirmType}
          isOpen={true}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmType(null)}
        />
      )}

      <style jsx>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
      `}</style>
    </>
  );
};

export default ActionMenu;