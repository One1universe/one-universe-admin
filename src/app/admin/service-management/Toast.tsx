import React, { useEffect } from "react";
import { Check, AlertCircle, X } from "lucide-react";

interface ToastProps {
  type: "success" | "error";
  message: string;
  onClose: () => void;
}

export default function Toast({ type, message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === "success" ? "bg-green-50" : "bg-red-50";
  const borderColor = type === "success" ? "border-green-200" : "border-red-200";
  const icon = type === "success" ? (
    <Check className="w-5 h-5 text-green-600" />
  ) : (
    <AlertCircle className="w-5 h-5 text-red-600" />
  );
  const textColor = type === "success" ? "text-green-800" : "text-red-800";

  return (
    <div
      className={`${bgColor} ${borderColor} border rounded-lg shadow-lg p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300`}
    >
      <div className="flex-shrink-0">{icon}</div>
      <p className={`${textColor} text-sm font-medium flex-1`}>{message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition"
      >
        <X size={16} />
      </button>
    </div>
  );
}