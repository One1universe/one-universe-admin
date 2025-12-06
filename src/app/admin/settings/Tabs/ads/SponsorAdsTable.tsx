// ./Tabs/ads/SponsorAdsTable.tsx
"use client";

import React, { useState, useMemo } from "react";
import AdsSubscriberDetailsModal from "./AdsSubscriberDetailsModal";
import { SponsorAdsFilterState } from "../../components/filters/SponsorAdsFilter";

interface SponsorAd {
  id: string;
  sellerName: string;
  businessName: string;
  email: string;
  endDate: string;
  planType: string;
  status: "Active" | "Expired" | "Suspended";
  paymentStatus?: "Paid" | "Pending" | "Failed" | "Refunded";
  startDate?: string;
}

interface SponsorAdsTableProps {
  filters?: SponsorAdsFilterState;
}

const SponsorAdsTable: React.FC<SponsorAdsTableProps> = ({ filters = {} }) => {
  const [selectedSubscriber, setSelectedSubscriber] = useState<any>(null);

  // Mock data with extra fields for filtering
  const rawAds: SponsorAd[] = [
    {
      id: "1",
      sellerName: "Chioma Eze",
      businessName: "Chioma Beauty Empire",
      email: "chioma@brand.ng",
      endDate: "2025-12-30",
      planType: "Premium Ad Slot",
      status: "Active",
      paymentStatus: "Paid",
      startDate: "2025-06-01",
    },
    {
      id: "2",
      sellerName: "TechMart NG",
      businessName: "TechMart Nigeria Ltd",
      email: "ads@techmart.com",
      endDate: "2026-01-15",
      planType: "Featured Banner",
      status: "Active",
      paymentStatus: "Paid",
      startDate: "2025-07-10",
    },
    {
      id: "3",
      sellerName: "FashionHub",
      businessName: "FashionHub Co",
      email: "sponsor@fashionhub.co",
      endDate: "2025-10-01",
      planType: "Premium Ad Slot",
      status: "Expired",
      paymentStatus: "Failed",
      startDate: "2025-04-01",
    },
    {
      id: "4",
      sellerName: "Foodie Palace",
      businessName: "Foodie Palace Ltd",
      email: "ads@foodiepalace.com",
      endDate: "2025-11-20",
      planType: "Lifetime",
      status: "Suspended",
      paymentStatus: "Refunded",
      startDate: "2025-03-15",
    },
  ];

  // Filter logic using useMemo for performance
  const ads = useMemo(() => {
    return rawAds.filter((ad) => {
      // Payment Status filter
      if (filters.paymentStatus && ad.paymentStatus !== filters.paymentStatus) {
        return false;
      }

      // Plan Type filter
      if (filters.planType && !ad.planType.toLowerCase().includes(filters.planType.toLowerCase())) {
        return false;
      }

      // Subscription Status filter
      if (filters.subscriptionStatus && ad.status !== filters.subscriptionStatus) {
        return false;
      }

      // Date range filter
      if (filters.fromDate || filters.toDate) {
        const adDate = new Date(ad.endDate);
        if (filters.fromDate && adDate < filters.fromDate) return false;
        if (filters.toDate && adDate > filters.toDate) return false;
      }

      return true;
    });
  }, [filters, rawAds]);

  const handleViewDetails = (ad: SponsorAd) => {
    setSelectedSubscriber({
      ...ad,
      phone: "+2349012345678",
      payments: [
        { date: "01/06/2025", amount: "₦15,000", status: "Paid", transactionId: "TXN8877665544" },
        { date: "01/05/2025", amount: "₦15,000", status: "Failed", transactionId: "TXN1122334455" },
        { date: "01/04/2025", amount: "₦15,000", status: "Paid", transactionId: "TXN9988776655" },
      ],
    });
  };

  const getStatusColor = (status: SponsorAd["status"]) => {
    switch (status) {
      case "Active": return "bg-[#D7FFE9] text-[#00AB47]";
      case "Expired": return "bg-[#FFE6E6] text-[#D84040]";
      case "Suspended": return "bg-[#FFF2B9] text-[#B76E00]";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  if (ads.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-[#757575] font-dm-sans text-lg">
          {Object.values(filters).some(Boolean)
            ? "No ads match your current filters"
            : "No sponsored ads found"}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-[#FFFCFC] border-b border-[#E5E5E5]">
              <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">Seller Name</th>
              <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">Email Address</th>
              <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">End Date</th>
              <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">Ad Type</th>
              <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">Status</th>
              <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#7B7B7B]">Action</th>
            </tr>
          </thead>
          <tbody>
            {ads.map((ad) => (
              <tr
                key={ad.id}
                className="bg-white border-b border-[#E5E5E5] hover:bg-[#FAFAFA] transition-colors"
              >
                <td className="py-[18px] px-[25px] font-dm-sans text-base text-[#303237]">{ad.sellerName}</td>
                <td className="py-[18px] px-[25px] font-dm-sans text-base text-[#303237]">{ad.email}</td>
                <td className="py-[18px] px-[25px] font-dm-sans text-base text-[#303237]">
                  {new Date(ad.endDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="py-[18px] px-[25px] font-dm-sans text-base text-[#303237]">{ad.planType}</td>
                <td className="py-[18px] px-[25px]">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ad.status)}`}>
                    <div className="w-2 h-2 rounded-full bg-current" />
                    {ad.status}
                  </span>
                </td>
                <td className="py-[18px] px-[25px]">
                  <button
                    onClick={() => handleViewDetails(ad)}
                    className="font-dm-sans text-sm font-medium text-[#154751] hover:text-[#04171F] underline-offset-2 hover:underline transition-colors"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4 p-4">
        {ads.map((ad) => (
          <div key={ad.id} className="bg-white border border-[#E8E3E3] rounded-lg p-5 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-dm-sans font-medium text-base text-[#171417]">{ad.sellerName}</h4>
                <p className="font-dm-sans text-sm text-[#6B6969] mt-1">{ad.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <p className="text-[#6B6969]">End Date</p>
                <p className="font-medium text-[#171417] mt-1">
                  {new Date(ad.endDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                </p>
              </div>
              <div>
                <p className="text-[#6B6969]">Ad Type</p>
                <p className="font-medium text-[#171417] mt-1">{ad.planType}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ad.status)}`}>
                <div className="w-2 h-2 rounded-full bg-current" />
                {ad.status}
              </span>

              <button
                onClick={() => handleViewDetails(ad)}
                className="font-dm-sans text-sm font-medium text-[#154751] hover:text-[#04171F] underline-offset-2 hover:underline"
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <AdsSubscriberDetailsModal
        isOpen={!!selectedSubscriber}
        onClose={() => setSelectedSubscriber(null)}
        subscriber={selectedSubscriber}
      />
    </>
  );
};

export default SponsorAdsTable;