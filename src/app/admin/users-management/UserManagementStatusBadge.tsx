import { cn } from "@/lib/utils";
import { AlertTriangle, CircleCheck, Flag } from "lucide-react";
import { FiClock } from "react-icons/fi";

export type UserManagementStatusBadgeProp = {
  status:
    | "Inactive"
    | "Active"
    | "Pending"
    | "Verified"
    | "Unverified"
    | "Deactivated";
};

const statusConfig: Record<
  UserManagementStatusBadgeProp["status"],
  {
    icon: React.ReactNode;
    textClass: string;
    bgClass: string;
  }
> = {
  Active: {
    icon: <CircleCheck size={16} className="text-[#1FC16B]" />,
    bgClass: "bg-[#E0F5E6]",
    textClass: "text-[#1FC16B]",
  },
  Inactive: {
    icon: <Flag size={16} className="text-[#D00416]" />,
    bgClass: "bg-[#FB37481A]",
    textClass: "text-[#D00416]",
  },
  Deactivated: {
    icon: <Flag size={16} className="text-[#D00416]" />,
    bgClass: "bg-[#FB37481A]",
    textClass: "text-[#D00416]",
  },

  Verified: {
    icon: <CircleCheck size={16} className="text-[#1FC16B]" />,
    bgClass: "bg-[#E0F5E6]",
    textClass: "text-[#1FC16B]",
  },
  Unverified: {
    icon: <AlertTriangle size={16} className="text-[#9D7F04]" />,
    bgClass: "bg-[#FFF2B9]",
    textClass: "text-[#9D7F04]",
  },

  Pending: {
    icon: <FiClock size={16} className="text-[#272727]" />,
    bgClass: "bg-[#E5E5E5]",
    textClass: "text-[#272727]",
  },
};

const UserManagementStatusBadge = ({ status }: UserManagementStatusBadgeProp) => {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[.875rem] font-normal",
        config.bgClass,
        config.textClass
      )}
    >
      {config.icon}
      {status}
    </span>
  );
};

export default UserManagementStatusBadge;
