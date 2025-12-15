"use client";
import React, { useState, useEffect } from "react";
import { MoveUp, Search, Check, X } from "lucide-react";
import EmptyApprovedService from "../components/empty-service/EmptyApprovedService";
import EmptyRejectedService from "../components/empty-service/EmptyRejectedService";
import EmptyPendingService from "../components/empty-service/EmptyPendingService";
import PendingTable from "./Tabs/PendingTabs/PendingTable";
import ApprovedTable from "./Tabs/ApprovalTabs/ApprovedTable";
import RejectedTable from "./Tabs/RejectedTabs/RejectedTable";
import DateRangePicker from "./Modal/DateRangePicker";
import Pagination from "../../../components/ui/Pagination"; // Adjust path if needed

type ServiceStatus = "Pending" | "Approved" | "Rejected";

interface Service {
  id: string;
  title: string;
  createdAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  sellerProfiles: Array<{
    user?: {
      fullName?: string;
      email?: string;
      phone?: string;
    };
  }>;
  rejectedReason?: string | null;
}

const ITEMS_PER_PAGE = 10;

export default function ServiceManagementPage() {
  const [activeTab, setActiveTab] = useState<ServiceStatus>("Pending");
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) return;

      setLoading(true);
      try {
        const res = await fetch(
          "https://one-universe-de5673cf0d65.herokuapp.com/api/v1/master-services/by-status?page=1&limit=1000",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();

        const allServices: Service[] = [
          ...(data.pending?.data || []).map((s: any) => ({ ...s, id: s.id })),
          ...(data.approved?.data || []).map((s: any) => ({ ...s, id: s.id })),
          ...(data.rejected?.data || []).map((s: any) => ({ ...s, id: s.id })),
        ];

        setServices(allServices);
      } catch (err) {
        console.error("Failed to fetch services:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Filter by current tab
  const tabServices = services.filter((s) => {
    const map: Record<ServiceStatus, string> = {
      Pending: "PENDING",
      Approved: "APPROVED",
      Rejected: "REJECTED",
    };
    return s.status === map[activeTab];
  });

  // Pagination logic
  const totalItems = tabServices.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedServices = tabServices.slice(startIndex, endIndex);

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    const currentPageIds = paginatedServices.map((s) => s.id);
    const allSelected = currentPageIds.every((id) => selectedServices.includes(id));

    if (allSelected) {
      setSelectedServices((prev) =>
        prev.filter((id) => !currentPageIds.includes(id))
      );
    } else {
      setSelectedServices((prev) => [
        ...prev.filter((id) => !currentPageIds.includes(id)),
        ...currentPageIds,
      ]);
    }
  };

  const handleSingleApprove = async (service: Service) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(
        `https://one-universe-de5673cf0d65.herokuapp.com/api/v1/master-services/${service.id}/approve`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setServices((prev) =>
        prev.map((s) =>
          s.id === service.id ? { ...s, status: "APPROVED" } : s
        )
      );
    } catch (err) {
      console.error("Approval failed", err);
    }
  };

  const handleBulkApprove = async () => {
    const token = localStorage.getItem("token");
    try {
      await fetch(
        "https://one-universe-de5673cf0d65.herokuapp.com/api/v1/master-services/bulk-approve",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ids: selectedServices }),
        }
      );
      setServices((prev) =>
        prev.map((s) =>
          selectedServices.includes(s.id)
            ? { ...s, status: "APPROVED" }
            : s
        )
      );
      setSelectedServices([]);
    } catch (err) {
      console.error("Bulk approval failed", err);
    }
  };

  const handleBulkReject = () => {
    alert("Bulk reject with reason modal coming soon!");
    setSelectedServices([]);
  };

  const getServiceCount = (status: ServiceStatus): number => {
    const map: Record<ServiceStatus, string> = {
      Pending: "PENDING",
      Approved: "APPROVED",
      Rejected: "REJECTED",
    };
    return services.filter((s) => s.status === map[status]).length;
  };

  const stats = [
    {
      label: "Pending Requests",
      color: "bg-gradient-to-br from-purple-500 to-blue-600",
      total: getServiceCount("Pending"),
      growth: 12,
    },
    {
      label: "Approved Today",
      color: "bg-[#67A344]",
      total: getServiceCount("Approved"),
      growth: 8,
    },
    {
      label: "Total Services",
      color: "bg-[#3621EE]",
      total: services.length,
      growth: 5,
    },
  ];

  const hasSelection = selectedServices.length > 0;

  return (
    <div className="w-full bg-gray-50 min-h-screen p-4 md:p-6">
      {/* Stats Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map(({ label, color, total, growth }) => (
          <div
            key={label}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`${color} w-10 h-10 rounded-lg flex items-center justify-center`}
              >
                <div className="w-5 h-5 bg-white/80 rounded"></div>
              </div>
              <h3 className="text-gray-700 font-medium">{label}</h3>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-3">
              {total.toLocaleString()}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MoveUp size={16} className="text-green-600" />
              <span className="text-green-600 font-medium">+{growth}%</span>
              <span className="text-gray-500">from last month</span>
            </div>
          </div>
        ))}
      </section>

      {/* Main Panel */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Service Requests
          </h2>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 -mx-8 px-8 mb-8 overflow-x-auto">
            {(["Pending", "Approved", "Rejected"] as ServiceStatus[]).map(
              (tab) => {
                const count = getServiceCount(tab);
                const isActive = activeTab === tab;

                return (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setSelectedServices([]);
                      setCurrentPage(1); // Reset to page 1 on tab change
                    }}
                    className={`px-6 py-4 text-sm font-medium transition-colors relative whitespace-nowrap ${
                      isActive
                        ? "text-gray-900"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab} Requests ({count})
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#154751] to-[#04171F] rounded-t-md" />
                    )}
                  </button>
                );
              }
            )}
          </div>

          {/* Controls */}
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search by name, email, service, or phone..."
                  className="w-full h-12 pl-12 pr-6 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-[#154751] focus:ring-4 focus:ring-[#154751]/10 transition"
                />
              </div>

              <DateRangePicker />
            </div>

            {hasSelection && (
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={handleBulkApprove}
                  className="flex items-center gap-2 h-[38px] px-6 rounded-[20px] text-white font-medium text-sm shadow-md hover:shadow-lg transition-all"
                  style={{
                    background:
                      "radial-gradient(50% 50% at 50% 50%, #154751 37%, #04171F 100%)",
                  }}
                >
                  <Check size={16} />
                  Approve Selected ({selectedServices.length})
                </button>

                <button
                  onClick={handleBulkReject}
                  className="flex items-center gap-2 h-[38px] px-6 rounded-[20px] bg-[#D84040] text-white font-medium text-sm shadow-md hover:bg-[#c73838] transition-all"
                >
                  <X size={16} />
                  Reject Selected ({selectedServices.length})
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Table + Pagination */}
        <div>
          {paginatedServices.length === 0 ? (
            <div className="py-20">
              {activeTab === "Pending" && <EmptyPendingService />}
              {activeTab === "Approved" && <EmptyApprovedService />}
              {activeTab === "Rejected" && <EmptyRejectedService />}
            </div>
          ) : (
            <>
              {activeTab === "Pending" && (
                <PendingTable
                  services={paginatedServices}
                  selectedServices={selectedServices}
                  onToggleService={toggleService}
                  onToggleAll={toggleAll}
                  onApprove={handleSingleApprove}
                />
              )}
              {activeTab === "Approved" && (
                <ApprovedTable
                  services={paginatedServices}
                  selectedServices={selectedServices}
                  onToggleService={toggleService}
                  onToggleAll={toggleAll}
                />
              )}
              {activeTab === "Rejected" && (
                <RejectedTable
                  services={paginatedServices}
                  selectedServices={selectedServices}
                  onToggleService={toggleService}
                  onToggleAll={toggleAll}
                />
              )}
            </>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              isLoading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
}