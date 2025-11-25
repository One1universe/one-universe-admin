// components/Pagination.tsx
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-between bg-white px-6 py-4 border-t border-[#E8E3E3]",
        "w-full max-w-[1120px] mx-auto",
        className
      )}
    >
      {/* Previous Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "flex items-center gap-2 h-11 px-6 rounded-[36px] border-[#E8E3E3] text-[#171417] font-bold",
          "hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        <ChevronLeft size={20} />
        Previous
      </Button>

      {/* Page Info */}
      <div className="flex items-center gap-2 text-[#6B6969] font-medium text-sm">
        <span className="text-[#171417] font-bold">Page {currentPage}</span>
        <span>of {totalPages}</span>
      </div>

      {/* Next Button */}
      <Button
        variant="default"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          "flex items-center gap-2 h-11 px-6 rounded-[36px] bg-[#171417] text-white font-bold",
          "hover:bg-[#171417]/90"
        )}
      >
        Next
        <ChevronRight size={20} />
      </Button>
    </div>
  );
}