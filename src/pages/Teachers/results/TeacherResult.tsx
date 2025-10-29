import React, { useEffect, useState } from "react";
import ResultCalendar from "./ResultCalendar";
import ResultCard from "./ResultCard";
import ResultList from "./ResultList";
import { useAuth } from "../../../Context/Auth/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../Store/store";
import { classroomService } from "../../../Services/Classroom";
import {
  fetchClassroomsFailure,
  fetchClassroomsStart,
  fetchClassroomsSuccess,
} from "../../../Store/Admin/classroomSlice";
import {
  fetchClassroomStudentsFailure,
  fetchClassroomStudentsStart,
  fetchClassroomStudentsSuccess,
} from "../../../Store/Admin/classroomStudentsSlice";

interface Classroom {
  classroomId: string;
  name: string;
}

const TeacherResult = (): React.JSX.Element => {
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();

  const fetchedClassrooms = useSelector(
    (state: RootState) => state.getClassrooms.listRecords
  );
  const loading = useSelector((state: RootState) => state.getClassrooms.loading);
  const error = useSelector((state: RootState) => state.getClassrooms.error);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  //Fetch classrooms once when teacher logs in
  useEffect(() => {
    const fetchClassrooms = async () => {
      dispatch(fetchClassroomsStart());
      try {
        if (user?.role === "Teacher") {
          const classroomData = await classroomService.getClassroomByTeacherId(user.id);
          dispatch(fetchClassroomsSuccess(classroomData));
        }
      } catch (err) {
        console.error("Fetch error:", err);
        dispatch(fetchClassroomsFailure((err as Error).message));
      }
    };

    fetchClassrooms();
  }, [user, dispatch]);

  //Automatically select first class when classrooms load
  useEffect(() => {
    if (fetchedClassrooms.length > 0 && !selectedClass) {
      const firstClassId = fetchedClassrooms[0].classroomId;
      setSelectedClass(firstClassId);
    }
  }, [fetchedClassrooms, selectedClass]);

  //Handle class change manually
  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const selectedClassKey = e.target.value;
    setSelectedClass(selectedClassKey);
    setIsSubmitted(false);
  };


  return (
    <div>
      <div>
        <ResultCalendar />
      </div>

      <div className="my-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between sm:px-0 pb-6">
          <h2 className="text-lg font-medium">
            Result List (
            {fetchedClassrooms.find((cls) => cls.classroomId === selectedClass)?.name ||
              "Select Class"}
            )
          </h2>

          {/* Class Select */}
          <div className="w-full md:w-48">
            <select
              value={selectedClass}
              onChange={handleClassChange}
              disabled={isSubmitted}
              className="w-full px-3 sm:px-4 py-2 bg-[#EE7306] text-white border-none outline-none rounded-lg text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select Class</option>
              {fetchedClassrooms.map((cls: Classroom) => (
                <option key={cls.classroomId} value={cls.classroomId}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/*Pass selectedClass and students as props */}
      <div className="mt-6">
        <ResultCard />
      </div>
      <div className="mt-6">
        <ResultList selectedClass={selectedClass} />
      </div>
    </div>
  );
};

export default TeacherResult;
