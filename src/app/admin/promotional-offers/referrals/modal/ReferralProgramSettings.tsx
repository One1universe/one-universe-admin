// ReferralProgramSettings.tsx
import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';

interface ReferralProgramSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSettings?: (settings: any) => void;
  onUpdateRules?: (rules: any) => void;
}

const ReferralProgramSettings: React.FC<ReferralProgramSettingsProps> = ({
  isOpen,
  onClose,
  onSaveSettings,
  onUpdateRules,
}) => {
  const [isProgramActive, setIsProgramActive] = useState(false);
  const [rewardPercentage, setRewardPercentage] = useState('');
  const [maxReferrals, setMaxReferrals] = useState('');
  const [minTransactionAmount, setMinTransactionAmount] = useState('');
  const [eligibilityPeriod, setEligibilityPeriod] = useState('');

  const isRewardConfigValid = rewardPercentage !== '' && maxReferrals !== '';
  const isRulesConfigValid = minTransactionAmount !== '' && eligibilityPeriod !== '';

  const handleSaveSettings = () => {
    if (isRewardConfigValid && onSaveSettings) {
      onSaveSettings({
        rewardPercentage,
        maxReferrals,
      });
    }
  };

  const handleUpdateRules = () => {
    if (isRulesConfigValid && onUpdateRules) {
      onUpdateRules({
        minTransactionAmount,
        eligibilityPeriod,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-[60]" onClick={onClose} />

      {/* Settings Modal */}
      <div
        className="fixed inset-0 z-[70] flex items-start justify-center pt-4 overflow-y-auto"
        style={{ contain: "none" }}
      >
        <div
          className="w-full max-w-[671px] bg-white rounded-2xl shadow-[-1px_8px_12px_0px_#0000001F] overflow-hidden mb-4"
          style={{ transform: "translateZ(0)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Teal Header */}
          <div className="bg-[#E8FBF7] px-8 pt-8 pb-4 border-b border-[#E8E3E3]">
            <div className="flex items-center justify-between">
              <h2 className="font-dm-sans font-bold text-[26px] leading-[120%] text-[#171417]">
                Referral Program Settings
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/30 rounded-lg transition"
              >
                <X className="w-6 h-6 text-[#171417]" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-2 flex flex-col gap-8">
            {/* Program Status Section */}
            <div className="bg-white rounded-lg shadow-[0px_1px_2px_0px_#1A1A1A1F,0px_4px_6px_0px_#1A1A1A14,0px_8px_16px_0px_#1A1A1A14] p-4 flex flex-col gap-3">
              <h3 className="font-dm-sans font-bold text-base text-[#171417]">
                Program Status
              </h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsProgramActive(!isProgramActive)}
                  className={`w-[42px] h-6 rounded-full transition-colors ${
                    isProgramActive ? 'bg-teal-600' : 'bg-[#E3E5E5]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      isProgramActive ? 'translate-x-[22px]' : 'translate-x-1'
                    }`}
                  />
                </button>
                <div className="flex-1">
                  <p className="font-dm-sans font-medium text-base text-[#171417]">
                    Referral Program Active
                  </p>
                  <p className="font-dm-sans font-normal text-sm text-[#454345]">
                    Toggle to enable or disable the entire referral program
                  </p>
                </div>
              </div>
            </div>

            {/* Reward Configuration Section */}
            <div className="bg-white rounded-lg shadow-[0px_1px_2px_0px_#1A1A1A1F,0px_4px_6px_0px_#1A1A1A14,0px_8px_16px_0px_#1A1A1A14] p-4 flex flex-col gap-3">
              <h3 className="font-dm-sans font-bold text-base text-[#171417]">
                Reward Configuration
              </h3>
              <div className="border-t border-[#E8E3E3]" />
              
              <div className="flex flex-col gap-4 mt-2">
                {/* Referral Reward Percentage */}
                <div className="flex flex-col gap-1">
                  <label className="font-dm-sans font-medium text-base text-[#05060D]">
                    Referral Reward Percentage
                  </label>
                  <div className="relative">
                    <select
                      value={rewardPercentage}
                      onChange={(e) => setRewardPercentage(e.target.value)}
                      className="w-full h-11 rounded-xl border border-[#B2B2B4] px-4 py-3 font-dm-sans text-base text-[#171417] appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      style={{ color: rewardPercentage ? '#171417' : '#B7B6B7' }}
                    >
                      <option value="">Select %</option>
                      <option value="1">1%</option>
                      <option value="2">2%</option>
                      <option value="3">3%</option>
                      <option value="5">5%</option>
                      <option value="10">10%</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#171417] pointer-events-none" />
                  </div>
                  <p className="font-dm-sans font-normal text-xs text-[#454345]">
                    Percentage of transaction value given as referral reward
                  </p>
                </div>

                {/* Maximum Referrals per User per Month */}
                <div className="flex flex-col gap-1">
                  <label className="font-dm-sans font-medium text-base text-[#05060D]">
                    Maximum Referrals per User per Month
                  </label>
                  <input
                    type="number"
                    value={maxReferrals}
                    onChange={(e) => setMaxReferrals(e.target.value)}
                    placeholder="Enter number"
                    className="w-full h-11 rounded-xl border border-[#B2B2B4] px-4 py-3 font-dm-sans text-base text-[#171417] placeholder:text-[#B7B6B7] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  <p className="font-dm-sans font-normal text-xs text-[#454345]">
                    Limit on referral rewards a user can earn monthly
                  </p>
                </div>

                {/* Save Settings Button */}
                <button
                  onClick={handleSaveSettings}
                  disabled={!isRewardConfigValid}
                  className="w-full h-10 rounded-full font-dm-sans font-medium text-base text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: isRewardConfigValid
                      ? 'radial-gradient(50% 50% at 50% 50%, #154751 37%, #04171F 100%)'
                      : 'linear-gradient(0deg, #ACC5CF, #ACC5CF)',
                  }}
                >
                  Save Settings
                </button>
              </div>
            </div>

            {/* Referral Rules & Requirements Section */}
            <div className="bg-white rounded-lg shadow-[0px_1px_2px_0px_#1A1A1A1F,0px_4px_6px_0px_#1A1A1A14,0px_8px_16px_0px_#1A1A1A14] p-4 flex flex-col gap-3">
              <h3 className="font-dm-sans font-bold text-base text-[#171417]">
                Referral Rules & Requirements
              </h3>
              
              <div className="flex flex-col gap-4">
                {/* Minimum Transaction Amount for Reward */}
                <div className="flex flex-col gap-1">
                  <label className="font-dm-sans font-medium text-base text-[#05060D]">
                    Minimum Transaction Amount for Reward
                  </label>
                  <input
                    type="number"
                    value={minTransactionAmount}
                    onChange={(e) => setMinTransactionAmount(e.target.value)}
                    placeholder="Enter number"
                    className="w-full h-11 rounded-xl border border-[#B2B2B4] px-4 py-3 font-dm-sans text-base text-[#171417] placeholder:text-[#B7B6B7] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  <p className="font-dm-sans font-normal text-xs text-[#454345]">
                    Minimum amount of referred user's first transaction to qualify for reward
                  </p>
                </div>

                {/* Reward Eligibility Period */}
                <div className="flex flex-col gap-1">
                  <label className="font-dm-sans font-medium text-base text-[#05060D]">
                    Reward Eligibility Period (Days)
                  </label>
                  <input
                    type="number"
                    value={eligibilityPeriod}
                    onChange={(e) => setEligibilityPeriod(e.target.value)}
                    placeholder="Enter days number"
                    className="w-full h-11 rounded-xl border border-[#B2B2B4] px-4 py-3 font-dm-sans text-base text-[#171417] placeholder:text-[#B7B6B7] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  <p className="font-dm-sans font-normal text-xs text-[#454345]">
                    Number of days referred user has to complete first transaction
                  </p>
                </div>

                {/* Update Rules Button */}
                <button
                  onClick={handleUpdateRules}
                  disabled={!isRulesConfigValid}
                  className="w-full h-10 rounded-full font-dm-sans font-medium text-base text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: isRulesConfigValid
                      ? 'radial-gradient(50% 50% at 50% 50%, #154751 37%, #04171F 100%)'
                      : 'linear-gradient(0deg, #ACC5CF, #ACC5CF)',
                  }}
                >
                  Update Rules
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReferralProgramSettings;