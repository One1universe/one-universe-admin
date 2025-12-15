// components/DateRangePicker.tsx
import React, { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";

export default function DateRangePicker() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedStart, setSelectedStart] = useState<Date | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<Date | null>(null);
  const [hoveredDay, setHoveredDay] = useState<Date | null>(null);

  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const firstDayOfWeek = monthStart.getDay();
  const blankDays = Array(firstDayOfWeek).fill(null);

  const today = new Date();
  const isPastDay = (day: Date): boolean => day < today && !isSameDay(day, today);

  const isInRange = (day: Date): boolean => {
    if (!selectedStart || !selectedEnd) return false;
    return day >= selectedStart && day <= selectedEnd;
  };

 const isStartOrEnd = (day: Date): boolean => {
  return (
    (selectedStart !== null && isSameDay(day, selectedStart)) ||
    (selectedEnd !== null && isSameDay(day, selectedEnd))
  );
};

  const handleDayClick = (day: Date) => {
    if (isPastDay(day)) return;

    if (!selectedStart || (selectedStart && selectedEnd)) {
      setSelectedStart(day);
      setSelectedEnd(null);
    } else {
      if (day < selectedStart) {
        setSelectedStart(day);
        setSelectedEnd(selectedStart);
      } else {
        setSelectedEnd(day);
      }
    }
  };

  const displayText =
    selectedStart && selectedEnd
      ? `${format(selectedStart, "MMM d")} – ${format(selectedEnd, "MMM d, yyyy")}`
      : "Select date range";

  // Close only when clicking outside trigger + popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        popoverRef.current &&
        triggerRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 h-[38px] px-3 rounded-lg border border-[#B5B1B1] bg-white hover:border-gray-400 transition-colors whitespace-nowrap"
      >
        <Calendar size={16} className="text-[#171417]" />
        <span className="text-base font-normal text-[#171417] font-['DM_Sans']">
          Date Range
        </span>
      </button>

      {/* Calendar Popover */}
      {isOpen && (
        <div ref={popoverRef} className="absolute top-full mt-2 right-0 z-50">
          <div className="bg-white rounded-xl border border-[#D0D0D0] shadow-lg p-4 w-[276px]">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 px-2">
              <button
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="p-1 hover:bg-gray-100 rounded-md transition"
              >
                <ChevronLeft size={20} className="text-gray-600" />
              </button>
              <h3 className="text-base font-medium text-[#171417] font-['DM_Sans']">
                {format(currentMonth, "MMMM yyyy")}
              </h3>
              <button
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="p-1 hover:bg-gray-100 rounded-md transition"
              >
                <ChevronRight size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div
                  key={day}
                  className="flex items-center justify-center h-9 w-9 text-sm font-normal text-[#565C69] font-['Inter']"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1">
              {blankDays.map((_, i) => (
                <div key={`blank-${i}`} className="h-9 w-9" />
              ))}

              {days.map((day) => {
                const past = isPastDay(day);
                const inRange = isInRange(day);
                const isStartEnd = isStartOrEnd(day);

                return (
                  <button
                    key={day.toString()}
                    onClick={() => handleDayClick(day)}
                    onMouseEnter={() => setHoveredDay(day)}
                    disabled={past}
                    className={`
                      relative flex items-center justify-center h-9 w-9 text-sm font-normal font-['Inter'] rounded-md transition-all
                      ${past ? "opacity-30 cursor-not-allowed" : "cursor-pointer hover:bg-gray-100"}
                      ${inRange ? "bg-[#154751]/10" : ""}
                      ${isStartEnd ? "bg-[#154751] text-white rounded-full" : "text-[#303237]"}
                    `}
                  >
                    {format(day, "d")}
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-sm text-[#171417] font-['DM_Sans'] mb-3">
                {displayText}
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setSelectedStart(null);
                    setSelectedEnd(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-[#154751] hover:bg-gray-50 rounded-lg transition"
                >
                  Clear
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  disabled={!selectedStart || !selectedEnd}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#154751] rounded-lg hover:bg-[#04171F] disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}