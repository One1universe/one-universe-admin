"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { FaCheck, FaUserCircle } from "react-icons/fa";
import UserManagementStatusBadge from "../../UserManagementStatusBadge";
import { X } from "lucide-react";
import { userManagementStore, UserType } from "@/store/userManagementStore";
import { formatDate, getRandomDate } from "@/utils/formatTime";

const users: UserType[] = [
  {
    name: "Chuka Nwosu",
    email: "bill.sandra@gmail.com",
    phone: "+2348484884848",
    status: "Active",
    createdAt: getRandomDate(new Date(2025, 0, 1), new Date(2025, 9, 30)),
    updatedAt: getRandomDate(new Date(2025, 0, 1), new Date(2025, 9, 30)),
    avatar: "/avatars/avatar1.png",
    isVerified: true,
  },
  {
    name: "Chuka Nwosu",
    email: "bill.sandra@gmail.com",
    phone: "+2348484884848",
    status: "Inactive",
    createdAt: getRandomDate(new Date(2025, 0, 1), new Date(2025, 9, 30)),
    updatedAt: getRandomDate(new Date(2025, 0, 1), new Date(2025, 9, 30)),
    avatar: "/avatars/avatar1.png",
    isVerified: false,
  },
  {
    name: "Chuka Nwosu",
    email: "bill.sandra@gmail.com",
    phone: "+2348484884848",
    status: "Active",
    createdAt: getRandomDate(new Date(2025, 0, 1), new Date(2025, 9, 30)),
    updatedAt: getRandomDate(new Date(2025, 0, 1), new Date(2025, 9, 30)),
    avatar: "/avatars/avatar1.png",
    isVerified: true,
  },
  {
    name: "Chuka Nwosu",
    email: "bill.sandra@gmail.com",
    phone: "+2348484884848",
    status: "Pending",
    createdAt: getRandomDate(new Date(2025, 0, 1), new Date(2025, 9, 30)),
    updatedAt: getRandomDate(new Date(2025, 0, 1), new Date(2025, 9, 30)),
    avatar: "/avatars/avatar1.png",
    isVerified: false,
  },
  {
    name: "Chuka Nwosu",
    email: "bill.sandra@gmail.com",
    phone: "+2348484884848",
    status: "Pending",
    createdAt: getRandomDate(new Date(2025, 0, 1), new Date(2025, 9, 30)),
    updatedAt: getRandomDate(new Date(2025, 0, 1), new Date(2025, 9, 30)),
    avatar: "/avatars/avatar1.png",
    isVerified: false,
  },
  {
    name: "Chuka Nwosu",
    email: "bill.sandra@gmail.com",
    phone: "+2348484884848",
    status: "Active",
    createdAt: getRandomDate(new Date(2025, 0, 1), new Date(2025, 9, 30)),
    updatedAt: getRandomDate(new Date(2025, 0, 1), new Date(2025, 9, 30)),
    avatar: "/avatars/avatar1.png",
    isVerified: true,
  },
];

const SellersTable = () => {
  const { openModal } = userManagementStore();
  const handleSelectUser = (user: UserType) => {
    console.log("Selected User:", user);
    openModal("openSeller", user);
  };
  return (
    <div className="w-full">
      {/* Desktop Table */}
      <div className="hidden md:block  overflow-hidden ">
        <table className="w-full text-sm">
          <thead className="bg-[#FFFCFC] text-[#646264] text-left  border-b border-[#E5E5E5] h-[60px]">
            <tr>
              <th className="py-3 px-4 font-medium">
                <div className="flex items-center gap-2">
                  <FaUserCircle size={18} />

                  <p className="">Full Name</p>
                </div>
              </th>
              <th className="py-3 px-4 font-medium">Email Address</th>
              <th className="py-3 px-4 font-medium">Phone Number</th>
              <th className="py-3 px-4 font-medium">Account Status</th>
              <th className="py-3 px-4 font-medium">Registration Date</th>
              <th className="py-3 px-4 font-medium">Time</th>
            </tr>
          </thead>
          <tbody className="text-[#303237]">
            {users.map((user, i) => (
              <tr
                key={i}
                className={cn(
                  "border-t border-gray-100 hover:bg-gray-50 transition h-[60px]"
                )}
                onClick={() => handleSelectUser(user)}
              >
                <td className="py-3 px-4  gap-3">
                  <div className="flex items-center gap-2">
                    <div className="relative size-6 rounded-full overflow-hidden">
                      <Image
                        src="/images/user.png"
                        alt={user.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="font-medium text-gray-900 hover:underline cursor-pointer">
                      {user.name}
                    </p>
                    {user.isVerified ? (
                      <div className="bg-[#1FC16B] size-[17px] rounded-full flex items-center justify-center">
                        <FaCheck className="text-white" size={12} />
                      </div>
                    ) : (
                      <div className="bg-[#D00416] size-[17px] rounded-full flex items-center justify-center">
                        <X className="text-white" size={12} />
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-[#303237]">{user.email}</td>
                <td className="py-3 px-4 text-[#454345]">{user.phone}</td>
                <td className="py-3 px-4">
                  <UserManagementStatusBadge status={user.status} />
                </td>
                <td className="py-3 px-4 text-[#303237]">
                  {formatDate(user.createdAt as Date).date}
                </td>
                <td className="py-3 px-4 text-[#303237]">
                  {formatDate(user.createdAt as Date).time}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="grid gap-4 md:hidden">
        {users.map((user, i) => (
          <div
            key={i}
            className="flex items-center justify-between border border-gray-200 rounded-2xl p-4 bg-white shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src="/images/user.png"
                  alt={user.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">
                  {formatDate(user.createdAt as Date).date}
                </p>
              </div>
            </div>

            <UserManagementStatusBadge status={user.status} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellersTable;

const SellerVerificationToolTip = () => {
  return (
    <section className="">
      <div className=""></div>
    </section>
  );
};
