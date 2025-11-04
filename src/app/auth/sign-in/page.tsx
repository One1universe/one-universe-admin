"use client";
import authService from "@/services/authService";
import useToastStore from "@/store/useToastStore";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const SignInPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockUntil, setLockUntil] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  useEffect(() => {
    const savedLock = localStorage.getItem("admin-login-lock");
    if (savedLock) {
      const lockTime = parseInt(savedLock, 10);
      if (lockTime > Date.now()) {
        setLockUntil(lockTime);
        setLoginAttempts(5);
      }
    }
  }, []);

  useEffect(() => {
    if (!lockUntil) return;

    const interval = setInterval(() => {
      const diff = Math.floor((lockUntil - Date.now()) / 1000);

      if (diff <= 0) {
        setLockUntil(null);
        setLoginAttempts(0);
        localStorage.removeItem("admin-login-lock");
        setTimeLeft(0);
      } else {
        setTimeLeft(diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockUntil]);

  const { showToast } = useToastStore();

  // Keep track of the reset timer
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Function to reset login attempts
  const resetLoginAttempts = () => {
    setLoginAttempts(0);
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
  };

  // Automatically reset after 2 minutes of the last attempt
  const startResetTimer = () => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(() => {
      resetLoginAttempts();
      showToast(
        "warning",
        "Login Attempts Reset",
        "You can try logging in again now.",
        4000
      );
    }, 2 * 60 * 1000); // 2 minutes
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) return;

    if (loginAttempts >= 5) {
      showToast(
        "error",
        "Too many login attempts",
        "Please try again later",
        7000
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.signin({ email, password });

      if (response.success) {
        showToast("success", "Login Successful", "Account logged in", 3000);
        resetLoginAttempts(); // Reset on success
        router.push("/admin");
      } else if (response.error) {
        showToast(
          "error",
          "Invalid email or password",
          "Please try again",
          5000
        );
        setLoginAttempts((prev) => {
          const newAttempts = prev + 1;
          if (newAttempts >= 5) {
            const lockTime = Date.now() + 5 * 60 * 1000; // 5 minutes
            setLockUntil(lockTime);
            localStorage.setItem("admin-login-lock", lockTime.toString());
          }
          return newAttempts;
        });
      }

      console.log("Login response:", response);
    } catch (error) {
      setLoginAttempts((prev) => prev + 1);
      startResetTimer();
      console.error("Login error:", error);
      showToast(
        "error",
        "Login Failed",
        "An unexpected error occurred. Please try again.",
        5000
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Validation for button disable
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isFormValid =
    email.trim() !== "" && isValidEmail && password.length >= 6;

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  return (
    <section className="flex items-center justify-center h-full md:px-6 px-1 py-8">
      <aside className="flex flex-col items-start md:max-w-[487px] w-full mb-[40px] gap-[32px]">
        <Image
          src="/logo/auth-logo.svg"
          alt="Auth Logo"
          width={68}
          height={54}
        />
        <div className="flex flex-col gap-[16px]">
          <h3 className="text-[#171417] font-bold text-[1.625rem] leading-[120%]">
            Welcome Back
          </h3>
          <p className="text-[#454345] text-[1rem] leading-[140%] mt-[12px]">
            Enter your account credential to login as an admin
          </p>
        </div>

        <form
          className="flex flex-col gap-[16px] w-full"
          onSubmit={handleAdminLogin}
        >
          <div className="flex flex-col gap-[8px]">
            <label
              className="text-[#05060B] font-medium text-[1rem] leading-[140%]"
              htmlFor="email"
            >
              Email
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              id="email"
              className="border border-[#B2B2B4] outline-none rounded-[12px] py-[12px] px-[16px] w-full"
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <label
              className="text-[#05060B] font-medium text-[1rem] leading-[140%]"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type={showPassword ? "text" : "password"}
                id="password"
                className="border border-[#B2B2B4] outline-none rounded-[12px] py-[12px] pl-[16px] pr-[40px] w-full"
                disabled={isLoading}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-right">
              <Link
                className="[color:var(--primary-radial)] text-[.875rem] font-medium leading-[140%]"
                href="/auth/forgot-password"
              >
                Forgot Password?
              </Link>
            </p>
          </div>
        </form>

        <button
          onClick={handleAdminLogin}
          disabled={isLoading || !isFormValid || loginAttempts >= 5}
          type="submit"
          className="[background:var(--primary-radial)] text-white font-medium leading-[140%] rounded-[20px] w-full py-[16px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading
            ? "Logging in..."
            : loginAttempts >= 5
            ? "Try again in 5 minutes"
            : "Log In"}
        </button>
      </aside>
      {loginAttempts >= 5 && lockUntil && (
        <section className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50">
          <aside className="flex items-center justify-center flex-col gap-6 shadow-lg md:w-[223px] w-[65%] bg-white md:rounded-2xl p-6">
            <p className="text-center text-[#646264] font-normal text-[1rem]">
              Too many failed attempts. Please try again in 5 minutes.
            </p>
            <h5 className="flex items-center gap-1 text-[#091E22] font-bold text-[1.625rem]">
              {String(Math.floor(timeLeft / 60)).padStart(2, "0")}
              <span>:</span>
              {String(timeLeft % 60).padStart(2, "0")}
            </h5>
          </aside>
        </section>
      )}
    </section>
  );
};

export default SignInPage;
