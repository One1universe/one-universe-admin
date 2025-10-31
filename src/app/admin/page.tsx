// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import { Separator } from "@/components/ui/separator";
// import { ChevronUp, MoveUp } from "lucide-react";
// import { Skeleton } from "@/components/ui/skeleton"; // assuming you’re using shadcn/ui
// import { useGetDashboardMonthlyStats } from "@/hooks/dashboard/useGetDashboardMonthlyStats";
// import WaveChart from "./WaveChart";

// const DashboardPage = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [selected, setSelected] = useState<string>("monthly");
//  const optionsMap = [
//    { label: "Daily", value: "daily" },
//    { label: "Weekly", value: "weekly" },
//    { label: "Monthly", value: "monthly" },
//  ];

//   const { data, isLoading, isError, error } = useGetDashboardMonthlyStats();
//   console.log("Dashboard data:", data);

//   const handleSelect = (optionValue: string) => {
//     setSelected(optionValue);
//     setIsOpen(false);
//   };


//   if (isError) {
//     return (
//       <main className="flex flex-col items-center justify-center h-[70vh]">
//         <p className="text-red-500 font-medium">
//           {(error as Error)?.message || "Failed to load dashboard data."}
//         </p>
//       </main>
//     );
//   }

//   const stats = [
//     {
//       label: "Total App Users",
//       color: "bg-[#3621EE]",
//       total: data?.users?.total ?? 0,
//       growth: data?.users?.growthPercentage ?? 0,
//       growthType: data?.users?.growthType ?? "neutral",
//     },
//     {
//       label: "Total Buyers",
//       color: "[background:var(--primary-radial)]",
//       total: data?.buyers?.total ?? 0,
//       growth: data?.buyers?.growthPercentage ?? 0,
//       growthType: data?.buyers?.growthType ?? "neutral",
//     },
//     {
//       label: "Total Sellers",
//       color: "bg-[#67A344]",
//       total: data?.sellers?.total ?? 0,
//       growth: data?.sellers?.growthPercentage ?? 0,
//       growthType: data?.sellers?.growthType ?? "neutral",
//     },
//     {
//       label: "Total Bookings",
//       color: "bg-[#CE1474]",
//       total: data?.bookings?.total ?? 0,
//       growth: data?.bookings?.growthPercentage ?? 0,
//       growthType: data?.bookings?.growthType ?? "neutral",
//     },
//   ];

//   return (
//     <main className="flex flex-col flex-1 gap-[8px] md:gap-[16px]">
//       <section className="flex flex-col gap-2">
//         <h3 className="text-[#171417] font-bold text-[1.5rem] leading-[120%]">
//           Dashboard
//         </h3>
//         <p className="text-[#6B6969] hidden md:block text-[1rem] leading-[140%]">
//           Overview of key metrics and activity
//         </p>
//       </section>

//       {/* Stats cards */}
//       <section className="grid grid-cols-1 min-[410px]:grid-cols-2 min-[1200px]:grid-cols-4 gap-[16px] my-[24px]">
//         {isLoading
//           ? Array.from({ length: 4 }).map((_, i) => (
//               <Skeleton
//                 key={i}
//                 className="h-[123px] rounded-[8px] border border-[#E8E3E3]"
//               />
//             ))
//           : stats.map(({ label, color, total, growth, growthType }) => {
//               const isPositive = growthType === "positive";
//               return (
//                 <aside
//                   key={label}
//                   className="h-[123px] border border-[#E8E3E3] rounded-[8px] py-[12px] px-[16px] flex flex-col gap-[8px]"
//                 >
//                   <div className="flex flex-col gap-[16px]">
//                     <div className="flex items-center gap-[8px]">
//                       <div className={`${color} size-[20px] p-1 rounded-[4px]`}>
//                         <Image
//                           src="/logo/logo-vector.svg"
//                           alt="Logo"
//                           width={12}
//                           height={11}
//                         />
//                       </div>
//                       <h3 className="text-[#171417] font-medium leading-[140%] text-[1rem]">
//                         {label}
//                       </h3>
//                     </div>
//                     <h3 className="font-bold text-[#171417] text-[1.25rem] leading-[140%]">
//                       {total.toLocaleString()}
//                     </h3>
//                   </div>
//                   <Separator />
//                   <div className="flex items-center gap-[8px]">
//                     <div
//                       className={`p-0.5 rounded-[2px] ${
//                         isPositive ? "bg-[#D7FFE9]" : "bg-[#E9BCB7]"
//                       }`}
//                     >
//                       <MoveUp
//                         size={8}
//                         className={`${
//                           isPositive ? "text-[#1FC16B]" : "text-[#D00416]"
//                         }`}
//                       />
//                     </div>
//                     <p className="text-[#171417] text-[.75rem] font-normal leading-[140%]">
//                       <span
//                         className={
//                           isPositive ? "text-[#1FC16B]" : "text-[#D00416]"
//                         }
//                       >
//                         {isPositive ? "+" : "-"}
//                         {growth}%
//                       </span>{" "}
//                       from last month
//                     </p>
//                   </div>
//                 </aside>
//               );
//             })}
//       </section>

