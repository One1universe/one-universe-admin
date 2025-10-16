import { Info } from "lucide-react";

const ForgotPasswordPage = () => {
  return (
    <section className="flex items-center justify-center h-full md:px-6 px-1 py-8  ">
      <aside className="flex flex-col items-start md:max-w-[487px] w-full   mb-[40px] gap-[32px]">
        <div className="flex flex-col gap-[16px] mb-[15px]">
          <h3 className="text-[#171417] font-bold text-[1.625rem] leading-[120%] text-left md:text-center">
            Forgot Your Password? No Worries
          </h3>
          <p className="text-[#454345] text-[1rem] leading-[140%] mt-[12px] text-left md:text-center">
            Enter the email address linked to your admin account, and we&apos;ll
            send you a link to reset your password.
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
            <div className="flex gap-[8px] items-center text-[#D84040] text-[.875rem] leading-[140%] mt-[4px]">
              <Info size={15} />
              <p className="text-[14px] leading-[140%]">Please enter a valid email address.</p>
            </div>
          </div>
        </form>
        <button
          type="button"
          className="[background:var(--primary-radial)] text-white font-medium leading-[140%] rounded-[20px] w-full py-[16px] cursor-pointer"
        >
          Send Reset Link
        </button>
      </aside>
    </section>
  );
};

export default ForgotPasswordPage;
