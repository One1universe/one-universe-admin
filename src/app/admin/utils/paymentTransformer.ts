// src/utils/paymentTransformer.ts

/**
 * Transform API response data to modal format
 * Handles both list and detail endpoints
 */

export interface TransformedPayment {
  id: string;
  serviceTitle: string;
  buyer: { name: string; email: string };
  seller: { name: string; email: string };
  amount: string | number;
  status: "PAID" | "PENDING" | "DISPUTED" | "PENDING REFUND" | "REFUNDED" | "FAILED";
  bookingId: string;
  bookingStatus: "Cancelled" | "Completed" | "In Progress";
  jobStatus: "Pending" | "In Progress" | "Completed" | "Cancelled";
  businessName: string;
  services: string;
  location: string;
  date: string;
}

/**
 * Map backend booking status to display status
 */
function mapBookingStatus(status: string): "Cancelled" | "Completed" | "In Progress" {
  const statusMap: Record<string, "Cancelled" | "Completed" | "In Progress"> = {
    BUYER_CONFIRM_COMPLETION: "In Progress",
    SELLER_CONFIRM_COMPLETION: "In Progress",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
    IN_PROGRESS: "In Progress",
    PENDING: "In Progress",
  };
  return statusMap[status] || "In Progress";
}

/**
 * Map backend job status to display status
 */
function mapJobStatus(status: string): "Pending" | "In Progress" | "Completed" | "Cancelled" {
  const statusMap: Record<string, "Pending" | "In Progress" | "Completed" | "Cancelled"> = {
    COMPLETED: "Completed",
    IN_PROGRESS: "In Progress",
    PENDING: "Pending",
    CANCELLED: "Cancelled",
  };
  return statusMap[status] || "Pending";
}

/**
 * Transform detail endpoint response (has bookingId, bookingStatus, etc)
 */
export function transformDetailResponse(data: any): TransformedPayment {
  return {
    id: data.reference || data.id || "",
    serviceTitle: data.serviceTitle || "N/A",
    buyer: {
      name: data.buyerName || "N/A",
      email: data.buyerEmail || "N/A",
    },
    seller: {
      name: data.sellerName || "N/A",
      email: data.sellerEmail || "N/A",
    },
    amount: data.amount || 0,
    status: data.status || "PENDING",
    bookingId: data.bookingId || "N/A",
    bookingStatus: mapBookingStatus(data.bookingStatus || ""),
    jobStatus: mapJobStatus(data.jobStatus || ""),
    businessName: data.sellerBusinessName || "N/A",
    services: data.serviceTitle || "N/A",
    location: data.bookingLocation || "N/A",
    date: data.bookingDate ? new Date(data.bookingDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : "N/A",
  };
}

/**
 * Transform list endpoint response (minimal data, used as fallback)
 */
export function transformListResponse(data: any): TransformedPayment {
  return {
    id: data.reference || data.id || "",
    serviceTitle: data.serviceTitle || "N/A",
    buyer: {
      name: data.buyerName || "N/A",
      email: data.buyerEmail || "N/A",
    },
    seller: {
      name: data.sellerName || "N/A",
      email: data.sellerEmail || "N/A",
    },
    amount: data.amount || 0,
    status: data.status || "PENDING",
    bookingId: "N/A",
    bookingStatus: "In Progress",
    jobStatus: "Pending",
    businessName: "N/A",
    services: data.serviceTitle || "N/A",
    location: "N/A",
    date: data.createdAt ? new Date(data.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : "N/A",
  };
}

/**
 * Auto-detect which transformer to use based on data structure
 */
export function transformPaymentData(data: any): TransformedPayment {
  // Debug log
  console.log("🔍 Transforming payment data:", data);
  
  // If data has bookingId, it's from detail endpoint
  if (data.bookingId) {
    console.log("✅ Using detail transformer");
    return transformDetailResponse(data);
  }
  
  // If data has buyerName (nested or not), it's real data
  if (data.buyerName || data.buyer?.name) {
    console.log("✅ Using list transformer with buyer data");
    return {
      ...transformListResponse(data),
      buyer: {
        name: data.buyerName || data.buyer?.name || "N/A",
        email: data.buyerEmail || data.buyer?.email || "N/A",
      },
      seller: {
        name: data.sellerName || data.seller?.name || "N/A",
        email: data.sellerEmail || data.seller?.email || "N/A",
      },
    };
  }
  
  // Fallback
  console.log("⚠️ Using default list transformer");
  return transformListResponse(data);
}