//       {/* Growth chart section */}
//       {/* <section className="border flex-1 border-[#E8E3E3] min-h-[475px] bg-blue-500 rounded-[16px] p-[12px] md:py-[24px] md:px-[25px] mb-[40px]">
//         <section className="flex items-center justify-between">
//           <h3 className="text-[#171417] font-medium leading-[140%] text-[1.25rem]">
//             User Growth
//           </h3>
//           <div className="relative w-[160px]">
//             <button
//               onClick={() => setIsOpen(!isOpen)}
//               className="w-full p-2 bg-white border border-[#B5B1B1] rounded-[8px] flex items-center justify-between text-sm font-normal hover:border-gray-400 transition-colors"
//             >
//               <span>{selected}</span>
//               <ChevronUp
//                 className={`w-5 h-5 transition-transform duration-200 ${
//                   isOpen ? "" : "rotate-180"
//                 }`}
//               />
//             </button>

//             {isOpen && (
//               <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-lg z-10">
//                 {options.map((option, index) => (
//                   <button
//                     key={option}
//                     onClick={() => handleSelect(option)}
//                     className={`w-full px-2 h-[38px] flex items-center gap-2 text-left hover:bg-gray-50 transition-colors ${
//                       index !== options.length - 1
//                         ? "border-b border-[#E5E5E5]"
//                         : ""
//                     }`}
//                   >
//                     <div
//                       className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
//                         selected === option
//                           ? "border-[#04171F] bg-white"
//                           : "border-[#757575] bg-white"
//                       }`}
//                     >
//                       {selected === option && (
//                         <div className="w-2.5 h-2.5 rounded-full [background:var(--primary-radial)]" />
//                       )}
//                     </div>

//                     <span className="text-[1rem] leading-[140%] font-normal text-[#3C3C3C]">
//                       {option}
//                     </span>
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
          
//         </section>

//         <section className="flex items-center justify-end gap-[16px] mt-[20px]">
//           <aside className="flex px-6.5 items-center gap-[8px] mt-[16px]">
//             <div className="bg-[#6F41A4] size-[12px] rounded-full"></div>
//             <p className="text-[.875rem] leading-[140%] font-normal text-[#303237]">
//               Buyers
//             </p>
//           </aside>
//           <aside className="flex pl-4.5 items-center gap-[8px] mt-[16px]">
//             <div className="[background:var(--primary-radial)] size-[12px] rounded-full"></div>
//             <p className="text-[.875rem] leading-[140%] font-normal text-[#303237]">
//               Sellers
//             </p>
//           </aside>
//         </section>

//         <section className="h-full w-full bg-red-500"></section>
//       </section> */}

//       <section className="flex flex-col border flex-1 border-[#E8E3E3] min-h-[525px] rounded-[16px] p-[12px] md:py-[24px] md:px-[25px] mb-[40px]">
//         {/* Header */}
//         <section className="flex items-center justify-between">
//           <h3 className="text-[#171417] font-medium leading-[140%] text-[1.25rem]">
//             User Growth
//           </h3>
//           <div className="relative w-[160px]">
//             <button
//               onClick={() => setIsOpen(!isOpen)}
//               className="w-full p-2 bg-white border border-[#B5B1B1] rounded-[8px] flex items-center justify-between text-sm font-normal hover:border-gray-400 transition-colors"
//             >
//               <span>{optionsMap.find((o) => o.value === selected)?.label}</span>
//               <ChevronUp
//                 className={`w-5 h-5 transition-transform duration-200 ${
//                   isOpen ? "" : "rotate-180"
//                 }`}
//               />
//             </button>

