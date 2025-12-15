"use client";

import React, { useState } from "react";
import { Star, X, Check } from "lucide-react";
import { appRatingsStore } from "@/store/appRatingsStore";

interface ReviewResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  ratingId: string;
  review: {
    id: string;
    username: string;
    userRole: string;
    rating: number;
    text: string;
    date: string;
    hasReply?: boolean;
    existingReply?: string | null;
  };
}

const ReviewResponseModal = ({ isOpen, onClose, ratingId, review }: ReviewResponseModalProps) => {
  const [reply, setReply] = useState(review.existingReply || "");
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const { replyingToRating, replyToRating } = appRatingsStore();

  const isActive = reply.trim().length > 0;

  if (!isOpen) return null;

  const showToast = (type: "success" | "error", message: string) => {
    console.log(`🔔 Toast: [${type.toUpperCase()}] ${message}`);
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={20}
        className={i < rating ? "fill-[#F9CB43] text-[#F9CB43]" : "text-gray-300"}
      />
    ));
  };

  const handleSendReply = async () => {
    if (!reply.trim()) {
      showToast("error", "Please enter a reply");
      return;
    }

    console.log("💬 Sending reply to rating:", ratingId);

    const success = await replyToRating(ratingId, reply.trim());

    if (success) {
      showToast("success", "Reply sent successfully!");
      setTimeout(() => {
        onClose();
      }, 800);
    } else {
      showToast("error", "Failed to send reply. Please try again.");
    }
  };

  return (
    <>
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-[9999] animate-slide-in">
          <div className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border ${
            toast.type === "success" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
          }`}>
            {toast.type === "success" ? (
              <Check className="w-5 h-5 text-green-700" />
            ) : (
              <X className="w-5 h-5 text-red-700" />
            )}
            <p className={`font-medium text-sm ${toast.type === "success" ? "text-green-800" : "text-red-800"}`}>
              {toast.message}
            </p>
            <button onClick={() => setToast(null)}>
              <X className="w-4 h-4 opacity-70" />
            </button>
          </div>
        </div>
      )}

      {/* DESKTOP */}
      <div className="hidden md:fixed md:inset-0 md:z-[200] md:flex md:items-center md:justify-center md:p-4">
        <div className="absolute inset-0" onClick={onClose} style={{ background: "rgba(0,0,0,0.05)" }} />
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[671px] max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-[#E8FBF7] px-8 py-8 border-b border-[#E8E3E3] flex items-center justify-between sticky top-0 z-10">
            <h2 className="font-dm-sans font-bold text-xl text-[#171417]">Respond to Review</h2>
            <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-lg transition">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#171417" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-8 space-y-8">
            {/* User Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-dm-sans font-medium text-base text-[#171417]">Feedback from</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="font-dm-sans font-medium text-base text-[#454345]">{review.username}</span>
                    <span className="text-sm text-[#171417] px-2 py-0.5 bg-[#E6E8E9] rounded">{review.userRole}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-1">{renderStars(review.rating)}</div>
            </div>

            {/* Review Text */}
            <div className="bg-[#FFFAFA] rounded-xl p-4">
              <p className="font-dm-sans text-base text-[#171417] leading-relaxed">{review.text}</p>
            </div>

            {/* Existing Reply (if any) */}
            {review.existingReply && (
              <div className="bg-[#E8FBF7] border border-[#1FC16B] rounded-xl p-4">
                <p className="font-dm-sans font-medium text-base text-[#154751] mb-2">Admin Reply</p>
                <p className="font-dm-sans text-base text-[#171417]">{review.existingReply}</p>
              </div>
            )}

            {/* Reply Box */}
            <div className="space-y-3">
              <label className="font-dm-sans font-medium text-base text-[#171417]">
                {review.hasReply ? "Edit Reply" : "Reply (optional)"}
              </label>
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type your response here..."
                className="w-full h-32 border border-[#B2B2B4] rounded-xl px-4 py-3 font-dm-sans text-base placeholder:text-[#B2B2B4] focus:outline-none focus:border-[#154751] resize-none disabled:bg-gray-50"
                disabled={replyingToRating}
              />
            </div>

            {/* Send Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSendReply}
                disabled={!isActive || replyingToRating}
                className={`px-8 py-4 rounded-[36px] font-dm-sans font-medium text-base transition-all ${
                  isActive && !replyingToRating
                    ? "bg-gradient-to-br from-[#154751] to-[#04171F] text-white hover:opacity-90"
                    : "bg-[#ACC5CF] text-[#FFFEFE] cursor-not-allowed"
                }`}
              >
                {replyingToRating ? "Sending..." : "Send Reply"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE - Bottom Sheet */}
      <div className="md:hidden fixed inset-0 z-[200] flex items-end">
        <div className="absolute inset-0" onClick={onClose} style={{ background: "rgba(0,0,0,0.05)" }} />
        <div
          className="relative w-full bg-white rounded-t-2xl shadow-2xl max-h-[90vh] overflow-y-auto animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-[#E8FBF7] px-6 py-6 border-b border-[#E8E3E3] flex items-center justify-between sticky top-0 z-10">
            <h2 className="font-dm-sans font-bold text-xl text-[#171417]">Respond to Review</h2>
            <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#171417" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* User + Stars */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-dm-sans font-medium text-base text-[#171417]">Feedback from</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="font-dm-sans font-medium text-base text-[#454345]">{review.username}</span>
                  <span className="text-sm text-[#171417] px-2 py-0.5 bg-[#E6E8E9] rounded">{review.userRole}</span>
                </div>
              </div>
              <div className="flex gap-1">{renderStars(review.rating)}</div>
            </div>

            {/* Review */}
            <div className="bg-[#FFFAFA] rounded-xl p-4">
              <p className="font-dm-sans text-base text-[#171417] leading-relaxed">{review.text}</p>
            </div>

            {/* Existing Reply (if any) */}
            {review.existingReply && (
              <div className="bg-[#E8FBF7] border border-[#1FC16B] rounded-xl p-4">
                <p className="font-dm-sans font-medium text-base text-[#154751] mb-2">Admin Reply</p>
                <p className="font-dm-sans text-base text-[#171417]">{review.existingReply}</p>
              </div>
            )}

            {/* Reply */}
            <div className="space-y-3">
              <label className="font-dm-sans font-medium text-base text-[#171417]">
                {review.hasReply ? "Edit Reply" : "Reply (optional)"}
              </label>
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type your response here..."
                className="w-full h-32 border border-[#B2B2B4] rounded-xl px-4 py-3 font-dm-sans text-base placeholder:text-[#B2B2B4] focus:outline-none focus:border-[#154751] resize-none disabled:bg-gray-50"
                disabled={replyingToRating}
              />
            </div>

            {/* Send Button */}
            <button
              onClick={handleSendReply}
              disabled={!isActive || replyingToRating}
              className={`w-full py-4 rounded-[36px] font-dm-sans font-medium text-base transition-all ${
                isActive && !replyingToRating
                  ? "bg-gradient-to-br from-[#154751] to-[#04171F] text-white"
                  : "bg-[#ACC5CF] text-[#FFFEFE]"
              }`}
            >
              {replyingToRating ? "Sending..." : "Send Reply"}
            </button>
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

export default ReviewResponseModal;