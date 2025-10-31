import React from "react";
import AdminCbtCards from "./StudentCbtCards";
import Calendar from "../../../../components/Teachers/chart/Calendar";
import AdminCbtTable from "./StudentCbtExam";

const StudentCbtDashboard = () => {
  return (
    <div className="px-6 py-4">
      <AdminCbtCards />

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-2">
        <AdminCbtTable />
        <Calendar />
      </div>
    </div>
  );
};

export default StudentCbtDashboard;