//             {isOpen && (
//               <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-lg z-10">
//                 {optionsMap.map((option, index) => (
//                   <button
//                     key={option.value}
//                     onClick={() => handleSelect(option.value)}
//                     className={`w-full px-2 h-[38px] flex items-center gap-2 text-left hover:bg-gray-50 transition-colors ${
//                       index !== optionsMap.length - 1
//                         ? "border-b border-[#E5E5E5]"
//                         : ""
//                     }`}
//                   >
//                     <div
//                       className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
//                         selected === option.label
//                           ? "border-[#04171F] bg-white"
//                           : "border-[#757575] bg-white"
//                       }`}
//                     >
//                       {selected === option.label && (
//                         <div className="w-2.5 h-2.5 rounded-full [background:var(--primary-radial)]" />
//                       )}
//                     </div>

//                     <span className="text-[1rem] leading-[140%] font-normal text-[#3C3C3C]">
//                       {option.label}
//                     </span>
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         </section>

//         {/* Buyers/Sellers Legend */}
//         <section className="flex items-center justify-end gap-[16px] mt-[20px]">
//           <aside className="flex px-6.5 items-center gap-[8px] mt-[16px]">
//             <div className="bg-[#6F41A4] size-[12px] rounded-full"></div>
//             <p className="text-[.875rem] leading-[140%] font-normal text-[#303237]">
//               Buyers
//             </p>
//           </aside>
//           <aside className="flex pl-4.5 items-center gap-[8px] mt-[16px]">
//             <div className="[background:var(--primary-radial)] size-[12px] rounded-full"></div>
//             <p className="text-[.875rem] leading-[140%] font-normal text-[#303237]">
//               Sellers
//             </p>
//           </aside>
//         </section>

//         {/* Content Box */}
//         <section className="flex-1 w-full  mt-[16px] rounded-[8px] relative min-h-[300px]">
//           {/* <EmptyUserGrowth /> */}
//           <div className="absolute inset-0  rounded-[8px]">
//             <WaveChart />
//           </div>
//         </section>
//       </section>
//     </main>
//   );
// };

// export default DashboardPage;

// const EmptyUserGrowth = () => {
//   return (
//     <div className="absolute inset-0 flex flex-col items-center justify-center rounded-[8px]">
//       {/* <p className="text-gray-500">No user growth data available.</p> */}
//       <div className="flex items-center flex-col gap-6 w-[439px]">
//         <Image
//           src="/dashboard/empty-growth.svg"
//           alt="No User Growth Data"
//           width={150}
//           height={150}
//         />
//         <div className="flex flex-col items-center gap-3 text-center px-4">
//           <h3 className="text-[#171417] font-bold text-[1rem] ">
//             No New Signups Yet
//           </h3>
//           <p className="text-[#6B6969] font-normal text-[1rem]">
//             User registration trends will appear here as more parents and
//             vendors join the platform.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };


"use client";

import { useState } from "react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { ChevronUp, MoveUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetDashboardMonthlyStats } from "@/hooks/dashboard/useGetDashboardMonthlyStats";
import { useDashboardChartGrowth } from "@/hooks/dashboard/useDashboardChartGrowth";
import WaveChart from "./WaveChart";

const DashboardPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<"daily" | "weekly" | "monthly">(
    "monthly"
  );

  const optionsMap = [
    { label: "Daily", value: "daily" as const },
    { label: "Weekly", value: "weekly" as const },
    { label: "Monthly", value: "monthly" as const },
  ];

  const { data, isLoading, isError, error } = useGetDashboardMonthlyStats();
  const {
    data: chartData,
    isLoading: isChartLoading,
    isError: isChartError,
  } = useDashboardChartGrowth(selected);

  const handleSelect = (optionValue: "daily" | "weekly" | "monthly") => {
    setSelected(optionValue);
    setIsOpen(false);
  };

  if (isError) {
    return (
      <main className="flex flex-col items-center justify-center h-[70vh]">
        <p className="text-red-500 font-medium">
          {(error as Error)?.message || "Failed to load dashboard data."}
        </p>
      </main>
    );
  }

  const stats = [
    {
      label: "Total App Users",
      color: "bg-[#3621EE]",
      total: data?.users?.total ?? 0,
      growth: data?.users?.growthPercentage ?? 0,
      growthType: data?.users?.growthType ?? "neutral",
    },
    {
      label: "Total Buyers",
      color: "[background:var(--primary-radial)]",
      total: data?.buyers?.total ?? 0,
      growth: data?.buyers?.growthPercentage ?? 0,
      growthType: data?.buyers?.growthType ?? "neutral",
    },
    {
      label: "Total Sellers",
      color: "bg-[#67A344]",
      total: data?.sellers?.total ?? 0,
      growth: data?.sellers?.growthPercentage ?? 0,
      growthType: data?.sellers?.growthType ?? "neutral",
    },
    {
      label: "Total Bookings",
      color: "bg-[#CE1474]",
      total: data?.bookings?.total ?? 0,
      growth: data?.bookings?.growthPercentage ?? 0,
      growthType: data?.bookings?.growthType ?? "neutral",
    },
  ];

  return (
    <main className="flex flex-col flex-1 gap-[8px] md:gap-[16px]">
      <section className="flex flex-col gap-2">
        <h3 className="text-[#171417] font-bold text-[1.5rem] leading-[120%]">
          Dashboard
        </h3>
        <p className="text-[#6B6969] hidden md:block text-[1rem] leading-[140%]">
          Overview of key metrics and activity
        </p>
      </section>

      {/* Stats cards */}
      <section className="grid grid-cols-1 min-[410px]:grid-cols-2 min-[1200px]:grid-cols-4 gap-[16px] my-[24px]">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
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

      {/* Growth chart section */}
      <section className="flex flex-col border flex-1 border-[#E8E3E3] min-h-[525px] rounded-[16px] p-[12px] md:py-[24px] md:px-[25px] mb-[40px]">
        {/* Header */}
        <section className="flex items-center justify-between">
          <h3 className="text-[#171417] font-medium leading-[140%] text-[1.25rem]">
            User Growth
          </h3>
          <div className="relative w-[160px]">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full p-2 bg-white border border-[#B5B1B1] rounded-[8px] flex items-center justify-between text-sm font-normal hover:border-gray-400 transition-colors"
            >
              <span>{optionsMap.find((o) => o.value === selected)?.label}</span>
              <ChevronUp
                className={`w-5 h-5 transition-transform duration-200 ${
                  isOpen ? "" : "rotate-180"
                }`}
              />
            </button>

            {isOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-lg z-10">
                {optionsMap.map((option, index) => (
                  <button
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={`w-full px-2 h-[38px] flex items-center gap-2 text-left hover:bg-gray-50 transition-colors ${
                      index !== optionsMap.length - 1
                        ? "border-b border-[#E5E5E5]"
                        : ""
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                        selected === option.value
                          ? "border-[#04171F] bg-white"
                          : "border-[#757575] bg-white"
                      }`}
                    >
                      {selected === option.value && (
                        <div className="w-2.5 h-2.5 rounded-full [background:var(--primary-radial)]" />
                      )}
                    </div>

                    <span className="text-[1rem] leading-[140%] font-normal text-[#3C3C3C]">
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Buyers/Sellers Legend */}
        <section className="flex items-center justify-end gap-[16px] mt-[20px]">
          <aside className="flex px-6.5 items-center gap-[8px] mt-[16px]">
            <div className="bg-[#6F41A4] size-[12px] rounded-full"></div>
            <p className="text-[.875rem] leading-[140%] font-normal text-[#303237]">
              Buyers
            </p>
          </aside>
          <aside className="flex pl-4.5 items-center gap-[8px] mt-[16px]">
            <div className="[background:var(--primary-radial)] size-[12px] rounded-full"></div>
            <p className="text-[.875rem] leading-[140%] font-normal text-[#303237]">
              Sellers
            </p>
          </aside>
        </section>

        {/* Content Box */}
        <section className="flex-1 w-full mt-[16px] rounded-[8px] relative min-h-[300px]">
          {isChartLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Skeleton className="w-full h-full rounded-[8px]" />
            </div>
          ) : isChartError ||
            !chartData?.data ||
            chartData.data.length === 0 ? (
            <EmptyUserGrowth />
          ) : (
            <div className="absolute inset-0 rounded-[8px]">
              <WaveChart data={chartData.data} />
            </div>
          )}
        </section>
      </section>
    </main>
  );
};

export default DashboardPage;

const EmptyUserGrowth = () => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center rounded-[8px]">
      <div className="flex items-center flex-col gap-6 w-[439px]">
        <Image
          src="/dashboard/empty-growth.svg"
          alt="No User Growth Data"
          width={150}
          height={150}
        />
        <div className="flex flex-col items-center gap-3 text-center px-4">
          <h3 className="text-[#171417] font-bold text-[1rem]">
            No New Signups Yet
          </h3>
          <p className="text-[#6B6969] font-normal text-[1rem]">
            User registration trends will appear here as more parents and
            vendors join the platform.
          </p>
        </div>
      </div>
    </div>
  );
};