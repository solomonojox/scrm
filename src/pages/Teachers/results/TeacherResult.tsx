import React from "react";
import ResultCalendar from "./ResultCalendar";
import ResultCard from "./ResultCard";
import ResultList from "./ResultList";


const TeacherResult = (): React.JSX.Element => {
  return (
    <div>
        <div>
          <ResultCalendar />
        </div>
        <div className="mt-6">
            <ResultCard />
        </div>
        <div className="mt-6">
            <ResultList />
        </div>
    </div>
  );
};

export default TeacherResult;
