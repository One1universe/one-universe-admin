"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import { ApproveVerificationModal, RejectVerificationModal } from "./Verificationactionmodals";
import { useSession } from "next-auth/react";
import getBaseUrl from "@/services/baseUrl";
import useToastStore from "@/store/useToastStore";

interface PhotoComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  userPhoto?: string;
  ninPhoto?: string;
  uploadedDate?: string;
  ninSource?: string;
  verificationId?: string;
  verificationStatus?: "PENDING" | "APPROVED" | "REJECTED" | "VERIFIED" | "FAILED";
  adminVerified?: boolean;
  onSuccess?: () => void;
}

const PhotoComparisonModal: React.FC<PhotoComparisonModalProps> = ({
  isOpen,
  onClose,
  userPhoto = "/images/woman.png",
  ninPhoto = "/images/man.png",
  uploadedDate = "Oct 12, 2024",
  ninSource = "From: Nigeria Database (Dikript)",
  verificationId,
  verificationStatus = "PENDING",
  adminVerified = false,
  onSuccess,
}) => {
  const { data: session } = useSession();
  const { showToast } = useToastStore();
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Determine if verified (check both status and adminVerified flag)
  const isVerified = verificationStatus === "VERIFIED" || 
                     (verificationStatus === "APPROVED" && adminVerified);
  const isRejected = verificationStatus === "FAILED" || 
                     (verificationStatus === "REJECTED" && !adminVerified);

  const handleApproveClick = () => {
    setShowApproveConfirm(true);
  };

  const handleApproveConfirm = async () => {
    if (!verificationId || !session?.accessToken) {
      showToast(
        "error",
        "Missing Information",
        "Verification ID or access token is missing. Please try again."
      );
      return;
    }

    setIsProcessing(true);
    try {
      const BASE_URL = getBaseUrl();
      const response = await fetch(
        `${BASE_URL}/verification/${verificationId}/approve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );

      // Try to parse JSON response
      let data = null;
      const contentType = response.headers.get("content-type");
      
      if (contentType && contentType.includes("application/json")) {
        try {
          data = await response.json();
        } catch (parseError) {
          // console.error("Failed to parse JSON:", parseError);
        }
      } else {
        // Try to get text if not JSON
        const text = await response.text();
        // console.error("Non-JSON response:", text);
      }

      if (!response.ok) {
        // Extract error message from various possible locations
        const errorMessage = 
          data?.message || 
          data?.error?.message ||
          data?.error || 
          (Array.isArray(data?.message) ? data.message.join(", ") : null) ||
          `Server error: ${response.status} ${response.statusText}`;
        
        showToast(
          "error",
          "Approval Failed",
          errorMessage
        );

        // console.error("❌ API Error Details:", {
        //   status: response.status,
        //   statusText: response.statusText,
        //   errorMessage,
        //   verificationId,
        //   responseData: data,
        //   url: `${BASE_URL}/verification/${verificationId}/approve`
        // });
        
        return;
      }

      // console.log("✅ Verification approved successfully", data);
      
      showToast(
        "success",
        "Verification Approved",
        data?.message || "The user's verification has been approved successfully!"
      );
      
      setShowApproveConfirm(false);
      
      // Call onSuccess callback to refresh data
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "An unexpected error occurred while approving verification";
      
      showToast(
        "error",
        "Approval Failed",
        errorMessage
      );

      // console.error("❌ Exception while approving verification:", {
      //   error,
      //   errorStack: error instanceof Error ? error.stack : undefined,
      //   verificationId,
      //   message: errorMessage
      // });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectClick = () => {
    setShowRejectConfirm(true);
  };

  const handleRejectConfirm = async (reason: string) => {
    if (!verificationId || !session?.accessToken) {
      showToast(
        "error",
        "Missing Information",
        "Verification ID or access token is missing. Please try again."
      );
      return;
    }

    setIsProcessing(true);
    try {
      const BASE_URL = getBaseUrl();
      const response = await fetch(
        `${BASE_URL}/verification/${verificationId}/reject`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify({ reason }),
        }
      );

      // Try to parse JSON response
      let data = null;
      const contentType = response.headers.get("content-type");
      
      if (contentType && contentType.includes("application/json")) {
        try {
          data = await response.json();
        } catch (parseError) {
          // console.error("Failed to parse JSON:", parseError);
        }
      } else {
        // Try to get text if not JSON
        const text = await response.text();
        // console.error("Non-JSON response:", text);
      }

      if (!response.ok) {
        // Extract error message from various possible locations
        const errorMessage = 
          data?.message || 
          data?.error?.message ||
          data?.error || 
          (Array.isArray(data?.message) ? data.message.join(", ") : null) ||
          `Server error: ${response.status} ${response.statusText}`;
        
        showToast(
          "error",
          "Rejection Failed",
          errorMessage
        );

        // console.error("❌ API Error Details:", {
        //   status: response.status,
        //   statusText: response.statusText,
        //   errorMessage,
        //   verificationId,
        //   reason,
        //   responseData: data,
        //   url: `${BASE_URL}/verification/${verificationId}/reject`
        // });
        
        return;
      }

      // console.log("✅ Verification rejected successfully", data);
      
      showToast(
        "success",
        "Verification Rejected",
        data?.message || "The user's verification has been rejected successfully!"
      );
      
      setShowRejectConfirm(false);
      
      // Call onSuccess callback to refresh data
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "An unexpected error occurred while rejecting verification";
      
      showToast(
        "error",
        "Rejection Failed",
        errorMessage
      );

      // console.error("❌ Exception while rejecting verification:", {
      //   error,
      //   errorStack: error instanceof Error ? error.stack : undefined,
      //   verificationId,
      //   reason,
      //   message: errorMessage
      // });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-[16px] w-full max-w-[917px] shadow-lg p-4 md:p-8 max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 120 }}
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 md:mb-4">
                <h2 className="text-[#171417] font-bold text-lg md:text-xl">Photo Comparison</h2>
                <div className="flex items-center gap-2 w-full md:w-auto">
                  {/* Dynamic Status Badge */}
                  {isVerified ? (
                    <div className="flex items-center gap-2 h-[28px] px-2 py-1 rounded-[8px] bg-[#E0F5E6] flex-1 md:flex-initial">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="7" stroke="#1FC16B" strokeWidth="1.5" fill="none" />
                        <path
                          d="M5 8L7 10L11 6"
                          stroke="#1FC16B"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-[#1FC16B] font-regular text-sm text-center">Verified</span>
                    </div>
                  ) : isRejected ? (
                    <div className="flex items-center gap-2 h-[28px] px-2 py-1 rounded-[8px] bg-[#FFC4C9] flex-1 md:flex-initial">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="7" stroke="#D00416" strokeWidth="1.5" fill="none" />
                        <path d="M5 5L11 11M5 11L11 5" stroke="#D00416" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      <span className="text-[#D00416] font-regular text-sm text-center">Rejected</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 h-[28px] px-2 py-1 rounded-[8px] bg-[#FFF2B9] flex-1 md:flex-initial">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M8 1.55469C4.41015 1.55469 1.5 4.46484 1.5 8.05469C1.5 11.6445 4.41015 14.5547 8 14.5547C11.5898 14.5547 14.5 11.6445 14.5 8.05469C14.5 4.46484 11.5898 1.55469 8 1.55469Z"
                          fill="#9D7F04"
                        />
                        <path
                          d="M8 5.05469V8.55469M8 10.5547H8.005"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-[#9D7F04] font-regular text-sm text-center">Pending Review</span>
                    </div>
                  )}
                  <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-black transition flex-shrink-0"
                    title="Close modal"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Photos Container */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
                {/* Uploaded by User */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-[#171417] font-medium text-base">Uploaded by User</h3>
                  <div className="w-full aspect-square rounded-[8px] bg-gray-200 flex items-center justify-center overflow-hidden">
                    <Image
                      src={userPhoto}
                      alt="User uploaded photo"
                      width={414}
                      height={414}
                      className="w-full h-full object-cover rounded-[8px]"
                      priority
                    />
                  </div>
                  <p className="text-[#606060] font-regular text-sm">Uploaded: {uploadedDate}</p>
                </div>

                {/* NIN/BVN Record Photo */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-[#171417] font-medium text-base">NIN/BVN Record Photo</h3>
                  <div className="w-full aspect-square rounded-[8px] bg-gray-200 flex items-center justify-center overflow-hidden">
                    <Image
                      src={ninPhoto}
                      alt="NIN/BVN record photo"
                      width={414}
                      height={414}
                      className="w-full h-full object-cover rounded-[8px]"
                      priority
                    />
                  </div>
                  <p className="text-[#606060] font-regular text-sm">{ninSource}</p>
                </div>
              </div>

              {/* Verification Notes */}
              <div className="flex flex-col gap-2 mb-6">
                <h3 className="text-[#171417] font-medium text-base">Verification Notes</h3>
                <p className="text-[#333333] font-regular text-sm md:text-base">
                  Compare both photos carefully. Verify facial features, age consistency, and any visible discrepancies. 
                  If photos do not match, reject the verification with specific reasons.
                </p>
              </div>

              {/* Action Buttons - Only show if not verified */}
              {!isVerified && (
                <div className="flex flex-col md:flex-row gap-3 md:gap-6 md:justify-end">
                  <button
                    onClick={handleRejectClick}
                    disabled={isProcessing || !verificationId}
                    className="flex items-center justify-center px-4 md:px-6 py-2.5 md:py-3 rounded-[36px] bg-[#D84040] text-white font-medium text-sm md:text-sm hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
                  >
                    {isProcessing ? "Processing..." : isRejected ? "Reject Again" : "Reject Verification"}
                  </button>
                  <button
                    onClick={handleApproveClick}
                    disabled={isProcessing || !verificationId}
                    className="flex items-center justify-center px-4 md:px-6 py-2.5 md:py-3 rounded-[36px] bg-gradient-to-r from-[#154751] to-[#04171F] text-white font-medium text-sm md:text-sm hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
                  >
                    {isProcessing ? "Processing..." : isRejected ? "Approve Verification" : "Approve Verification"}
                  </button>
                </div>
              )}

              {/* Already Verified Message */}
              {isVerified && (
                <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                  <p className="text-sm text-center text-green-700">
                    ✅ This verification has been approved.
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Verification Action Modals */}
      <ApproveVerificationModal
        isOpen={showApproveConfirm}
        onClose={() => setShowApproveConfirm(false)}
        onConfirm={handleApproveConfirm}
        loading={isProcessing}
      />

      <RejectVerificationModal
        isOpen={showRejectConfirm}
        onClose={() => setShowRejectConfirm(false)}
        onConfirm={handleRejectConfirm}
        loading={isProcessing}
      />
    </>
  );
};

export default PhotoComparisonModal;