"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import useToastStore from "@/store/useToastStore";
import { TriangleAlert } from "lucide-react";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

export default function Toast() {
  const { isOpen, type, heading, description, closeToast, duration } =
    useToastStore();

  useEffect(() => {
    if (isOpen && duration) {
      const timer = setTimeout(() => closeToast(), duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, closeToast]);

  const colors = {
    success: {
      mainIcon: FaCheckCircle,
      bg: "bg-[#fff]",
      border: "border-b-[2px] border-[#3DA755]",
      iconText: "text-[#3DA755] w-6 h-6", // Bigger icon size (24px)
      // icon: "text-[#77B254]   w-12 h-12 rounded-[10px]", // Larger container (48px)
      heading: "text-[#06070E]",
    },
    error: {
      mainIcon: FaExclamationTriangle,
      bg: "bg-[#fff]",
      border: "border-b-[2px] border-[#E81313]",
      iconText: "text-[#E81313] w-6 h-6",
      // icon: "text-[#D84040]  w-12 h-12 rounded-[10px]", // Larger container (48px)
      heading: "text-[#2A2829]",
    },
    warning: {
      mainIcon: TriangleAlert,
      bg: "bg-[#fff]",
      border: "border-b-[2px] border-[#FBBF24]",
      iconText: "text-[#FBBF24] w-6 h-6",
      // icon: "bg-[#FEF3C7] border-2 border-[#FCD34D] w-12 h-12 rounded-[10px]",
      heading: "text-[#2A2829]",
    },
  };

  const {
    bg,
    border,
    // icon,
    iconText,
    heading: headingColor,
    mainIcon: MainIcon,
  } = colors[type];

  return (
    <div className="fixed top-7 right-4 z-[99999] pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="toast"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 40,
              duration: 0.4,
            }}
            className={`${bg} ${border} shadow-lg rounded-xl overflow-hidden pl-6 pr-6 py-3 flex items-center gap-3 pointer-events-auto w-full md:w-[470px] md:h-[70px] h-[55px]`}
          >
            <div className={`flex items-center justify-center`}>
              <MainIcon className={iconText} />
            </div>

            <div className="flex flex-col ml-3.5 gap-[2px] flex-1 leading-[140%]">
              <span className={`md:text-[1rem] text-[.875rem] font-bold ${headingColor}`}>
                {heading}
              </span>
              <span className="md:text-sm text-[.750rem] text-[#454345]">{description}</span>
            </div>

            <button
              onClick={closeToast}
              className="ml-3 cursor-pointer text-[#000000] hover:text-[#000000]/70 text-lg font-bold"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
