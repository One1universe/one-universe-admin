// src/components/ReferralProgramSettings.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { referralManagementStore } from '@/store/referralManagementStore';
import { referralService } from '@/services/referralService';

interface ReferralProgramSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSettings?: (settings: any) => void;
  onUpdateRules?: (rules: any) => void;
}

const SETTINGS_ID = process.env.NEXT_PUBLIC_PLATFORM_SETTINGS_ID || '';

const ReferralProgramSettings: React.FC<ReferralProgramSettingsProps> = ({
  isOpen,
  onClose,
  onSaveSettings,
  onUpdateRules,
}) => {
  // Form state
  const [isProgramActive, setIsProgramActive] = useState(false);
  const [platformFeePercentage, setPlatformFeePercentage] = useState('');
  const [maxReferralsPerMonth, setMaxReferralsPerMonth] = useState('');
  const [maxTransactionAmount, setMaxTransactionAmount] = useState('');
  const [eligibilityPeriod, setEligibilityPeriod] = useState('');

  // Loading & feedback states
  const [isSavingStatus, setIsSavingStatus] = useState(false);
  const [isSavingRewards, setIsSavingRewards] = useState(false);
  const [isSavingRules, setIsSavingRules] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [rewardsMessage, setRewardsMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [rulesMessage, setRulesMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { settings, settingsLoading, updateSettings } = referralManagementStore();

  // === CRITICAL: Fetch settings by specific ID when modal opens ===
  useEffect(() => {
    if (isOpen && SETTINGS_ID) {
      setIsLoadingSettings(true);
      console.log('[SETTINGS MODAL] Fetching settings for ID:', SETTINGS_ID);
      
      referralService
        .getReferralSettingsById(SETTINGS_ID)
        .then((fetchedSettings) => {
          console.log('[SETTINGS MODAL] Fetched settings:', fetchedSettings);
          
          // Populate form with fetched data
          setIsProgramActive(fetchedSettings.active ?? false);
          setPlatformFeePercentage(fetchedSettings.platformFeePercentage?.toString() ?? '');
          setMaxReferralsPerMonth(fetchedSettings.maxReferralsPerUserPerMonth?.toString() ?? '');
          setMaxTransactionAmount(fetchedSettings.maxTransactionAmount?.toString() ?? '');
          setEligibilityPeriod(fetchedSettings.rewardEligibilityDays?.toString() ?? '');
        })
        .catch((err) => {
          console.error('[SETTINGS MODAL] Failed to fetch settings:', err);
          setStatusMessage({ type: 'error', text: 'Failed to load settings' });
        })
        .finally(() => {
          setIsLoadingSettings(false);
        });
    }
  }, [isOpen]); // Only depends on isOpen

  // Reset messages when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStatusMessage(null);
      setRewardsMessage(null);
      setRulesMessage(null);
    }
  }, [isOpen]);

  // Validation
  const isRewardConfigValid = platformFeePercentage !== '' && maxReferralsPerMonth !== '';
  const isRulesConfigValid = maxTransactionAmount !== '' && eligibilityPeriod !== '';

  // Helper to show temporary messages
  const showMessage = (
    setter: (msg: { type: 'success' | 'error'; text: string } | null) => void,
    type: 'success' | 'error',
    text: string
  ) => {
    setter({ type, text });
    setTimeout(() => setter(null), 3000);
  };

  const handleSaveProgramStatus = async () => {
    setIsSavingStatus(true);
    try {
      await updateSettings({ active: isProgramActive });
      showMessage(setStatusMessage, 'success', 'Program status updated successfully');
      onSaveSettings?.({ active: isProgramActive });
    } catch (err: any) {
      showMessage(setStatusMessage, 'error', err.message || 'Failed to update status');
    } finally {
      setIsSavingStatus(false);
    }
  };

  const handleSaveRewardConfig = async () => {
    if (!isRewardConfigValid) return;
    setIsSavingRewards(true);
    try {
      const payload = {
        platformFeePercentage: parseFloat(platformFeePercentage),
        maxReferralsPerUserPerMonth: parseInt(maxReferralsPerMonth, 10),
      };
      await updateSettings(payload);
      showMessage(setRewardsMessage, 'success', 'Reward settings saved successfully');
      onSaveSettings?.(payload);
    } catch (err: any) {
      showMessage(setRewardsMessage, 'error', err.message || 'Failed to save reward settings');
    } finally {
      setIsSavingRewards(false);
    }
  };

  const handleSaveRules = async () => {
    if (!isRulesConfigValid) return;
    setIsSavingRules(true);
    try {
      const payload = {
        maxTransactionAmount: parseFloat(maxTransactionAmount),
        rewardEligibilityDays: parseInt(eligibilityPeriod, 10),
      };
      await updateSettings(payload);
      showMessage(setRulesMessage, 'success', 'Rules updated successfully');
      onUpdateRules?.(payload);
    } catch (err: any) {
      showMessage(setRulesMessage, 'error', err.message || 'Failed to save rules');
    } finally {
      setIsSavingRules(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-[60]" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-[70] flex items-start justify-center pt-4 overflow-y-auto">
        <div
          className="w-full max-w-[671px] bg-white rounded-2xl shadow-lg overflow-hidden mb-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-[#E8FBF7] px-8 pt-8 pb-4 border-b border-[#E8E3E3]">
            <div className="flex items-center justify-between">
              <h2 className="font-dm-sans font-bold text-[26px] text-[#171417]">
                Referral Program Settings
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-white/30 rounded-lg">
                <X className="w-6 h-6 text-[#171417]" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-8 py-8 flex flex-col gap-8">
            {isLoadingSettings ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-teal-600 border-t-transparent"></div>
                <span className="ml-3 text-gray-600">Loading settings...</span>
              </div>
            ) : (
              <>
                {/* Program Status */}
                <div className="bg-white rounded-lg shadow-md p-6 border">
                  {statusMessage && (
                    <div className={`mb-4 p-3 rounded-lg border ${statusMessage.type === 'success' ? 'bg-green-50 border-green-300 text-green-700' : 'bg-red-50 border-red-300 text-red-700'}`}>
                      {statusMessage.text}
                    </div>
                  )}

                  <h3 className="font-bold text-lg mb-4">Program Status</h3>
                  <div className="flex items-center gap-4 mb-6">
                    <button
                      type="button"
                      onClick={() => setIsProgramActive(!isProgramActive)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isProgramActive ? 'bg-teal-600' : 'bg-gray-300'}`}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${isProgramActive ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                    <span className="font-medium">
                      Referral Program {isProgramActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <button
                    onClick={handleSaveProgramStatus}
                    disabled={isSavingStatus}
                    className="w-full h-11 bg-gradient-to-b from-[#154751] to-[#04171F] text-white rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSavingStatus ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent" />
                        Saving...
                      </>
                    ) : (
                      'Save Status'
                    )}
                  </button>
                </div>

                {/* Reward Configuration */}
                <div className="bg-white rounded-lg shadow-md p-6 border">
                  {rewardsMessage && (
                    <div className={`mb-4 p-3 rounded-lg border ${rewardsMessage.type === 'success' ? 'bg-green-50 border-green-300 text-green-700' : 'bg-red-50 border-red-300 text-red-700'}`}>
                      {rewardsMessage.text}
                    </div>
                  )}

                  <h3 className="font-bold text-lg mb-4">Reward Configuration</h3>

                  <div className="space-y-5">
                    <div>
                      <label className="block font-medium mb-2">Platform Fee Percentage (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={platformFeePercentage}
                        onChange={(e) => setPlatformFeePercentage(e.target.value)}
                        placeholder="e.g. 5"
                        className="w-full h-11 px-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block font-medium mb-2">Max Referrals per User per Month</label>
                      <input
                        type="number"
                        min="0"
                        value={maxReferralsPerMonth}
                        onChange={(e) => setMaxReferralsPerMonth(e.target.value)}
                        placeholder="e.g. 10"
                        className="w-full h-11 px-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSaveRewardConfig}
                    disabled={!isRewardConfigValid || isSavingRewards}
                    className="w-full h-11 mt-6 bg-gradient-to-b from-[#154751] to-[#04171F] text-white rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSavingRewards ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent" />
                        Saving...
                      </>
                    ) : (
                      'Save Reward Settings'
                    )}
                  </button>
                </div>

                {/* Rules & Requirements */}
                <div className="bg-white rounded-lg shadow-md p-6 border">
                  {rulesMessage && (
                    <div className={`mb-4 p-3 rounded-lg border ${rulesMessage.type === 'success' ? 'bg-green-50 border-green-300 text-green-700' : 'bg-red-50 border-red-300 text-red-700'}`}>
                      {rulesMessage.text}
                    </div>
                  )}

                  <h3 className="font-bold text-lg mb-4">Referral Rules & Requirements</h3>

                  <div className="space-y-5">
                    <div>
                      <label className="block font-medium mb-2">Maximum Transaction Amount for Reward (₦)</label>
                      <input
                        type="number"
                        min="0"
                        value={maxTransactionAmount}
                        onChange={(e) => setMaxTransactionAmount(e.target.value)}
                        placeholder="e.g. 100000"
                        className="w-full h-11 px-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Transactions above this amount do NOT qualify</p>
                    </div>

                    <div>
                      <label className="block font-medium mb-2">Reward Eligibility Period (Days)</label>
                      <input
                        type="number"
                        min="0"
                        value={eligibilityPeriod}
                        onChange={(e) => setEligibilityPeriod(e.target.value)}
                        placeholder="e.g. 30"
                        className="w-full h-11 px-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSaveRules}
                    disabled={!isRulesConfigValid || isSavingRules}
                    className="w-full h-11 mt-6 bg-gradient-to-b from-[#154751] to-[#04171F] text-white rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSavingRules ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent" />
                        Saving...
                      </>
                    ) : (
                      'Save Rules'
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ReferralProgramSettings;