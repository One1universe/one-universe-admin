export type SupportTicket = {
  id: string;
  ticketId: string;
  username: string;
  subject: string;
  userRole: string;
  description: string;
  attachments?: { name: string; size: string }[];
  priority?: "Low" | "Medium" | "High";
  status: "New" | "In Progress" | "Resolved";
  submittedDate: string;
};
