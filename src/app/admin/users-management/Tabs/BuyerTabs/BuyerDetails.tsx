"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, TrendingUp, TriangleAlert, X } from "lucide-react";
import { userManagementStore } from "@/store/userManagementStore";
import UserManagementStatusBadge from "../../UserManagementStatusBadge";

const BuyerDetails = () => {
  const { modalType, selectedUser, closeModal } = userManagementStore();
  // const handleSelect = (value: string) => {
  //   console.log("Selected:", value);
  // };
  return (
    <AnimatePresence>
      {modalType === "openBuyer" && selectedUser && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="shadow-lg w-full md:w-[65%] bg-white md:rounded-2xl relative mx- md:mx-0"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 120 }}
          >
            <div className="flex rounded-t-2xl items-center justify-between bg-[#E8FBF7]  pt-8 px-4  py-4">
              <div className="flex items-center gap-4">
                <button
                  title="Close modal"
                  onClick={closeModal}
                  className=" text-gray-500 hover:text-black"
                >
                  <X size={18} />
                </button>
                <h2 className="text-xl font-bold  text-[#171417]">
                  Buyer Profile
                </h2>
              </div>
              <button
                className="[background:var(--primary-radial)] py-1.5 px-6 text-[#FDFDFD] rounded-[36px] font-medium text-sm"
                type="button"
              >
                View History
              </button>
            </div>
            <div className="rounded-b-2xl bg-white max-h-[80vh] overflow-y-auto scrollbar-hide">
              <>
                <section className="flex-1 flex flex-col gap-[16px]">
                  <aside className="px-8 py-6 flex flex-col gap-[24px]">
                    <div className="flex items-center gap-2">
                      <FileText size={20} className="text-[#454345]" />
                      <h3 className="text-[#646264] font-bold text-base">
                        Personal Information
                      </h3>
                    </div>
                    <div className="flex flex-col gap-5  w-full md:w-[75%]">
                      <div className="flex justify-between">
                        <h3 className="text-[#171417] font-medium text-base ">
                          Name
                        </h3>
                        <p className="text-[#454345] font-normal text-base flex gap-2 items-center">
                          <span className="font-medium">
                            {selectedUser.name}
                          </span>
                          <span className="bg-[#E6E8E9] text-sm rounded-[8px] py-0.5 px-2">
                            Buyer
                          </span>
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <h3 className="text-[#171417] font-medium text-base ">
                          Email Address
                        </h3>
                        <p className="text-[#454345] font-normal text-base ">
                          {selectedUser.email}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <h3 className="text-[#171417] font-medium text-base ">
                          Phone Number
                        </h3>
                        <p className="text-[#454345] font-normal text-base ">
                          {selectedUser.phone}
                        </p>
                      </div>

                      <div className="flex justify-between items-center">
                        <h3 className="text-[#171417] font-medium text-base ">
                          Verification Status
                        </h3>
                        <UserManagementStatusBadge status="Verified" />
                      </div>
                      <div className="flex justify-between">
                        <h3 className="text-[#171417] font-medium text-base ">
                          Location
                        </h3>
                        <p className="text-[#454345] font-normal text-base ">
                          {selectedUser.location}
                        </p>
                      </div>
                      <div className="flex justify-between items-center">
                        <h3 className="text-[#171417] font-medium text-base ">
                          Account Status
                        </h3>
                        <UserManagementStatusBadge status="Active" />
                      </div>
                      <div className="flex justify-between">
                        <h3 className="text-[#171417] font-medium text-base ">
                          Wallet Balance
                        </h3>
                        <p className="text-[#454345] font-bold text-base ">
                          ₦23,450
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <h3 className="text-[#171417] font-medium text-base ">
                          Registration Date
                        </h3>
                        <p className="text-[#454345] font-normal text-base ">
                          May 11, 2025
                        </p>
                      </div>
                    </div>
                  </aside>
                  <div className="bg-[#E8E3E3] h-[1px] w-full"></div>
                  <aside className="px-8 py-6 flex flex-col gap-[24px]">
                    <div className="flex items-center gap-2">
                      <TriangleAlert size={20} className="text-[#FB3748]" />
                      <h3 className="text-[#FB3748] font-bold text-base">
                        Emergency Contact
                      </h3>
                    </div>
                    <div className="flex flex-col gap-5  w-full md:w-[75%]">
                      <div className="flex justify-between">
                        <h3 className="text-[#171417] font-medium text-base ">
                          Full Name
                        </h3>
                        <p className="text-[#454345] font-normal text-base ">
                          Ajibola Adeyemi
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <h3 className="text-[#171417] font-medium text-base ">
                          Email Address
                        </h3>
                        <p className="text-[#454345] font-normal text-base ">
                          janeadebayo@gmail.com
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <h3 className="text-[#171417] font-medium text-base ">
                          Phone Number
                        </h3>
                        <p className="text-[#454345] font-normal text-base ">
                          +23484848848
                        </p>
                      </div>
                    </div>
                  </aside>
                  <div className="bg-[#E8E3E3] h-[1px] w-full"></div>
                  <aside className="px-8 py-6 flex flex-col gap-[24px]">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={20} className="text-[#454345]" />
                      <h3 className="text-[#646264] font-bold text-base">
                        Activity Summary
                      </h3>
                    </div>
                    <div className="flex flex-col gap-5  w-full md:w-[75%]">
                      <div className="flex justify-between">
                        <h3 className="text-[#171417] font-medium text-base ">
                          Total Bookings Made
                        </h3>
                        <p className="text-[#454345] font-normal text-base ">
                          0
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <h3 className="text-[#171417] font-medium text-base ">
                          Last booking Date
                        </h3>
                        <p className="text-[#454345] font-normal text-base ">
                          0
                        </p>
                      </div>
                    </div>
                  </aside>
                </section>
                <div className="bg-white pt-3 pb-12 flex items-center justify-end">
                  <div className="flex md:items-center md:justify-between md:flex-row flex-col gap-4 px-5 md:pr-8 md:w-fit w-full">
                    <button
                      className="bg-[#D84040] px-6 py-1.5 rounded-[36px] text-[#FFFFFF] cursor-pointer text-sm"
                      type="button"
                    >
                      Deactivate Buyer
                    </button>
                    <button
                      className="border border-[#D84040] px-6 py-1.5 rounded-[36px] text-[#D84040] cursor-pointer text-sm"
                      type="button"
                    >
                      Send Warning
                    </button>
                    <button
                      className="border border-[#04171F] px-6 py-1.5 rounded-[36px] text-[#04171F] cursor-pointer text-sm"
                      type="button"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </>
            </div>
          </motion.div>

          
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BuyerDetails;
