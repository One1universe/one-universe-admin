"use client";

import { useEffect, useState } from "react";
import { HiOutlineDownload } from "react-icons/hi";
import PaymentTable, { Payment } from "./Details/PaymentTable";
import EmptyPaymentManagement from "./EmptyPaymentManagement";
import NoPaymentManagement from "./NoPaymentManagement";
import PaymentFilters from "./Filters/PaymentFilters";
import ExportModal from "./Details/ExportModal"; // ← Your existing modal
import Pagination from "@/components/ui/Pagination";
import { paymentManagementStore } from "@/store/paymentManagementStore";
import { filterPayments, formatCurrency, formatDate } from "../utils/paymentUtils";

// Export libraries
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const PaymentManagementPage = () => {
  const {
    allPayments,
    allPaymentsLoading,
    allPaymentsError,
    allPaymentsMeta,
    searchQuery,
    filters,
    fetchAllPayments,
    setSearchQuery,
    setFilters,
  } = paymentManagementStore();

  const [showFilter, setShowFilter] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchAllPayments(currentPage, itemsPerPage);
  }, [currentPage]);

  const filteredPayments = filterPayments(allPayments, filters, searchQuery);

  const transformedPayments: Payment[] = filteredPayments.map((payment) => ({
    id: payment.reference,
    serviceTitle: payment.serviceTitle || "N/A",
    buyer: payment.buyerName || "N/A",
    seller: payment.sellerName || "N/A",
    totalAmount: formatCurrency(payment.amount),
    status: payment.status,
    date: formatDate(payment.createdAt),
    buyerUserId: payment.buyerUserId || null,
    sellerUserId: payment.sellerUserId || null,
  }));

  const hasPayments = allPayments.length > 0;
  const hasResults = transformedPayments.length > 0;
  const totalPages = allPaymentsMeta?.lastPage || 1;

  const handleApplyFilter = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setShowFilter(false);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // EXPORT FUNCTION
  const handleExport = (format: "csv" | "pdf") => {
    const data = transformedPayments.map((p) => ({
      "Payment ID": p.id,
      "Service Title": p.serviceTitle,
      Buyer: p.buyer,
      Seller: p.seller,
      Amount: p.totalAmount,
      Status:
        p.status === "PAID" ? "Paid" :
        p.status === "PENDING" ? "Pending" :
        p.status === "DISPUTED" ? "Disputed" :
        p.status === "PENDING REFUND" ? "Pending Refund" :
        p.status === "REFUNDED" ? "Refunded" : "Failed",
      Date: p.date,
    }));

    const filename = `payments_${new Date().toISOString().split("T")[0]}`;

    if (format === "csv") {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Payments");
      const csv = XLSX.write(wb, { bookType: "csv", type: "string" });
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      saveAs(blob, `${filename}.csv`);
    }

    if (format === "pdf") {
      const doc = new jsPDF("l", "mm", "a4");
      doc.setFontSize(20);
      doc.text("Payment Records", 14, 22);
      autoTable(doc, {
        head: [["Payment ID", "Service Title", "Buyer", "Seller", "Amount", "Status", "Date"]],
        body: data.map(row => Object.values(row)),
        startY: 30,
        theme: "grid",
        headStyles: { fillColor: [4, 23, 31], textColor: [255, 255, 255] },
        styles: { fontSize: 9 },
      });
      doc.save(`${filename}.pdf`);
    }

    setShowExportModal(false);
  };

  return (
    <>
      <main className="max-w-[1120px] mx-auto px-10 pt-6 pb-8">
        <header className="flex justify-between items-start mb-8">
          <div className="flex flex-col gap-1">
            <h1 className="font-dm-sans font-bold text-[24px] leading-[120%] text-[#171417]">
              Payment Management
            </h1>
            <p className="font-dm-sans text-base leading-[140%] text-[#6B6969] max-w-[429px]">
              Oversee all payouts and refunds to ensure sellers are paid
            </p>
          </div>

          {/* EXPORT BUTTON */}
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 h-12 px-6 bg-gradient-to-r from-[#154751] to-[#04171F] text-white font-dm-sans font-medium text-base rounded-[20px] hover:opacity-90 transition"
          >
            <HiOutlineDownload size={16} />
            Export
          </button>
        </header>

        <section className="bg-white rounded-t-3xl border border-[#E8E3E3] overflow-hidden relative">
          <div className="bg-white px-6 py-5 border-b border-[#E8E3E3]">
            <h2 className="font-dm-sans font-medium text-xl leading-[140%] text-[#171417]">
              Payment Records
            </h2>
          </div>

          {/* Search + Filter Button */}
          <div className="px-6 py-5 flex flex-col sm:flex-row gap-4 items-center justify-between">
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

            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-2 h-12 px-6 border border-[#B5B1B1] rounded-lg text-[#171417] font-dm-sans font-medium text-base hover:bg-gray-50 transition whitespace-nowrap"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6.22222 13.3333H9.77778V11.5556H6.22222V13.3333ZM0 2.66667V4.44444H16V2.66667H0ZM2.66667 8.88889H13.3333V7.11111H2.66667V8.88889Z" fill="currentColor" />
              </svg>
              Filter
            </button>
          </div>

          {/* Error Message */}
          {allPaymentsError && (
            <div className="mx-6 mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm font-medium">{allPaymentsError}</p>
            </div>
          )}

          {/* Table Content */}
          <div className="min-h-[480px]">
            {allPaymentsLoading ? (
              <div className="p-8 space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : allPaymentsError ? (
              <div className="flex flex-col items-center justify-center py-16">
                <h3 className="text-lg font-medium text-gray-900">Failed to load payments</h3>
                <button
                  onClick={() => fetchAllPayments(currentPage, itemsPerPage)}
                  className="mt-4 px-6 py-3 bg-[#04171F] text-white rounded-lg"
                >
                  Retry
                </button>
              </div>
            ) : !hasPayments ? (
              <EmptyPaymentManagement />
            ) : !hasResults ? (
              <NoPaymentManagement />
            ) : (
              <PaymentTable data={transformedPayments} />
            )}
          </div>

          {/* Pagination */}
          {hasResults && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </section>
      </main>

      {/* FILTER DROPDOWN */}
      {showFilter && (
        <div
          className="fixed inset-0 z-[9999] bg-black/30"
          onClick={() => setShowFilter(false)}
        >
          <div
            className="absolute right-8 top-48 w-[476px]"
            onClick={(e) => e.stopPropagation()}
          >
            <PaymentFilters onApplyFilter={handleApplyFilter} />
          </div>
        </div>
      )}

      {/* EXPORT MODAL — YOUR EXISTING ONE */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
      />
    </>
  );
};

export default PaymentManagementPage;