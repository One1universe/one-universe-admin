"use client";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetDashboardMonthlyStats } from "@/hooks/dashboard/useGetDashboardMonthlyStats";
import { ListFilter, MoveUp, Search } from "lucide-react";
import Image from "next/image";
import React from "react";
import ServiceTabSelector from "./ServiceTabSelector";
import { Tabs } from "@/components/ui/tabs";

const ServiceManagementPage = () => {
  const { data, isLoading, isError, error } = useGetDashboardMonthlyStats();

  const stats = [
    {
      label: "Pending Requests",
      color: "[background:var(--primary-radial)]",
      total: 0,
      growth: data?.buyers?.growthPercentage ?? 0,
      growthType: data?.buyers?.growthType ?? "neutral",
    },
    {
      label: "Approved Today",
      color: "bg-[#67A344]",
      total: 0,
      growth: data?.sellers?.growthPercentage ?? 0,
      growthType: data?.sellers?.growthType ?? "neutral",
    },
    {
      label: "Total Services",
      color: "bg-[#3621EE]",
      total: 0,
      growth: data?.users?.growthPercentage ?? 0,
      growthType: data?.users?.growthType ?? "neutral",
    },
  ];
  return (
    <Tabs
      defaultValue="Buyers"
      className="flex flex-col gap-[8px] md:gap-[16px]"
    >
      <section className="grid grid-cols-1 min-[410px]:grid-cols-2 min-[1200px]:grid-cols-3 gap-[16px] my-[24px]">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-[123px] rounded-[8px] border border-[#E8E3E3]"
              />
            ))
          : stats.map(({ label, color, total, growth, growthType }) => {
              const isPositive = growthType === "positive";
              return (
                <aside
                  key={label}
                  className="h-[123px] border border-[#E8E3E3] rounded-[8px] py-[12px] px-[16px] flex flex-col gap-[8px]"
                >
                  <div className="flex flex-col gap-[16px]">
                    <div className="flex items-center gap-[8px]">
                      <div className={`${color} size-[20px] p-1 rounded-[4px]`}>
                        <Image
                          src="/logo/logo-vector.svg"
                          alt="Logo"
                          width={12}
                          height={11}
                        />
                      </div>
                      <h3 className="text-[#171417] font-medium leading-[140%] text-[1rem]">
                        {label}
                      </h3>
                    </div>
                    <h3 className="font-bold text-[#171417] text-[1.25rem] leading-[140%]">
                      {total.toLocaleString()}
                    </h3>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-[8px]">
                    <div
                      className={`p-0.5 rounded-[2px] ${
                        isPositive ? "bg-[#D7FFE9]" : "bg-[#E9BCB7]"
                      }`}
                    >
                      <MoveUp
                        size={8}
                        className={`${
                          isPositive ? "text-[#1FC16B]" : "text-[#D00416]"
                        }`}
                      />
                    </div>
                    <p className="text-[#171417] text-[.75rem] font-normal leading-[140%]">
                      <span
                        className={
                          isPositive ? "text-[#1FC16B]" : "text-[#D00416]"
                        }
                      >
                        {isPositive ? "+" : "-"}
                        {growth}%
                      </span>{" "}
                      from last month
                    </p>
                  </div>
                </aside>
              );
            })}
      </section>
      <div className="my-[30px] md:px-[15px]">
        <section className="pb-3 flex flex-col gap-3.5">
          <h3 className="text-[#171417] font-medium text-[1.25rem] leading-[140%] mb-[20px] px-[25px]">
            Service Requests
          </h3>
          <section className="flex flex-col gap-5">
            <ServiceTabSelector />
            <aside className="flex items-center justify-between gap-[24px]">
              <div className="border border-[#B7B6B7] relative w-[532px] rounded-[8px]">
                <input
                  type="text"
                  placeholder="Search by name, email, service, or phone..."
                  className="w-full h-[46px] pl-[40px] pr-[16px] rounded-[8px] outline-none text-[#7B7B7B] placeholder:text-[#6B6969] placeholder:text-[.75rem] text-[.75rem] md:text-[1rem] leading-[140%] font-normal"
                />
                <Search
                  size={16}
                  className="text-[#6B6969] absolute left-4 top-4"
                />
              </div>
              <div className="">
                <button
                  className="border border-[#B7B6B7] flex items-center h-[48px] md:h-[46px]  px-[8px] rounded-[8px] gap-2 cursor-pointer"
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
        </section>
        {/* <TabsContent value="Buyers">
          <BuyersTable />
        </TabsContent>
        <TabsContent value="Sellers">
          <SellersTable />
        </TabsContent>
        <TabsContent value="Admin Users">
          <AdminTable />
        </TabsContent>
        {modalType === "openBuyer" && <BuyerDetails />}
        {modalType === "openSeller" && <SellerDetails />} */}

        {/* <BuyersTable /> */}
      </div>
    </Tabs>
  );
};

export default ServiceManagementPage;
