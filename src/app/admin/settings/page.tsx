"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Camera,
  Eye,
  EyeOff,
  AlertCircle,
  Check,
  X,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useProfileStore } from "@/store/profileStore";
import authService from "@/services/authService";

// Import all dashboards and notification tab
import SubscriptionDashboard from "./SubscriptionDashboard";
import SponsorAdsDashboard from "./SponsorAdsDashboard";
import PlatformChargesDashboard from "./PlatformChargesDashboard";
import NotificationTab from "./Tabs/NotificationTab";

// ============================================================================
// TOAST NOTIFICATION COMPONENT
// ============================================================================
interface Toast {
  id: string;
  message: string;
  type: "success" | "error";
}

const Toast: React.FC<Toast & { onClose: () => void }> = ({
  id,
  message,
  type,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-6 right-6 z-[9999] rounded-2xl px-6 py-4 shadow-lg flex items-center gap-3 animate-slide-in max-w-md`}
      style={{
        background:
          type === "success"
            ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
            : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
      }}
    >
      {type === "success" ? (
        <CheckCircle size={24} className="text-white flex-shrink-0" />
      ) : (
        <XCircle size={24} className="text-white flex-shrink-0" />
      )}
      <p className="text-white font-dm-sans font-medium">{message}</p>
      <button
        onClick={onClose}
        className="ml-auto text-white/80 hover:text-white"
      >
        <X size={20} />
      </button>
    </div>
  );
};

const ToastContainer: React.FC<{ toasts: Toast[]; onRemove: (id: string) => void }> = ({
  toasts,
  onRemove,
}) => {
  return (
    <div className="fixed top-0 right-0 z-[9999] pointer-events-none">
      <div className="p-6 space-y-3 pointer-events-auto">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={() => onRemove(toast.id)}
          />
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// OTP MODAL - Errors only via toast
// ============================================================================
const OTPModal: React.FC<{
  onClose: () => void;
  onOTPReceived: () => void;
  email: string;
  isLoading: boolean;
  error: string | null;
  token: string;
  showToast: (message: string, type: "success" | "error") => void;
}> = ({ onClose, onOTPReceived, email, isLoading, error, token, showToast }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [verifying, setVerifying] = useState(false);

  const handleChange = (i: number, value: string) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[i] = value;
      setOtp(newOtp);
      if (value && i < 5) {
        document.getElementById(`otp-${i + 1}`)?.focus();
      }
    }
  };

  const isComplete = otp.every((d) => d !== "");
  const otpCode = otp.join("");

  const handleVerifyOTP = async () => {
    if (!isComplete) {
      showToast("Please enter all 6 digits of the OTP", "error");
      return;
    }

    setVerifying(true);

    try {
      await authService.verifyPasswordResetOTP(email, otpCode, token);
      showToast("OTP verified successfully! ✓", "success");
      setTimeout(() => onOTPReceived(), 500);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Invalid or expired OTP";

      const friendlyMessage =
        errorMessage.toLowerCase().includes("invalid") ||
        errorMessage.toLowerCase().includes("expired")
          ? "The OTP you entered is incorrect or has expired. Please try again."
          : "Failed to verify OTP. Please try again.";

      showToast(friendlyMessage, "error");
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => {
    if (error) {
      showToast(
        error.includes("send")
          ? "Failed to send OTP. Please try again."
          : error,
        "error"
      );
    }
  }, [error, showToast]);

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-transparent" onClick={onClose} />

      <div className="relative bg-white rounded-t-3xl md:rounded-3xl w-full max-w-md p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-3">
          <h2 className="font-dm-sans font-bold text-2xl text-[#171417]">
            Verify Your Identity
          </h2>
          <p className="text-[#6B6969] text-sm">
            We sent a 6-digit code to <br /> <strong>{email}</strong>
          </p>
        </div>

        <div className="flex justify-center gap-2">
          {otp.map((_, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              type="text"
              maxLength={1}
              value={otp[i]}
              onChange={(e) => handleChange(i, e.target.value)}
              disabled={isLoading || verifying}
              className="w-11 h-11 text-center text-xl font-bold border-2 border-[#E3E5E5] rounded-lg focus:border-[#154751] outline-none disabled:opacity-50"
            />
          ))}
        </div>

        <button
          onClick={handleVerifyOTP}
          disabled={!isComplete || isLoading || verifying}
          className="w-full h-12 rounded-2xl text-white font-dm-sans font-medium disabled:opacity-50 flex items-center justify-center gap-2"
          style={{
            background:
              isComplete && !isLoading && !verifying
                ? "radial-gradient(circle at center, #154751 37%, #04171F 100%)"
                : "#ACC5CF",
          }}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Requesting OTP...
            </>
          ) : verifying ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify OTP"
          )}
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// PASSWORD CHANGE MODAL - IMPROVED WITH PROPER ERROR HANDLING
// ============================================================================
const PasswordChangeModal: React.FC<{
  onClose: () => void;
  email: string;
  token: string;
  showToast: (message: string, type: "success" | "error") => void;
}> = ({ onClose, email, token, showToast }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Password strength validation
  const hasMin = newPass.length >= 8;
  const hasUpper = /[A-Z]/.test(newPass);
  const hasLower = /[a-z]/.test(newPass);
  const hasNumber = /\d/.test(newPass);
  const hasSpecial = /[!@#$%^&*]/.test(newPass);
  const match = newPass === confirm && confirm !== "";

  const canSubmit =
    currentPassword &&
    hasMin &&
    hasUpper &&
    hasLower &&
    hasNumber &&
    hasSpecial &&
    match;

  // Clear field error when user starts typing
  const handleCurrentPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPassword(e.target.value);
    if (fieldErrors.currentPassword) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.currentPassword;
        return newErrors;
      });
    }
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPass(e.target.value);
    if (fieldErrors.newPassword) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.newPassword;
        return newErrors;
      });
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirm(e.target.value);
    if (fieldErrors.confirmPassword) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.confirmPassword;
        return newErrors;
      });
    }
  };

  const handleChangePassword = async () => {
    if (!canSubmit) {
      showToast("Please complete all password requirements", "error");
      return;
    }

    setLoading(true);
    setFieldErrors({});

    try {
      // console.log("📤 Submitting password change...");

      const response = await authService.changePassword(
        currentPassword,
        newPass,
        confirm,
        token
      );

      // console.log("✅ Password changed successfully");

      // Show success message
      showToast(
        response.message || "Password changed successfully! ✓",
        "success"
      );

      // Reset form and close modal
      setCurrentPassword("");
      setNewPass("");
      setConfirm("");
      setTimeout(() => onClose(), 500);
    } catch (err) {
      // ⭐ Extract the specific error message from backend
      const errorMessage =
        err instanceof Error ? err.message : "Failed to change password";

      // console.error("❌ Error:", errorMessage);

      // Show error in toast immediately
      showToast(errorMessage, "error");

      // ⭐ Map specific errors to fields for better UX
      if (
        errorMessage.toLowerCase().includes("current") ||
        errorMessage.toLowerCase().includes("incorrect")
      ) {
        setFieldErrors((prev) => ({
          ...prev,
          currentPassword: errorMessage,
        }));
      } else if (errorMessage.toLowerCase().includes("match")) {
        setFieldErrors((prev) => ({
          ...prev,
          confirmPassword: errorMessage,
        }));
      } else if (errorMessage.toLowerCase().includes("same")) {
        setFieldErrors((prev) => ({
          ...prev,
          newPassword: errorMessage,
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-transparent" onClick={onClose} />

      <div className="relative bg-white rounded-t-3xl md:rounded-3xl w-full max-w-2xl p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center">
          <h2 className="font-dm-sans font-bold text-2xl text-[#171417]">
            Change Password
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={28} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Current Password */}
          <div className="relative">
            <label className="block font-dm-sans font-medium mb-2 text-[#171417]">
              Current Password
            </label>
            <input
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={handleCurrentPasswordChange}
              placeholder="Enter your current password"
              className={`w-full h-12 px-4 pr-12 rounded-xl border focus:outline-none disabled:opacity-50 transition-colors ${
                fieldErrors.currentPassword
                  ? "border-red-500 focus:border-red-500"
                  : "border-[#B2B2B4] focus:border-[#154751]"
              }`}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-4 top-10 text-gray-600"
            >
              {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {fieldErrors.currentPassword && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} />
                {fieldErrors.currentPassword}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="relative">
            <label className="block font-dm-sans font-medium mb-2 text-[#171417]">
              New Password
            </label>
            <input
              type={showNew ? "text" : "password"}
              value={newPass}
              onChange={handleNewPasswordChange}
              placeholder="Enter new password"
              className={`w-full h-12 px-4 pr-12 rounded-xl border focus:outline-none disabled:opacity-50 transition-colors ${
                fieldErrors.newPassword
                  ? "border-red-500 focus:border-red-500"
                  : "border-[#B2B2B4] focus:border-[#154751]"
              }`}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-4 top-10 text-gray-600"
            >
              {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {fieldErrors.newPassword && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} />
                {fieldErrors.newPassword}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block font-dm-sans font-medium mb-2 text-[#171417]">
              Confirm New Password
            </label>
            <input
              type={showConfirm ? "text" : "password"}
              value={confirm}
              onChange={handleConfirmPasswordChange}
              placeholder="Confirm new password"
              className={`w-full h-12 px-4 pr-12 rounded-xl border focus:outline-none disabled:opacity-50 transition-colors ${
                fieldErrors.confirmPassword
                  ? "border-red-500 focus:border-red-500"
                  : "border-[#B2B2B4] focus:border-[#154751]"
              }`}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-10 text-gray-600"
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {fieldErrors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} />
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>

          {/* Password Strength Indicators */}
          <div className="flex flex-wrap gap-2 mt-4">
            {[
              { valid: hasMin, text: "8+ characters" },
              { valid: hasUpper, text: "Uppercase" },
              { valid: hasLower, text: "Lowercase" },
              { valid: hasNumber, text: "Number" },
              { valid: hasSpecial, text: "Special char (!@#$%^&*)" },
              { valid: match, text: "Passwords match" },
            ].map((item) => (
              <div
                key={item.text}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  item.valid
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {item.valid ? (
                  <Check size={14} />
                ) : (
                  <X size={14} />
                )}
                {item.text}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleChangePassword}
          disabled={!canSubmit || loading}
          className="w-full h-12 rounded-2xl text-white font-dm-sans font-medium disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
          style={{
            background:
              canSubmit && !loading
                ? "radial-gradient(circle at center, #154751 37%, #04171F 100%)"
                : "#ACC5CF",
          }}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Changing Password...
            </>
          ) : (
            "Update Password"
          )}
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN SETTINGS PAGE - FULL VERSION
// ============================================================================
const SettingsPage = () => {
  const { data: session, status } = useSession();
  const {
    profile,
    loading,
    error,
    updating,
    updateError,
    uploadingImage,
    uploadError,
    fetchProfile,
    updateProfile,
    uploadProfilePicture,
  } = useProfileStore();

  const [activeTab, setActiveTab] = useState("account");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isRequestingOTP, setIsRequestingOTP] = useState(false);

  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: "success" | "error") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      setSessionError("You are not authenticated. Please log in.");
      return;
    }

    if (!session?.accessToken || !session?.user?.id) {
      setSessionError("Invalid session. Please log in again.");
      return;
    }

    setSessionError(null);
    fetchProfile(session.user.id, session.accessToken);
  }, [session, status, fetchProfile]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName);
      setEmail(profile.email);
    }
  }, [profile]);

  const startPasswordChange = async () => {
    if (!session?.accessToken || !email) {
      showToast("Please log in to change password", "error");
      return;
    }

    setIsRequestingOTP(true);
    setOtpError(null);

    try {
      await authService.requestPasswordResetOTP(email, session.accessToken);
      setShowOtpModal(true);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to request OTP";
      setOtpError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setIsRequestingOTP(false);
    }
  };

  const verifyOtp = () => {
    setShowOtpModal(false);
    setShowPasswordModal(true);
  };

  const handleSaveChanges = async () => {
    if (!session?.accessToken) {
      showToast("You must be logged in to update your profile", "error");
      return;
    }

    if (!fullName.trim() || !email.trim()) {
      showToast("Full name and email are required", "error");
      return;
    }

    const success = await updateProfile(
      { fullName: fullName.trim(), email: email.trim() },
      session.accessToken
    );

    if (success) {
      await fetchProfile(session.user.id, session.accessToken);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const getRoleName = () => {
    if (!profile?.userRoles || profile.userRoles.length === 0) return "Admin";
    return profile.userRoles[0].role.name.replace("_", " ");
  };

  const handleProfilePictureChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please select a valid image file", "error");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showToast("Image size must be less than 2MB", "error");
      return;
    }

    if (!session?.accessToken || !email) {
      showToast("Session error. Please log in again.", "error");
      return;
    }

    const imageUrl = await uploadProfilePicture(file, session.accessToken, email);
    if (imageUrl) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#154751]" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="text-red-500" size={24} />
            <h2 className="font-bold text-red-700">Authentication Required</h2>
          </div>
          <p className="text-red-600 text-sm">
            Please log in to access your settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* DESKTOP */}
        <div className="hidden md:block w-full max-w-[1200px] mx-auto px-6 py-8">
          <div className="bg-white rounded-[32px] p-10">
            <div className="mb-8">
              <h1 className="font-dm-sans font-bold text-2xl text-[#171417] mb-2">
                Settings
              </h1>
              <p className="font-dm-sans text-base text-[#6B6969]">
                Assign and manage what each admin can access, view, and control.
              </p>
            </div>

            {sessionError && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                <AlertCircle className="text-red-500" size={20} />
                <p className="text-red-700 text-sm">{sessionError}</p>
              </div>
            )}

            <div className="flex gap-16">
              <div className="w-[140px] flex-shrink-0 space-y-5">
                {["account", "notifications", "subscription", "ads", "charges"].map(
                  (tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`w-full text-left font-dm-sans text-base capitalize transition-colors ${
                        activeTab === tab
                          ? "font-medium bg-gradient-to-br from-[#154751] to-[#04171F] bg-clip-text text-transparent"
                          : "text-[#B5B1B1]"
                      }`}
                    >
                      {tab === "account"
                        ? "My account"
                        : tab === "ads"
                        ? "Sponsor ads"
                        : tab === "charges"
                        ? "Platform charges"
                        : tab}
                    </button>
                  )
                )}
              </div>

              <div className="flex-1 min-w-0 overflow-x-hidden">
                {activeTab === "account" && (
                  <div className="space-y-12">
                    {loading && (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-[#154751]" />
                      </div>
                    )}

                    {error && !loading && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                        <AlertCircle className="text-red-500" size={20} />
                        <p className="text-red-700 text-sm">{error}</p>
                      </div>
                    )}

                    {showSuccess && (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                        <Check className="text-green-500" size={20} />
                        <p className="text-green-700 text-sm">
                          Profile updated successfully!
                        </p>
                      </div>
                    )}

                    {!loading && profile && (
                      <>
                        <div className="text-center">
                          <div className="relative inline-block">
                            {uploadingImage && (
                              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center z-10">
                                <Loader2 className="w-8 h-8 animate-spin text-white" />
                              </div>
                            )}
                            {profile.profilePicture ? (
                              <img
                                src={profile.profilePicture}
                                alt="Profile"
                                className="w-24 h-24 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#154751] to-[#04171F] flex items-center justify-center">
                                <User size={48} className="text-white" />
                              </div>
                            )}
                            <button
                              onClick={handleCameraClick}
                              disabled={uploadingImage}
                              className="absolute bottom-0 right-0 w-9 h-9 bg-white rounded-full border-2 border-[#154751] flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                              <Camera size={18} className="text-[#154751]" />
                            </button>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleProfilePictureChange}
                              className="hidden"
                            />
                          </div>
                          <h2 className="mt-4 font-dm-sans font-bold text-2xl">
                            {profile.fullName}
                          </h2>
                          <p className="text-[#6B6969]">{getRoleName()}</p>
                        </div>

                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <label className="block font-dm-sans font-medium mb-2 text-left">
                                Full Name
                              </label>
                              <input
                                type="text"
                                value={fullName || ""}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full h-12 px-4 rounded-xl border border-[#B2B2B4] focus:border-[#154751] outline-none"
                                disabled={updating}
                              />
                            </div>
                            <div>
                              <label className="block font-dm-sans font-medium mb-2 text-left">
                                Email
                              </label>
                              <input
                                type="email"
                                value={email || ""}
                                disabled
                                className="w-full h-12 px-4 rounded-xl bg-[#E8E8E8] cursor-not-allowed"
                              />
                            </div>
                          </div>

                          {updateError && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                              <AlertCircle className="text-red-500" size={18} />
                              <p className="text-red-700 text-sm">{updateError}</p>
                            </div>
                          )}

                          {uploadError && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                              <AlertCircle className="text-red-500" size={18} />
                              <p className="text-red-700 text-sm">{uploadError}</p>
                            </div>
                          )}

                          <button
                            onClick={handleSaveChanges}
                            disabled={
                              updating ||
                              !fullName ||
                              !fullName.trim() ||
                              !email ||
                              !email.trim()
                            }
                            className="px-8 py-3 rounded-2xl text-white font-dm-sans font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            style={{
                              background:
                                "radial-gradient(circle at center, #154751 37%, #04171F 100%)",
                            }}
                          >
                            {updating ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              "Save Changes"
                            )}
                          </button>
                        </div>

                        <div className="pt-8 border-t border-[#E3E5E5]">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-dm-sans font-bold text-xl text-[#171417]">
                                Password
                              </h3>
                              <p className="font-dm-sans text-base text-[#6B6969]">
                                Keep your account secure
                              </p>
                            </div>
                            <button
                              onClick={startPasswordChange}
                              disabled={isRequestingOTP}
                              className="px-6 py-3 rounded-2xl text-white font-dm-sans font-medium disabled:opacity-50 flex items-center gap-2"
                              style={{
                                background:
                                  "radial-gradient(circle at center, #154751 37%, #04171F 100%)",
                              }}
                            >
                              {isRequestingOTP ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Requesting OTP...
                                </>
                              ) : (
                                "Change Password"
                              )}
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {activeTab === "notifications" && <NotificationTab />}
                {activeTab === "subscription" && <SubscriptionDashboard />}
                {activeTab === "ads" && <SponsorAdsDashboard />}
                {activeTab === "charges" && <PlatformChargesDashboard />}
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE */}
        <div className="md:hidden min-h-screen bg-gray-50">
          <div className="bg-white border-b border-gray-200 px-5 py-4">
            <h1 className="font-dm-sans font-bold text-xl text-[#171417]">
              Settings
            </h1>
          </div>

          {sessionError && (
            <div className="mx-5 mt-4 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
              <AlertCircle className="text-red-500" size={20} />
              <p className="text-red-700 text-sm">{sessionError}</p>
            </div>
          )}

          <div className="px-5 py-4 space-y-3 bg-white">
            {["account", "notifications", "subscription", "ads", "charges"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full px-5 py-4 rounded-xl text-left font-dm-sans font-medium text-base capitalize transition-all ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-[#154751] to-[#04171F] text-white shadow-lg"
                      : "bg-gray-100 text-[#171417]"
                  }`}
                >
                  {tab === "account"
                    ? "My Account"
                    : tab === "ads"
                    ? "Sponsor ads"
                    : tab === "charges"
                    ? "Platform charges"
                    : tab}
                </button>
              )
            )}
          </div>

          <div className="bg-gray-50 min-h-screen">
            {activeTab === "account" && (
              <div className="bg-white px-5 py-8 space-y-8">
                {loading && (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-[#154751]" />
                  </div>
                )}

                {error && !loading && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                    <AlertCircle className="text-red-500" size={20} />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                {showSuccess && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                    <Check className="text-green-500" size={20} />
                    <p className="text-green-700 text-sm">
                      Profile updated successfully!
                    </p>
                  </div>
                )}

                {!loading && profile && (
                  <>
                    <div className="text-center">
                      <div className="relative inline-block">
                        {uploadingImage && (
                          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center z-10">
                            <Loader2 className="w-8 h-8 animate-spin text-white" />
                          </div>
                        )}
                        {profile.profilePicture ? (
                          <img
                            src={profile.profilePicture}
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#154751] to-[#04171F] flex items-center justify-center">
                            <User size={48} className="text-white" />
                          </div>
                        )}
                        <button
                          onClick={handleCameraClick}
                          disabled={uploadingImage}
                          className="absolute bottom-0 right-0 w-9 h-9 bg-white rounded-full border-2 border-[#154751] flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                          <Camera size={18} className="text-[#154751]" />
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePictureChange}
                          className="hidden"
                        />
                      </div>
                      <h2 className="mt-4 font-dm-sans font-bold text-xl">
                        {profile.fullName}
                      </h2>
                      <p className="text-[#6B6969] text-sm">{getRoleName()}</p>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <label className="block font-dm-sans font-medium mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={fullName || ""}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full h-12 px-4 rounded-xl border border-[#B2B2B4] focus:border-[#154751] outline-none"
                          disabled={updating}
                        />
                      </div>
                      <div>
                        <label className="block font-dm-sans font-medium mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={email || ""}
                          disabled
                          className="w-full h-12 px-4 rounded-xl bg-[#E8E8E8] cursor-not-allowed"
                        />
                      </div>

                      {updateError && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                          <AlertCircle className="text-red-500" size={18} />
                          <p className="text-red-700 text-sm">{updateError}</p>
                        </div>
                      )}

                      {uploadError && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                          <AlertCircle className="text-red-500" size={18} />
                          <p className="text-red-700 text-sm">{uploadError}</p>
                        </div>
                      )}

                      <button
                        onClick={handleSaveChanges}
                        disabled={
                          updating ||
                          !fullName ||
                          !fullName.trim() ||
                          !email ||
                          !email.trim()
                        }
                        className="w-full h-12 rounded-[20px] text-white font-dm-sans font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        style={{
                          background:
                            "radial-gradient(circle at center, #154751 37%, #04171F 100%)",
                        }}
                      >
                        {updating ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </button>

                      <button
                        onClick={startPasswordChange}
                        disabled={isRequestingOTP}
                        className="w-full h-12 rounded-[20px] text-white font-dm-sans font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                        style={{
                          background:
                            "radial-gradient(circle at center, #154751 37%, #04171F 100%)",
                        }}
                      >
                        {isRequestingOTP ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Requesting OTP...
                          </>
                        ) : (
                          "Change Password"
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === "notifications" && <NotificationTab />}
            {activeTab === "subscription" && <SubscriptionDashboard />}
            {activeTab === "ads" && <SponsorAdsDashboard />}
            {activeTab === "charges" && <PlatformChargesDashboard />}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showOtpModal && (
        <OTPModal
          onClose={() => setShowOtpModal(false)}
          onOTPReceived={verifyOtp}
          email={email}
          isLoading={isRequestingOTP}
          error={otpError}
          token={session?.accessToken || ""}
          showToast={showToast}
        />
      )}

      {showPasswordModal && (
        <PasswordChangeModal
          onClose={() => {
            setShowPasswordModal(false);
          }}
          email={email}
          token={session?.accessToken || ""}
          showToast={showToast}
        />
      )}

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
};

export default SettingsPage;