"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

const tabs = [
  { label: "Pending Requests", value: "pending-request" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

export default function ServiceTabSelector() {
  const [activeTab, setActiveTab] = useState(tabs[0].value); // default to first tab's value

  return (
    <TabsList className="flex items-center gap-8 border border-[#BBBBBB] rounded-[12px] px-6 h-[46px] w-fit bg-transparent">
      {tabs.map((tab) => {
        const isActive = tab.value === activeTab;
        return (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`relative text-[16px] font-medium bg-transparent border-none shadow-none ring-0 ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 hover:bg-transparent hover:shadow-none hover:border-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-none transition-colors duration-200 ${
              isActive ? "text-[#0F2A33]" : "text-[#777777]"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="underline"
                className="absolute -bottom-[6px] left-0 right-0 h-[2px] bg-[#0F2A33] rounded-full"
              />
            )}
            {tab.label} <span>0</span>
          </TabsTrigger>
        );
      })}
    </TabsList>
  );
}
