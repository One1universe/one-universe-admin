// MarkAsPaidModal.tsx
import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface MarkAsPaidModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const MarkAsPaidModal: React.FC<MarkAsPaidModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-[80]" onClick={onClose} />

      {/* Modal */}
      <div
        className="fixed inset-0 z-[90] flex items-center justify-center p-4"
        style={{ contain: "none" }}
      >
        <div
          className="w-full max-w-[633px] bg-white rounded-2xl shadow-[-1px_8px_12px_0px_#0000001F] overflow-hidden"
          style={{ transform: "translateZ(0)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Teal Header */}
          <div className="bg-[#E8FBF7] px-8 pt-8 pb-4 border-b border-[#E8E3E3]">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="p-0 hover:opacity-70 transition"
              >
                <ArrowLeft className="w-6 h-6 text-[#171417]" />
              </button>
              <h2 className="font-dm-sans font-bold text-[20px] leading-[140%] text-[#171417]">
                Mark Reward as Paid?
              </h2>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-6 flex flex-col gap-6">
            {/* Description */}
            <div className="space-y-4">
              <p className="font-dm-sans font-medium text-base leading-[140%] text-[#171417]">
                You're about to mark this referral reward as manually paid outside the system.
              </p>
              <p className="font-dm-sans font-normal text-base leading-[140%] text-[#454345]">
                This action is irreversible and will be logged for audit purposes.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-8">
              {/* Cancel Button */}
              <button
                onClick={onClose}
                className="flex-1 h-12 rounded-[20px] font-dm-sans font-medium text-base leading-[140%] border transition-colors hover:bg-gray-50"
                style={{
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderImage: 'radial-gradient(50% 50% at 50% 50%, #154751 37%, #04171F 100%) 1',
                  color: '#154751',
                }}
              >
                Cancel
              </button>

              {/* Confirm Button */}
              <button
                onClick={handleConfirm}
                className="flex-1 h-12 rounded-[20px] text-white font-dm-sans font-medium text-base leading-[140%] transition-opacity hover:opacity-90"
                style={{ background: 'radial-gradient(50% 50% at 50% 50%, #154751 37%, #04171F 100%)' }}
              >
                Confirm & Mark as Paid
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MarkAsPaidModal;