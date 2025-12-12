// src/components/ExportModal.tsx
"use client";

import { X } from "lucide-react";
import { useState } from "react";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: "csv" | "pdf") => void;
}

export default function ExportModal({ isOpen, onClose, onExport }: ExportModalProps) {
  const [format, setFormat] = useState<"csv" | "pdf">("csv");

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6 border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#171417]">Export Data</h2>
            <button
              onClick={onClose}
              className="rounded-lg p-2 hover:bg-gray-100 transition"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Format Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-[#05060D]">Export Format</h3>

          <div className="space-y-3">
            {/* CSV Option */}
            <label
              className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition-all ${
                format === "csv"
                  ? "border-[#154751] bg-[#F0F7F7]"
                  : "border-gray-300 bg-white hover:border-gray-400"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="export-format"
                  value="csv"
                  checked={format === "csv"}
                  onChange={() => setFormat("csv")}
                  className="sr-only" // hidden but accessible
                />
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
                    format === "csv"
                      ? "border-[#154751] bg-[#154751]"
                      : "border-gray-400 bg-white"
                  }`}
                >
                  {format === "csv" && (
                    <div className="h-2 w-2 rounded-full bg-white" />
                  )}
                </div>
                <span className="font-medium text-[#3C3C3C]">CSV</span>
              </div>
              <span className="text-sm text-gray-500">Spreadsheet format</span>
            </label>

            {/* PDF Option */}
            <label
              className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition-all ${
                format === "pdf"
                  ? "border-[#154751] bg-[#F0F7F7]"
                  : "border-gray-300 bg-white hover:border-gray-400"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="export-format"
                  value="pdf"
                  checked={format === "pdf"}
                  onChange={() => setFormat("pdf")}
                  className="sr-only"
                />
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
                    format === "pdf"
                      ? "border-[#154751] bg-[#154751]"
                      : "border-gray-400 bg-white"
                  }`}
                >
                  {format === "pdf" && (
                    <div className="h-2 w-2 rounded-full bg-white" />
                  )}
                </div>
                <span className="font-medium text-[#3C3C3C]">PDF</span>
              </div>
              <span className="text-sm text-gray-500">Document format</span>
            </label>
          </div>
        </div>

        {/* Download Button */}
        <div className="mt-8">
          <button
            onClick={() => onExport(format)}
            className="w-full rounded-2xl bg-gradient-to-r from-[#154751] to-[#04171F] py-4 text-lg font-medium text-white transition hover:opacity-90 active:scale-[0.98]"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
}