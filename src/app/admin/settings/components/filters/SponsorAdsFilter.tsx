// components/filters/SponsorAdsFilter.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Filter, Calendar, Check, X, ChevronDown } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Export the type so dashboard can import it
export interface SponsorAdsFilterState {
  paymentStatus: string | null;
  planType: string | null;
  subscriptionStatus: string | null;
  fromDate: Date | null;
  toDate: Date | null;
}

interface SponsorAdsFilterProps {
  onApply: (filters: SponsorAdsFilterState) => void;
  onClear: () => void;
}

const SponsorAdsFilter: React.FC<SponsorAdsFilterProps> = ({ onApply, onClear }) => {
  const [isOpen, setIsOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [planType, setPlanType] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleApply = () => {
    onApply({
      paymentStatus,
      planType,
      subscriptionStatus,
      fromDate,
      toDate,
    });
    setIsOpen(false);
  };

  const handleClear = () => {
    setPaymentStatus(null);
    setPlanType(null);
    setSubscriptionStatus(null);
    setFromDate(null);
    setToDate(null);
    onClear();
  };

  const hasActiveFilters = paymentStatus || planType || subscriptionStatus || fromDate || toDate;

  const CustomDateInput = React.forwardRef<HTMLButtonElement, any>(
    ({ value, onClick, placeholder }, ref) => (
      <button
        ref={ref}
        onClick={onClick}
        type="button"
        className="w-full px-4 py-3 text-left text-sm font-dm-sans border border-[#B5B1B1] rounded-lg hover:border-[#757575] transition flex items-center justify-between bg-white"
      >
        <span className={value ? "text-[#3C3C3C]" : "text-[#757575]"}>
          {value || placeholder}
        </span>
        <Calendar size={18} className="text-[#757575]" />
      </button>
    )
  );
  CustomDateInput.displayName = "CustomDateInput";

  const SelectDropdown = ({ 
    label, 
    value, 
    options, 
    onChange, 
    placeholder 
  }: {
    label: string;
    value: string | null;
    options: { label: string; value: string }[];
    onChange: (value: string | null) => void;
    placeholder: string;
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    return (
      <div className="flex flex-col gap-2">
        <label className="font-dm-sans font-medium text-[#05060D] text-base">{label}</label>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="w-full px-4 py-3 text-left text-sm font-dm-sans border border-[#B5B1B1] rounded-lg hover:border-[#757575] transition flex items-center justify-between bg-white"
          >
            <span className={selectedOption ? "text-[#3C3C3C]" : "text-[#757575]"}>
              {selectedOption?.label || placeholder}
            </span>
            <ChevronDown size={18} className={`text-[#757575] transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </button>

          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E5E5E5] rounded-lg overflow-hidden shadow-lg z-10">
              {options.map((option, index) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(value === option.value ? null : option.value);
                    setIsOpen(false);
                  }}
                  type="button"
                  className={`w-full px-4 py-3 flex items-center gap-2 text-left hover:bg-gray-50 transition-colors ${
                    index !== options.length - 1 ? "border-b border-[#E5E5E5]" : ""
                  }`}
                >
                  <div
                    className={`w-4 h-4 border flex items-center justify-center rounded transition-colors ${
                      value === option.value
                        ? "bg-[#154751] border-[#154751]"
                        : "border-[#757575] bg-white"
                    }`}
                  >
                    {value === option.value && <Check size={12} className="text-white" />}
                  </div>
                  <span className="text-base font-dm-sans text-[#3C3C3C]">{option.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="relative" ref={filterRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-5 py-3 border border-[#B5B1B1] rounded-xl bg-white hover:bg-gray-50 transition font-dm-sans text-base"
      >
        <Filter size={18} />
        Filter {hasActiveFilters && <span className="text-[#154751] font-bold">(Active)</span>}
        <ChevronDown size={18} className={`transition ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-3 w-96 bg-white rounded-2xl shadow-2xl border border-[#E5E5E5] z-50">
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-[#E8E3E3]">
              <h3 className="font-dm-sans font-bold text-xl text-[#171417]">Filter Ads</h3>
              <button onClick={handleClear} className="text-[#FB3748] hover:text-[#d32f3e] flex items-center gap-1 text-sm font-medium">
                <X size={16} />
                Clear All
              </button>
            </div>

            {/* Payment Status */}
            <SelectDropdown
              label="Payment Status"
              value={paymentStatus}
              options={[
                { label: "Paid", value: "paid" },
                { label: "Pending", value: "pending" },
                { label: "Failed", value: "failed" },
                { label: "Refunded", value: "refunded" },
              ]}
              onChange={setPaymentStatus}
              placeholder="Select payment status"
            />

            {/* Plan Type */}
            <SelectDropdown
              label="Plan Type"
              value={planType}
              options={[
                { label: "Monthly", value: "monthly" },
                { label: "Yearly", value: "yearly" },
                { label: "Lifetime", value: "lifetime" },
              ]}
              onChange={setPlanType}
              placeholder="Select plan type"
            />

            {/* Subscription Status */}
            <SelectDropdown
              label="Subscription Status"
              value={subscriptionStatus}
              options={[
                { label: "Active", value: "active" },
                { label: "Expired", value: "expired" },
                { label: "Cancelled", value: "cancelled" },
                { label: "Suspended", value: "suspended" },
              ]}
              onChange={setSubscriptionStatus}
              placeholder="Select subscription status"
            />

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-dm-sans font-medium text-[#05060D] text-base">From Date</label>
                <DatePicker
                  selected={fromDate}
                  onChange={(date) => {
                    setFromDate(date);
                    if (toDate && date && toDate < date) setToDate(null);
                  }}
                  maxDate={new Date()}
                  dateFormat="MMM d, yyyy"
                  customInput={<CustomDateInput placeholder="Select date" />}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-dm-sans font-medium text-[#05060D] text-base">To Date</label>
                <DatePicker
                  selected={toDate}
                  onChange={(date) => setToDate(date)}
                  minDate={fromDate || undefined}
                  maxDate={new Date()}
                  dateFormat="MMM d, yyyy"
                  customInput={<CustomDateInput placeholder="Select date" />}
                />
              </div>
            </div>

            <button
              onClick={handleApply}
              className="w-full py-4 rounded-2xl text-white font-dm-sans font-bold text-lg transition hover:opacity-90"
              style={{ background: "radial-gradient(circle at center, #154751 37%, #04171F 100%)" }}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SponsorAdsFilter;