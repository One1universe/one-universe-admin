// app/admin/settings/SponsorAdsDashboard.tsx
"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import SettingsEmptyState from "./SettingsEmptyState";
import SponsorAdsTable from "./Tabs/ads/SponsorAdsTable";
import UpdatePlanPricingModal from "./Tabs/pricing/UpdatePricingModal";

// Fixed: Use the @ alias
import SponsorAdsFilter, { SponsorAdsFilterState } from "./components/filters/SponsorAdsFilter";

interface Plan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  iconColor?: string;
}

const SponsorAdsDashboard = () => {
  const hasAds = true;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState<SponsorAdsFilterState>({
    paymentStatus: null,
    planType: null,
    subscriptionStatus: null,
    fromDate: null,
    toDate: null,
  });

  const plan: Plan = {
    id: "sponsor-ads-price",
    name: "Sponsored Ads Price",
    description: "Price for sponsored ads placements",
    monthlyPrice: 15000,
    yearlyPrice: 150000,
    iconColor: "#154751",
  };

  const handleUpdatePrice = (planId: string, newMonthlyPrice: number, newYearlyPrice: number) => {
    console.log("UPDATED PLAN:", planId, newMonthlyPrice, newYearlyPrice);
  };

  return (
    <div className="w-full space-y-8 px-5 md:px-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <h2 className="font-dm-sans font-medium text-xl text-[#171417]">
          Sponsored Ad Subscribers
        </h2>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-4 rounded-3xl bg-gradient-to-r from-[#154751] to-[#04171F] hover:opacity-90 transition-opacity text-white font-dm-sans font-medium text-base"
        >
          Update Sponsor Price
        </button>
      </div>

      <div className="bg-white rounded-t-3xl overflow-hidden shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-6 pt-4 pb-5 border-b border-[#D0D0D0]">
          <div className="flex items-center gap-3 border border-[#B7B7B7] rounded-lg px-4 py-3 w-full md:w-96">
            <Search size={20} className="text-[#7B7B7B]" />
            <input
              type="text"
              placeholder="Search by name, email, or phone"
              className="flex-1 outline-none font-inter text-base text-[#7B7B7B] placeholder-[#7B7B7B]"
            />
          </div>

          <SponsorAdsFilter
            onApply={(newFilters) => setFilters(newFilters)}
            onClear={() => setFilters({
              paymentStatus: null,
              planType: null,
              subscriptionStatus: null,
              fromDate: null,
              toDate: null,
            })}
          />
        </div>

        {hasAds ? (
          <div className="overflow-x-auto">
            <SponsorAdsTable filters={filters} />
          </div>
        ) : (
          <div className="py-20">
            <SettingsEmptyState />
          </div>
        )}
      </div>

      <UpdatePlanPricingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        plan={plan}
        onUpdate={handleUpdatePrice}
      />
    </div>
  );
};

export default SponsorAdsDashboard;