// components/Pagination.tsx
"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  isLoading?: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  isLoading = false,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const handlePrevious = () => {
    if (currentPage > 1 && !isLoading) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && !isLoading) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between bg-white px-6 py-4 border-t border-[#E8E3E3]",
        "w-full",
        className
      )}
    >
      {/* Previous Button */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1 || isLoading}
        className={cn(
          "flex items-center gap-2 h-11 px-6 rounded-[36px] border border-[#E8E3E3] text-[#171417] font-bold",
          "bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
          "font-dm-sans text-base"
        )}
      >
        <ChevronLeft size={20} />
        Previous
      </button>

      {/* Page Info */}
      <div className="flex items-center gap-2 text-[#6B6969] font-medium text-sm">
        <span className="text-[#171417] font-bold font-dm-sans">Page {currentPage}</span>
        <span className="font-dm-sans">of {totalPages}</span>
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages || isLoading}
        className={cn(
          "flex items-center gap-2 h-11 px-6 rounded-[36px] text-white font-bold",
          "bg-[#171417] hover:bg-[#171417]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
          "font-dm-sans text-base"
        )}
      >
        Next
        <ChevronRight size={20} />
      </button>
    </div>
  );
}