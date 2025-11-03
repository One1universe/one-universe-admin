import Image from "next/image";
import React from "react";

const NoPaymentManagement = () => {
  return (
    <section className="py-12 flex items-center justify-center">
      <section className="flex items-center justify-center flex-col">
        <Image
          src="/empty/no-result.png"
          alt="Empty State"
          width={150}
          height={150}
        />
        <aside className="flex items-center justify-center flex-col gap-3 text-[1rem] leading-[140%] mt-4 w-[439px]">
          <h3 className="text-center text-[#171417] font-bold">
            No Matching Payments
          </h3>
          <p className="text-center text-[#6B6969] font-normal">
            We couldn’t find any payment records matching your search. Try
            adjusting your keywords or filters.
          </p>
        </aside>
      </section>
    </section>
  );
};

export default NoPaymentManagement;
