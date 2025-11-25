"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { userManagementStore } from "@/store/userManagementStore";
import UserManagementStatusBadge from "../../UserManagementStatusBadge";
import axios from "axios";
import { useSession } from "next-auth/react";
import {
  SendWarningModal,
  ReactivateModal,
  DeactivateModal,
} from "@/app/admin/users-management/components/modals/UserActionModals";

const AdminDetails = () => {
  const { modalType, selectedUser, closeModal } = userManagementStore();
  const { data: session } = useSession();

  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showReactivateModal, setShowReactivateModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  const [loadingDeactivate, setLoadingDeactivate] = useState(false);
  const [loadingReactivate, setLoadingReactivate] = useState(false);
  const [loadingWarning, setLoadingWarning] = useState(false);

  const isActive = selectedUser?.status === "ACTIVE";

  const handleSendWarning = async () => {
    if (!warningMessage.trim()) return;
    setLoadingWarning(true);
    try {
      await axios.post(
        `/api/admin/users/${selectedUser?.id}/warning`,
        { message: warningMessage },
        { headers: { Authorization: `Bearer ${session?.accessToken}` } }
      );
      setShowWarningModal(false);
      setWarningMessage("");
    } catch (err) {
      console.error("Warning failed", err);
    } finally {
      setLoadingWarning(false);
    }
  };

  const handleConfirmReactivate = async () => {
    setLoadingReactivate(true);
    try {
      await axios.patch(
        `/api/admin/users/${selectedUser?.id}/reactivate`,
        {},
        { headers: { Authorization: `Bearer ${session?.accessToken}` } }
      );
      setShowReactivateModal(false);
      closeModal();
    } catch (err) {
      console.error("Reactivate failed", err);
    } finally {
      setLoadingReactivate(false);
    }
  };

  const handleConfirmDeactivate = async () => {
    setLoadingDeactivate(true);
    try {
      await axios.patch(
        `/api/admin/users/${selectedUser?.id}/deactivate`,
        {},
        { headers: { Authorization: `Bearer ${session?.accessToken}` } }
      );
      setShowDeactivateModal(false);
      closeModal();
    } catch (err) {
      console.error("Deactivate failed", err);
    } finally {
      setLoadingDeactivate(false);
    }
  };

  return (
    <AnimatePresence>
      {modalType === "openAdmin" && selectedUser && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* MAIN ADMIN DETAILS MODAL */}
          <motion.div
            className="shadow-lg w-full md:w-[65%] bg-white md:rounded-2xl"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 120 }}
          >
            {/* Header */}
            <div className="flex rounded-t-2xl items-center justify-between bg-[#E8FBF7] pt-8 px-4 py-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-black"
                >
                  <X size={18} />
                </button>
                <h2 className="text-xl font-bold text-[#171417]">
                  Admin Profile
                </h2>
              </div>
              <button className="bg-gradient-to-r from-teal-600 to-cyan-700 py-1.5 px-6 text-white rounded-[36px] font-medium text-sm">
                View History
              </button>
            </div>

            {/* Body */}
            <div className="p-8 space-y-6">
              <div className="space-y-5">
                <div className="flex justify-between">
                  <strong>Name</strong>
                  <span>
                    {selectedUser.fullName}{" "}
                    <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded text-xs">
                      Admin
                    </span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <strong>Email</strong> <span>{selectedUser.email}</span>
                </div>
                <div className="flex justify-between">
                  <strong>Phone</strong> <span>{selectedUser.phone}</span>
                </div>
                <div className="flex justify-between items-center">
                  <strong>Verification</strong>
                  <UserManagementStatusBadge status="VERIFIED" />
                </div>
                <div className="flex justify-between">
                  <strong>Location</strong> <span>{selectedUser.location}</span>
                </div>
                <div className="flex justify-between items-center">
                  <strong>Status</strong>
                  <UserManagementStatusBadge status={selectedUser.status} />
                </div>
                <div className="flex justify-between">
                  <strong>Role</strong> <strong>Administrator</strong>
                </div>
                <div className="flex justify-between">
                  <strong>Registered</strong> <span>May 11, 2025</span>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="bg-white pt-3 pb-12 flex justify-end px-8">
              <div className="flex gap-4 flex-wrap">
                {isActive ? (
                  <button
                    onClick={() => setShowDeactivateModal(true)}
                    className="bg-red-600 text-white px-6 py-2 rounded-full text-sm"
                  >
                    Deactivate Admin
                  </button>
                ) : (
                  <button
                    onClick={() => setShowReactivateModal(true)}
                    className="bg-green-600 text-white px-6 py-2 rounded-full text-sm"
                  >
                    Reactivate Admin
                  </button>
                )}
                <button
                  onClick={() => setShowWarningModal(true)}
                  className="border border-red-600 text-red-600 px-6 py-2 rounded-full text-sm"
                >
                  Send Warning
                </button>
                <button
                  onClick={closeModal}
                  className="border border-gray-800 text-gray-800 px-6 py-2 rounded-full text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>

          {/* REUSABLE MODALS */}
          <SendWarningModal
            isOpen={showWarningModal}
            onClose={() => setShowWarningModal(false)}
            warningMessage={warningMessage}
            setWarningMessage={setWarningMessage}
            onSend={handleSendWarning}
            loading={loadingWarning}
          />

          <ReactivateModal
            isOpen={showReactivateModal}
            onClose={() => setShowReactivateModal(false)}
            onConfirm={handleConfirmReactivate}
            loading={loadingReactivate}
            userName={selectedUser.fullName}
          />

          <DeactivateModal
            isOpen={showDeactivateModal}
            onClose={() => setShowDeactivateModal(false)}
            onConfirm={handleConfirmDeactivate}
            loading={loadingDeactivate}
            userName={selectedUser.fullName}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdminDetails;