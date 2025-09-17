import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const GradeChart = () => {
  const [selectedBar, setSelectedBar] = useState(null);
  const [animationEnabled, setAnimationEnabled] = useState(true);

  const data = [
    {
      subject: "English Language",
      grade: 58,
      shortName: "English\nLanguage",
      fullName: "English Language",
      status: "Pass",
    },
    {
      subject: "Mathematics",
      grade: 88,
      shortName: "Mathematics",
      fullName: "Mathematics",
      status: "Excellent",
    },
    {
      subject: "Basic Science",
      grade: 28,
      shortName: "Basic\nScience",
      fullName: "Basic Science",
      status: "Fail",
    },
    {
      subject: "Social Studies",
      grade: 55,
      shortName: "Social\nStudies",
      fullName: "Social Studies",
      status: "Pass",
    },
    {
      subject: "Civic Education",
      grade: 20,
      shortName: "Civic\nEducation",
      fullName: "Civic Education",
      status: "Fail",
    },
    {
      subject: "Computer Studies ICT",
      grade: 35,
      shortName: "Computer\nStudies ICT",
      fullName: "Computer Studies ICT",
      status: "Fail",
    },
    {
      subject: "Literature in English",
      grade: 78,
      shortName: "Literature\nin English",
      fullName: "Literature in English",
      status: "Good",
    },
    {
      subject: "Yoruba Language",
      grade: 38,
      shortName: "Yoruba\nLanguage",
      fullName: "Yoruba Language",
      status: "Fail",
    },
    {
      subject: "Agricultural Science",
      grade: 40,
      shortName: "Agricultural\nScience",
      fullName: "Agricultural Science",
      status: "Pass",
    },
    {
      subject: "Home Economics",
      grade: 98,
      shortName: "Home\nEconomics",
      fullName: "Home Economics",
      status: "Outstanding",
    },
    {
      subject: "Cultural & Creative Arts",
      grade: 25,
      shortName: "Cultural &\nCreative Arts",
      fullName: "Cultural & Creative Arts",
      status: "Fail",
    },
    {
      subject: "Physical & Health Education",
      grade: 58,
      shortName: "Physical &\nHealth Education",
      fullName: "Physical & Health Education",
      status: "Pass",
    },
  ];

  // Colors alternating between blue and coral
  const colors = [
    "#6366f1",
    "#fb7185",
    "#6366f1",
    "#fb7185",
    "#6366f1",
    "#fb7185",
    "#6366f1",
    "#fb7185",
    "#6366f1",
    "#fb7185",
    "#6366f1",
    "#fb7185",
  ];

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <h3 className="font-semibold text-xs text-gray-900 mb-2">{data.shortName}</h3>
          <p className="text-lg font-bold text-blue-600">{data.grade}%</p>
          <p
            className={`text-xs font-medium ${
              data.status === "Outstanding"
                ? "text-green-600"
                : data.status === "Excellent"
                ? "text-green-500"
                : data.status === "Good"
                ? "text-blue-500"
                : data.status === "Pass"
                ? "text-yellow-500"
                : "text-red-500"
            }`}
          >
            Status: {data.status}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom label component for x-axis
  const CustomXAxisTick = (props) => {
    const { x, y, payload } = props;
    const item = data[payload.index];

    if (!item) return null;

    const lines = item.shortName.split("\n");
    const isSelected = selectedBar === payload.index;

    return (
      <g transform={`translate(${x},${y}) rotate(-45)`}>
        <text
          x={0}
          y={0}
          dy={15}
          textAnchor="end"
          fill={isSelected ? "#2563eb" : "#666"}
          fontSize="11"
          fontWeight={isSelected ? "600" : "400"}
        >
          {item.fullName}
        </text>
      </g>
    );
  };

  // Handle bar click
  const handleBarClick = (data, index) => {
    setSelectedBar(selectedBar === index ? null : index);
  };

  // Get statistics
  const stats = {
    total: data.length,
    average: Math.round(data.reduce((sum, item) => sum + item.grade, 0) / data.length),
    highest: Math.max(...data.map((item) => item.grade)),
    lowest: Math.min(...data.map((item) => item.grade)),
    passing: data.filter((item) => item.grade >= 40).length,
    failing: data.filter((item) => item.grade < 40).length,
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-[900px] mx-auto">
      {/* Header with controls */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-semibold text-gray-900">Average Grade per Subject</h2>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-indigo-500 rounded-sm"></div>
            <div className="w-4 h-4 bg-rose-400 rounded-sm"></div>
            <span className="text-gray-600 text-sm">Subjects</span>
          </div>
        </div>
      </div>

      {/* Selected subject info */}
      {/* {selectedBar !== null && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <h3 className="font-semibold text-gray-900">{data[selectedBar].fullName}</h3>
          <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
            <div>
              <span className="text-gray-600">Grade: </span>
              <span className="font-bold text-blue-600">{data[selectedBar].grade}%</span>
            </div>
            <div>
              <span className="text-gray-600">Status: </span>
              <span
                className={`font-medium ${
                  data[selectedBar].status === "Outstanding"
                    ? "text-green-600"
                    : data[selectedBar].status === "Excellent"
                    ? "text-green-500"
                    : data[selectedBar].status === "Good"
                    ? "text-blue-500"
                    : data[selectedBar].status === "Pass"
                    ? "text-yellow-600"
                    : "text-red-500"
                }`}
              >
                {data[selectedBar].status}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Rank: </span>
              <span className="font-medium">
                #
                {data
                  .sort((a, b) => b.grade - a.grade)
                  .findIndex((item) => item.subject === data[selectedBar].subject) + 1}{" "}
                of {data.length}
              </span>
            </div>
          </div>
        </div>
      )} */}

      {/* Chart */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              bottom: 90,
            }}
            barCategoryGap="20%"
          >
            <CartesianGrid
              strokeDasharray="none"
              stroke="#EDEDED"
              horizontal={true}
              vertical={true}
            />
            <XAxis
              dataKey="subject"
              axisLine={false}
              tickLine={false}
              tick={<CustomXAxisTick />}
              height={30}
              interval={0}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#666" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="grade"
              radius={[8, 8, 0, 0]}
              maxBarSize={40}
              animationDuration={animationEnabled ? 1000 : 0}
              animationBegin={0}
              onClick={handleBarClick}
              cursor="pointer"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={selectedBar === index ? "#1d4ed8" : colors[index]}
                  opacity={selectedBar !== null && selectedBar !== index ? 0.6 : 1}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GradeChart;
