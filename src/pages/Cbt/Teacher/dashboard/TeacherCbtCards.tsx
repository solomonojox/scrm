import { CircleAlert, CircleCheck, Newspaper } from "lucide-react";

const cardData = [
  {
    id: 1,
    title: "Total Subject",
    value: "10",
    icon: Newspaper,
    borderColor: "blue-500",
  },
  {
    id: 2,
    title: "Total Completed",
    value: "5",
    icon: CircleCheck,
    borderColor: "green-500",
  },
  {
    id: 3,
    title: "Total Pending",
    value: "5",
    icon: CircleAlert,
    borderColor: "red-500",
  },
];

const TeacherCbtCards = () => {
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
              <p className="text-2xl font-bold">{value}</p>
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

export default TeacherCbtCards;
