"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Clock, XCircle } from "lucide-react";
import axios from "axios";
import getBaseUrl from "@/services/baseUrl";
import { useSession } from "next-auth/react";

interface DisputeHistory {
  id: string;
  raisedBy: {
    name: string;
    role: "BUYER" | "SELLER";
  };
  against: {
    name: string;
    role: "BUYER" | "SELLER";
  };
  status: "RESOLVED" | "PENDING" | "ESCALATED";
  time: string;
  date: string;
  description?: string;
}

interface BookingHistory {
  id: string;
  clientName: string;
  serviceName: string;
  status: "ACTIVE" | "COMPLETED" | "CANCELLED" | "DISPUTE";
  time: string;
  date: string;
}

interface UserHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
}

const UserHistoryModal = ({ isOpen, onClose, userId, userName }: UserHistoryModalProps) => {
  const { data: session } = useSession();
  const [disputes, setDisputes] = useState<DisputeHistory[]>([]);
  const [bookings, setBookings] = useState<BookingHistory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      fetchHistory();
    }
  }, [isOpen, userId]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const BASE = getBaseUrl();
      const token = (session as any)?.accessToken || (session as any)?.user?.accessToken;

      // Fetch disputes
      const disputesRes = await axios.get(`${BASE}/admin/users/${userId}/disputes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDisputes(disputesRes.data.disputes || []);

      // Fetch bookings
      const bookingsRes = await axios.get(`${BASE}/admin/users/${userId}/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(bookingsRes.data.bookings || []);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      RESOLVED: { bg: "bg-[#E0F5E6]", text: "text-[#1FC16B]", icon: CheckCircle, label: "Resolved" },
      PENDING: { bg: "bg-[#FFF9E6]", text: "text-[#9D7F04]", icon: Clock, label: "Pending" },
      ESCALATED: { bg: "bg-[#FFE6E6]", text: "text-[#D00416]", icon: AlertCircle, label: "Escalated" },
      ACTIVE: { bg: "bg-[#E6F2FF]", text: "text-[#007BFF]", icon: CheckCircle, label: "Active" },
      COMPLETED: { bg: "bg-[#E0F5E6]", text: "text-[#1FC16B]", icon: CheckCircle, label: "Completed" },
      CANCELLED: { bg: "bg-[#FFF9E6]", text: "text-[#9D7F04]", icon: XCircle, label: "Cancelled" },
      DISPUTE: { bg: "bg-[#FFE6E6]", text: "text-[#D00416]", icon: AlertCircle, label: "Dispute" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg ${config.bg} ${config.text} text-sm font-medium`}>
        <Icon size={14} />
        {config.label}
      </span>
    );
  };

  const groupByDate = (items: any[]) => {
    const grouped: { [key: string]: any[] } = {};
    
    items.forEach(item => {
      const date = item.date || "Unknown";
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(item);
    });

    return grouped;
  };

  const disputesByDate = groupByDate(disputes);
  const bookingsByDate = groupByDate(bookings);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-[95%] max-w-[1027px] max-h-[90vh] overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-[#E8FBF7] px-8 py-6 border-b border-[#E8E3E3] flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#171417]">
                Dispute & Booking History
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-black transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#171417]"></div>
                </div>
              ) : (
                <div className="flex flex-col lg:flex-row gap-4 p-6">
                  {/* Dispute History Section */}
                  <div className="flex-1 px-8 space-y-3">
                    <h3 className="text-base font-medium text-[#171417] mb-4">
                      Dispute History
                    </h3>

                    {disputes.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 space-y-2">
                        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                          <AlertCircle size={32} className="text-gray-400" />
                        </div>
                        <p className="text-sm text-[#454345] text-center">
                          No Disputes Involving This User
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {Object.entries(disputesByDate).map(([date, items]) => (
                          <div key={date} className="space-y-2">
                            <p className="text-base font-medium text-[#454345]">{date}</p>
                            
                            {items.map((dispute) => (
                              <div key={dispute.id} className="space-y-3">
                                <div className="space-y-3">
                                  {/* Dispute Info */}
                                  <div className="flex items-start gap-3 text-sm">
                                    <span className="text-[#454345]">Raised by</span>
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="font-medium text-[#171417]">
                                        {dispute.raisedBy.name}
                                      </span>
                                      <span className="text-[#171417]">
                                        {dispute.raisedBy.role.charAt(0) + dispute.raisedBy.role.slice(1).toLowerCase()}
                                      </span>
                                      <span className="text-[#454345]">To</span>
                                      <span className="font-medium text-[#454345]">
                                        {dispute.against.name}
                                      </span>
                                      <span className="text-[#171417]">
                                        {dispute.against.role.charAt(0) + dispute.against.role.slice(1).toLowerCase()}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Time and Status */}
                                  <div className="flex items-center gap-3">
                                    <span className="text-sm text-[#646264]">{dispute.time}</span>
                                    {getStatusBadge(dispute.status)}
                                  </div>
                                </div>

                                <div className="border-b border-[#B7B6B7]"></div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Vertical Divider */}
                  <div className="hidden lg:block w-px bg-[#B7B6B7]"></div>

                  {/* Booking History Section */}
                  <div className="flex-1 px-8 space-y-3">
                    <h3 className="text-base font-medium text-[#171417] mb-4">
                      Booking History
                    </h3>

                    {bookings.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 space-y-2">
                        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                          <Clock size={32} className="text-gray-400" />
                        </div>
                        <p className="text-sm text-[#454345] text-center">
                          This user haven&apos;t handled any bookings yet.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {Object.entries(bookingsByDate).map(([date, items]) => (
                          <div key={date} className="space-y-2">
                            <p className="text-base font-medium text-[#454345]">{date}</p>
                            
                            {items.map((booking) => (
                              <div key={booking.id} className="space-y-2">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1">
                                    <p className="font-medium text-[#171417] text-base">
                                      {booking.clientName}
                                    </p>
                                    <p className="text-[#646264]">{booking.serviceName}</p>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="text-sm text-[#646264]">{booking.time}</span>
                                    {getStatusBadge(booking.status)}
                                  </div>
                                </div>
                                <div className="border-b border-[#B7B6B7]"></div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-[#E8E3E3] px-8 py-4 bg-gray-50">
              <button
                onClick={onClose}
                className="w-full bg-[#171417] text-white py-2.5 rounded-lg font-medium hover:bg-[#171417]/90 transition"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserHistoryModal;