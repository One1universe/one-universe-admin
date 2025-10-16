"use client";
import React, { useState } from "react";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRouter } from "next/navigation";
import Image from "next/image";

const InviteAdminPage = () => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", ""]);
  const [isLinkValid, setIsLinkValid] = useState<boolean>(false);
  const router = useRouter();

  const handleChange = (index: number, value: string) => {
    if (!new RegExp(REGEXP_ONLY_DIGITS_AND_CHARS).test(value) && value !== "")
      return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const passcode = otp.join("");
    console.log("Submitted OTP:", passcode);
    router.push("/auth/sign-in");
    // TODO: Call your verification API here
  };

  return (
    <section className="flex items-center justify-center h-full md:px-6 px-1 py-8 overflow-x-hidden">
      <aside className="flex flex-col items-start md:max-w-[487px] w-full mb-[40px] gap-[32px]">
        {isLinkValid && (
          <>
            <div className="flex flex-col gap-[16px] mb-[15px]">
              <h3 className="text-[#171417] font-bold text-[1.625rem] leading-[120%] text-left md:text-center">
                You&apos;re Almost In!
              </h3>
              <p className="text-[#454345] text-[1rem] leading-[140%] mt-[12px] text-left md:text-center">
                Welcome! You’ve been invited to join the Admin Portal. To
                continue, please verify your invitation using the passcode sent
                to your email.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center w-full gap-6"
            >
              <InputOTP maxLength={5}>
                <InputOTPGroup className="flex gap-3 justify-center">
                  {otp.map((_, i) => (
                    <InputOTPSlot
                      key={i}
                      index={i}
                      onChange={(e) =>
                        handleChange(i, (e.target as HTMLInputElement).value)
                      }
                      className="w-[48px] h-[64px] border border-gray-300 rounded-lg text-center text-lg font-semibold focus:border-blue-500 focus:outline-none"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>

              <button
                type="submit"
                className="[background:var(--primary-radial)] text-white font-medium leading-[140%] rounded-[20px] w-full py-[16px] cursor-pointer"
              >
                Verify Invitation
              </button>
            </form>
          </>
        )}
        {!isLinkValid && (
          <>
            <Image
              src="/logo/auth-logo.svg"
              alt="Auth Logo"
              width={68}
              height={54}
              className="block md:hidden"
            />
            <div className="flex flex-col justify-center items-center gap-[32px] w-full">
              <Image
                src="/images/error.png"
                alt="Error"
                width={120}
                height={120}
                className=""
              />
              <div className="flex flex-col gap-[15px] mb-[15px]">
                <h3 className="text-[#171417] font-bold text-[1.625rem] leading-[120%] text-center md:text-left">
                  Invitation Link Expired
                </h3>
                <div className="">
                  <p className="text-[#454345] text-[1rem] leading-[140%] text-center md:text-left">
                    This invitation link is no longer valid.
                  </p>
                  <p className="text-[#454345] text-[1rem] leading-[140%] text-center md:text-left">
                    Please contact the Super Admin to request a new invitation.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </aside>
    </section>
  );
};

export default InviteAdminPage;
