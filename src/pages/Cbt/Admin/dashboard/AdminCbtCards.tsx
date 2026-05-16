import { User2, Users2Icon } from "lucide-react";
import { cbtAdminService } from "../../../../Services/Cbt/Admin/CbtAdminService";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../Store/store";
import { useAuth } from "../../../../Context/Auth/useAuth";
import {
  fetchStudentsStart,
  fetchStudentsSuccess,
  fetchStudentsFailure,
} from "../../../../Store/Student/studentSlice";
import {
  fetchTeacherStart,
  fetchTeacherSuccess,
  fetchTeacherFailure,
} from "../../../../Store/Teachers/teacherSlice";
import { useEffect } from "react";
import { cbtStudentService } from "../../../../Services/Cbt/student/cbtStudentService";

const cardData = [
  {
    id: 1,
    title: "Total Students",
    value: "1,000",
    icon: Users2Icon,
    borderColor: "blue-500",
  },
  {
    id: 2,
    title: "Total Teachers",
    value: "100",
    icon: Users2Icon,
    borderColor: "green-500",
  },
  {
    id: 3,
    title: "Total Users",
    value: "1,100",
    icon: Users2Icon,
    borderColor: "red-500",
  },
];

const AdminCbtCards = () => {
  const fetchedStudentRecord = useSelector((state: RootState) => state.getStudent.listRecords);
  const fetchedTeacherRecord = useSelector((state: RootState) => state.getTeacher.listRecords);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full ">
      {cardData.map(({ id, title, value, icon: Icon, borderColor }) => (
        <div
          key={id}
          className={`w-full bg-white rounded-lg shadow-md p-4 border-t-2 border-${borderColor} flex justify-between`}
        >
          <div className="flex justify-between w-full">
            <div className="flex flex-col space-y-2">
              <h2 className="text-md font-semibold">{title}</h2>
              <p className="text-2xl font-bold">
                {title === "Total Users"
                  ? `${fetchedStudentRecord?.length + fetchedTeacherRecord?.length}`
                  : title === "Total Teachers"
                    ? fetchedTeacherRecord?.length
                    : fetchedStudentRecord?.length}
              </p>
            </div>
            <div className="mt-4">
              <Icon className={`w-8 h-8 text-${borderColor}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminCbtCards;
