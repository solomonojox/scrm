import React, { useState, useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay
} from "date-fns";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const CalendarCard = ({ events = {} }) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(new Date(currentYear, currentMonth));
    const monthEnd = endOfMonth(monthStart);
    const weekStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const days = [];
    let day = weekStart;

    while (day <= weekEnd) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  }, [currentMonth, currentYear]);

  const handleMonthChange = (e) => setCurrentMonth(Number(e.target.value));
  const handleYearChange = (e) => setCurrentYear(Number(e.target.value));

  const years = [];
  for (let y = today.getFullYear() - 5; y <= today.getFullYear() + 5; y++) {
    years.push(y);
  }

  return (
    <div className="flex-1 border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">{MONTHS[currentMonth]} {currentYear}</h3>
        <div className="flex space-x-2">
          <select
            className="border rounded px-2 py-1 text-sm"
            value={currentMonth}
            onChange={handleMonthChange}
          >
            {MONTHS.map((m, idx) => (
              <option key={m} value={idx}>{m}</option>
            ))}
          </select>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={currentYear}
            onChange={handleYearChange}
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="border border-gray-300 rounded-lg p-2 mb-4">
        <div className="grid grid-cols-7 text-center font-semibold mb-2 text-gray-700">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 text-center gap-y-2 text-sm">
          {calendarDays.map((day) => {
            const isCurrentMonth = day.getMonth() === currentMonth;
            const isToday = isSameDay(day, today);
            return (
              <div
                key={day.toISOString()}
                className={`mx-auto w-8 h-8 flex items-center justify-center rounded-full
                  ${!isCurrentMonth ? 'text-gray-400' : ''}
                  ${isToday ? 'bg-blue-500 text-white font-semibold' : ''}
                `}
              >
                {format(day, 'd')}
              </div>
            );
          })}
        </div>
      </div>

      {/* Events */}
      <div>
        <h4 className="font-semibold mb-2 text-gray-800">Today's Schedule</h4>
        <ul className="text-sm list-disc list-inside text-gray-700">
          {(events[format(today, 'yyyy-MM-dd')] || []).map((evt, idx) => (
            <li key={idx}>{evt.time} - {evt.title}</li>
          ))}
          {!(events[format(today, 'yyyy-MM-dd')]?.length) && (
            <li>No events for today.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CalendarCard;
