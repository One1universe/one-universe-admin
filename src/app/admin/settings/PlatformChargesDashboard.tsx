"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";
import { platformSettingsStore } from "@/store/platformSettingsStore";

interface ToastProps {
  type: "success" | "error" | "warning";
  title: string;
  message: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ type, title, message, onClose }) => {
  const icons = {
    success: <CheckCircle size={24} className="text-[#1FC16B]" />,
    error: <XCircle size={24} className="text-[#D84040]" />,
    warning: <AlertCircle size={24} className="text-[#F9CB43]" />,
  };

  const borders = {
    success: "border-b-4 border-b-[#1FC16B]",
    error: "border-b-4 border-b-[#D84040]",
    warning: "border-b-4 border-b-[#F9CB43]",
  };

  return (
    <div
      className={`fixed top-6 right-6 z-[9999] w-[90%] max-w-[473px] bg-white rounded-lg shadow-2xl ${borders[type]} animate-in slide-in-from-top-2 fade-in duration-300`}
    >
      <div className="flex gap-4 px-5 py-4">
        {icons[type]}
        <div className="flex-1">
          <h4 className="font-dm-sans font-bold text-base text-[#06070E]">
            {title}
          </h4>
          <p className="font-dm-sans text-sm text-[#454345] mt-1 leading-tight">
            {message}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-[#B2B2B4] hover:text-[#171417] transition-colors flex-shrink-0"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

const PlatformChargesDashboard = () => {
  const [fee, setFee] = useState("");
  const [toast, setToast] = useState<ToastProps | null>(null);

  // Get settings ID from environment variable
  const settingsId = process.env.NEXT_PUBLIC_PLATFORM_SETTINGS_ID;

  // Get store state
  const {
    platformSettings,
    loading,
    error,
    updatingFee,
    updateError,
    updateSuccess,
    fetchPlatformSettings,
    updatePlatformFee,
    clearUpdateSuccess,
    clearError,
  } = platformSettingsStore();

  // ✅ Fetch settings on mount
  useEffect(() => {
    if (!settingsId) {
      console.error("❌ NEXT_PUBLIC_PLATFORM_SETTINGS_ID is not set in environment variables");
      setToast({
        type: "error",
        title: "Configuration Error",
        message: "Platform settings ID is not configured",
        onClose: () => setToast(null),
      });
      return;
    }

    const loadSettings = async () => {
      try {
        await fetchPlatformSettings(settingsId);
      } catch (err) {
        console.error("Failed to load platform settings:", err);
      }
    };

    loadSettings();
  }, [settingsId, fetchPlatformSettings]);

  // ✅ Auto-dismiss success toast
  useEffect(() => {
    if (updateSuccess) {
      setToast({
        type: "success",
        title: "Update Successful",
        message: `Platform fee updated successfully to ${platformSettings?.platformFeePercentage}%.`,
        onClose: () => {
          setToast(null);
          clearUpdateSuccess();
          setFee("");
        },
      });
    }
  }, [updateSuccess, platformSettings?.platformFeePercentage, clearUpdateSuccess]);

  // ✅ Show error toast
  useEffect(() => {
    if (updateError) {
      setToast({
        type: "error",
        title: "Update Failed",
        message: updateError,
        onClose: () => {
          setToast(null);
          clearError();
        },
      });
    }
  }, [updateError, clearError]);

  // ✅ Show fetch error toast
  useEffect(() => {
    if (error) {
      setToast({
        type: "error",
        title: "Error Loading Settings",
        message: error,
        onClose: () => {
          setToast(null);
          clearError();
        },
      });
    }
  }, [error, clearError]);

  const currentFee = platformSettings?.platformFeePercentage || 0;

  const handleUpdate = async () => {
    const num = parseFloat(fee);

    if (!fee || isNaN(num) || num < 1 || num > 100) {
      setToast({
        type: "warning",
        title: "Invalid Input",
        message: "Platform charge must be between 1% and 100%.",
        onClose: () => setToast(null),
      });
      return;
    }

    if (!platformSettings?.id) {
      setToast({
        type: "error",
        title: "Error",
        message: "Platform settings not loaded. Please refresh the page.",
        onClose: () => setToast(null),
      });
      return;
    }

    // Call the store action
    const success = await updatePlatformFee(platformSettings.id, num);

    if (!success) {
      // Error toast is shown by useEffect above
      console.error("Failed to update platform fee");
    }
  };

  const isValid =
    fee === "" ||
    (!isNaN(parseFloat(fee)) &&
      parseFloat(fee) >= 1 &&
      parseFloat(fee) <= 100);
  const isActive =
    fee !== "" &&
    isValid &&
    parseFloat(fee) !== currentFee &&
    !updatingFee;

  return (
    <>
      <div className="w-full space-y-8 px-5 md:px-0">
        {/* Header */}
        <div className="space-y-2">
          <h2 className="font-dm-sans font-medium text-xl text-[#171417]">
            Platform Charge Management
          </h2>
          <p className="font-dm-sans text-sm md:text-base text-[#6B6969]">
            Admins can adjust the platform service fee applied to all payouts.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-[#FFFCFC] border-l-4 border-l-[#154751] rounded-r-lg p-6 max-w-2xl">
            <p className="font-dm-sans text-sm text-[#6B6969]">Loading settings...</p>
          </div>
        )}

        {/* Current Fee Card */}
        {!loading && platformSettings && (
          <div className="bg-[#FFFCFC] border-l-4 border-l-[#154751] rounded-r-lg p-6 max-w-2xl">
            <div>
              <p className="font-dm-sans text-xs text-[#6B6969]">
                Current Platform Fee
              </p>
              <p className="font-dm-sans font-bold text-xl text-[#171417] mt-1">
                {currentFee}%{" "}
                <span className="text-sm font-normal text-[#6B6969]">
                  (default)
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Update Form */}
        <div className="space-y-6 max-w-2xl">
          <div>
            <label className="font-dm-sans font-medium text-base text-[#05060D]">
              New Platform Fee (%)
            </label>
            <div className="mt-3">
              <input
                type="text"
                value={fee}
                onChange={(e) =>
                  setFee(
                    e.target.value
                      .replace(/[^0-9.]/g, "")
                      .replace(/(\..*)\./g, "$1")
                  )
                }
                placeholder="Enter percentage"
                disabled={loading || updatingFee}
                className="w-full h-12 px-4 rounded-xl border border-[#B2B2B4] font-dm-sans text-base text-center focus:outline-none focus:border-[#154751] transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <button
            onClick={handleUpdate}
            disabled={!isActive}
            className={`w-full h-12 rounded-[20px] font-dm-sans font-medium text-base text-white flex items-center justify-center transition-all ${
              isActive ? "shadow-lg hover:shadow-xl" : "opacity-70 cursor-not-allowed"
            }`}
            style={{
              background: isActive
                ? "radial-gradient(50% 50% at 50% 50%, #154751 37%, #04171F 100%)"
                : "linear-gradient(0deg, #ACC5CF, #ACC5CF)",
            }}
          >
            {updatingFee ? "Updating..." : "Update Platform Fee"}
          </button>
        </div>

        {/* Additional Settings Display */}
        {!loading && platformSettings && (
          <div className="bg-[#F5F5F5] rounded-lg p-6 max-w-2xl space-y-4">
            <h3 className="font-dm-sans font-medium text-base text-[#171417]">
              Other Platform Settings
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#6B6969]">Max Transaction Amount:</span>
                <span className="font-medium text-[#171417]">
                  N{platformSettings.maxTransactionAmount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6969]">Reward Eligibility Days:</span>
                <span className="font-medium text-[#171417]">
                  {platformSettings.rewardEligibilityDays} days
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6969]">Max Referrals Per User/Month:</span>
                <span className="font-medium text-[#171417]">
                  {platformSettings.maxReferralsPerUserPerMonth}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6969]">Status:</span>
                <span
                  className={`font-medium ${
                    platformSettings.active ? "text-[#1FC16B]" : "text-[#D84040]"
                  }`}
                >
                  {platformSettings.active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toast at Top Right */}
      {toast && <Toast {...toast} />}
    </>
  );
};

export default PlatformChargesDashboard;