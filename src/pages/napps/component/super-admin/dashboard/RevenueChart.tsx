import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  {
    chapter: 'Lagos',
    totalRevenue: 475000,
    chapterShare: 95000, // 20% of 475k
  },
  {
    chapter: 'FCT',
    totalRevenue: 245000,
    chapterShare: 49000, // 20% of 245k
  },
  {
    chapter: 'Rivers',
    totalRevenue: 75000,
    chapterShare: 15000, // 20% of 75k
  },
];

// Custom formatter for the Y-Axis labels (e.g., 150K)
const formatYAxis = (value: any) => {
  if (value === 0) return '₦0K';
  return `₦${value / 1000}K`;
};

const RevenueChart = () => {
  return (
    <div className="w-full max-w-full p-6 bg-white border border-gray-100 rounded-xl shadow-sm">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900">Revenue by Chapter</h2>
        <p className="text-sm text-gray-500 mt-1">
          Expected revenue based on student count (₦500/student/term) and 20% chapter share
        </p>
      </div>

      {/* Chart Container */}
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            barGap={8}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="#E5E7EB"
            />
            <XAxis
              dataKey="chapter"
              axisLine={true}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 14 }}
              dy={10}
            />
            <YAxis
              tickFormatter={formatYAxis}
              axisLine={true}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
              ticks={[0, 150000, 300000, 450000, 600000]}
            />
            <Tooltip
              cursor={{ fill: '#F9FAFB' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              formatter={(value) => [`₦${value.toLocaleString()}`, '']}
            />

            {/* Total Revenue Bar (Purple/Blue) */}
            <Bar
              dataKey="totalRevenue"
              fill="#5243ED"
              radius={[2, 2, 0, 0]}
              barSize={120}
            />

            {/* Chapter Share Bar (Green) */}
            <Bar
              dataKey="chapterShare"
              fill="#10B981"
              radius={[2, 2, 0, 0]}
              barSize={120}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;