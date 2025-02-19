import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { name: "UI Design", value: 38 },
  { name: "UX Design", value: 18 },
  { name: "Development", value: 12 },
  { name: "UI Motion", value: 10 },
  { name: "Animation", value: 10 },
  { name: "User Research", value: 12 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

const ProjectProgressCard = () => {
  return (
    <div className="flex-1 border border-gray-200 rounded-lg p-4">
      <h3 className="font-semibold mb-4">Progress in Project</h3>
      <div className="w-full h-64">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProjectProgressCard;
