import React, { useEffect } from "react";
import AllResult from "./AllResult";
import AllFolders from "./AllFolders";
import {
  fetchClassroomStudentsFailure,
  fetchClassroomStudentsStart,
  fetchClassroomStudentsSuccess,
} from "../../../Store/Admin/classroomStudentsSlice";
import { classroomService } from "../../../Services/Classroom";
import { AppDispatch, RootState } from "../../../Store/store";
import { useDispatch, useSelector } from "react-redux";

const ResultList = ({ selectedClass }: { selectedClass: string }): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const fetchedStudents = useSelector((state: RootState) => state.getStudentsByClassId.listRecords);
  const [activeTab, setActiveTab] = React.useState<string | React.JSX.Element>("All Results");
  const tabs = [
    { id: 1, label: "All Results" },
    { id: 2, label: "All Folders" },
  ];

  //Fetch students whenever selectedClass changes
  useEffect(() => {
    if (selectedClass) {
      fetchStudentsForClass(selectedClass);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClass]);

  //Fetch students by classroom ID
  const fetchStudentsForClass = async (classId: string) => {
    dispatch(fetchClassroomStudentsStart());
    try {
      const studentData = await classroomService.getStudentsByClassroomId(classId);
      dispatch(fetchClassroomStudentsSuccess(studentData));

    } catch (err) {
      console.error("Fetch students error:", err);
      dispatch(fetchClassroomStudentsFailure((err as Error).message));
    }
  };

  return (
    <>
      <section>
        <div className="">
          <div className="">
            <div className="w-full py-3 px-2 md:px-8 bg-[#EE7306] rounded-md">
              <div className="flex space-x-2 md:space-x-4 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.label)}
                    className={`px-4 py-1 rounded-full text-xs md:text-[14px] whitespace-nowrap ${
                      activeTab === tab.label
                        ? "bg-white text-[#EE7306] font-semibold"
                        : "text-white/50 hover:bg-white/20"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            {activeTab === "All Results" && <AllResult students={fetchedStudents} />}
            {activeTab === "All Folders" && <AllFolders />}
          </div>
        </div>
      </section>
    </>
  );
};

export default ResultList;
