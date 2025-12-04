"use client";

import React, { useState } from "react";
import { X, Check } from "lucide-react";

interface Plan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  iconColor?: string;
}

interface UpdatePlanPricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan;
  onUpdate: (planId: string, newMonthlyPrice: number, newYearlyPrice: number) => void;
}

const UpdatePlanPricingModal: React.FC<UpdatePlanPricingModalProps> = ({
  isOpen,
  onClose,
  plan,
  onUpdate,
}) => {
  const [newMonthlyPrice, setNewMonthlyPrice] = useState("");
  const [newYearlyPrice, setNewYearlyPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const formatPrice = (value: string) => {
    const num = value.replace(/\D/g, "");
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleSubmit = () => {
    const monthly = parseFloat(newMonthlyPrice.replace(/,/g, ""));
    const yearly = parseFloat(newYearlyPrice.replace(/,/g, ""));
    if ((isNaN(monthly) && newMonthlyPrice) || (isNaN(yearly) && newYearlyPrice)) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onUpdate(plan.id, monthly || plan.monthlyPrice, yearly || plan.yearlyPrice);
      setIsSubmitting(false);
      onClose();
      setNewMonthlyPrice("");
      setNewYearlyPrice("");
    }, 800);
  };

  const accentColor = plan.iconColor || "#154751";

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Modal container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto">
        <div className="bg-white rounded-[16px] shadow-2xl w-full max-w-[556px] mx-auto">
          
          {/* Header */}
          <div className="bg-[#E8FBF7] border-b border-[#E8E3E3] px-8 py-8 flex justify-between items-center rounded-t-[16px]">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: accentColor }}>
                <Check size={20} className="text-white" />
              </div>
              <div>
                <h2 className="font-dm-sans font-medium text-lg text-[#171417]">{plan.name}</h2>
                <p className="font-dm-sans text-sm text-[#6B6969]">{plan.description}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/30 rounded-lg transition-colors">
              <X size={28} className="text-[#171417]" />
            </button>
          </div>

          {/* Body */}
          <div className="p-8 space-y-6">
            {/* Current Prices */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 bg-[#FFFCFC] border-l-4 border-[#154751] rounded-[8px] p-4 flex flex-col gap-2">
                <p className="text-xs text-[#6B6969] font-dm-sans">Current Monthly Price</p>
                <p className="text-lg font-bold text-[#171417]">₦{plan.monthlyPrice.toLocaleString()}/month</p>
              </div>
              <div className="flex-1 bg-[#FFFCFC] border-l-4 border-[#1ABF9E] rounded-[8px] p-4 flex flex-col gap-2">
                <p className="text-xs text-[#6B6969] font-dm-sans">Current Yearly Price</p>
                <p className="text-lg font-bold text-[#171417]">₦{plan.yearlyPrice.toLocaleString()}/year</p>
              </div>
            </div>

            {/* New Prices */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex flex-col gap-2">
                <label className="font-dm-sans font-medium text-[#05060D]">New Monthly Price (₦)</label>
                <input
                  type="text"
                  value={newMonthlyPrice}
                  onChange={(e) => setNewMonthlyPrice(formatPrice(e.target.value))}
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 rounded-[12px] border border-[#B2B2B4] focus:border-[#154751] focus:outline-none text-center font-dm-sans text-lg"
                />
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <label className="font-dm-sans font-medium text-[#05060D]">New Yearly Price (₦)</label>
                <input
                  type="text"
                  value={newYearlyPrice}
                  onChange={(e) => setNewYearlyPrice(formatPrice(e.target.value))}
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 rounded-[12px] border border-[#B2B2B4] focus:border-[#154751] focus:outline-none text-center font-dm-sans text-lg"
                />
              </div>
            </div>

            {/* Update Button */}
            <div className="flex justify-end pt-4">
              <button
                onClick={handleSubmit}
                disabled={(!newMonthlyPrice && !newYearlyPrice) || isSubmitting}
                className={`px-12 md:px-16 py-4 rounded-[20px] font-dm-sans font-medium text-lg text-white transition-all active:scale-95 disabled:cursor-not-allowed ${
                  (newMonthlyPrice || newYearlyPrice) && !isSubmitting ? "shadow-lg hover:shadow-xl" : "opacity-60"
                }`}
                style={{
                  background: (newMonthlyPrice || newYearlyPrice) && !isSubmitting
                    ? "radial-gradient(50% 50% at 50% 50%, #154751 37%, #04171F 100%)"
                    : "linear-gradient(0deg, #ACC5CF, #ACC5CF)",
                }}
              >
                {isSubmitting ? "Updating..." : "Update Pricing"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdatePlanPricingModal;
