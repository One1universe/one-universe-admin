// components/modal/DeletePromotionModal.tsx
"use client";

import React from "react";
import { AlertTriangle, Trash2 } from "lucide-react";

interface DeletePromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  offerTitle?: string;
}

const DeletePromotionModal: React.FC<DeletePromotionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  offerTitle,
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-[80]" 
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[90] flex items-end md:items-center justify-center md:p-4">
        <div
          className="bg-white rounded-t-lg md:rounded-lg border border-[#EBEBEB] w-full md:w-auto md:max-w-[633px] shadow-[0px_20px_20px_0px_#00000014,0px_0px_2px_0px_#0000001F] md:shadow-[0px_20px_20px_0px_#00000014,0px_0px_2px_0px_#0000001F]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Content */}
          <div className="p-5 md:p-8 flex flex-col gap-6 md:gap-8">
            {/* Icon & Text Section */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Icon */}
              <div className="w-12 h-12 rounded-full bg-[#FFD5D0] flex items-center justify-center flex-shrink-0 p-2">
                <div className="relative w-8 h-8">
                  <Trash2 className="w-full h-full text-[#D84040]" strokeWidth={1.33} />
                </div>
              </div>

              {/* Text Content */}
              <div className="flex flex-col gap-2 flex-1 text-center md:text-left">
                {/* Title */}
                <h2 className="font-dm-sans font-bold text-xl leading-[140%] text-[#171417]">
                  Delete Promotional Offer?
                </h2>

                {/* Warning Message */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-start gap-2 justify-center md:justify-start">
                    <AlertTriangle className="w-5 h-5 text-[#BA8D07] flex-shrink-0 mt-0.5" strokeWidth={1} />
                    <p className="font-dm-sans text-sm leading-[140%] text-[#454345] text-left">
                      This action cannot be undone and will remove the offer from all user views.
                    </p>
                  </div>
                  
                  <p className="font-dm-sans text-base leading-[140%] text-[#171417]">
                    Are you sure you want to delete this promotional offer?
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-8">
              {/* Cancel Button */}
              <button
                onClick={onClose}
                className="w-full md:flex-1 px-6 py-3 md:py-4 rounded-[20px] border font-dm-sans font-medium text-base leading-[140%] text-center transition hover:bg-gray-50"
                style={{
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderImage: 'radial-gradient(50% 50% at 50% 50%, #154751 37%, #04171F 100%) 1',
                  color: '#154751',
                }}
              >
                Cancel
              </button>

              {/* Delete Button */}
              <button
                onClick={handleConfirm}
                className="w-full md:flex-1 px-6 py-3 md:py-4 rounded-[20px] bg-[#D84040] font-dm-sans font-medium text-base leading-[140%] text-center text-[#FDFDFD] transition hover:bg-[#C13636]"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeletePromotionModal;