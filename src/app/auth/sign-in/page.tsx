"use client";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  return (
    <section className="flex items-center justify-center h-full md:px-6 px-1 py-8  ">
      <aside className="flex flex-col items-start md:max-w-[487px] w-full   mb-[40px] gap-[32px]">
        <Image
          src="/logo/auth-logo.svg"
          alt="Auth Logo"
          width={68}
          height={54}
          className=""
        />
        <div className="flex flex-col gap-[16px]">
          <h3 className="text-[#171417] font-bold text-[1.625rem] leading-[120%]">
            Welcome Back
          </h3>
          <p className="text-[#454345] text-[1rem] leading-[140%] mt-[12px]">
            Enter your account credential to login as an admin
          </p>
        </div>
        <form className="flex flex-col gap-[16px] w-full">
          <div className="flex flex-col gap-[8px]">
            <label
              className="text-[#05060B] font-medium text-[1rem] leading-[140%]"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="border border-[#B2B2B4] outline-none rounded-[12px] py-[12px] px-[16px] w-full"
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
                type="password"
                id="password"
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
          type="button"
          className="[background:var(--primary-radial)] text-white font-medium leading-[140%] rounded-[20px] w-full py-[16px] cursor-pointer"
        >
          Log In
        </button>
      </aside>
    </section>
  );
};

export default SignInPage;
