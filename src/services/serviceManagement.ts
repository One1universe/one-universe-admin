// @/services/serviceManagement.ts
export type ServiceStatus = "Pending" | "Approved" | "Rejected";

export interface SellerUser {
  fullName?: string;
  email?: string;
  phone?: string;
}

export interface SellerProfile {
  user?: SellerUser;
}

export interface Service {
  id: string;
  title: string;
  createdAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectedAt?: string | null;
  rejectedReason?: string | null;
  sellerProfiles: SellerProfile[];
}

// API Response Type
interface ServicesByStatusResponse {
  status: string;
  message: string;
  approved: { data: Service[]; meta: { total: number } };
  pending: { data: Service[]; meta: { total: number } };
  rejected: { data: Service[]; meta: { total: number } };
}

export const fetchServicesByStatus = async (): Promise<Service[]> => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token) throw new Error("No token found");

  const res = await fetch(
    "https://one-universe-de5673cf0d65.herokuapp.com/api/v1/master-services/by-status?page=1&limit=100",
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch services");

  const data: ServicesByStatusResponse = await res.json();

  // Flatten all services into one array with consistent id
  const allServices: Service[] = [
    ...data.pending.data.map(s => ({ ...s, id: s.id })),
    ...data.approved.data.map(s => ({ ...s, id: s.id })),
    ...data.rejected.data.map(s => ({ ...s, id: s.id })),
  ];

  return allServices;
};

export const approveService = async (id: string) => {
  const token = localStorage.getItem("token");
  const res = await fetch(
    `https://one-universe-de5673cf0d65.herokuapp.com/api/v1/master-services/${id}/approve`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  if (!res.ok) throw new Error("Approval failed");
};

export const rejectService = async (id: string, reason?: string) => {
  const token = localStorage.getItem("token");
  const res = await fetch(
    `https://one-universe-de5673cf0d65.herokuapp.com/api/v1/master-services/${id}/reject`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reason }),
    }
  );
  if (!res.ok) throw new Error("Rejection failed");
};

export const bulkApprove = async (ids: string[]) => {
  const token = localStorage.getItem("token");
  const res = await fetch(
    "https://one-universe-de5673cf0d65.herokuapp.com/api/v1/master-services/bulk-approve",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids }),
    }
  );
  if (!res.ok) throw new Error("Bulk approval failed");
};

export const bulkReject = async (ids: string[], reason?: string) => {
  const token = localStorage.getItem("token");
  const res = await fetch(
    "https://one-universe-de5673cf0d65.herokuapp.com/api/v1/master-services/bulk-reject",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids, reason }),
    }
  );
  if (!res.ok) throw new Error("Bulk rejection failed");
};