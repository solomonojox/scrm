import React from 'react';
import { MdEdit, MdAccessTime, MdPeople } from 'react-icons/md';
import { BsBox } from 'react-icons/bs';
import { FaPencilAlt } from 'react-icons/fa';

const UpcomingClasses = () => {
  // Dummy data for classes
  const classes = [
    {
      id: 1,
      title: "UX Writing for Begainners",
      instructor: "Royal Parvej",
      duration: "01:30m",
      students: 12,
      icon: <FaPencilAlt className="text-blue-500" />
    },
    {
      id: 2,
      title: "How to Do Multitasking Esily",
      instructor: "Esther Howard",
      duration: "02h 40m",
      students: 12,
      icon: <BsBox className="text-purple-500" />
    },
    {
      id: 3,
      title: "UI Design Advance Course",
      instructor: "Guy Hawkins",
      duration: "02h 20m",
      students: 12,
      icon: <MdEdit className="text-orange-500" />
    }
  ];

  return (
    <div className="bg-gray-50 p-6 rounded-xl">
      <h2 className="text-2xl font-semibold mb-6">Upcomming Classes</h2>
      
      <div className="space-y-4">
        {classes.map((classItem) => (
          <div 
            key={classItem.id}
            className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm"
          >
            {/* Icon Container */}
            <div className="p-3 bg-gray-100 rounded-xl">
              {classItem.icon}
            </div>

            {/* Class Info */}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{classItem.title}</h3>
              <div className="flex items-center gap-4 mt-2">
                {/* Instructor */}
                <div className="flex items-center gap-1">
                  <img 
                    src="/api/placeholder/20/20"
                    alt={classItem.instructor}
                    className="w-5 h-5 rounded-full"
                  />
                  <span className="text-sm text-gray-600">{classItem.instructor}</span>
                </div>

                {/* Duration */}
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <MdAccessTime className="text-gray-400" />
                  <span>{classItem.duration}</span>
                </div>

                {/* Students */}
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <MdPeople className="text-gray-400" />
                  <span>{classItem.students} Students</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* See All Button */}
      <button className="w-full mt-4 py-2 text-gray-600 text-sm font-medium hover:bg-gray-100 rounded-lg transition-colors">
        See All ▼
      </button>
    </div>
  );
};

export default UpcomingClasses;