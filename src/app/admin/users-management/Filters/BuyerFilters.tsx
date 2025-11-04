"use client";
import { ChevronUp, X } from "lucide-react";
import React, { useState } from "react";

const BuyerFilters = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<"daily" | "weekly" | "monthly">(
    "monthly"
  );

  const optionsMap = [
    { label: "Daily", value: "daily" as const },
    { label: "Weekly", value: "weekly" as const },
    { label: "Monthly", value: "monthly" as const },
  ];
  const handleSelect = (optionValue: "daily" | "weekly" | "monthly") => {
    setSelected(optionValue);
    setIsOpen(false);
  };
  return (
    <section className="w-[476px] h-[540px] bg-white px-6 py-8 rounded-2xl flex flex-col gap-6 absolute right-0 z-50">
      <div className="flex items-center justify-between border-b border-[#E8E3E3]  pb-3">
        <h3 className="text-[#171417] text-[1.25rem] font-bold ">Filter</h3>
        <button
          className="flex items-center gap-2 text-[#FB3748] "
          type="button"
        >
          <X />
          <span className="">Clear Filter</span>
        </button>
      </div>
      <div className="">
        <div className="">
          <h3 className="">Account Status</h3>
          <div className="relative w-full">
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
        </div>
      </div>
    </section>
  );
};

export default BuyerFilters;
