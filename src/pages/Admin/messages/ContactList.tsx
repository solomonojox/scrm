import React from "react";
import { TeacherType } from "../../../Types/Teacher/teacherType";
import { Guardian } from "../../../Types/Guardian/guardianTypes";

interface Props {
  teachers: TeacherType[];
  selectedTeacher: TeacherType | null;
  onSelectTeacher: (teacher: TeacherType) => void;
  selectedGuardian: Guardian | null;
  onSelectGuardian: (guardian: Guardian) => void;
  guardian: Guardian | Guardian[]; // Can be object or array
}

const ContactList: React.FC<Props> = ({
  teachers,
  selectedTeacher,
  onSelectTeacher,
  guardian,
  selectedGuardian,
  onSelectGuardian,
}) => {

  // Normalize admin into an array
   const guardianList: Guardian[] = Array.isArray(guardian) ? guardian : guardian ? [guardian] : [];

  return (
    <div className="w-full lg:w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-900">All Messages</h2>
          {/* Optional: loading state can be displayed here */}
        </div>
      </div>

      {/* Contact list */}
      <div className="flex-1 overflow-y-auto">
        {/* Admins */}
        {guardianList.map((a) => (
          <div
            key={a.guardianId}
            onClick={() => onSelectGuardian(a)}
            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors
              ${selectedGuardian?.guardianId === a.guardianId ? "bg-blue-50" : ""}`}
          >
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${a.firstname}`}
                  alt={a.firstname}
                  className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover"
                />
                {a.firstname && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 lg:w-4 lg:h-4 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="truncate text-sm lg:text-base text-gray-900 font-semibold">
                    {a.firstname} {a.lastname}
                  </h3>
                  <span className="text-xs font-semibold px-2 bg-red-100 rounded-full text-red-500">
                    Guardian
                  </span>
                </div>
                {/* Last message placeholder */}
                <p className="text-xs lg:text-sm truncate mt-1 text-gray-600">
                  {/* lastMessage */}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Teachers */}
        {teachers.map((teacher) => (
          <div
            key={teacher.teacherId}
            onClick={() => onSelectTeacher(teacher)}
            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors
              ${selectedTeacher?.teacherId === teacher.teacherId ? "bg-blue-100" : ""}`}
          >
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${teacher.firstname}`}
                  alt={teacher.firstname}
                  className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover"
                />
                {teacher.firstname && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 lg:w-4 lg:h-4 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="truncate text-sm lg:text-base text-gray-900 font-semibold">
                    {teacher.firstname} {teacher.lastname}
                  </h3>
                  <span className="text-xs font-semibold px-2 bg-green-100 rounded-full text-green-500">
                    Teacher
                  </span>
                </div>
                {/* Last message placeholder */}
                <p className="text-xs lg:text-sm truncate mt-1 text-gray-600">
                  {/* lastMessage */}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactList;
