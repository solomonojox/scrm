import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const ProgressChart = () => {
  // Data for the donut chart
  const data = [
    { name: 'Completed', value: 12, total: 25, color: '#3B82F6' },
    { name: 'Visited', value: 14, total: 45, color: '#F97316' },
    { name: 'Empty', value: 100, color: '#1E293B' }  // Background circle
  ];

  return (
    <div className="bg-gray-900 p-6 rounded-lg text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">My Progress</h2>
        <select className="bg-gray-800 text-sm px-3 py-1 rounded-full border border-gray-700">
          <option>Weekly</option>
        </select>
      </div>

      <div className="relative h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Total Hours Overlay */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-sm text-gray-400">Total Hours</div>
          <div className="text-xl font-bold">7h 20m</div>
        </div>
      </div>

      <div className="space-y-2 mt-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-6 bg-orange-500 rounded-sm"></div>
            <span>Visited Lessons</span>
          </div>
          <span className="font-semibold">14/45</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-6 bg-blue-500 rounded-sm"></div>
            <span>Completed</span>
          </div>
          <span className="font-semibold">12/25</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;