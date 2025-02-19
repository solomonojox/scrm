import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Mon", Pending: 3, Completed: 2 },
  { name: "Tue", Pending: 2, Completed: 3 },
  { name: "Wed", Pending: 3, Completed: 2 },
  { name: "Thu", Pending: 4, Completed: 1 },
  { name: "Fri", Pending: 2, Completed: 3 },
];

const TaskProgressCard = () => {
  return (
    <div className="flex-1 border border-gray-200 rounded-lg p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Task Progress</h3>
        <select className="border rounded px-2 py-1 text-sm">
          <option>This Week</option>
          <option>Last Week</option>
        </select>
      </div>

      {/* Chart */}
      <div className="w-full h-64">
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Pending" fill="#8884d8" />
            <Bar dataKey="Completed" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TaskProgressCard;
