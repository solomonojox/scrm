import React, { useEffect, useState } from "react";
import AllAttendance from "./AllAttendance";
import AllFolders from "./AllFolders";
import { useAuth } from "../../../Context/Auth/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../Store/store";
import { classroomService } from "../../../Services/Classroom";
import {
  fetchClassroomsFailure,
  fetchClassroomsStart,
  fetchClassroomsSuccess,
} from "../../../Store/Admin/classroomSlice";
import { attendanceService } from "../../../Services/Attendance"; // 👈 add your attendance service

interface Prop {
  setCardData: (data: any) => void
}

const AttendanceList: React.FC<Prop> = ({ setCardData }): React.JSX.Element => {
  const [activeTab, setActiveTab] = useState("All Attendance");
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const fetchedRecord = useSelector((state: RootState) => state.getClassrooms.listRecords);
  const fetchedLoading = useSelector((state: RootState) => state.getClassrooms.loading);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false)

  // Fetch classrooms on mount
  useEffect(() => {
    fetchClassroom();
  }, [user]);

  const fetchClassroom = async () => {
    dispatch(fetchClassroomsStart());
    try {
      if (user?.role === "Teacher") {
        const classroomData = await classroomService.getClassroomByTeacherId(user?.id);
        dispatch(fetchClassroomsSuccess(classroomData));
      }
    } catch (err) {
      console.error("Fetch error:", err);
      dispatch(fetchClassroomsFailure((err as Error).message));
    }
  };

  const classroomIdToFetch = selectedClass || fetchedRecord[0]?.classroomId; // use first classroom if none selected

  // Whenever classroom data or selected class changes, fetch attendance
  useEffect(() => {
    if (!fetchedRecord || fetchedRecord.length === 0) return;
    fetchAttendance()
  }, [selectedClass, fetchedRecord, user]);


  const fetchAttendance = async () => {
    setLoading(true)
    try {
      const data = await attendanceService.getAttendanceByClassroomIdAndSchoolId(user?.schoolId, classroomIdToFetch);

      setAttendanceData(data);
      setCardData(data)
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setLoading(false)
    }
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedClass(e.target.value);
  };

  return (
    <section>
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between px-4 sm:px-0 pb-6">
        <h2 className="text-lg font-medium">Attendance List</h2>
        <div className="w-full lg:w-48">
          <select
            value={selectedClass}
            onChange={handleClassChange}
            className="w-full px-3 sm:px-4 py-2 bg-orange-500 text-white border-none outline-none rounded-lg text-sm sm:text-base"
          >
            <option value="">Select Class</option>
            {fetchedRecord.map((cls, index) => (
              <option key={index} value={cls.classroomId}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="w-full py-3 px-2 md:px-8 bg-[#EE7306] rounded-md">
        <div className="flex space-x-2 md:space-x-4 overflow-x-auto">
          {["All Attendance", "All Folders"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1 rounded-full text-xs md:text-[14px] whitespace-nowrap ${activeTab === tab
                  ? "bg-white text-[#EE7306] font-semibold"
                  : "text-white/50 hover:bg-white/20"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/*Pass fetched attendance data to AllAttendance */}
      {activeTab === "All Attendance" && <AllAttendance loading={loading} attendanceData={attendanceData} />}
      {activeTab === "All Folders" && <AllFolders />}
    </section>
  );
};

export default AttendanceList;
