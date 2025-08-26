// AccademicPerfomance.tsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { subject: "English Language", score: 95 },
  { subject: "Mathematics", score: 50 },
  { subject: "Basic Science", score: 62 },
  { subject: "Social Studies", score: 38 },
  { subject: "Civic Education", score: 52 },
  { subject: "Computer Studies / ICT", score: 88 },
  { subject: "Literature in English", score: 76 },
  { subject: "Yoruba Language", score: 46 },
  { subject: "Agricultural Science", score: 55 },
  { subject: "Home Economics", score: 42 },
  { subject: "Cultural & Creative Arts", score: 87 },
  { subject: "Physical & Health Education", score: 28 },
];

const AcademicPerfomance: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Academic performance</h2>
        <button className="bg-orange-500 text-white text-sm px-4 py-1 rounded-full">
          Weekly
        </button>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="subject"
            tick={{ fontSize: 11 }}
            interval={0}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Bar dataKey="score" fill="#a78bfa" barSize={20} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AcademicPerfomance;
