"use client";

import React, { useState, useEffect } from "react";
import { appRatingsStore } from "@/store/appRatingsStore";
import ReviewResponseModal from "./ReviewResponseModal";
import EmptyState from "../../EmptyState";

const AppRatingsTable = () => {
  const [selectedReview, setSelectedReview] = useState<any>(null);

  // Get state from store
  const {
    ratings,
    ratingsLoading,
    ratingsError,
    currentPage,
    totalPages,
    totalRatings,
    fetchRatings,
  } = appRatingsStore();

  // Fetch ratings on mount
  useEffect(() => {
    console.log("📊 Fetching app ratings on mount");
    fetchRatings(1, 10);
  }, [fetchRatings]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill={star <= rating ? "#F9CB43" : "#BDC0CE"}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10 0L12.2451 6.90983H19.5106L13.6327 11.1803L15.8779 18.0902L10 14.3197L4.12215 18.0902L6.36731 11.1803L0.489435 6.90983H7.75486L10 0Z" />
          </svg>
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getPlatformDisplay = (platform: string) => {
    switch (platform) {
      case "ios":
        return "iOS";
      case "android":
        return "Android";
      case "UNKNOWN":
        return "Web";
      default:
        return platform;
    }
  };

  const getUserDisplay = (rating: any) => {
    if (rating.user) {
      return rating.user.fullName || rating.user.email;
    }
    return "Anonymous User";
  };

  const handleReply = (rating: any) => {
    setSelectedReview({
      id: rating.id,
      username: getUserDisplay(rating),
      userRole: getPlatformDisplay(rating.platform),
      rating: rating.rating,
      text: rating.message,
      date: formatDate(rating.createdAt),
      hasReply: !!rating.adminReply,
      existingReply: rating.adminReply,
    });
  };

  const handlePageChange = (page: number) => {
    console.log("📄 Changing to page:", page);
    fetchRatings(page, 10);
  };

  // Loading state
  if (ratingsLoading && ratings.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#154751]"></div>
      </div>
    );
  }

  // Error state
  if (ratingsError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 font-dm-sans text-base">{ratingsError}</p>
        <button
          onClick={() => fetchRatings(1, 10)}
          className="mt-4 px-6 py-2 bg-[#154751] text-white rounded-lg hover:opacity-90"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      {/* === CONTENT WHEN THERE ARE RATINGS === */}
      {ratings.length > 0 ? (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block w-full overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-[#FFFCFC] border-b border-[#E5E5E5]">
                  <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">
                    Username
                  </th>
                  <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">
                    Platform
                  </th>
                  <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">
                    Rating
                  </th>
                  <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">
                    Date
                  </th>
                  <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">
                    Feedback
                  </th>
                  <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264] text-center">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {ratings.map((rating) => (
                  <tr
                    key={rating.id}
                    className="border-b border-[#E5E5E5] hover:bg-[#FAFAFA] transition-colors"
                  >
                    <td className="py-[18px] px-[25px] font-dm-sans text-base text-[#303237]">
                      {getUserDisplay(rating)}
                    </td>

                    <td className="py-[18px] px-[25px] font-dm-sans text-base text-[#303237]">
                      {getPlatformDisplay(rating.platform)}
                    </td>

                    <td className="py-[18px] px-[25px]">{renderStars(rating.rating)}</td>

                    <td className="py-[18px] px-[25px] font-dm-sans text-base text-[#303237]">
                      {formatDate(rating.createdAt)}
                    </td>

                    <td className="py-[18px] px-[25px] font-dm-sans text-base text-[#303237] max-w-[400px] truncate">
                      {rating.message}
                    </td>

                    <td className="py-[18px] px-[25px]">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => handleReply(rating)}
                          className="px-6 py-3 rounded-[36px] text-white font-dm-sans font-medium text-base bg-gradient-to-br from-[#154751] to-[#04171F] hover:opacity-90 transition-opacity whitespace-nowrap"
                        >
                          {rating.adminReply ? "Edit Reply" : "Reply"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4 p-4">
            {ratings.map((rating) => (
              <div
                key={rating.id}
                className="bg-white border border-[#E8E3E3] rounded-lg p-4 shadow-sm"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-dm-sans font-medium text-base text-[#303237] mb-1">
                      {getUserDisplay(rating)}
                    </h3>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-dm-sans text-sm text-[#454345]">
                        {getPlatformDisplay(rating.platform)}
                      </span>
                      <span className="font-dm-sans text-sm text-[#454345]">
                        {formatDate(rating.createdAt)}
                      </span>
                    </div>
                    {renderStars(rating.rating)}
                  </div>
                </div>
                <p className="font-dm-sans text-sm text-[#303237] mb-4">{rating.message}</p>
                <button
                  onClick={() => handleReply(rating)}
                  className="w-full py-4 rounded-[36px] text-white font-dm-sans font-medium text-base bg-gradient-to-br from-[#154751] to-[#04171F] hover:opacity-90 transition-opacity"
                >
                  {rating.adminReply ? "Edit Reply" : "Reply"}
                </button>
              </div>
            ))}
          </div>

          {/* Pagination - Only render if there are multiple pages */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white px-6 py-4 border-t border-[#E8E3E3]">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || ratingsLoading}
                className="flex items-center gap-2 h-11 px-6 rounded-[36px] border border-[#E8E3E3] text-[#171417] font-bold bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-dm-sans text-base"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M12 16l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Previous
              </button>

              {/* Page Info */}
              <div className="flex items-center gap-2 text-[#6B6969] font-medium text-sm">
                <span className="text-[#171417] font-bold font-dm-sans">Page {currentPage}</span>
                <span className="font-dm-sans">of {totalPages}</span>
              </div>

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || ratingsLoading}
                className="flex items-center gap-2 h-11 px-6 rounded-[36px] text-white font-bold bg-[#171417] hover:bg-[#171417]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-dm-sans text-base"
              >
                Next
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M8 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}
        </>
      ) : (
        /* === EMPTY STATE FOR RATINGS === */
        <EmptyState type="ratings" />
      )}

      {/* Review Response Modal */}
      {selectedReview && (
        <ReviewResponseModal
          isOpen={true}
          onClose={() => setSelectedReview(null)}
          review={selectedReview}
          ratingId={selectedReview.id}
        />
      )}
    </>
  );
};

export default AppRatingsTable;