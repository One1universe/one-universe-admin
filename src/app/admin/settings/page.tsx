"use client";

import React, { useState } from "react";
import { User, Camera, Eye, EyeOff, AlertCircle, Check } from "lucide-react";

// ToggleSwitch Component
interface ToggleSwitchProps {
  enabled: boolean;
  onToggle: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="relative w-[42px] h-[24px] rounded-full transition-colors"
      style={{
        background: enabled
          ? "linear-gradient(to right, #154751, #04171F)"
          : "#E3E5E5",
      }}
    >
      <div
        className="absolute top-[2px] w-[20px] h-[20px] rounded-full bg-white shadow-sm transition-transform duration-300"
        style={{ transform: enabled ? "translateX(20px)" : "translateX(2px)" }}
      />
    </button>
  );
};

// NotificationRow Component
interface NotificationRowProps {
  label: string;
}

const NotificationRow: React.FC<NotificationRowProps> = ({ label }) => {
  const [email, setEmail] = useState(false);
  const [inApp, setInApp] = useState(false);

  return (
    <div className="flex items-center justify-between py-4 md:py-0 md:h-[58px]">
      <span className="font-dm-sans text-sm md:text-base leading-[140%] text-[#6B6969] flex-1 md:w-[200px]">
        {label}
      </span>

      <div className="flex gap-8 md:gap-[150px]">
        <div className="w-[56px] flex justify-center">
          <ToggleSwitch enabled={email} onToggle={() => setEmail(!email)} />
        </div>

        <div className="w-[56px] flex justify-center">
          <ToggleSwitch enabled={inApp} onToggle={() => setInApp(!inApp)} />
        </div>
      </div>
    </div>
  );
};

// OTP Modal Component - Transparent + Click Outside to Close
interface OTPModalProps {
  onClose: () => void;
  onVerify: () => void;
}

const OTPModal: React.FC<OTPModalProps> = ({ onClose, onVerify }) => {
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [error, setError] = useState(false);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setError(false);

      if (value && index < 4) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleVerify = () => {
    const otpValue = otp.join("");
    if (otpValue.length === 5) {
      if (otpValue === "12345") {
        onVerify();
      } else {
        setError(true);
      }
    }
  };

  const isComplete = otp.every(digit => digit !== "");

  return (
    <div
      className="fixed inset-0 flex items-end md:items-center justify-center z-50"
      onClick={onClose} // Click outside → close
    >
      <div
        className="bg-white rounded-t-2xl md:rounded-2xl w-full max-w-full md:max-w-[486px] p-5 md:p-8 space-y-6 md:space-y-8 shadow-[0px_-8px_12px_0px_rgba(0,0,0,0.12)] md:shadow-none"
        onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside
      >
        <div className="space-y-4">
          <h2 className="font-dm-sans font-bold text-xl text-center text-[#171417]">
            Verify Your Identity
          </h2>
          <p className="font-dm-sans text-base text-center text-[#454345]">
            We've sent a 5-digit OTP to your registered email. Please enter it below to continue. The code is valid for 10 minutes.
          </p>
        </div>

        <div className="flex justify-center gap-2 md:gap-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              className={`w-12 h-16 md:w-14 md:h-16 text-center text-xl font-dm-sans rounded border ${
                error ? "border-[#D84040]" : "border-[#BDC0CE]"
              } focus:outline-none focus:border-[#154751]`}
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={!isComplete}
          className="w-full h-12 rounded-[20px] font-dm-sans font-medium text-base text-white"
          style={{
            background: isComplete
              ? "radial-gradient(circle at center, #154751 37%, #04171F 100%)"
              : "#ACC5CF",
            cursor: isComplete ? "pointer" : "not-allowed",
          }}
        >
          Verify OTP
        </button>

        <button
          className="w-full text-center font-dm-sans font-medium text-base"
          style={{
            background: "radial-gradient(circle at center, #154751 37%, #04171F 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Resend OTP
        </button>
      </div>
    </div>
  );
};

// Password Change Modal - Transparent + Click Outside to Close
interface PasswordChangeModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({ onClose, onSuccess }) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

  const isValid = hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecial;
  const canSubmit = currentPassword && newPassword && confirmPassword && isValid && !passwordMismatch;

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    setPasswordMismatch(value !== "" && value !== newPassword);
    // or: setPasswordMismatch(!!value && value !== newPassword);
  };

  const ValidationBadge = ({ isValid, text }: { isValid: boolean; text: string }) => (
    <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-2xl ${isValid ? "bg-[#154751]" : "bg-[#E8E8E8]"}`}>
      <Check size={14} className={isValid ? "text-white" : "text-[#E8E8E8]"} />
      <span className={`font-dm-sans font-medium text-base ${isValid ? "text-white" : "text-[#B2B2B4]"}`}>
        {text}
      </span>
    </div>
  );

  return (
    <div
      className="fixed inset-0 flex items-end md:items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-2xl md:rounded-2xl w-full max-w-full md:max-w-[671px] overflow-hidden shadow-[0px_-8px_12px_0px_rgba(0,0,0,0.12)] md:shadow-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#E8FBF7] px-5 md:px-8 pt-6 md:pt-8 pb-4 border-b border-[#E8E3E3]">
          <h2 className="font-dm-sans font-bold text-xl text-[#171417]">
            Change Password
          </h2>
        </div>

        <div className="px-5 md:px-8 py-6 space-y-6">
          <div className="space-y-2">
            <label className="font-dm-sans font-medium text-base text-[#05060D]">Current Password</label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full h-[43px] px-4 pr-12 rounded-xl border border-[#B2B2B4] font-dm-sans text-base focus:outline-none focus:border-[#154751]"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showCurrentPassword ? <EyeOff size={20} className="text-[#B2B2B4]" /> : <Eye size={20} className="text-[#B2B2B4]" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-dm-sans font-medium text-base text-[#05060D]">New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                className="w-full h-[43px] px-4 pr-12 rounded-xl border border-[#B2B2B4] font-dm-sans text-base focus:outline-none focus:border-[#154751]"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showNewPassword ? <EyeOff size={20} className="text-[#B2B2B4]" /> : <Eye size={20} className="text-[#B2B2B4]" />}
              </button>
            </div>

            {newPassword && (
              <div className="flex flex-wrap gap-3 mt-3">
                <ValidationBadge isValid={hasMinLength} text="8 characters" />
                <ValidationBadge isValid={hasUppercase} text="Uppercase" />
                <ValidationBadge isValid={hasLowercase} text="Lowercase" />
                <ValidationBadge isValid={hasNumber} text="Number" />
                <ValidationBadge isValid={hasSpecial} text="Special character" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="font-dm-sans font-medium text-base text-[#05060D]">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                placeholder="Re-enter your new password"
                className={`w-full h-[43px] px-4 pr-12 rounded-xl border ${
                  passwordMismatch ? "border-[#D84040]" : "border-[#B2B2B4]"
                } font-dm-sans text-base focus:outline-none focus:border-[#154751]`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showConfirmPassword ? <EyeOff size={20} className="text-[#B2B2B4]" /> : <Eye size={20} className="text-[#B2B2B4]" />}
              </button>
            </div>

            {passwordMismatch && (
              <div className="flex items-center gap-2">
                <AlertCircle size={16} className="text-[#D84040]" />
                <span className="font-dm-sans text-sm text-[#D84040]">
                  Passwords do not match.
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="px-5 md:px-8 pb-6 md:pb-8">
          <button
            onClick={onSuccess}
            disabled={!canSubmit}
            className="w-full h-12 rounded-[20px] font-dm-sans font-medium text-base text-white"
            style={{
              background: canSubmit
                ? "radial-gradient(circle at center, #154751 37%, #04171F 100%)"
                : "#ACC5CF",
              cursor: canSubmit ? "pointer" : "not-allowed",
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

// NotificationTab Component
const NotificationTab = () => {
  const alertTypes = [
    "Dispute Escalations",
    "Payment Disbursement",
    "Panic Alert",
    "New User Registrations",
    "Pending Verification",
    "Credit Requests",
    "Platform Downtime",
  ];

  return (
    <div className="w-full md:max-w-[878px] space-y-6">
      <div className="w-full md:max-w-[765px]">
        <h2 className="font-dm-sans font-medium text-lg md:text-[20px] leading-[140%] text-[#171417] mb-2">
          Notification Preferences
        </h2>
        <p className="font-dm-sans text-sm md:text-[16px] leading-[140%] text-[#6B6969]">
          Stay informed without the noise. Choose which alerts matter to you and how you'd like to receive them.
        </p>
      </div>

      <div className="w-full md:max-w-[724px] space-y-5">
        <div className="flex items-center justify-between h-[28px] border-b border-[#E3E5E5]">
          <span className="font-dm-sans font-bold text-sm md:text-[16px] leading-[140%] text-[#171417]">
            Alert Type
          </span>
          <div className="flex items-center gap-8 md:gap-[96px]">
            <span className="font-dm-sans font-bold text-sm md:text-[16px] leading-[140%] text-[#171417] w-[56px] text-center">
              Email
            </span>
            <span className="font-dm-sans font-bold text-sm md:text-[16px] leading-[140%] text-[#171417] w-[56px] text-center">
              In-app
            </span>
          </div>
        </div>

        <div className="space-y-2 md:space-y-6">
          {alertTypes.map((type) => (
            <NotificationRow key={type} label={type} />
          ))}
        </div>
      </div>
    </div>
  );
};

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("account");
  const [fullName, setFullName] = useState("Oloruntomi Dosunmu");
  const [email] = useState("tomi@gmail.com");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleChangePasswordClick = () => {
    setShowOtpModal(true);
  };

  const handleOtpVerify = () => {
    setShowOtpModal(false);
    setShowPasswordModal(true);
  };

  const handlePasswordChangeSuccess = () => {
    setShowPasswordModal(false);
    alert("Password changed successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* DESKTOP LAYOUT */}
      <div className="hidden md:block w-full max-w-[1200px] mx-auto px-10 py-6">
        <div className="bg-white rounded-[32px] p-10">
          <div className="mb-8">
            <h1 className="font-dm-sans font-bold text-2xl leading-[120%] text-[#171417] mb-2">
              Settings
            </h1>
            <p className="font-dm-sans text-base leading-[140%] text-[#6B6969]">
              Assign and manage what each admin can access, view, and control.
            </p>
          </div>

          <div className="flex gap-16">
            <div className="w-[128px] space-y-4 pt-2">
              {["account", "notifications", "subscription", "ads", "charges"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full text-left font-dm-sans text-base leading-[140%] capitalize ${
                    activeTab === tab
                      ? "font-medium bg-gradient-to-br from-[#154751] to-[#04171F] bg-clip-text text-transparent"
                      : "font-normal text-[#B5B1B1]"
                  }`}
                >
                  {tab === "account" ? "My account" : tab.replace("-", " ")}
                </button>
              ))}
            </div>

            <div className="flex-1 max-w-[878px]">
              {activeTab === "account" && (
                <div className="space-y-20">
                  <div className="space-y-16">
                    <div className="flex flex-col items-center">
                      <div className="relative w-[100px] h-[100px] mb-4">
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-[#154751] to-[#04171F] flex items-center justify-center">
                          <User size={48} className="text-white" />
                        </div>
                        <button className="absolute bottom-0 right-0 w-[32px] h-[32px] bg-white rounded-full flex items-center justify-center border-2 border-[#154751] shadow-sm">
                          <Camera size={18} className="text-[#154751]" />
                        </button>
                      </div>
                      <h2 className="font-dm-sans font-bold text-xl leading-[140%] text-[#171417] mb-1">
                        Tomi Dosunmu
                      </h2>
                      <p className="font-dm-sans text-xs leading-[140%] text-center text-[#6B6969]">
                        Content Admin
                      </p>
                    </div>

                    <div className="flex items-start justify-between gap-8">
                      <div className="flex-1 max-w-[390px]">
                        <label className="font-dm-sans font-medium text-base leading-[140%] text-[#05060D] block mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full h-[46px] px-4 rounded-xl border border-[#B2B2B4] font-dm-sans text-base text-[#171417] focus:outline-none focus:border-[#154751] bg-white mb-6"
                        />
                        <button disabled className="px-6 py-3 h-[48px] rounded-[20px] font-dm-sans font-medium text-base leading-[140%] text-[#FFFEFE] bg-[#ACC5CF] cursor-not-allowed">
                          Save Changes
                        </button>
                      </div>

                      <div className="flex-1 max-w-[390px]">
                        <label className="font-dm-sans font-medium text-base leading-[140%] text-[#05060D] block mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={email}
                          disabled
                          className="w-full h-[46px] px-4 rounded-xl font-dm-sans text-base text-[#171417] bg-[#E8E8E8] cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-8 border-t border-gray-200">
                    <div className="max-w-[354px]">
                      <h3 className="font-dm-sans font-bold text-xl leading-[140%] text-[#171417] mb-2">
                        Password
                      </h3>
                      <p className="font-dm-sans text-base leading-[140%] text-[#454345]">
                        Change your password to login to your account.
                      </p>
                    </div>
                    <button
                      onClick={handleChangePasswordClick}
                      className="px-6 py-4 h-[48px] rounded-[20px] font-dm-sans font-medium text-base leading-[140%] text-white flex items-center justify-center"
                      style={{ background: "radial-gradient(circle at center, #154751 37%, #04171F 100%)" }}
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && <NotificationTab />}

              {activeTab !== "account" && activeTab !== "notifications" && (
                <div className="flex items-center justify-center h-96 text-gray-400">
                  <p className="font-dm-sans text-lg">Coming Soon</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE LAYOUT */}
      <div className="md:hidden bg-white min-h-screen">
        <div className="px-5 py-4 bg-white">
          <h1 className="font-dm-sans font-bold text-xl text-[#171417]">Settings</h1>
        </div>

        {activeTab === "account" && (
          <div className="px-5 py-4 bg-white">
            <div className="flex flex-col items-center text-center">
              <div className="relative w-[100px] h-[100px] mb-2">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-[#154751] to-[#04171F] flex items-center justify-center">
                  <User size={48} className="text-white" />
                </div>
                <button className="absolute bottom-0 right-0 w-[28px] h-[28px] bg-white rounded-full flex items-center justify-center border-2 border-[#154751] shadow-sm">
                  <Camera size={14} className="text-[#154751]" />
                </button>
              </div>
              <h2 className="font-dm-sans font-bold text-base leading-[140%] text-[#171417]">
                Tomi Dosunmu
              </h2>
              <p className="font-dm-sans text-xs leading-[140%] text-[#6B6969]">
                Content Admin
              </p>
            </div>
          </div>
        )}

        <div className="px-5 py-4 bg-white space-y-2">
          {["account", "notifications", "subscription", "ads", "charges"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full px-5 py-4 rounded-xl text-left font-dm-sans font-medium text-base capitalize ${
                activeTab === tab
                  ? "bg-gradient-to-br from-[#154751] to-[#04171F] text-white"
                  : "bg-gray-50 text-[#171417]"
              }`}
            >
              {tab === "account" ? "My Account" : tab.replace("-", " ")}
            </button>
          ))}
        </div>

        {activeTab === "account" && (
          <div className="px-5 py-6 bg-white space-y-6">
            <div>
              <label className="font-dm-sans font-medium text-base leading-[140%] text-[#05060D] block mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-[46px] px-4 rounded-xl border border-[#B2B2B4] font-dm-sans text-base text-[#171417] focus:outline-none focus:border-[#154751] bg-white"
              />
            </div>

            <div>
              <label className="font-dm-sans font-medium text-base leading-[140%] text-[#05060D] block mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full h-[46px] px-4 rounded-xl font-dm-sans text-base text-[#171417] bg-[#E8E8E8] cursor-not-allowed"
              />
            </div>

            <button
              className="w-full py-3 h-[46px] rounded-[20px] font-dm-sans font-medium text-base leading-[140%] text-white flex items-center justify-center"
              style={{ background: "radial-gradient(circle at center, #154751 37%, #04171F 100%)" }}
            >
              Save Changes
            </button>

            <div className="pt-6 mt-6 border-t border-gray-200">
              <h3 className="font-dm-sans font-bold text-lg leading-[140%] text-[#171417] mb-2">
                Password
              </h3>
              <p className="font-dm-sans text-sm leading-[140%] text-[#454345] mb-4">
                Change your password to login to your account.
              </p>
              <button
                onClick={handleChangePasswordClick}
                className="w-full py-3 h-[46px] rounded-[20px] font-dm-sans font-medium text-base leading-[140%] text-white flex items-center justify-center"
                style={{ background: "radial-gradient(circle at center, #154751 37%, #04171F 100%)" }}
              >
                Change Password
              </button>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="px-5 py-6 bg-white">
            <NotificationTab />
          </div>
        )}

        {activeTab !== "account" && activeTab !== "notifications" && (
          <div className="px-5 py-12 text-center text-gray-400">
            <p className="font-dm-sans text-base">Coming Soon</p>
          </div>
        )}
      </div>

      {/* MODALS - Transparent backdrop + Click outside to close */}
      {showOtpModal && (
        <OTPModal onClose={() => setShowOtpModal(false)} onVerify={handleOtpVerify} />
      )}

      {showPasswordModal && (
        <PasswordChangeModal
          onClose={() => setShowPasswordModal(false)}
          onSuccess={handlePasswordChangeSuccess}
        />
      )}
    </div>
  );
};

export default SettingsPage;