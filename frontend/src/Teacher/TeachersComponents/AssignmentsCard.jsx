import React from "react";

const assignments = [
  {
    id: 1,
    title: "User Research for GSpace",
    date: "20 Sep 2022",
    progress: "100%",
  },
  {
    id: 2,
    title: "User Persona for Ollyan",
    date: "22 Sep 2022",
    progress: "100%",
  },
  {
    id: 3,
    title: "User Research for GSpace",
    date: "25 Sep 2022",
    progress: "80%",
  },
];

const AssignmentsCard = () => {
  return (
    <div className="flex-1 border border-gray-200 rounded-lg p-4">
      {/* Header */}
      <div className="flex justify-between mb-4">
        <h3 className="font-semibold">
          Assignments (<span className="text-blue-600">20</span>)
        </h3>
        <span className="text-gray-500 text-sm">36% Complete</span>
      </div>

      {/* List */}
      <ul className="space-y-3">
        {assignments.map((item) => (
          <li key={item.id} className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" />
            <div className="flex-1">
              <h4 className="font-medium text-sm">{item.title}</h4>
              <p className="text-xs text-gray-500">
                Due: {item.date} • Progress: {item.progress}
              </p>
            </div>
            <button className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
              View
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssignmentsCard;
