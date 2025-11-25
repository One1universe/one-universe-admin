"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, FileText, TrendingUp, X } from "lucide-react";
import { userManagementStore } from "@/store/userManagementStore";
import UserManagementStatusBadge from "../../UserManagementStatusBadge";
import { IoBusinessOutline } from "react-icons/io5";
import Image from "next/image";
import axios from "axios";
import { useSession } from "next-auth/react";
import {
  SendWarningModal,
  ReactivateModal,
  DeactivateModal,
} from "@/app/admin/users-management/components/modals/UserActionModals";

const SellerDetails = () => {
  const { modalType, selectedUser, closeModal } = userManagementStore();
  const { data: session } = useSession();

  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showReactivateModal, setShowReactivateModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [loadingDeactivate, setLoadingDeactivate] = useState(false);
  const [loadingReactivate, setLoadingReactivate] = useState(false);
  const [loadingWarning, setLoadingWarning] = useState(false);

  if (!selectedUser || modalType !== "openSeller") return null;

  const isActive = selectedUser.status === "ACTIVE";
  const profile = selectedUser.profile;

  const handleSendWarning = async () => {
    if (!warningMessage.trim()) return;
    setLoadingWarning(true);
    try {
      await axios.post(
        `/api/admin/users/${selectedUser.id}/warning`,
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
        `/api/admin/users/${selectedUser.id}/reactivate`,
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
        `/api/admin/users/${selectedUser.id}/deactivate`,
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
      {modalType === "openSeller" && selectedUser && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="shadow-lg w-full md:w-[85%] bg-white md:rounded-2xl relative"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 120 }}
          >
            {/* Header */}
            <div className="flex rounded-t-2xl items-center justify-between bg-[#E8FBF7] pt-8 px-4 py-4">
              <div className="flex items-center gap-4">
                <button
                  title="Close modal"
                  onClick={closeModal}
                  className="text-gray-500 hover:text-black"
                >
                  <X size={18} />
                </button>
                <h2 className="text-xl font-bold text-[#171417]">Seller Profile</h2>
              </div>
              <button
                className="[background:var(--primary-radial)] py-1.5 px-6 text-[#FDFDFD] rounded-[36px] font-medium text-sm"
                type="button"
              >
                View History
              </button>
            </div>

            {/* Body - Two Column Layout */}
            <div className="rounded-b-2xl bg-white max-h-[80vh] overflow-y-auto scrollbar-hide">
              <section className="flex flex-col md:flex-row py-3.5">
                {/* Left Column */}
                <section className="flex-1 px-5 w-full">
                  {/* Personal Information */}
                  <aside className="py-6 flex flex-col gap-[24px]">
                    <div className="flex items-center gap-2">
                      <FileText size={20} className="text-[#454345]" />
                      <h3 className="text-[#646264] font-bold text-base">Personal Information</h3>
                    </div>
                    <div className="flex flex-col gap-5">
                      <div className="flex justify-between">
                        <h3 className="text-[#171417] font-medium text-base">Name</h3>
                        <p className="text-[#454345] font-normal text-base flex gap-2 items-center">
                          <span className="font-medium">{selectedUser.fullName}</span>
                          <span className="bg-[#1DD2AE] text-[#171417] text-sm rounded-[8px] py-0.5 px-2">
                            SELLER
                          </span>
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <h3 className="text-[#171417] font-medium text-base">Email Address</h3>
                        <p className="text-[#454345] font-normal text-base">{selectedUser.email}</p>
                      </div>
                      <div className="flex justify-between">
                        <h3 className="text-[#171417] font-medium text-base">Phone Number</h3>
                        <p className="text-[#454345] font-normal text-base">{selectedUser.phone}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <h3 className="text-[#171417] font-medium text-base">Verification Status</h3>
                        <UserManagementStatusBadge
                          status={selectedUser.verificationStatus ? "VERIFIED" : "UNVERIFIED"}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <h3 className="text-[#171417] font-medium text-base">Account Status</h3>
                        <UserManagementStatusBadge status={selectedUser.status} />
                      </div>
                      <div className="flex justify-between">
                        <h3 className="text-[#171417] font-medium text-base">Wallet Balance</h3>
                        <p className="text-[#454345] font-bold text-base">
                          ₦{selectedUser.wallet?.balance?.toLocaleString() || "0"}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <h3 className="text-[#171417] font-medium text-base">Registration Date</h3>
                        <p className="text-[#454345] font-normal text-base">
                          {new Date(selectedUser.createdAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </aside>

                  <div className="bg-[#E8E3E3] h-[1px] w-full"></div>

                  {/* Business Details */}
                  {profile && (
                    <aside className="py-6 flex flex-col gap-[24px]">
                      <div className="flex items-center gap-2">
                        <IoBusinessOutline size={20} className="text-[#454345]" />
                        <h3 className="text-[#646264] font-bold text-base">Business Details</h3>
                      </div>
                      <div className="flex flex-col gap-5">
                        <div className="flex justify-between">
                          <h3 className="text-[#171417] font-medium text-base">Business Name</h3>
                          <p className="text-[#454345] font-normal text-base">{profile.businessName || "-"}</p>
                        </div>
                        <div className="flex justify-between">
                          <h3 className="text-[#171417] font-medium text-base">Services</h3>
                          <p className="text-[#454345] font-normal text-base">
                            {profile.servicesOffered?.join(", ") || "-"}
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <h3 className="text-[#171417] font-medium text-base">Location</h3>
                          <p className="text-[#454345] font-normal text-base">{selectedUser.location || "-"}</p>
                        </div>
                        <div className="flex justify-between">
                          <h3 className="text-[#171417] font-medium text-base">Service Description</h3>
                          <p className="text-[#454345] font-normal text-base">
                            {profile.businessDescription || "-"}
                          </p>
                        </div>
                      </div>
                    </aside>
                  )}
                </section>

                {/* Divider */}
                <div className="bg-[#E8E3E3] w-full h-[1px] md:w-[1px] md:h-auto"></div>

                {/* Right Column */}
                <section className="flex-1 px-5 w-full">
                  {/* Portfolio / Business Documents */}
                    {profile?.portfolioGallery && profile.portfolioGallery.length > 0 && (
                  <>
                    <aside className="py-6 flex flex-col gap-[24px]">
                      <div className="flex items-center gap-2">
                        <IoBusinessOutline size={20} className="text-[#454345]" />
                        <h3 className="text-[#646264] font-bold text-base">Business Documents</h3>
                      </div>

                      <div className="flex flex-col gap-4">
                        {profile.portfolioGallery.map((file: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-4">
                            {/* You can later make this dynamic based on file type */}
                            <Image
                              src="/icons/dispute-evidence.svg"
                              alt="Document icon"
                              width={32}
                              height={32}
                              className="flex-shrink-0"
                            />

                            <div className="flex flex-1 justify-between items-center">
                              <div className="flex flex-col gap-1">
                                <h4 className="text-[#154751] font-medium text-[.875rem] truncate max-w-[200px]">
                                  {file}
                                </h4>
                                <p className="text-[#8C8989] font-normal text-[.875rem] flex items-center gap-2">
                                  <span>200KB</span>
                                  <span className="w-1 h-1 bg-[#454345] rounded-full"></span>
                                  <span>Oct 12, 2024</span>
                                </p>
                              </div>

                              <a
                                href={`/uploads/${file}`}
                                download
                                className="text-[#373737] hover:text-[#154751] transition-colors"
                              >
                                <Download size={19} className="cursor-pointer" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </aside>

                    {/* Divider only if portfolio exists */}
                    <div className="bg-[#E8E3E3] h-[1px] w-full" />
                  </>
                )}
                  {/* Activity Summary */}
                  <aside className="py-6 flex flex-col gap-[24px]">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={20} className="text-[#454345]" />
                      <h3 className="text-[#646264] font-bold text-base">Activity Summary</h3>
                    </div>
                    <div className="flex flex-col gap-5 md:w-3/5">
                      <div className="flex justify-between">
                        <h3 className="text-[#171417] font-medium text-base">Total Bookings Made</h3>
                        <p className="text-[#454345] font-normal text-base">
                          {selectedUser.bookingStats?.totalBookings || 0}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <h3 className="text-[#171417] font-medium text-base">Ongoing Bookings</h3>
                        <p className="text-[#454345] font-normal text-base">
                          {selectedUser.bookingStats?.ongoingBookings || 0}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <h3 className="text-[#171417] font-medium text-base">Completed Bookings</h3>
                        <p className="text-[#454345] font-normal text-base">
                          {selectedUser.bookingStats?.completedBookings || 0}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <h3 className="text-[#171417] font-medium text-base">Disputed Bookings</h3>
                        <p className="text-[#454345] font-normal text-base">
                          {selectedUser.bookingStats?.disputedBookings || 0}
                        </p>
                      </div>
                    </div>
                  </aside>
                </section>
              </section>

              {/* Footer Actions */}
              <div className="bg-white pt-3 pb-12 flex items-center justify-end">
                <div className="flex md:flex-row flex-col gap-4 px-5 md:pr-8 w-full md:w-fit">
                  {isActive ? (
                    <button
                      className="bg-[#D84040] px-6 py-1.5 rounded-[36px] text-[#FFFFFF] cursor-pointer text-sm"
                      onClick={() => setShowDeactivateModal(true)}
                    >
                      Deactivate Seller
                    </button>
                  ) : (
                    <button
                      className="bg-green-600 px-6 py-1.5 rounded-[36px] text-[#FFFFFF] cursor-pointer text-sm"
                      onClick={() => setShowReactivateModal(true)}
                    >
                      Reactivate Seller
                    </button>
                  )}
                  <button
                    className="border border-[#D84040] px-6 py-1.5 rounded-[36px] text-[#D84040] cursor-pointer text-sm"
                    onClick={() => setShowWarningModal(true)}
                  >
                    Send Warning
                  </button>
                  <button
                    className="border border-[#04171F] px-6 py-1.5 rounded-[36px] text-[#04171F] cursor-pointer text-sm"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            {/* Modals */}
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SellerDetails;