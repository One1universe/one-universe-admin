// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
"use client";
import authService from "@/services/authService";
import useToastStore from "@/store/useToastStore";
import { Info } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
type ForgotPasswordResponse = { error: string };

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const { showToast } = useToastStore();

  const handleForgotPassword = async () => {
    setIsLoading(true);
    try {
      const response = (await authService.forgotPassword({
        email,
      })) as ForgotPasswordResponse;
      if (response.error) {
        setIsError(true);
      } else {
        showToast(
          "success",
          "Email Sent",
          "Password reset link has been sent",
          5000
        );
        setIsError(false);
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isFormValid = email.trim() !== "" && isValidEmail;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    // stop shaking as soon as user types
    if (isError) {
      // only remove error when valid email is entered
      if (isValidEmail) setIsError(false);
    }
  };

  // Stronger shake animation
  const shakeAnimation = {
    x: [0, -15, 15, -15, 15, -8, 8, -5, 5, 0],
    transition: { duration: 0.6, ease: [0.42, 0, 0.58, 1] },
  };

  return (
    <section className="flex items-center justify-center h-full md:px-6 px-1 py-8">
      <aside className="flex flex-col items-start md:max-w-[487px] w-full mb-[40px] gap-[32px]">
        <div className="flex flex-col gap-[16px] mb-[15px]">
          <h3 className="text-[#171417] font-bold text-[1.625rem] leading-[120%] text-left md:text-center">
            Forgot Your Password? No Worries
          </h3>
          <p className="text-[#454345] text-[1rem] leading-[140%] mt-[12px] text-left md:text-center">
            Enter the email address linked to your admin account, and we&apos;ll
            send you a link to reset your password.
          </p>
        </div>

        <form
          className="flex flex-col gap-[16px] w-full"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="flex flex-col gap-[8px] w-full">
            <label
              className="text-[#05060B] font-medium text-[1rem] leading-[140%]"
              htmlFor="email"
            >
              Email
            </label>

            {/* Input Field with Motion and Shake */}
            <motion.input
              key={isError ? "shake" : "normal"} // re-trigger shake on new error
              animate={isError ? shakeAnimation : undefined}
              onChange={handleChange}
              value={email}
              type="email"
              id="email"
              className={`border outline-none rounded-[12px] py-[12px] px-[16px] w-full transition-all duration-200 ${
                isError
                  ? "border-[#D84040] focus:border-[#D84040]"
                  : "border-[#B2B2B4] focus:border-[#05060B]"
              }`}
            />

            {/* Error Message */}
            <AnimatePresence>
              {isError && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.25 }}
                  className="flex gap-[8px] items-center text-[#D84040] text-[.875rem] leading-[140%] mt-[4px]"
                >
                  <Info size={15} />
                  <p className="text-[14px] leading-[140%]">
                    Please enter a valid email address.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>

        <button
          disabled={isLoading || !isFormValid || isError}
          onClick={handleForgotPassword}
          type="button"
          className="[background:var(--primary-radial)] text-white font-medium leading-[140%] rounded-[20px] w-full py-[16px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Sending Reset Link..." : "Send Reset Link"}
        </button>
      </aside>
    </section>
  );
};

export default ForgotPasswordPage;
