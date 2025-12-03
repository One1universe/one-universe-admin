"use client";

import React, { useState } from "react";
import ReviewResponseModal from "./ReviewResponseModal";
import EmptyState from "../../EmptyState"; // ← Our smart empty state

type AppRating = {
  id: string;
  username: string;
  platform: "iOS" | "Android" | "Web";
  rating: number;
  createdAt: string;
  review: string;
};

const AppRatingsTable = () => {
  const [selectedReview, setSelectedReview] = useState<AppRating | null>(null);

  const ratings: AppRating[] = [
    {
      id: "1",
      username: "alex_morgan",
      platform: "iOS",
      rating: 5,
      createdAt: "Dec 1, 2024",
      review: "Amazing app! Super fast and easy to use. Best experience ever!",
    },
    {
      id: "2",
      username: "jamie_lee",
      platform: "Web",
      rating: 4,
      createdAt: "Nov 30, 2024",
      review: "Really good, just needs dark mode support on web version.",
    },
    {
      id: "3",
      username: "chris_evans",
      platform: "Android",
      rating: 3,
      createdAt: "Nov 28, 2024",
      review: "It's okay, but keeps crashing when uploading large files.",
    },
    {
      id: "4",
      username: "sophia_turner",
      platform: "iOS",
      rating: 5,
      createdAt: "Nov 27, 2024",
      review: "Perfect! Clean UI and fast performance. Highly recommend.",
    },
  ];

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

  const handleReply = (rating: AppRating) => {
    setSelectedReview(rating);
  };

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
                {ratings.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-[#E5E5E5] hover:bg-[#FAFAFA] transition-colors"
                  >
                    <td className="py-[18px] px-[25px] font-dm-sans text-base text-[#303237]">
                      {item.username}
                    </td>

                    <td className="py-[18px] px-[25px] font-dm-sans text-base text-[#303237]">
                      {item.platform}
                    </td>

                    <td className="py-[18px] px-[25px]">{renderStars(item.rating)}</td>

                    <td className="py-[18px] px-[25px] font-dm-sans text-base text-[#303237]">
                      {item.createdAt}
                    </td>

                    <td className="py-[18px] px-[25px] font-dm-sans text-base text-[#303237] max-w-[400px] truncate">
                      {item.review}
                    </td>

                    <td className="py-[18px] px-[25px]">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleReply(item)}
                          className="px-6 py-3 rounded-[36px] text-white font-dm-sans font-medium text-base bg-gradient-to-br from-[#154751] to-[#04171F] hover:opacity-90 transition-opacity whitespace-nowrap"
                        >
                          Reply
                        </button>

                        <button
                          onClick={() => console.log("More actions for rating", item.id)}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          aria-label="More actions"
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-[#303237]"
                          >
                            <circle cx="10" cy="5" r="2" fill="currentColor" />
                            <circle cx="10" cy="10" r="2" fill="currentColor" />
                            <circle cx="10" cy="15" r="2" fill="currentColor" />
                          </svg>
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
            {ratings.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#E8E3E3] rounded-lg p-4 shadow-sm"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-dm-sans font-medium text-base text-[#303237] mb-1">
                      {item.username}
                    </h3>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-dm-sans text-sm text-[#454345]">
                        {item.platform}
                      </span>
                      <span className="font-dm-sans text-sm text-[#454345]">
                        {item.createdAt}
                      </span>
                    </div>
                    {renderStars(item.rating)}
                  </div>
                  <button
                    onClick={() => console.log("More actions for rating", item.id)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-[#303237]"
                    >
                      <circle cx="10" cy="5" r="2" fill="currentColor" />
                      <circle cx="10" cy="10" r="2" fill="currentColor" />
                      <circle cx="10" cy="15" r="2" fill="currentColor" />
                    </svg>
                  </button>
                </div>
                <p className="font-dm-sans text-sm text-[#303237] mb-4">{item.review}</p>
                <button
                  onClick={() => handleReply(item)}
                  className="w-full py-4 rounded-[36px] text-white font-dm-sans font-medium text-base bg-gradient-to-br from-[#154751] to-[#04171F] hover:opacity-90 transition-opacity"
                >
                  Reply
                </button>
              </div>
            ))}
          </div>
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
          review={{
            username: selectedReview.username,
            userRole: selectedReview.platform,
            rating: selectedReview.rating,
            text: selectedReview.review,
            date: selectedReview.createdAt,
          }}
        />
      )}
    </>
  );
};

export default AppRatingsTable;