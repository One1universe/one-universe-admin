// RatingsFilterDrawer.tsx
"use client";

import React, { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { appRatingsStore } from "@/store/appRatingsStore";

interface RatingsFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const RatingsFilterDrawer = ({ isOpen, onClose }: RatingsFilterDrawerProps) => {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [platform, setPlatform] = useState("All");
  const [isPlatformOpen, setIsPlatformOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const { setFilters, applyFilters, ratingsLoading } = appRatingsStore();

  if (!isOpen) return null;

  const platforms = ["All", "ios", "android", "UNKNOWN"];

  const platformDisplay = {
    All: "All",
    ios: "iOS",
    android: "Android",
    UNKNOWN: "Web",
  };

  const handleApplyFilters = async () => {
    setIsApplying(true);

    try {
      // Build filters object
      const filters: any = {};

      if (selectedRating) {
        filters.rating = selectedRating;
      }

      if (platform !== "All") {
        filters.platform = platform;
      }

      if (fromDate) {
        // Convert DD-MM-YYYY to ISO format YYYY-MM-DD
        const [day, month, year] = fromDate.split("-");
        filters.fromDate = `${year}-${month}-${day}`;
      }

      if (toDate) {
        // Convert DD-MM-YYYY to ISO format YYYY-MM-DD
        const [day, month, year] = toDate.split("-");
        filters.toDate = `${year}-${month}-${day}`;
      }

      console.log("🔍 Applying filters:", filters);

      // Set filters in store
      setFilters(filters);

      // Fetch with filters applied
      await applyFilters();

      // Close drawer
      onClose();
    } catch (error) {
      console.error("❌ Error applying filters:", error);
    } finally {
      setIsApplying(false);
    }
  };

  const handleClearFilters = () => {
    setSelectedRating(null);
    setFromDate("");
    setToDate("");
    setPlatform("All");
    setFilters({});
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-[682px] bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-3 border-b border-[#E8E3E3]">
          <h2 className="font-dm-sans font-bold text-[20px] leading-[140%] text-[#171417]">
            Filter
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={24} className="text-[#171417]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
          {/* Rating */}
          <div className="space-y-4">
            <label className="font-dm-sans font-medium text-base text-[#05060D]">
              Rating
            </label>
            <div className="flex items-center gap-8 h-[54px]">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setSelectedRating(selectedRating === star ? null : star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill={star <= (selectedRating || 0) ? "#F9CB43" : "#BDC0CE"}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 2L14.09 8.26L20.62 8.68L15.62 13.18L16.91 19.68L12 16.86L7.09 19.68L8.38 13.18L3.38 8.68L9.91 8.26L12 2Z" />
                    </svg>
                  </button>
                ))}
              </div>
              {selectedRating && (
                <span className="font-dm-sans font-medium text-base text-[#171417]">
                  {selectedRating}+
                </span>
              )}
            </div>
          </div>

          {/* From Date */}
          <div className="space-y-3">
            <label className="font-dm-sans font-medium text-base text-[#05060D]">
              From
            </label>
            <input
              type="text"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              placeholder="DD-MM-YYYY"
              className="w-full h-[43px] px-4 rounded-xl border border-[#B2B2B4] bg-white font-dm-sans text-base text-center focus:outline-none focus:border-[#154751] transition"
            />
          </div>

          {/* To Date */}
          <div className="space-y-3">
            <label className="font-dm-sans font-medium text-base text-[#05060D]">
              To
            </label>
            <input
              type="text"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              placeholder="DD-MM-YYYY"
              className="w-full h-[43px] px-4 rounded-xl border border-[#B2B2B4] bg-white font-dm-sans text-base text-center focus:outline-none focus:border-[#154751] transition"
            />
          </div>

          {/* Platform - Dropdown */}
          <div className="space-y-3">
            <label className="font-dm-sans font-medium text-base text-[#05060D]">
              Platform
            </label>
            <div className="relative">
              <button
                onClick={() => setIsPlatformOpen(!isPlatformOpen)}
                className="w-full h-[43px] px-4 rounded-xl border border-[#B2B2B4] bg-white font-dm-sans text-base text-center flex items-center justify-between focus:outline-none focus:border-[#154751] transition"
              >
                <span>{platformDisplay[platform as keyof typeof platformDisplay]}</span>
                <ChevronDown
                  size={20}
                  className={`text-[#171417] transition-transform ${isPlatformOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isPlatformOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#B2B2B4] rounded-xl shadow-lg z-10">
                  {platforms.map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        setPlatform(p);
                        setIsPlatformOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left font-dm-sans text-base hover:bg-[#154751]/5 transition"
                    >
                      {platformDisplay[p as keyof typeof platformDisplay]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-[#E8E3E3] space-y-3">
          <button
            onClick={handleApplyFilters}
            disabled={isApplying || ratingsLoading}
            className="w-full px-6 py-4 rounded-[20px] bg-gradient-to-br from-[#154751] to-[#04171F] text-white font-dm-sans font-medium text-base hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isApplying ? "Applying..." : "Apply Filter"}
          </button>

          <button
            onClick={handleClearFilters}
            className="w-full px-6 py-4 rounded-[20px] border border-[#E8E3E3] bg-white text-[#154751] font-dm-sans font-medium text-base hover:bg-gray-50 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </>
  );
};

export default RatingsFilterDrawer;