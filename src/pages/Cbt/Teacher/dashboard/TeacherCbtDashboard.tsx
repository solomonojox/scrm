import React from "react";
import Calendar from "../../../../components/Teachers/chart/Calendar";
import TeacherCbtCards from "./TeacherCbtCards";
import TeacheTable from "./TeacheTable";


const TeacherCbtDashboard = () => {
  return (
    <div className="px-6 py-4">
      <TeacherCbtCards />

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-2">
        <TeacheTable />
        <Calendar />
      </div>
    </div>
  );
};

export default TeacherCbtDashboard;
