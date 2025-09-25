import React, { useState } from "react";
import { ChevronLeft, ChevronRight, FileText, Plus } from "lucide-react";

const AttendanceCalendar = (): React.JSX.Element => {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 8, 16)); // September 16, 2024

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

              <button className="inline-flex items-center justify-center text-xs sm:text-sm px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md transition-colors shadow-sm w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                New Attendance
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCalendar;

// {/* Main content area */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="bg-white rounded-lg shadow-sm border">
//           <div className="p-6">
//             <h2 className="text-lg font-semibold text-gray-900 mb-4">
//               Attendance for {formatDate(currentDate)}
//             </h2>

//             {/* Placeholder content */}
//             <div className="text-center py-12 text-gray-500">
//               <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
//                 <FileText className="w-8 h-8 text-gray-400" />
//               </div>
//               <p className="text-lg font-medium">No attendance records found</p>
//               <p className="mt-2">
//                 Click "New Attendance" to add attendance records for this date.
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Quick stats */}
//         <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div className="bg-white p-6 rounded-lg shadow-sm border">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Present Today</p>
//                 <p className="text-2xl font-semibold text-green-600">--</p>
//               </div>
//               <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
//                 <div className="w-6 h-6 bg-green-500 rounded-full"></div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-lg shadow-sm border">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Absent Today</p>
//                 <p className="text-2xl font-semibold text-red-600">--</p>
//               </div>
//               <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
//                 <div className="w-6 h-6 bg-red-500 rounded-full"></div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-lg shadow-sm border">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Late Today</p>
//                 <p className="text-2xl font-semibold text-yellow-600">--</p>
//               </div>
//               <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
//                 <div className="w-6 h-6 bg-yellow-500 rounded-full"></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
