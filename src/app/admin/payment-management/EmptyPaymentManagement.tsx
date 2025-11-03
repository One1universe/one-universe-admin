import Image from "next/image";

const EmptyPaymentManagement = () => {
  return (
    <section className="py-12 flex items-center justify-center">
      <section className="flex items-center justify-center flex-col">
        <Image
          src="/empty/empty-state.png"
          alt="Empty State"
          width={150}
          height={150}
        />
        <aside className="flex items-center justify-center flex-col gap-3 text-[1rem] leading-[140%] mt-4 w-[439px]">
          <h3 className="text-center text-[#171417] font-bold">
            No payment records available
          </h3>
          <p className="text-center text-[#6B6969] font-normal">
            Payments will appear here once the buyer confirms the job start (30%
            auto release) and at job completion (70% release after 24 hours)
          </p>
        </aside>
      </section>
    </section>
  );
};

export default EmptyPaymentManagement;
