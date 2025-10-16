"use client";
import { Check, Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";

const SetUpPage = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  return (
    <section className="flex items-center justify-center h-full md:px-6 px-1 py-8  ">
      <aside className="flex flex-col items-start md:max-w-[487px] w-full   mb-[40px] gap-[32px]">
        <div className="flex flex-col gap-[16px] mb-[15px]">
          <h2 className="text-[#171417] font-bold text-[1.625rem] leading-[120%] text-left  md:bg-red-400">
            Set Up Your Admin Account
          </h2>
          <p className="text-[#454345] text-[1rem] leading-[140%] mt-[12px] text-left ">
            Create a secure password to protect your account.
          </p>
        </div>
        <form className="flex flex-col gap-[24px] w-full">
          <div className="flex flex-col gap-[8px]">
            <label
              className="text-[#05060B] font-medium text-[1rem] leading-[140%]"
              htmlFor="password"
            >
              Create Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                className="border border-[#B2B2B4] outline-none rounded-[12px] py-[12px] pl-[16px] pr-[40px] w-full"
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
            <div className="flex flex-wrap gap-[12px]">
              <p className="text-[16px] font-medium py-[4px] px-[8px] rounded-[16px] bg-[#1DD2AE] text-[#171417] flex items-center gap-[8px] leading-[140%]">
                <span>8 characters</span>
                <Check />
              </p>
              <p className="text-[16px] font-medium py-[4px] px-[8px] rounded-[16px] bg-[#1DD2AE] text-[#171417] flex items-center gap-[8px] leading-[140%]">
                <span>Uppercase</span>
                <Check />
              </p>
              <p className="text-[16px] font-medium py-[4px] px-[8px] rounded-[16px] bg-[#1DD2AE] text-[#171417] flex items-center gap-[8px] leading-[140%]">
                <span>Lowercase</span>
                <Check />
              </p>
              <p className="text-[16px] font-medium py-[4px] px-[8px] rounded-[16px] bg-[#1DD2AE] text-[#171417] flex items-center gap-[8px] leading-[140%]">
                <span>Numbers</span>
                <Check />
              </p>
              <p className="text-[16px] font-medium py-[4px] px-[8px] rounded-[16px] bg-[#1DD2AE] text-[#171417] flex items-center gap-[8px] leading-[140%]">
                <span>Special character</span>
                <Check />
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-[8px]">
            <label
              className="text-[#05060B] font-medium text-[1rem] leading-[140%]"
              htmlFor="password"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder="Re-enter your password"
                className="border border-[#B2B2B4] outline-none rounded-[12px] py-[12px] pl-[16px] pr-[40px] w-full"
              />
              <button
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                title={showConfirmPassword ? "Hide password" : "Show password"}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </form>
        <button
          type="button"
          className="[background:var(--primary-radial)] text-white font-medium leading-[140%] rounded-[20px] w-full py-[16px] cursor-pointer"
        >
          Finish Setup
        </button>
      </aside>
    </section>
  );
};

export default SetUpPage;
