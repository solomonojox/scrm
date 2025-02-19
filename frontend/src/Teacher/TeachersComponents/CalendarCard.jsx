import React from "react";

const CalendarCard = () => {
  return (
    <div className="flex-1 border border-gray-200 rounded-lg p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">September</h3>
        <select className="border rounded px-2 py-1 text-sm">
          <option>2022</option>
          <option>2023</option>
        </select>
      </div>

      {/* Simple Calendar Grid */}
      <div className="border border-gray-300 rounded-lg p-2 mb-4">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 text-center font-semibold mb-2">
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
          <div>Sun</div>
        </div>
        {/* Days (example row) */}
        <div className="grid grid-cols-7 text-center gap-y-2">
          <div>5</div>
          <div>6</div>
          <div>7</div>
          <div>8</div>
          <div>9</div>
          <div>10</div>
          <div>11</div>
        </div>
      </div>

      {/* Events */}
      <div>
        <h4 className="font-semibold mb-2">Today's Schedule</h4>
        <ul className="text-sm list-disc list-inside text-gray-700">
          <li>09:00 AM - Sync with Design Team</li>
          <li>11:00 AM - UX Review</li>
          <li>02:00 PM - Development Sprint</li>
        </ul>
      </div>
    </div>
  );
};

export default CalendarCard;
