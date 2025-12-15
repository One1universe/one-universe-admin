"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { Eye, CheckCircle, Trash2, X, Check } from "lucide-react";
import { supportTicketStore } from "@/store/supportTicketStore";
import ConfirmModal from "../../Tabs/ReportTabs/ConfirmModal";

interface ActionMenuProps {
  ticket: any;
  isOpen: boolean;
  onClose: () => void;
  position: { top: number; left: number };
  onViewDetails: (ticket: any) => void;
}

const ActionMenu = ({ ticket, isOpen, onClose, position, onViewDetails }: ActionMenuProps) => {
  const desktopMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const { markAsResolved, deleteTicket, respondingToTicket } = supportTicketStore();

  const [confirmType, setConfirmType] = useState<"delete" | "resolve" | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // ⚠️ FIX: Only setup click-outside listener when menu is OPEN AND no modal
  useEffect(() => {
    if (!isOpen || confirmType !== null) {
      // Don't add listener if confirmType is set (modal is open)
      return;
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (
        !desktopMenuRef.current?.contains(e.target as Node) &&
        !mobileMenuRef.current?.contains(e.target as Node)
      ) {
        console.log("🖱️ Click outside detected - closing menu");
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, confirmType, onClose]); // ⚠️ Added confirmType to deps

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (type: "success" | "error", message: string) => {
    console.log(`🔔 Toast: [${type.toUpperCase()}] ${message}`);
    setToast({ type, message });
  };

  const handleViewDetails = useCallback(() => {
    console.log("👁️ View Details clicked");
    onViewDetails(ticket);
  }, [ticket, onViewDetails]);

  const handleResolve = useCallback(() => {
    console.log("✅ Mark as Resolved clicked - setting confirmType to 'resolve'");
    setConfirmType("resolve");
  }, []);

  const handleDelete = useCallback(() => {
    console.log("🗑️ Delete clicked - setting confirmType to 'delete'");
    setConfirmType("delete");
  }, []);

  // THIS IS THE CRITICAL FUNCTION - called from ConfirmModal
  const handleConfirm = useCallback(async () => {
    console.log("🔄 handleConfirm called");
    console.log("   confirmType:", confirmType);
    console.log("   ticket:", { id: ticket?.id, ticketId: ticket?.ticketId });

    if (!ticket?.id && !ticket?.ticketId) {
      console.error("❌ ERROR: Missing both id and ticketId");
      showToast("error", "Missing ticket identifier");
      setConfirmType(null);
      return;
    }

    setIsProcessing(true);

    try {
      let success = false;
      const ticketId = ticket.id || ticket.ticketId;

      console.log(`⏳ Processing ${confirmType} for ticket:`, ticketId);

      if (confirmType === "resolve") {
        console.log("📞 Calling markAsResolved with ID:", ticketId);
        success = await markAsResolved(ticketId);
        console.log("✅ markAsResolved returned:", success);
      } else if (confirmType === "delete") {
        console.log("📞 Calling deleteTicket with ID:", ticketId);
        try {
          success = await deleteTicket(ticketId);
          console.log("✅ deleteTicket returned:", success);
        } catch (deleteErr) {
          console.error("❌ deleteTicket threw error:", deleteErr);
          throw deleteErr;
        }
      } else {
        console.warn("⚠️ Unknown confirmType:", confirmType);
      }

      if (success) {
        const action = confirmType === "resolve" ? "resolved" : "deleted";
        const message = `Ticket ${ticket.ticketId} ${action}!`;
        console.log("✅ SUCCESS:", message);
        showToast("success", message);

        // Close modal and menu after delay
        setTimeout(() => {
          console.log("🚪 Closing modal");
          setConfirmType(null);
          setTimeout(() => {
            console.log("🚪 Closing menu");
            onClose();
          }, 300);
        }, 800);
      } else {
        console.warn("⚠️ Operation returned false - showing error toast");
        showToast("error", "Failed. Please try again.");
        setConfirmType(null);
      }
    } catch (err: any) {
      console.error("❌ CATCH ERROR in handleConfirm:", err);
      console.error("   Error message:", err?.message);
      console.error("   Error type:", typeof err);
      showToast("error", err?.message || "Operation failed");
      setConfirmType(null);
    } finally {
      setIsProcessing(false);
    }
  }, [confirmType, ticket, markAsResolved, deleteTicket, onClose]);

  const handleCancel = useCallback(() => {
    console.log("❌ Confirm cancelled - closing modal");
    setConfirmType(null);
  }, []);

  const isResolved = ticket?.status === "RESOLVED";
  const isDisabled = isProcessing || respondingToTicket;

  console.log(`🎨 Rendering ActionMenu - isOpen: ${isOpen}, confirmType: ${confirmType}`);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-[9999] animate-slide-in">
          <div className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border ${
            toast.type === "success" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
          }`}>
            {toast.type === "success" ? <Check className="w-5 h-5 text-green-700" /> : <X className="w-5 h-5 text-red-700" />}
            <p className={`font-medium text-sm ${toast.type === "success" ? "text-green-800" : "text-red-800"}`}>
              {toast.message}
            </p>
            <button onClick={() => setToast(null)}>
              <X className="w-4 h-4 opacity-70" />
            </button>
          </div>
        </div>
      )}

      {/* Desktop Menu */}
      {!confirmType && (
        <div
          ref={desktopMenuRef}
          className="hidden md:block fixed z-[100] w-[206px] bg-white rounded-[20px] shadow-xl border border-gray-100"
          style={{ top: `${position.top}px`, left: `${position.left}px` }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleViewDetails}
            disabled={isDisabled}
            className="w-full flex items-center gap-3 px-6 py-4 hover:bg-gray-50 disabled:opacity-50 text-left rounded-t-[20px]"
          >
            <Eye size={18} className="text-gray-600" /> View Details
          </button>
          <button
            onClick={handleResolve}
            disabled={isDisabled || isResolved}
            className="w-full flex items-center gap-3 px-6 py-4 hover:bg-gray-50 border-t border-gray-100 disabled:opacity-50 text-left"
          >
            <CheckCircle size={18} className="text-gray-600" />{" "}
            {isResolved ? "Already Resolved" : "Mark as Resolved"}
          </button>
          <button
            onClick={handleDelete}
            disabled={isDisabled}
            className="w-full flex items-center gap-3 px-6 py-4 hover:bg-red-50 text-red-600 border-t border-gray-100 text-left rounded-b-[20px]"
          >
            <Trash2 size={18} /> Delete Ticket
          </button>
        </div>
      )}

      {/* Mobile Sheet */}
      {!confirmType && (
        <div className="md:hidden fixed inset-0 z-[100] flex items-end">
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <div
            ref={mobileMenuRef}
            className="relative w-full bg-white rounded-t-3xl p-6 shadow-2xl animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-semibold text-lg">{ticket.email}</h3>
                <p className="text-sm text-gray-500">{ticket.ticketId}</p>
              </div>
              <button onClick={onClose} className="p-1">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleViewDetails}
                className="w-full py-4 bg-gradient-to-r from-[#154751] to-[#04171F] text-white rounded-2xl font-medium"
              >
                View Details
              </button>
              <button
                onClick={handleResolve}
                disabled={isDisabled || isResolved}
                className="w-full py-4 border-2 border-[#154751] text-[#154751] rounded-2xl font-medium disabled:opacity-50"
              >
                {isProcessing ? "Processing..." : "Mark as Resolved"}
              </button>
              <button
                onClick={handleDelete}
                disabled={isDisabled}
                className="w-full py-4 text-red-600 rounded-2xl font-medium"
              >
                Delete Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal - Only render when confirmType is set */}
      {confirmType && (
        <ConfirmModal
          type={confirmType}
          isOpen={true}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}

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

export default ActionMenu;