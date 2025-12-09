export type PromotionalOffer = {
  id: string;
  offerId: string;
  title: string;
  type: "Discount" | "Free Shipping" | "Bundle" | "Cashback";
  description?: string;
  eligibleUser: "All Users" | "Premium Members" | "First-time Buyers" | "Existing Users";
  endDate: string;
  startDate?: string;
  redemptions: number;
  maxRedemptions?: number;
  status: "Active" | "Draft" | "Completed" | "Expired";
  discountValue?: string;
  terms?: string;
  createdBy?: string;
  createdDate?: string;
  attachments?: { name: string; size: string }[];
};