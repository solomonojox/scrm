// AdminCbtCards.tsx (Enhanced)
import { Users2Icon, UserCheck } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../Store/store";

const AdminCbtCards = () => {
  const fetchedAdminCbtStudentRecord = useSelector((state: RootState) => state.getAdminCbtStudents.listRecords);
  const fetchedAdminCbtTeacherRecord = useSelector((state: RootState) => state.getAdminCbtTeachers.listRecords);
  const fetchedAdminCbtExaminerRecord = useSelector((state: RootState) => state.getAdminCbtExaminers.listRecords);
  

  const totalStudents = fetchedAdminCbtStudentRecord?.length || 0;
  const totalTeachers = fetchedAdminCbtTeacherRecord?.length || 0;
  const totalExaminers = fetchedAdminCbtExaminerRecord?.length || 0;

  const totalUsers = totalStudents + totalTeachers + totalExaminers;
 

  

  const cardData = [
    {
      id: 1,
      title: "Total Students",
      value: totalStudents,
      icon: Users2Icon,
      borderColor: "blue-500",
      bgColor: "bg-blue-50",
      description: "Active enrolled students"
    },
    {
      id: 2,
      title: "Total Teachers",
      value: totalTeachers,
      icon: UserCheck,
      borderColor: "green-500",
      bgColor: "bg-green-50",
      description: "Registered teachers"
    },
    {
      id: 3,
      title: "Total Examiners",
      value: totalExaminers,
      icon: UserCheck,
      borderColor: "yellow-800",
      bgColor: "bg-yellow-50",
      description: "Registered examiners"
    },
    {
      id: 4,
      title: "Total Users",
      value: totalUsers,
      icon: Users2Icon,
      borderColor: "orange-500",
      bgColor: "bg-orange-50",
      description: "Platform participants"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {cardData.map(({ id, title, value, icon: Icon, borderColor, bgColor, description }) => (
        <div
          key={id}
          className={`w-full bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-4 border-t-2 border-${borderColor} group`}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <div className={`p-2 rounded-lg ${bgColor}`}>
                  <Icon className={`w-4 h-4 text-${borderColor}`} />
                </div>
                <h2 className="text-sm font-semibold text-gray-600">{title}</h2>
              </div>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                {typeof value === 'number' ? value.toLocaleString() : value}
              </p>
              <p className="text-xs text-gray-400 mt-1">{description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminCbtCards;