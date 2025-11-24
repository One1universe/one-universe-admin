/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import UserManagementStatusBadge from "../../UserManagementStatusBadge";
import { formatDate, getRandomDate } from "@/utils/formatTime";
import { FaUserCircle } from "react-icons/fa";
import { userManagementStore, UserType } from "@/store/userManagementStore";
import { cn } from "@/lib/utils";
import { EllipsisVertical } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

const API_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjNmQwODkzYS03NTFiLTQ3NjQtYjU5MC05Y2UyMDk4Y2JhMjUiLCJlbWFpbCI6ImluZm9Ab25ldW5pdmVyc2UubmciLCJyb2xlcyI6WyJTVVBFUl9BRE1JTiJdLCJpYXQiOjE3NjMwNDMwMjksImV4cCI6MTc2MzA0MzkyOX0.QzTNlJwyv5PVR7AaTOsdT121vtmvR8fkIYOvx3bjzo8";

// const users: UserType[] = [
//   {
//     name: "Chuka Nwosu",
//     email: "bill.sandra@gmail.com",
//     phone: "+2348484884848",
//     location: "Ikeja, Lagos",
//     status: "Active",
//     role: "Super Admin",
//     createdAt: getRandomDate(new Date(2025, 0, 1), new Date(2025, 9, 30)),
//     updatedAt: getRandomDate(new Date(2025, 0, 1), new Date(2025, 9, 30)),
//     avatar: "/avatars/avatar1.png",
//   },
//   {
//     name: "Chuka Nwosu",
//     email: "bill.sandra@gmail.com",
//     phone: "+2348484884848",
//     status: "Inactive",
//     location: "Uyo, Akwa Ibom",
//     role: "Admin",
//     createdAt: getRandomDate(new Date(2025, 0, 1), new Date(2025, 9, 30)),
//     updatedAt: getRandomDate(new Date(2025, 0, 1), new Date(2025, 9, 30)),
//     avatar: "/avatars/avatar1.png",
//   },
//   {
//     name: "Chuka Nwosu",
//     email: "bill.sandra@gmail.com",
//     phone: "+2348484884848",
//     status: "Active",
//     location: "Ikeja, Lagos",
//     role: "User Manager",
//     createdAt: getRandomDate(new Date(2025, 0, 1), new Date(2025, 9, 30)),
//     updatedAt: getRandomDate(new Date(2025, 0, 1), new Date(2025, 9, 30)),
//     avatar: "/avatars/avatar1.png",
//   },
//   {
//     name: "Chuka Nwosu",
//     email: "bill.sandra@gmail.com",
//     phone: "+2348484884848",
//     status: "Active",
//     role: "Booking Manager",
//     location: "Abuja, FCT",
//     createdAt: getRandomDate(new Date(2025, 0, 1), new Date(2025, 9, 30)),
//     updatedAt: getRandomDate(new Date(2025, 0, 1), new Date(2025, 9, 30)),
//     avatar: "/avatars/avatar1.png",
//   },
//   {
//     name: "Chuka Nwosu",
//     email: "bill.sandra@gmail.com",
//     phone: "+2348484884848",
//     status: "Inactive",
//     location: "Uyo, Akwa Ibom",
//     role: "Admin",
//     createdAt: getRandomDate(new Date(2025, 0, 1), new Date(2025, 9, 30)),
//     updatedAt: getRandomDate(new Date(2025, 0, 1), new Date(2025, 9, 30)),
//     avatar: "/avatars/avatar1.png",
//   },
//   {
//     name: "Chuka Nwosu",
//     email: "bill.sandra@gmail.com",
//     phone: "+2348484884848",
//     status: "Active",
//     location: "Calabar, Cross River",
//     role: "User Manager",
//     createdAt: getRandomDate(new Date(2025, 0, 1), new Date(2025, 9, 30)),
//     updatedAt: getRandomDate(new Date(2025, 0, 1), new Date(2025, 9, 30)),
//     avatar: "/avatars/avatar1.png",
//   },
// ];

const AdminTable = () => {
  const { openModal } = userManagementStore();

  const handleSelectUser = (user: UserType) => {
    console.log("Selected User:", user);
    openModal("openAdmin", user);
  };
  const [user, setUser] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          "https://one-universe-de5673cf0d65.herokuapp.com/api/v1/admin/others",
          {
            headers: {
              Authorization: `Bearer ${API_TOKEN}`,
            },
          }
        );
        console.log("Fetched Users:", response.data.data);
        setUser(response.data.data);
      } catch (error: any) {
        console.error("Error fetching users:", error);
        if (error.response?.status === 401) {
          setError(
            "Authentication failed. Please login again or refresh your token."
          );
        } else {
          setError("Failed to fetch users. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-8">
        <p className="text-gray-500">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex items-center justify-center py-8">
        <div className="text-center">
          <p className="text-red-500 mb-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-blue-500 hover:underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
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
              <th className="py-3 px-4 font-medium">Dated Created</th>
              <th className="py-3 px-4 font-medium">Role</th>
              <th className="py-3 px-4 font-medium">Status</th>
              <th className="py-3 px-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="text-[#303237]">
            {user.map((item) => (
              <tr
                key={item.id}
                className={cn(
                  "border-t border-gray-100 hover:bg-gray-50 transition h-[60px]"
                )}
                onClick={() => handleSelectUser(item)}
              >
                <td className="py-3 px-4  gap-3">
                  <div className="flex items-center gap-2">
                    <div className="relative size-6 rounded-full overflow-hidden">
                      <Image
                        src="/images/user.png"
                        alt={item.fullName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="font-medium text-gray-900 hover:underline cursor-pointer">
                      {item.fullName}
                    </p>
                  </div>
                </td>
                <td className="py-3 px-4 text-[#303237]">{item.email}</td>
                <td className="py-3 px-4 text-[#454345]">
                  {item.createdAt
                    ? formatDate(new Date(item.createdAt)).date
                    : "N/A"}
                </td>
                <td className="py-3 px-4">{item.role}</td>
                <td className="py-3 px-4 text-[#303237]">
                  <UserManagementStatusBadge status={item.status} />
                </td>
                <td className="py-3 px-4 text-[#303237]">
                  <EllipsisVertical />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="grid gap-4 md:hidden">
        {user.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border border-gray-200 rounded-2xl p-4 bg-white shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src="/images/user.png"
                  alt={item.fullName}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{item.fullName}</p>
                <p className="text-sm text-gray-500">
                  {item.createdAt
                    ? formatDate(new Date(item.createdAt)).date
                    : "N/A"}
                </p>
              </div>
            </div>

            <UserManagementStatusBadge status={item.status} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTable;
