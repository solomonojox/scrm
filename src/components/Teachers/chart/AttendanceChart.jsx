import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
  Tooltip,
} from "recharts";

const AttendanceChart = () => {
  const [selectedWeek, setSelectedWeek] = useState(null);

  const icon = {
    ico: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 17 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="0.5" y="7" width="16" height="2" fill="#1D0F81" />
        <circle cx="8.5" cy="8" r="3.5" fill="white" stroke="#1D0F81" />
      </svg>
    ),
  };

  const data = [
    { week: "Wk 1", weekNumber: 1, attendance: 75, fullWeek: "Week 1" },
    { week: "Wk 2", weekNumber: 2, attendance: 24, fullWeek: "Week 2" },
    { week: "Wk 3", weekNumber: 3, attendance: 19, fullWeek: "Week 3" },
    { week: "Wk 4", weekNumber: 4, attendance: 44, fullWeek: "Week 4" },
    { week: "Wk 5", weekNumber: 5, attendance: 37, fullWeek: "Week 5" },
    { week: "Wk 6", weekNumber: 6, attendance: 63, fullWeek: "Week 6" },
    { week: "Wk 7", weekNumber: 7, attendance: 65, fullWeek: "Week 7" },
    { week: "Wk 8", weekNumber: 8, attendance: 96, fullWeek: "Week 8" },
    { week: "Wk 9", weekNumber: 9, attendance: 45, fullWeek: "Week 9" },
    { week: "Wk 10", weekNumber: 10, attendance: 31, fullWeek: "Week 10" },
    { week: "Wk 11", weekNumber: 11, attendance: 42, fullWeek: "Week 11" },
    { week: "Wk 12", weekNumber: 12, attendance: 55, fullWeek: "Week 12" },
  ];

  // Calculate trend analysis
  const currentWeek = data[data.length - 1];
  const previousWeek = data[data.length - 2];
  const attendanceChange = currentWeek.attendance - previousWeek.attendance;
  const changePercentage = Math.abs(Math.round((attendanceChange / previousWeek.attendance) * 100));
  const isIncrease = attendanceChange > 0;
  const isDecrease = attendanceChange < 0;

  // Calculate statistics
  const stats = {
    average: Math.round(data.reduce((sum, item) => sum + item.attendance, 0) / data.length),
    highest: Math.max(...data.map((item) => item.attendance)),
    lowest: Math.min(...data.map((item) => item.attendance)),
    trend: isIncrease ? "Increasing" : isDecrease ? "Decreasing" : "Stable",
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{data.fullWeek}</p>
          <p className="text-lg font-bold text-indigo-600">{data.attendance}%</p>
          <p className="text-xs text-gray-500">Attendance Rate</p>
        </div>
      );
    }
    return null;
  };

  // Handle point click
  const handlePointClick = (data, index) => {
    setSelectedWeek(selectedWeek === index ? null : index);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Attendance Trend</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <p>{icon.ico}</p>
            <span className="text-gray-600 text-sm">Weeks 1 - 12</span>
          </div>
        </div>
      </div>

      {/* Selected week info */}
      {selectedWeek !== null && (
        <div className="mb-6 p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-500">
          <h3 className="font-semibold text-gray-900">{data[selectedWeek].fullWeek}</h3>
          <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
            <div>
              <span className="text-gray-600">Attendance Rate: </span>
              <span className="font-bold text-indigo-600">{data[selectedWeek].attendance}%</span>
            </div>
            <div>
              <span className="text-gray-600">Rank: </span>
              <span className="font-medium">
                #
                {data
                  .sort((a, b) => b.attendance - a.attendance)
                  .findIndex((item) => item.weekNumber === data[selectedWeek].weekNumber) + 1}{" "}
                of {data.length}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="h-80 w-full mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 20,
              bottom: 15,
            }}
          >
            <defs>
              <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="none"
              stroke="#e5e7eb"
              horizontal={true}
              vertical={true}
            />
            <XAxis
              dataKey="week"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#666" }}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#666" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="attendance"
              stroke="#6366f1"
              strokeWidth={3}
              fill="url(#attendanceGradient)"
              dot={{
                fill: "#6366f1",
                strokeWidth: 2,
                stroke: "#6366f1",
                r: 4,
                cursor: "pointer",
              }}
              activeDot={{
                r: 6,
                fill: "#6366f1",
                stroke: "#fff",
                strokeWidth: 2,
              }}
              onClick={handlePointClick}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Trend Analysis */}
      <div className="mb-6">
        {isDecrease && (
          <p className="text-red-600 text-center font-medium">
            Attendance was {changePercentage}% lower this week
          </p>
        )}
        {isIncrease && (
          <p className="text-green-600 text-center font-medium">
            Attendance was {changePercentage}% higher this week
          </p>
        )}
        {!isIncrease && !isDecrease && (
          <p className="text-gray-600 text-center font-medium">
            Attendance remained stable this week
          </p>
        )}
      </div>
    </div>
  );
};

export default AttendanceChart;
