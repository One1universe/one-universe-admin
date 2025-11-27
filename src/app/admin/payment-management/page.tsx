"use client";

import { useEffect, useState } from "react";
import { HiOutlineDownload } from "react-icons/hi";
import PaymentTable from "./Details/PaymentTable";
import EmptyPaymentManagement from "./EmptyPaymentManagement";
import NoPaymentManagement from "./NoPaymentManagement";

type Payment = {
  id: string;
  serviceTitle: string;
  buyer: string;
  seller: string;
  totalAmount: string;
  status: "PAID" | "PENDING" | "DISPUTED" | "PENDING REFUND" | "REFUNDED";
  date: string;
};

const PaymentManagementPage = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPayments([
        {
          id: "PAY-001",
          serviceTitle: "Website Development",
          buyer: "Jane Adebayo",
          seller: "Ayo Tech",
          totalAmount: "₦50,000",
          status: "PAID",
          date: "Nov 22, 2025",
        },
        {
          id: "PAY-002",
          serviceTitle: "Mobile App Design",
          buyer: "John Doe",
          seller: "Tech Labs",
          totalAmount: "₦75,000",
          status: "PENDING",
          date: "Nov 20, 2025",
        },
        // ... more
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const filteredPayments = payments.filter((p) =>
    [p.id, p.buyer, p.seller, p.serviceTitle].some((field) =>
      field.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const hasPayments = payments.length > 0;
  const hasResults = filteredPayments.length > 0;

  return (
    <main className="max-w-[1120px] mx-auto px-10 pt-6">
      {/* TOP HEADER: Title + Export Button (same line) */}
      <header className="flex justify-between items-start mb-8">
        <div className="flex flex-col gap-1">
          <h1 className="font-dm-sans font-bold text-[24px] leading-[120%] text-[#171417]">
            Payment Management
          </h1>
          <p className="font-dm-sans text-base leading-[140%] text-[#6B6969] max-w-[429px]">
            Oversee all payouts and refunds to ensure sellers are paid
          </p>
        </div>

        {/* Export Button - Aligned to the right */}
        <button className="flex items-center gap-2 h-12 px-6 bg-gradient-to-r from-[#154751] to-[#04171F] text-white font-dm-sans font-medium text-base rounded-[20px] hover:opacity-90 transition">
          <HiOutlineDownload size={16} />
          Export
        </button>
      </header>

      {/* PAYMENT RECORDS SECTION */}
      <section className="bg-white rounded-t-3xl border border-[#E8E3E3] overflow-hidden">
        {/* "Payment Records" Tab Header */}
        <div className="bg-white px-6 py-5 border-b border-[#E8E3E3]">
          <h2 className="font-dm-sans font-medium text-xl leading-[140%] text-[#171417]">
            Payment Records
          </h2>
        </div>

        {/* Search + Filter Row */}
        <div className="px-6 py-5 flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Search Bar */}
          <div className="relative w-full sm:w-[532px]">
            <input
              type="text"
              placeholder="Search by Payment ID, Buyer/Seller Name, or Service Title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 border border-[#B7B6B7] rounded-lg text-base font-inter placeholder-[#7B7B7B] focus:outline-none focus:border-[#04171F] transition"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7B7B7B]"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Filter Button */}
          <button className="flex items-center gap-2 h-12 px-6 border border-[#B5B1B1] rounded-lg text-[#171417] font-dm-sans font-medium text-base hover:bg-gray-50 transition">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M6.22222 13.3333H9.77778V11.5556H6.22222V13.3333ZM0 2.66667V4.44444H16V2.66667H0ZM2.66667 8.88889H13.3333V7.11111H2.66667V8.88889Z"
                fill="currentColor"
              />
            </svg>
            Filter
          </button>
        </div>

        {/* Table Content */}
        <div className="min-h-[480px]">
          {loading ? (
            <div className="p-8 space-y-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-gray-100 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : !hasPayments ? (
            <EmptyPaymentManagement />
          ) : !hasResults ? (
            <NoPaymentManagement />
          ) : (
            <PaymentTable data={filteredPayments} />
          )}
        </div>
      </section>
    </main>
  );
};

export default PaymentManagementPage;