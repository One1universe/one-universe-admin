"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";

interface ReviewResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: {
    username: string;
    userRole: string;
    rating: number;
    text: string;
    date: string;
  };
}

const ReviewResponseModal = ({ isOpen, onClose, review }: ReviewResponseModalProps) => {
  const [reply, setReply] = useState("");
  const isActive = reply.trim().length > 0;

  if (!isOpen) return null;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={20}
        className={i < rating ? "fill-[#F9CB43] text-[#F9CB43]" : "text-gray-300"}
      />
    ));
  };

  return (
    <>
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

            {/* Reply Box */}
            <div className="space-y-3">
              <label className="font-dm-sans font-medium text-base text-[#171417]">Reply (optional)</label>
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type your response here..."
                className="w-full h-32 border border-[#B2B2B4] rounded-xl px-4 py-3 font-dm-sans text-base placeholder:text-[#B2B2B4] focus:outline-none focus:border-[#154751] resize-none"
              />
            </div>

            {/* Send Button */}
            <div className="flex justify-end">
              <button
                onClick={() => {
                  if (reply.trim()) {
                    alert("Reply sent!");
                    onClose();
                  }
                }}
                disabled={!isActive}
                className={`px-8 py-4 rounded-[36px] font-dm-sans font-medium text-base transition-all ${
                  isActive
                    ? "bg-gradient-to-br from-[#154751] to-[#04171F] text-white hover:opacity-90"
                    : "bg-[#ACC5CF] text-[#FFFEFE] cursor-not-allowed"
                }`}
              >
                Send Reply
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

            {/* Reply */}
            <div className="space-y-3">
              <label className="font-dm-sans font-medium text-base text-[#171417]">Reply (optional)</label>
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type your response here..."
                className="w-full h-32 border border-[#B2B2B4] rounded-xl px-4 py-3 font-dm-sans text-base placeholder:text-[#B2B2B4] focus:outline-none focus:border-[#154751] resize-none"
              />
            </div>

            {/* Send Button */}
            <button
              onClick={() => {
                if (reply.trim()) {
                  alert("Reply sent!");
                  onClose();
                }
              }}
              disabled={!isActive}
              className={`w-full py-4 rounded-[36px] font-dm-sans font-medium text-base transition-all ${
                isActive
                  ? "bg-gradient-to-br from-[#154751] to-[#04171F] text-white"
                  : "bg-[#ACC5CF] text-[#FFFEFE]"
              }`}
            >
              Send Reply
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