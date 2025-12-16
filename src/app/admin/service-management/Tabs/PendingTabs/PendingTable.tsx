import React, { useState } from "react";
import { Check, X, ChevronDown } from "lucide-react";
import { Service } from "@/services/serviceManagement";

interface PendingTableProps {
  services: Service[];
  selectedServices: string[];
  onToggleService: (id: string) => void;
  onToggleAll: () => void;
  onApprove: (service: Service) => void;
  onReject?: (serviceIds: string[]) => void;
}

export default function PendingTable({
  services,
  selectedServices,
  onToggleService,
  onToggleAll,
  onApprove,
  onReject,
}: PendingTableProps) {
  const [expandedService, setExpandedService] = useState<string | null>(null);

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name: string): string => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-orange-500",
      "bg-pink-500",
      "bg-indigo-500",
    ];
    return colors[name.length % colors.length];
  };

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-4 px-6 w-12">
                <input
                  type="checkbox"
                  checked={
                    selectedServices.length === services.length &&
                    services.length > 0
                  }
                  onChange={onToggleAll}
                  className="w-5 h-5 rounded border-gray-300 cursor-pointer"
                />
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">
                Seller
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">
                Pending Service
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">
                Submitted On
              </th>
              <th className="text-center py-4 px-6 text-sm font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {services.map((service: Service) => {
              const sellerUser = service.sellerProfiles[0]?.user;
              const displayName = sellerUser?.fullName || "Unknown Seller";
              const email = sellerUser?.email || "";
              const phone = sellerUser?.phone || "";

              return (
                <tr
                  key={service.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-6">
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(service.id)}
                      onChange={() => onToggleService(service.id)}
                      className="w-5 h-5 rounded border-gray-300 cursor-pointer"
                    />
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full ${getAvatarColor(
                          displayName
                        )} flex items-center justify-center text-white text-sm font-medium`}
                      >
                        {getInitials(displayName)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {displayName}
                        </div>
                        {(email || phone) && (
                          <div className="text-xs text-gray-500 mt-0.5">
                            {email || phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">
                    {service.title}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">
                    {new Date(service.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onApprove(service)}
                        className="flex items-center gap-2 h-[38px] px-6 rounded-[20px] text-white font-medium text-sm shadow-md hover:shadow-lg transition-all"
                        style={{
                          background:
                            "radial-gradient(50% 50% at 50% 50%, #154751 37%, #04171F 100%)",
                        }}
                      >
                        <Check size={16} />
                        Approve
                      </button>
                      <button
                        onClick={() => onReject?.([service.id])}
                        className="flex items-center gap-2 h-[38px] px-6 rounded-[20px] bg-[#D84040] text-white font-medium text-sm shadow-md hover:bg-[#c73838] transition-all"
                      >
                        <X size={16} />
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile List */}
      <div className="md:hidden p-4 space-y-3">
        {services.map((service: Service) => {
          const sellerUser = service.sellerProfiles[0]?.user;
          const displayName = sellerUser?.fullName || "Unknown Seller";
          const email = sellerUser?.email || "";
          const phone = sellerUser?.phone || "";

          const isExpanded = expandedService === service.id;

          return (
            <div
              key={service.id}
              className={`border rounded-lg transition-all ${
                isExpanded ? "border-gray-300 shadow-sm" : "border-gray-200"
              }`}
            >
              <div
                className="flex items-center gap-3 p-4 cursor-pointer"
                onClick={() =>
                  setExpandedService(isExpanded ? null : service.id)
                }
              >
                <div
                  className={`w-10 h-10 rounded-full ${getAvatarColor(
                    displayName
                  )} flex items-center justify-center text-white text-sm font-medium flex-shrink-0`}
                >
                  {getInitials(displayName)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {displayName}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">
                    {service.title}
                  </p>
                  {(email || phone) && (
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {email || phone}
                    </p>
                  )}
                </div>
                <ChevronDown
                  size={20}
                  className={`text-gray-400 transition-transform flex-shrink-0 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </div>

              {isExpanded && (
                <div className="px-4 pb-4 space-y-3 border-t border-gray-100">
                  <p className="text-sm text-gray-700">
                    <strong>Submitted on:</strong>{" "}
                    {new Date(service.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  {email && (
                    <p className="text-sm text-gray-700">
                      <strong>Email:</strong> {email}
                    </p>
                  )}
                  {phone && (
                    <p className="text-sm text-gray-700">
                      <strong>Phone:</strong> {phone}
                    </p>
                  )}

                  {/* Mobile Action Buttons - Matching bulk button styles */}
                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => onApprove(service)}
                      className="flex-1 flex items-center justify-center gap-2 h-[38px] rounded-[20px] text-white font-medium text-sm shadow-md hover:shadow-lg transition-all"
                      style={{
                        background:
                          "radial-gradient(50% 50% at 50% 50%, #154751 37%, #04171F 100%)",
                      }}
                    >
                      <Check size={16} />
                      Approve
                    </button>
                    <button
                      onClick={() => onReject?.([service.id])}
                      className="flex-1 flex items-center justify-center gap-2 h-[38px] rounded-[20px] bg-[#D84040] text-white font-medium text-sm shadow-md hover:bg-[#c73838] transition-all"
                    >
                      <X size={16} />
                      Reject
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}