import React from "react";
import AttendanceCalendar from "./AttendanceCalendar";
import AttendanceCard from "./AttendanceCard";
import AttendanceList from "./AttendanceList";

const TeacherAttendance = (): React.JSX.Element => {
  return (
    <div>
        <div>
          <AttendanceCalendar />
        </div>
        <div className="mt-6">
            <AttendanceCard />
        </div>
        <div className="mt-6">
            <AttendanceList />
        </div>
    </div>
  );
};

export default TeacherAttendance;
