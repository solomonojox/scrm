import React, { useState } from "react";
import { ChevronLeft, ChevronRight, FileText, Plus, X } from "lucide-react";

const AttendanceCalendar = (): React.JSX.Element => {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 8, 16)); // September 16, 2024
  const [newAttendanceOpen, setNewAttendanceOpen] = useState(false);

  const toggleNewAttendance = () => {
    setNewAttendanceOpen(!newAttendanceOpen);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  const navigateDate = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + direction);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="bg-gray-50 w-full">
      {/* Header */}
      <div className="bg-white shadow-sm border rounded-md">
        <div className="lg:max-w-7xl mx-auto">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between px-4 sm:px-6 lg:px-8 py-4">
            {/* Left side - Attendance title and date navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 gap-4">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Attendance</h1>
                <p className="h-8 w-[0.5px] bg-gray-400"></p>
              </div>
              {/* Date navigation */}
              <div className="flex items-center justify-between sm:justify-start space-x-2">
                <button
                  onClick={() => navigateDate(-1)}
                  className="p-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md transition-colors"
                  aria-label="Previous day"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>

                <div className="text-base sm:text-lg font-medium text-gray-900 min-w-[120px] sm:min-w-[150px] text-center">
                  {formatDate(currentDate)}
                </div>

                <button
                  onClick={() => navigateDate(1)}
                  className="p-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md transition-colors"
                  aria-label="Next day"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>

                <button
                  onClick={goToToday}
                  className="px-3 py-2 text-xs sm:text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Today
                </button>
              </div>
            </div>

            {/* Right side - Action buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <button className="inline-flex items-center justify-center text-xs sm:text-sm px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md transition-colors shadow-sm w-full sm:w-auto">
                <FileText className="w-4 h-4 mr-2" />
                Attendance Report
              </button>

              <button
                onClick={toggleNewAttendance}
                className="inline-flex items-center justify-center text-xs sm:text-sm px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md transition-colors shadow-sm w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Attendance
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* New Attendance Modal */}
      {newAttendanceOpen && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-10 flex items-center justify-center z-50">
          <div className="bg-white h-screen w-[600px] rounded-md shadow-lg p-6">
            <button
              onClick={toggleNewAttendance}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-medium mb-4">New Attendance</h2>
            <form className="space-y-4">{/* Form fields go here */}</form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceCalendar;
