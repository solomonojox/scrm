// AssignmentCompletion.tsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Dot,
} from "recharts";

const data = [
  { subject: "English Language", assignments: 95 },
  { subject: "Mathematics", assignments: 55 },
  { subject: "Basic Science", assignments: 65 },
  { subject: "Social Studies", assignments: 45 },
  { subject: "Civic Education", assignments: 60 },
  { subject: "Computer Studies / ICT", assignments: 90 },
  { subject: "Literature in English", assignments: 80 },
  { subject: "Yoruba Language", assignments: 50 },
  { subject: "Agricultural Science", assignments: 58 },
  { subject: "Home Economics", assignments: 46 },
  { subject: "Cultural & Creative Arts", assignments: 89 },
  { subject: "Physical & Health Education", assignments: 35 },
];

const AssignmentCompletion: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Assignment Completion</h2>
        <button className="bg-orange-500 text-white text-sm px-4 py-1 rounded-full">
          Weekly
        </button>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="subject"
            tick={{ fontSize: 11 }}
            interval={0}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis domain={[0, 100]} label={{ value: "Number of Assignments", angle: -90, position: "insideLeft", style: { textAnchor: "middle" } }} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="assignments"
            stroke="#8b5cf6"
            strokeWidth={2}
            dot={{ stroke: "#8b5cf6", fill: "white", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AssignmentCompletion;