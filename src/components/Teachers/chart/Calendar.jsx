import React, { useState, useMemo } from "react";
import { ChevronDown } from "lucide-react";

const Calendar = () => {
  // Use the real current date
  const today = new Date();

  // Initialize current month/year based on today's date
  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const [selectedDates, setSelectedDates] = useState(new Set([today.toISOString().split("T")[0]]));

  const [events, setEvents] = useState({
    [today.toISOString().split("T")[0]]: ["Team Meeting at 2 PM"],
    "2025-09-20": ["Doctor Appointment"],
    "2025-09-25": ["Birthday Party"],
  });

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const years = [2023, 2024, 2025, 2026, 2027];

  // ✅ Helper: compare only year/month/day
  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const getWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  };

  const calendarData = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const firstDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;
    const daysInMonth = lastDayOfMonth.getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const calendar = [];
    let date = 1;
    let nextMonthDate = 1;

    for (let week = 0; week < 6; week++) {
      const weekDates = [];
      let weekNumber = null;

      for (let day = 0; day < 7; day++) {
        if (week === 0 && day < firstDayOfWeek) {
          const prevDate = daysInPrevMonth - (firstDayOfWeek - day - 1);
          const fullDate = new Date(currentYear, currentMonth - 1, prevDate);
          weekDates.push({
            date: prevDate,
            isCurrentMonth: false,
            fullDate,
            isPreviousMonth: true,
          });
          if (day === 0) weekNumber = getWeekNumber(fullDate);
        } else if (date <= daysInMonth) {
          const fullDate = new Date(currentYear, currentMonth, date);
          weekDates.push({
            date,
            isCurrentMonth: true,
            fullDate,
            isToday: isSameDay(fullDate, today),
            isWeekend: day >= 5,
          });
          if (day === 0) weekNumber = getWeekNumber(fullDate);
          date++;
        } else {
          const fullDate = new Date(currentYear, currentMonth + 1, nextMonthDate);
          weekDates.push({
            date: nextMonthDate,
            isCurrentMonth: false,
            fullDate,
            isNextMonth: true,
          });
          if (day === 0) weekNumber = getWeekNumber(fullDate);
          nextMonthDate++;
        }
      }

      calendar.push({ weekNumber, dates: weekDates });
    }

    return calendar;
  }, [currentYear, currentMonth, today]);

  const todaysEvents = useMemo(() => {
    const todayString = today.toISOString().split("T")[0];
    return events[todayString] || [];
  }, [events, today]);

  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value);
    setCurrentDate(new Date(currentYear, newMonth, 1));
  };

  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value);
    setCurrentDate(new Date(newYear, currentMonth, 1));
  };

  const handleDateClick = (dateObj) => {
    const dateString = dateObj.fullDate.toISOString().split("T")[0];
    const newSelectedDates = new Set(selectedDates);

    if (newSelectedDates.has(dateString)) {
      newSelectedDates.delete(dateString);
    } else {
      newSelectedDates.add(dateString);
    }

    setSelectedDates(newSelectedDates);
  };

  const isDateSelected = (dateObj) => {
    const dateString = dateObj.fullDate.toISOString().split("T")[0];
    return selectedDates.has(dateString);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Calendar</h2>

        <div className="flex gap-2">
          {/* Month Dropdown */}
          <div className="relative">
            <select
              value={currentMonth}
              onChange={handleMonthChange}
              className="appearance-none bg-gray-50 border border-gray-200 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {months.map((month, index) => (
                <option key={month} value={index}>
                  {month}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Year Dropdown */}
          <div className="relative">
            <select
              value={currentYear}
              onChange={handleYearChange}
              className="appearance-none bg-gray-50 border border-gray-200 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Month Badge */}
      <div className="text-center mb-4">
        <span className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium">
          {months[currentMonth]}
        </span>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-8 gap-1 mb-4">
        {/* Empty cell for week number column header */}
        <div></div>

        {/* Week days header */}
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={`text-center py-2 text-sm font-medium ${
              index >= 5 ? "text-blue-500" : "text-gray-500"
            }`}
          >
            {day}
          </div>
        ))}

        {/* Calendar dates with week numbers */}
        {calendarData.map((week, weekIndex) => (
          <React.Fragment key={weekIndex}>
            {/* Week number */}
            <div className="flex items-center justify-center h-10">
              <div className="bg-indigo-500 text-white text-xs font-medium px-2 py-1 rounded min-w-[24px] text-center">
                {week.weekNumber}
              </div>
            </div>

            {/* Week dates */}
            {week.dates.map((dateObj, dayIndex) => (
              <button
                key={`${weekIndex}-${dayIndex}`}
                onClick={() => handleDateClick(dateObj)}
                className={`
                  relative px-4 h-10 flex items-center justify-center text-sm cursor-pointer rounded transition-all
                  ${
                    !dateObj.isCurrentMonth
                      ? "text-gray-400 hover:bg-gray-50"
                      : "text-gray-900 hover:bg-gray-100"
                  }
                  ${dateObj.isToday ? "bg-red-500 text-white font-semibold hover:bg-red-600" : ""}
                  ${
                    isDateSelected(dateObj) && !dateObj.isToday
                      ? "bg-indigo-500 text-white font-medium hover:bg-indigo-600"
                      : ""
                  }
                  ${
                    dateObj.isWeekend &&
                    dateObj.isCurrentMonth &&
                    !dateObj.isToday &&
                    !isDateSelected(dateObj)
                      ? "text-blue-500"
                      : ""
                  }
                `}
              >
                {dateObj.date}
              </button>
            ))}
          </React.Fragment>
        ))}
      </div>

      {/* Today's Event Section */}
      <div className="pt-2 border-t border-gray-200">
        <h3 className="text-red-600 font-semibold mb-2">Today's Event</h3>
        {todaysEvents.length > 0 ? (
          <ul className="space-y-1">
            {todaysEvents.map((event, index) => (
              <li key={index} className="text-sm text-red-500">
                {event}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-red-500 text-sm">No events today.</p>
        )}
      </div>
    </div>
  );
};

export default Calendar;
