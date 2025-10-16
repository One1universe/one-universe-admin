"use client";
import Image from "next/image";
import React, { useState } from "react";

const CompletedSetupPage = () => {
  const [isSetupComplete, setIsSetupComplete] = useState<boolean>(false);
  return (
    <section className="flex items-center justify-center h-full md:px-6 px-1 py-8 overflow-x-hidden">
      <aside className="flex flex-col items-start md:max-w-[487px] w-full mb-[40px] gap-[32px]">
        <Image
          src="/logo/auth-logo.svg"
          alt="Auth Logo"
          width={68}
          height={54}
          className="block md:hidden"
        />
        {isSetupComplete && (
          <div className="flex flex-col justify-center items-center gap-[32px] w-full">
            <Image
              src="/gif/confetti.gif"
              alt="Confetti"
              width={150}
              height={150}
              className=""
            />
            <div className="flex flex-col gap-[15px] mb-[15px]">
              <h3 className="text-[#171417] font-bold text-[1.625rem] leading-[120%] text-left md:text-center">
                Welcome to the Admin Portal!
              </h3>
              <p className="text-[#454345] text-[1rem] leading-[140%] text-left md:text-center">
                Your account is now active. You can start managing the system
                right away.
              </p>
            </div>
            <button
              type="button"
              className="[background:var(--primary-radial)] text-white font-medium leading-[140%] rounded-[20px] w-full py-[16px] cursor-pointer"
            >
              Go to Dashboard
            </button>
          </div>
        )}
        {!isSetupComplete && (
          <div className="flex flex-col justify-center items-center gap-[32px] w-full">
            <div className="flex flex-col gap-[15px] mb-[15px]">
              <h3 className="text-[#171417] font-bold text-[1.625rem] leading-[120%] text-left md:text-center">
                Continue Your Setup
              </h3>
              <p className="text-[#454345] text-[1rem] leading-[140%] text-left md:text-center">
                You started setting up your account but didn’t finish. Pick up
                right where you left off.
              </p>
            </div>
            <button
              type="button"
              className="[background:var(--primary-radial)] text-white font-medium leading-[140%] rounded-[20px] w-full py-[16px] cursor-pointer"
            >
              Resume Setup
            </button>
          </div>
        )}
      </aside>
    </section>
  );
};

export default CompletedSetupPage;
