"use client";

import React, { useState } from "react";
import { SupportTicket } from "@/types/SupportTicket";
import ActionMenu from "../../components/tickets/ActionMenu";
import StatusIcon from "../../components/tickets/StatusIcon";
import TicketDetailView from "./TicketDetailView";
import EmptyState from "../../EmptyState"; // ← Your smart empty state

const SupportTicketsTable = () => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  const tickets: SupportTicket[] = [
    {
      id: "1",
      ticketId: "#4685",
      username: "Wade Warren",
      userRole: "Buyer",
      subject: "Unable to upload profile picture",
      description: "I keep getting an error when trying to upload my profile picture.",
      status: "Resolved",
      submittedDate: "12, May 2025",
    },
    {
      id: "2",
      ticketId: "#4684",
      username: "Sarah Smith",
      userRole: "Seller",
      subject: "Payment processing error",
      description: "Payment failed during checkout with error code 503.",
      status: "In Progress",
      submittedDate: "Nov 30, 2024",
    },
    {
      id: "3",
      ticketId: "#4683",
      username: "Mike Jones",
      userRole: "Buyer",
      subject: "Account verification issue",
      description: "I never received the verification email after signing up.",
      status: "New",
      submittedDate: "Nov 29, 2024",
      attachments: [{ name: "Screenshot.png", size: "200 KB" }],
    },
  ];

  const handleActionClick = (
    ticketId: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const menuWidth = 206;
    const menuHeight = 180;
    const padding = 16;

    let left = rect.right - menuWidth;
    if (left < padding) left = padding;
    if (left + menuWidth > window.innerWidth - padding) {
      left = window.innerWidth - menuWidth - padding;
    }

    let top = rect.bottom + window.scrollY + 8;
    if (top + menuHeight > window.innerHeight + window.scrollY) {
      top = rect.top + window.scrollY - menuHeight - 8;
    }

    setMenuPosition({ top, left });
    setOpenMenuId(prev => prev === ticketId ? null : ticketId);
  };

  const openTicketDetail = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setOpenMenuId(null);
  };

  const getStatusStyles = (status: SupportTicket["status"]) => {
    switch (status) {
      case "Resolved": return "bg-[#E0F5E6] text-[#1FC16B]";
      case "In Progress": return "bg-[#D3E1FF] text-[#007BFF]";
      case "New": return "bg-[#FFF2B9] text-[#9D7F04]";
      default: return "";
    }
  };

  const openTicket = openMenuId ? tickets.find(t => t.id === openMenuId) : null;

  return (
    <>
      {/* === CONTENT WHEN THERE ARE TICKETS === */}
      {tickets.length > 0 ? (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block w-full overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-[#FFFCFC] border-b border-[#E5E5E5]">
                  <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">Ticket ID</th>
                  <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">Username</th>
                  <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">Subject</th>
                  <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">Status</th>
                  <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">Submitted Date</th>
                  <th className="py-[18px] px-[25px] font-inter font-medium text-base text-[#7B7B7B]">Action</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="bg-white border-b border-[#E5E5E5] hover:bg-[#FAFAFA]">
                    <td className="py-[18px] px-[25px] font-dm-sans text-base text-[#303237]">{ticket.ticketId}</td>
                    <td className="py-[18px] px-[25px] font-dm-sans text-base text-[#303237]">{ticket.username}</td>
                    <td className="py-[18px] px-[25px] font-dm-sans text-base text-[#303237] max-w-[300px] truncate">{ticket.subject}</td>
                    <td className="py-[18px] px-[25px]">
                      <div className={`inline-flex items-center gap-[6px] px-2 py-1 rounded-lg ${getStatusStyles(ticket.status)}`}>
                        <StatusIcon status={ticket.status} />
                        <span className="font-dm-sans text-sm">{ticket.status}</span>
                      </div>
                    </td>
                    <td className="py-[18px] px-[25px] font-dm-sans text-base text-[#303237]">{ticket.submittedDate}</td>
                    <td className="py-[18px] px-[25px]">
                      <button
                        onClick={(e) => handleActionClick(ticket.id, e)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-[#303237]">
                          <circle cx="10" cy="5" r="2" fill="currentColor" />
                          <circle cx="10" cy="10" r="2" fill="currentColor" />
                          <circle cx="10" cy="15" r="2" fill="currentColor" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4 p-4">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="bg-white border border-[#E8E3E3] rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-dm-sans font-medium text-base text-[#303237]">{ticket.username}</span>
                      <span className="font-dm-sans text-sm text-[#454345]">{ticket.ticketId}</span>
                    </div>
                    <p className="font-dm-sans text-sm text-[#454345]">{ticket.submittedDate}</p>
                  </div>
                  <button
                    onClick={(e) => handleActionClick(ticket.id, e)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-[#303237]">
                      <circle cx="10" cy="5" r="2" fill="currentColor" />
                      <circle cx="10" cy="10" r="2" fill="currentColor" />
                      <circle cx="10" cy="15" r="2" fill="currentColor" />
                    </svg>
                  </button>
                </div>
                <p className="font-dm-sans text-sm text-[#303237] mb-3">{ticket.subject}</p>
                <div className={`inline-flex items-center gap-[6px] px-2 py-1 rounded-lg ${getStatusStyles(ticket.status)}`}>
                  <StatusIcon status={ticket.status} />
                  <span className="font-dm-sans text-sm">{ticket.status}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* === EMPTY STATE === */
        <EmptyState type="support" />
      )}

      {/* Action Menu */}
      {openTicket && (
        <ActionMenu
          ticket={openTicket}
          isOpen={true}
          onClose={() => setOpenMenuId(null)}
          position={menuPosition}
          onViewDetails={openTicketDetail}
        />
      )}

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <TicketDetailView ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
      )}
    </>
  );
};

export default SupportTicketsTable;