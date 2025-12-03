"use client";

import React from "react";
import Image from "next/image";

type EmptyStateType = "support" | "ratings";

interface EmptyStateProps {
  type: EmptyStateType;
}

const EmptyState = ({ type }: EmptyStateProps) => {
  const config = {
    support: {
      image: "/empty/empty-support.png",
      title: "No Support Requests Yet",
      description: "All user-reported issues will appear here. You're all caught up for now!",
    },
    ratings: {
      image: "/empty/empty-ratings.png", // ← Your downloaded image
      title: "No Ratings or Feedback Yet",
      description: "User reviews submitted via the mobile app will appear here. Check back later!",
    },
  };

  const { image, title, description } = config[type];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Empty State Icon */}
      <div className="w-[150px] h-[150px] mb-6 relative">
        <Image
          src={image}
          alt={type === "support" ? "No support tickets" : "No ratings"}
          width={150}
          height={150}
          className="object-contain"
        />
      </div>

      {/* Empty State Text */}
      <h3 className="font-dm-sans font-bold text-base leading-[140%] text-[#171417] mb-2 text-center">
        {title}
      </h3>
      <p className="font-dm-sans text-base leading-[140%] text-[#6B6969] text-center max-w-[600px]">
        {description}
      </p>
    </div>
  );
};

export default EmptyState;