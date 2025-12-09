// app/admin/settings/ReferralDashboard.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, Filter, TrendingUp, TrendingDown, Check } from "lucide-react";
import SettingsEmptyState from "./ReferralEmptyState";
import ReferralTable from "./ReferralTable";
import { Referral } from "@/types/Referral";

interface Plan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  iconColor?: string;
}

const ReferralDashboard = () => {
  const [hasReferrals, setHasReferrals] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>(["All"]);
  const [searchQuery, setSearchQuery] = useState("");
  const filterRef = useRef<HTMLDivElement>(null);

  const plan: Plan = {
    id: "premium-Referral",
    name: "Premium Referral Price",
    description: "Price for premium Referrals",
    monthlyPrice: 5000,
    yearlyPrice: 50000,
    iconColor: "#154751",
  };

  // Sample referral data
  const [referrals] = useState<Referral[]>([
    {
      id: "1",
      referralId: "#REF001",
      referrerName: "Wade Warren",
      referredName: "Sarah Smith",
      firstTransaction: "Completed",
      signDate: "12 May 2025",
      status: "Paid",
      rewardEarned: true,
    },
    {
      id: "2",
      referralId: "#REF002",
      referrerName: "Jane Cooper",
      referredName: "Mike Jones",
      firstTransaction: "Pending",
      signDate: "11 May 2025",
      status: "Processing",
      rewardEarned: false,
    },
    {
      id: "3",
      referralId: "#REF003",
      referrerName: "John Doe",
      referredName: "Emily Davis",
      firstTransaction: "Completed",
      signDate: "10 May 2025",
      status: "Paid",
      rewardEarned: true,
    },
    {
      id: "4",
      referralId: "#REF004",
      referrerName: "Robert Brown",
      referredName: "Lisa Anderson",
      firstTransaction: "Completed",
      signDate: "09 May 2025",
      status: "Pending",
      rewardEarned: false,
    },
    {
      id: "5",
      referralId: "#REF005",
      referrerName: "Mary Wilson",
      referredName: "David Taylor",
      firstTransaction: "Pending",
      signDate: "08 May 2025",
      status: "Processing",
      rewardEarned: false,
    },
  ]);

  // Filter referrals based on search and selected filters
  const filteredReferrals = referrals.filter((referral) => {
    const matchesSearch =
      referral.referrerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      referral.referredName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      selectedFilters.includes("All") || selectedFilters.includes(referral.status);

    return matchesSearch && matchesFilter;
  });

  const handleUpdatePrice = (planId: string, newMonthlyPrice: number, newYearlyPrice: number) => {
    console.log("UPDATED PLAN:", planId, newMonthlyPrice, newYearlyPrice);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full space-y-8 px-5 md:px-0">

      {/* === HEADER SECTION === */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="font-dm-sans font-bold text-2xl leading-[120%] text-[#171417]">
            Referral Performance 
          </h1>
          <p className="font-dm-sans text-base leading-[140%] text-[#6B6969]">
            Create and manage incentives to boost platform activity
          </p>
        </div>

        {/* Settings Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 h-[48px] rounded-[20px] px-6 py-4 whitespace-nowrap"
          style={{
            background: 'radial-gradient(50% 50% at 50% 50%, #154751 37%, #04171F 100%)'
          }}
        >
          {/* Plus icon */}
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0"
          >
            <path 
              d="M8 3.33334V12.6667M3.33333 8H12.6667" 
              stroke="#FFFFFF" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          
          {/* Button text */}
          <span 
            className="font-dm-sans font-medium text-base leading-[140%]"
            style={{ color: '#FDFDFD' }}
          >
            Referral Settings
          </span>
        </button>
      </div>

      {/* === 4 STAT CARDS === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Referrals */}
        <div className="bg-white border border-[#E8E3E3] rounded-lg px-4 pt-3 pb-4 h-[123px] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-[#3621EE] rounded flex items-center justify-center p-1">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 0L7.854 4.146L12 6L7.854 7.854L6 12L4.146 7.854L0 6L4.146 4.146L6 0Z" fill="#FFFFFF"/>
                </svg>
              </div>
              <span className="font-dm-sans text-base font-medium text-[#171417]">
                Total Referrals
              </span>
            </div>
            <TrendingUp size={16} className="text-[#00AB47]" />
          </div>
          <div className="border-t border-[#E8E3E3] pt-2">
            <p className="font-dm-sans font-bold text-2xl text-[#171417]">5</p>
            <div className="font-dm-sans text-xs text-[#171417] mt-1 flex items-center gap-1">
              <TrendingUp size={10} className="text-[#1FC16B]" />
              <span>+21% from last month</span>
            </div>
          </div>
        </div>

         {/* Successful Referrals  */}
        <div className="bg-white border border-[#E8E3E3] rounded-lg px-4 pt-3 pb-4 h-[123px] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-[#FE4B01] rounded flex items-center justify-center p-1">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 0L7.854 4.146L12 6L7.854 7.854L6 12L4.146 7.854L0 6L4.146 4.146L6 0Z" fill="#FFFFFF"/>
                </svg>
              </div>
              <span className="font-dm-sans text-base font-medium text-[#171417]">
                Successful Referrals
              </span>
            </div>
            <TrendingDown size={16} className="text-[#D84040]" />
          </div>
          <div className="border-t border-[#E8E3E3] pt-2">
            <p className="font-dm-sans font-bold text-2xl text-[#171417]">3</p>
            <div className="font-dm-sans text-xs text-[#D84040] mt-1 flex items-center gap-1">
              <TrendingDown size={10} className="text-[#D84040]" />
              <span>-21% from last month</span>
            </div>
          </div>
        </div>

        {/* Reward paid */}
        <div className="bg-white border border-[#E8E3E3] rounded-lg px-4 pt-3 pb-4 h-[123px] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-[#67A344] rounded flex items-center justify-center p-1">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 0L7.854 4.146L12 6L7.854 7.854L6 12L4.146 7.854L0 6L4.146 4.146L6 0Z" fill="#FFFFFF"/>
                </svg>
              </div>
              <span className="font-dm-sans text-base font-medium text-[#171417]">
                Reward Paid
              </span>
            </div>
            <TrendingUp size={16} className="text-[#1FC16B]" />
          </div>
          <div className="border-t border-[#E8E3E3] pt-2">
            <p className="font-dm-sans font-bold text-2xl text-[#171417]">₦248,000</p>
            <div className="font-dm-sans text-xs text-[#171417] mt-1 flex items-center gap-1">
              <TrendingUp size={10} className="text-[#1FC16B]" />
              <span>+21% from last month</span>
            </div>
          </div>
        </div>

        {/* Current Reward Rate */}
        <div className="bg-white border border-[#E8E3E3] rounded-lg px-4 pt-3 pb-4 h-[123px] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-[#CE1474] rounded flex items-center justify-center p-1">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 0L7.854 4.146L12 6L7.854 7.854L6 12L4.146 7.854L0 6L4.146 4.146L6 0Z" fill="#FFFFFF"/>
                </svg>
              </div>
              <span className="font-dm-sans text-base font-medium text-[#171417]">
                Current Reward Rate
              </span>
            </div>
            <TrendingDown size={16} className="text-[#D84040]" />
          </div>
          <div className="border-t border-[#E8E3E3] pt-2">
            <p className="font-dm-sans font-bold text-2xl text-[#171417]">₦5,000</p>
            <div className="font-dm-sans text-xs text-[#D84040] mt-1 flex items-center gap-1">
              <TrendingDown size={10} className="text-[#D84040]" />
              <span>-21% from last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* === MAIN CONTAINER WITH SEARCH + FILTER === */}
      <div className="bg-white rounded-t-3xl overflow-hidden">
        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-6 pt-4 pb-5 border-b border-[#D0D0D0]">
          <div className="flex items-center gap-3 border border-[#B7B6B7] rounded-lg px-4 py-3 w-full md:w-96">
            <Search size={20} className="text-[#7B7B7B]" />
            <input
              type="text"
              placeholder="Search by referrer or referred name"
              className="flex-1 outline-none font-inter text-base text-[#7B7B7B] placeholder-[#7B7B7B]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* FILTER BUTTON + DROPDOWN */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-3 border border-[#B5B1B1] rounded-lg bg-white hover:bg-gray-50 transition"
            >
              <Filter size={16} />
              <span className="font-dm-sans text-base text-[#171417]">
                Filter {selectedFilters.length > 1 ? `(${selectedFilters.length - 1})` : ""}
              </span>
            </button>

            {/* EXACT DESIGN DROPDOWN */}
            {isFilterOpen && (
              <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-lg shadow-lg border border-[#E5E5E5] overflow-hidden z-50">
                <div className="py-2">
                  {["All", "Paid", "Pending", "Processing"].map((filter) => {
                    const isSelected = selectedFilters.includes(filter);

                    return (
                      <label
                        key={filter}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-[#F9F9F9] cursor-pointer transition"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {
                            if (filter === "All") {
                              setSelectedFilters(["All"]);
                            } else {
                              setSelectedFilters((prev) =>
                                prev.includes(filter)
                                  ? prev.filter((f) => f !== filter && f !== "All")
                                  : [...prev.filter((f) => f !== "All"), filter]
                              );
                            }
                          }}
                          className="sr-only"
                        />
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition ${
                            isSelected
                              ? "border-[#154751] bg-[#154751]"
                              : "border-[#757575] bg-white"
                          }`}
                        >
                          {isSelected && <Check size={10} className="text-white" />}
                        </div>
                        <span className="font-dm-sans text-base text-[#3C3C3C] select-none">
                          {filter}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* TABLE OR EMPTY STATE */}
        {filteredReferrals.length > 0 ? (
          <div className="p-0">
            <ReferralTable referrals={filteredReferrals} />
          </div>
        ) : (
          <div className="py-20">
            <SettingsEmptyState />
          </div>
        )}
      </div>

    </div>
  );
};

export default ReferralDashboard;