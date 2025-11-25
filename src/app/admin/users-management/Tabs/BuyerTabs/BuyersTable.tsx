/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";
import UserManagementStatusBadge from "../../UserManagementStatusBadge";
import { userManagementStore, UserType } from "@/store/userManagementStore";
import { formatDate } from "@/utils/formatTime";

interface BuyersTableProps {
  currentPage: number;
  onTotalPagesChange: (totalPages: number) => void;
}

interface ApiResponse {
  data: UserType[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export default function BuyersTable({ currentPage, onTotalPagesChange }: BuyersTableProps) {
  const { openModal } = userManagementStore();
  const { data: session, status } = useSession();

  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSelectUser = (user: UserType) => {
    openModal("openBuyer", user);
  };

  // ←←← THIS IS THE KEY FIX
  const stableCallback = useCallback(onTotalPagesChange, []); // never changes

  useEffect(() => {
    if (status === "loading" || !session?.accessToken) return;

    const fetchBuyers = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get<ApiResponse>(
          `https://one-universe-de5673cf0d65.herokuapp.com/api/v1/admin/buyers?page=${currentPage}&limit=10`,
          {
            headers: { Authorization: `Bearer ${session.accessToken}` },
          }
        );

        setUsers(response.data.data);

        // Only update total pages when it actually changes
        if (response.data.pagination.pages !== undefined) {
          stableCallback(response.data.pagination.pages);
        }
      } catch (err: any) {
        console.error(err);
        setError("Failed to load buyers.");
      } finally {
        setLoading(false);
      }
    };

    fetchBuyers();
  }, [currentPage, session?.accessToken, status, stableCallback]);
  //                                     ^^^^^^^^^^^^^^^^ stable dependency

  if (loading || status === "loading") {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <p className="text-gray-500">Loading buyers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full text-center py-12 text-red-500">
        {error}
        <button onClick={() => window.location.reload()} className="ml-4 text-blue-500 underline">
          Retry
        </button>
      </div>
    );
  }

  if (users.length === 0) {
    return <div className="w-full text-center py-12 text-gray-500">No buyers found.</div>;
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#FFFCFC] text-[#646264] text-left border-b border-[#E5E5E5] h-[60px]">
            <tr>
              <th className="py-3 px-4 font-medium flex items-center gap-2">
                <FaUserCircle size={18} />
                Full Name
              </th>
              <th className="py-3 px-4 font-medium">Email Address</th>
              <th className="py-3 px-4 font-medium">Phone Number</th>
              <th className="py-3 px-4 font-medium">Account Status</th>
              <th className="py-3 px-4 font-medium">Registration Date</th>
              <th className="py-3 px-4 font-medium">Time</th>
            </tr>
          </thead>
          <tbody className="text-[#303237]">
            {users.map((item) => (
              <tr
                key={item.id}
                className="border-t border-gray-100 hover:bg-gray-50 transition h-[60px] cursor-pointer"
                onClick={() => handleSelectUser(item)}
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="relative size-6 rounded-full overflow-hidden bg-gray-200">
                      {item.profilePicture ? (
                        <img
                          src={item.profilePicture}
                          alt={item.fullName}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FaUserCircle className="text-gray-400" size={24} />
                        </div>
                      )}
                    </div>
                    <p className="font-medium text-gray-900">{item.fullName}</p>
                  </div>
                </td>
                <td className="py-3 px-4">{item.email}</td>
                <td className="py-3 px-4">{item.phone}</td>
                <td className="py-3 px-4">
                  <UserManagementStatusBadge status={item.status} />
                </td>
                <td className="py-3 px-4">
                  {item.createdAt ? formatDate(new Date(item.createdAt)).date : "N/A"}
                </td>
                <td className="py-3 px-4">
                  {item.createdAt ? formatDate(new Date(item.createdAt)).time : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="grid gap-4 md:hidden px-4 py-6">
        {users.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border border-gray-200 rounded-2xl p-4 bg-white shadow-sm cursor-pointer"
            onClick={() => handleSelectUser(item)}
          >
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                {item.profilePicture ? (
                  <img
                    src={item.profilePicture}
                    alt={item.fullName}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <FaUserCircle className="text-gray-400" size={40} />
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{item.fullName}</p>
                <p className="text-sm text-gray-500">
                  {item.createdAt ? formatDate(new Date(item.createdAt)).date : "N/A"}
                </p>
              </div>
            </div>
            <UserManagementStatusBadge status={item.status} />
          </div>
        ))}
      </div>
    </>
  );
}