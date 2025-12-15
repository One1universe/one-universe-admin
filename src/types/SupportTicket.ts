// src/types/SupportTicket.ts
export type SupportTicketStatus = "New" | "In Progress" | "Resolved";
export type SupportTicketApiStatus = "NEW" | "IN_PROGRESS" | "RESOLVED";

export interface SupportTicket {
  id: string;
  ticketId: string;
  username: string;
  userRole?: string;
  subject: string;
  description: string;
  status: SupportTicketStatus;
  originalStatus?: SupportTicketApiStatus; // Add this for API status
  submittedDate: string;
  attachments?: {
    name: string;
    size: string;
  }[];
}