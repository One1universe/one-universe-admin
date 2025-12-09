"use client";

import React, { useState } from "react";
import { Referral } from "@/types/Referral";
import ReferralEmptyState from "./ReferralEmptyState";

interface ReferralTableProps {
  referrals: Referral[];
}

const ReferralTable = ({ referrals }: ReferralTableProps) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);

  const handleActionClick = (
    referralId: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setOpenMenuId(prev => prev === referralId ? null : referralId);
  };

  const openReferralDetail = (referral: Referral) => {
    setSelectedReferral(referral);
    setOpenMenuId(null);
  };

  const getTransactionStyles = (status: Referral["firstTransaction"]) => {
    switch (status) {
      case "Completed": return "bg-[#E0F5E6] text-[#1FC16B]";
      case "Pending": return "bg-[#FFF2B9] text-[#9D7F04]";
      default: return "";
    }
  };

  const getStatusStyles = (status: Referral["status"]) => {
    switch (status) {
      case "Paid": return "bg-[#E0F5E6] text-[#1FC16B]";
      case "Pending": return "bg-[#FFF2B9] text-[#9D7F04]";
      case "Processing": return "bg-[#D3E1FF] text-[#007BFF]";
      default: return "";
    }
  };

  const getRewardIcon = (earned: boolean) => {
    return earned ? (
      <div className="flex items-center gap-1">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#1FC16B]">
          <path d="M13.78 4.22a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06 0l-3.5-3.5a.75.75 0 111.06-1.06L5.5 10.94l6.72-6.72a.75.75 0 011.06 0z" fill="currentColor"/>
        </svg>
        <span className="font-dm-sans text-sm font-medium text-[#1FC16B]">Yes</span>
      </div>
    ) : (
      <div className="flex items-center gap-1">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#D84040]">
          <path d="M12.22 3.78a.75.75 0 010 1.06L9.06 8l3.16 3.16a.75.75 0 11-1.06 1.06L8 9.06l-3.16 3.16a.75.75 0 11-1.06-1.06L6.94 8 3.78 4.84a.75.75 0 111.06-1.06L8 6.94l3.16-3.16a.75.75 0 011.06 0z" fill="currentColor"/>
        </svg>
        <span className="font-dm-sans text-sm font-medium text-[#D84040]">No</span>
      </div>
    );
  };

  return (
    <>
      {referrals.length > 0 ? (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block w-full overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1100px]">
              <thead>
                <tr className="bg-[#FFFCFC] border-b border-[#E5E5E5]">
                  <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">Referral Name</th>
                  <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">Referred Name</th>
                  <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">First Transaction</th>
                  <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">Sign Date</th>
                  <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">Status</th>
                  <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">Reward Earned</th>
                  <th className="py-[18px] px-[25px] font-inter font-medium text-base text-[#7B7B7B]">Action</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((referral) => (
                  <tr key={referral.id} className="bg-white border-b border-[#E5E5E5] hover:bg-[#FAFAFA]">
                    <td className="py-[18px] px-[25px] font-dm-sans text-base text-[#303237]">{referral.referrerName}</td>
                    <td className="py-[18px] px-[25px] font-dm-sans text-base text-[#303237]">{referral.referredName}</td>
                    <td className="py-[18px] px-[25px]">
                      <div className={`inline-flex items-center px-3 py-1 rounded-lg w-fit ${getTransactionStyles(referral.firstTransaction)}`}>
                        <span className="font-dm-sans text-sm font-medium">{referral.firstTransaction}</span>
                      </div>
                    </td>
                    <td className="py-[18px] px-[25px] font-dm-sans text-base text-[#303237]">{referral.signDate}</td>
                    <td className="py-[18px] px-[25px]">
                      <div className={`inline-flex items-center px-3 py-1 rounded-lg ${getStatusStyles(referral.status)}`}>
                        <span className="font-dm-sans text-sm font-medium">{referral.status}</span>
                      </div>
                    </td>
                    <td className="py-[18px] px-[25px]">
                      {getRewardIcon(referral.rewardEarned)}
                    </td>
                    <td className="py-[18px] px-[25px]">
                      <button
                        onClick={(e) => handleActionClick(referral.id, e)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-[#303237]">
                          <circle cx="10" cy="5" r="2" fill="currentColor" />
                          <circle cx="10" cy="10" r="2" fill="currentColor" />
                          <circle cx="10" cy="15" r="2" fill="currentColor" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4 p-4">
            {referrals.map((referral) => (
              <div key={referral.id} className="bg-white border border-[#E8E3E3] rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-dm-sans font-medium text-base text-[#303237]">{referral.referrerName}</span>
                    </div>
                    <p className="font-dm-sans text-sm text-[#454345]">Referred: {referral.referredName}</p>
                  </div>
                  <button
                    onClick={(e) => handleActionClick(referral.id, e)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-[#303237]">
                      <circle cx="10" cy="5" r="2" fill="currentColor" />
                      <circle cx="10" cy="10" r="2" fill="currentColor" />
                      <circle cx="10" cy="15" r="2" fill="currentColor" />
                    </svg>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <div className={`inline-flex items-center px-2 py-1 rounded-lg text-xs ${getTransactionStyles(referral.firstTransaction)}`}>
                    <span className="font-dm-sans font-medium">{referral.firstTransaction}</span>
                  </div>
                  <div className={`inline-flex items-center px-2 py-1 rounded-lg text-xs ${getStatusStyles(referral.status)}`}>
                    <span className="font-dm-sans font-medium">{referral.status}</span>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <p className="font-dm-sans text-[#454345]"><span className="font-medium text-[#303237]">Date:</span> {referral.signDate}</p>
                  <p className="font-dm-sans text-[#454345]"><span className="font-medium text-[#303237]">Reward:</span> {referral.rewardEarned ? "Yes" : "No"}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <ReferralEmptyState />
      )}
    </>
  );
};

export default ReferralTable;