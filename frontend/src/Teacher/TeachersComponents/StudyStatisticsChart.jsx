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
  { month: "Jan", UX: 2, UI: 4, Dev: 5 },
  { month: "Feb", UX: 3, UI: 5, Dev: 6 },
  { month: "Mar", UX: 2, UI: 4, Dev: 5 },
  { month: "Apr", UX: 3, UI: 5, Dev: 6 },
  { month: "May", UX: 4, UI: 6, Dev: 7 },
  { month: "Jun", UX: 5, UI: 6, Dev: 7 },
  { month: "Jul", UX: 4, UI: 5, Dev: 6 },
  { month: "Aug", UX: 3, UI: 4, Dev: 5 },
  { month: "Sep", UX: 2, UI: 3, Dev: 4 },
  { month: "Oct", UX: 3, UI: 4, Dev: 5 },
  { month: "Nov", UX: 2, UI: 4, Dev: 5 },
  { month: "Dec", UX: 3, UI: 5, Dev: 6 },
];

const StudyStatisticsChart = () => {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-md" style={{ height: "500px", width: "100%" }} >
      <h2 className="text-xl font-semibold mb-4">Study Statistics</h2>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data} layout="horizontal" margin={{ top: 20, right: 30, left: 20, bottom: 5 }} >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="UX" fill="#4682B4" name="UX Design" stackId="study" barSize={15} radius={[10, 10, 10, 10]} />
          <Bar dataKey="UI" fill="#8A2BE2" name="UI Design" stackId="study" barSize={15} radius={[10, 10, 10, 10]} />
          <Bar dataKey="Dev" fill="#FF7F50" name="Development" stackId="study" barSize={15} radius={[10, 10, 10, 10]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StudyStatisticsChart;
