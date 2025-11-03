import { HiOutlineLogout } from "react-icons/hi";
import React from "react";
import { ListFilter, Search } from "lucide-react";
import EmptyPaymentManagement from "./EmptyPaymentManagement";
import NoPaymentManagement from "./NoPaymentManagement";

const PaymentManagementPage = () => {
  return (
    <section className="">
      <section className=" flex flex-col justify-between md:flex-row gap-[16px]">
        <section className="flex flex-col  gap-2">
          <h3 className="text-[#171417] font-bold text-[1.5rem] sm:text-[1.25rem] leading-[120%]">
            Payment Management
          </h3>
          <p className="text-[#6B6969] text-[1rem] sm:text-[.875rem] leading-[140%]">
            Oversee all payouts and refunds to ensure sellers are paid
          </p>
        </section>
        <div className="flex items-center justify-end">
          <button
            className="[background:var(--primary-radial)] px-[24px]  w-full md:w-fit flex items-center justify-center gap-[16px] text-[#FDFDFD] h-[46px] rounded-[20px] cursor-pointer"
            type="button"
          >
            <p className="">Export</p>
            <HiOutlineLogout size={16} />
          </button>
        </div>
      </section>
      <section className="my-[30px] md:px-[15px]">
        <section className="pb-3">
          <h3 className="text-[#171417] font-medium text-[1.25rem] leading-[140%] mb-[20px]">
            Payment Records
          </h3>
          <aside className="flex items-center justify-between gap-[24px]">
            <div className="border border-[#B7B6B7] relative w-[532px] rounded-[8px]">
              <input
                type="text"
                placeholder="Search by Payment ID, Buyer/Seller Name, or Service Title..."
                className="w-full h-[46px] pl-[40px] pr-[16px] rounded-[8px] outline-none text-[#7B7B7B] placeholder:text-[#6B6969] placeholder:text-[.75rem] text-[.75rem] md:text-[1rem] leading-[140%] font-normal"
              />
              <Search
                size={16}
                className="text-[#6B6969] absolute left-4 top-4"
              />
            </div>
            <div className="">
              <button
                className="border border-[#B7B6B7] flex items-center h-[46px] md:h-[38px] px-[8px] rounded-[8px] gap-2 cursor-pointer"
                type="button"
              >
                <ListFilter size={16} />
                <span className="md:block hidden text-[#171417] text-[1rem] leading-[140%]">
                  Filter
                </span>
              </button>
            </div>
          </aside>
        </section>

        <hr />

        <section className="mt-4 py-10">
          {/* <EmptyPaymentManagement /> */}
          <NoPaymentManagement />
          {/* <NoResultDispute /> */}
          {/* <DisputeTable /> */}
        </section>

        <section className="mt-8 mb-[50px] w- flex items-center justify-center">
          {/* <Pagination totalPages={30} /> */}
        </section>
      </section>
    </section>
  );
};

export default PaymentManagementPage;
