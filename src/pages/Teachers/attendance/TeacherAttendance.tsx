import React from "react";
import AttendanceCalendar from "./AttendanceCalendar";
import AttendanceCard from "./AttendanceCard";
import AttendanceList from "./AttendanceList";

const TeacherAttendance = (): React.JSX.Element => {
  const [cardData, setCardData] = React.useState([]);
  // console.log(cardData)

  return (
    <div>
      <div>
        <AttendanceCalendar />
      </div>
      <div className="mt-6">
        <AttendanceCard cardData={cardData} />
      </div>
      <div className="mt-6">
        <AttendanceList setCardData={setCardData} />
      </div>
    </div>
  );
};

export default TeacherAttendance;