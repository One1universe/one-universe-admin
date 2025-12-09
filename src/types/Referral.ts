export type Referral = {
  id: string;
  referralId: string;
  referrerName: string;
  referredName: string;
  firstTransaction: "Completed" | "Pending";
  signDate: string;
  status: "Paid" | "Pending" | "Processing";
  rewardEarned: boolean;
};