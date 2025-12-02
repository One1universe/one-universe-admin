"use client";

import React, { useState } from "react";
import { SupportTicket } from "@/types/SupportTicket";

interface TicketDetailViewProps {
  ticket: SupportTicket;
  onClose: () => void;
}

const TicketDetailView = ({ ticket, onClose }: TicketDetailViewProps) => {
  const [response, setResponse] = useState("");
  const [adminResponses, setAdminResponses] = useState<string[]>([]);

  const userResponses = [ticket.description || "No initial message from user."];

  const getStatusStyles = (status: SupportTicket["status"]) => {
    switch (status) {
      case "Resolved": return "bg-[#E0F5E6] text-[#1FC16B]";
      case "In Progress": return "bg-[#D3E1FF] text-[#007BFF]";
      case "New": return "bg-[#FFF2B9] text-[#9D7F04]";
      default: return "";
    }
  };

  const StatusIcon = ({ status }: { status: SupportTicket["status"] }) => {
    if (status === "Resolved") {
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6.00016 10.7803L3.2135 8.00033L2.2735 8.94033L6.00016 12.667L14.0002 4.66699L13.0602 3.72699L6.00016 10.7803Z" fill="#1FC16B"/>
        </svg>
      );
    }
    if (status === "In Progress") {
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6" stroke="#007BFF" strokeWidth="2" fill="none" />
          <path d="M8 4V8L10.5 10.5" stroke="#007BFF" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    }
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="3" fill="#9D7F04" />
      </svg>
    );
  };

  const handleSendResponse = () => {
    if (response.trim()) {
      setAdminResponses([...adminResponses, response]);
      setResponse("");
    }
  };

  const handleAddNewResponse = () => setResponse("");

  const handleMarkAsResolved = () => {
    alert(`Ticket ${ticket.ticketId} marked as resolved!`);
    onClose();
  };

  // REUSABLE CONTENT — used on both desktop and mobile
  const ModalContent = () => (
    <>
      {/* Header */}
      <div className="bg-[#E8FBF7] px-6 py-5 md:px-8 md:py-6 border-b border-[#E8E3E3] flex items-center justify-between sticky top-0 z-10">
        <h2 className="font-dm-sans font-bold text-xl leading-[140%] text-[#171417]">
          Ticket ID: {ticket.ticketId}
        </h2>
        <button onClick={onClose} className="p-1 hover:bg-white rounded-lg transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="#171417" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 md:px-8 space-y-8">
        {/* All your original content — 100% unchanged */}
        <div className="space-y-5">
          <div className="flex items-start gap-4">
            <span className="font-dm-sans font-medium text-base text-[#171417] min-w-[160px]">User</span>
            <div className="flex items-center gap-2">
              <span className="font-dm-sans font-medium text-base text-[#454345]">{ticket.username}</span>
              <span className="font-dm-sans text-sm text-[#171417] px-2 py-0.5 bg-gray-100 rounded">
                {ticket.userRole || "User"}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <span className="font-dm-sans font-medium text-base text-[#171417] min-w-[160px]">Status</span>
            <div className={`inline-flex items-center gap-[6px] px-2 py-1 rounded-lg ${getStatusStyles(ticket.status)}`}>
              <StatusIcon status={ticket.status} />
              <span className="font-dm-sans text-sm leading-[140%]">{ticket.status}</span>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <span className="font-dm-sans font-medium text-base text-[#171417] min-w-[160px]">Submitted on</span>
            <span className="font-dm-sans text-base text-[#454345]">{ticket.submittedDate}</span>
          </div>

          <div className="flex items-start gap-4">
            <span className="font-dm-sans font-medium text-base text-[#171417] min-w-[160px]">Subject</span>
            <span className="font-dm-sans text-base text-[#454345]">{ticket.subject}</span>
          </div>

          <div className="flex items-start gap-4">
            <span className="font-dm-sans font-medium text-base text-[#171417] min-w-[160px]">Description</span>
            <span className="font-dm-sans text-base text-[#454345] leading-[140%] whitespace-pre-wrap">
              {ticket.description}
            </span>
          </div>

          {ticket.attachments && ticket.attachments.length > 0 && (
            <div className="flex items-start gap-4">
              <span className="font-dm-sans font-medium text-base text-[#171417] min-w-[160px]">Attachments</span>
              <div className="space-y-2">
                {ticket.attachments.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                      <path d="M8 4H16L20 8V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H8C7.46957 22 6.96086 21.7893 6.58579 21.4142C6.21071 21.0391 6 20.5304 6 20V6C6 5.46957 6.21071 4.96086 6.58579 4.58579C6.96086 4.21071 7.46957 4 8 4Z" stroke="#454345" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div>
                      <p className="font-dm-sans font-medium text-sm text-[#303237]">{file.name}</p>
                      <p className="font-dm-sans text-sm text-[#8C8989]">{file.size}</p>
                    </div>
                    <button className="ml-2">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M7 10L12 15M12 15L17 10M12 15V3" stroke="#454345" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Message */}
        {userResponses.map((msg, i) => (
          <div key={i} className="space-y-2">
            <h3 className="font-dm-sans font-medium text-base text-[#171417]">User Message</h3>
            <div className="bg-[#E8FBF7] rounded-xl px-4 py-3">
              <p className="font-dm-sans text-base leading-[140%] text-[#171417]">{msg}</p>
            </div>
          </div>
        ))}

        {/* Admin Responses */}
        {adminResponses.map((resp, i) => (
          <div key={i} className="space-y-2">
            <h3 className="font-dm-sans font-medium text-base text-[#171417]">Admin Response #{i + 1}</h3>
            <div className="bg-[#FFFAFA] rounded-xl px-4 py-3">
              <p className="font-dm-sans text-base leading-[140%] text-[#171417]">{resp}</p>
            </div>
          </div>
        ))}

        {/* Response Section */}
        {adminResponses.length === 0 ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="font-dm-sans font-medium text-base text-[#171417]">Respond to User:</label>
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Type your response here..."
                className="w-full border border-[#B2B2B4] rounded-xl px-4 py-3 font-dm-sans text-base placeholder:text-[#B2B2B4] focus:outline-none focus:border-[#154751] resize-none"
                rows={4}
              />
            </div>
            <div className="flex items-center gap-2 text-[#454345]">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="#454345" strokeWidth="2"/>
                <path d="M10 6V10L13 13" stroke="#454345" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <p className="font-dm-sans text-base">Response will be sent via in-app message or email depending on user settings</p>
            </div>
            <button
              onClick={handleSendResponse}
              disabled={!response.trim()}
              className={`w-full md:w-auto px-6 py-3 md:py-4 rounded-[36px] font-dm-sans font-medium text-base text-center transition-all ${
                response.trim()
                  ? "bg-gradient-to-br from-[#154751] to-[#04171F] text-white hover:opacity-90"
                  : "bg-[#ACC5CF] text-[#FFFEFE] cursor-not-allowed"
              }`}
            >
              Send Response
            </button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-4 justify-end">
            <button onClick={handleAddNewResponse} className="flex items-center justify-center gap-2 px-6 py-4 rounded-[36px] hover:bg-gray-50 transition-colors border border-gray-200">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 5V19M5 12H19" stroke="url(#gradient)" strokeWidth="2" strokeLinecap="round"/>
                <defs>
                  <radialGradient id="gradient">
                    <stop offset="0.37" stopColor="#154751"/>
                    <stop offset="1" stopColor="#04171F"/>
                  </radialGradient>
                </defs>
              </svg>
              <span className="font-dm-sans font-medium text-base" style={{
                background: "radial-gradient(50% 50% at 50% 50%, #154751 37%, #04171F 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                Add New Response
              </span>
            </button>
            <button onClick={handleMarkAsResolved} className="px-6 py-4 rounded-[36px] bg-gradient-to-br from-[#154751] to-[#04171F] text-white font-dm-sans font-medium text-base hover:opacity-90 transition-opacity">
              Mark as Resolved
            </button>
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* DESKTOP: Centered Modal */}
      <div className="hidden md:fixed md:inset-0 md:z-[200] md:flex md:items-center md:justify-center md:p-4">
        <div className="absolute inset-0" onClick={onClose} style={{ background: "rgba(0,0,0,0.05)" }} />
        <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-[671px] max-h-[90vh] overflow-y-auto">
          <ModalContent />
        </div>
      </div>

      {/* MOBILE: Bottom Sheet — SAME DESIGN, slides up */}
      <div className="md:hidden fixed inset-0 z-[200] flex items-end">
        <div className="absolute inset-0" onClick={onClose} style={{ background: "rgba(0,0,0,0.05)" }} />
        <div 
          className="relative w-full bg-white rounded-t-2xl shadow-2xl max-h-[90vh] overflow-y-auto animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          <ModalContent />
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.35s ease-out; }
      `}</style>
    </>
  );
};

export default TicketDetailView;