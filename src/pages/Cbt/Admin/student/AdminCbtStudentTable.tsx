import {
  Badge,
  Btn,
} from "../../../../components/ui/CbtSharedComponents";

import { Icons } from "../../../../assets/icons/Icon";

import { Student } from "./AdminCbtStudentPage";

interface Props {
  students: Student[];

  onView: (student: Student) => void;

  onEdit: (student: Student) => void;

  onDelete: (id: string) => void;
}

export default function AdminCbtStudentTable({
  students,
  onView,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {[
              "Name",
              "Gender",
              "DOB",
              "Session",
              "Term",
              "Actions",
            ].map((header) => (
              <th
                key={header}
                className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {students.map((student, index) => (
            <tr
              key={student.id}
              className={`border-b border-gray-50 transition-colors hover:bg-orange-50/30 ${
                index % 2 === 0
                  ? ""
                  : "bg-gray-50/30"
              }`}
            >
              {/* Name */}
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-orange-400 to-orange-600 text-xs font-bold text-white">
                    {student.firstname[0]}
                    {student.lastname[0]}
                  </div>

                  <span className="font-semibold text-gray-900">
                    {student.firstname}{" "}
                    {student.lastname}
                  </span>
                </div>
              </td>

              {/* Gender */}
              <td className="px-5 py-3.5 text-gray-600">
                {student.gender}
              </td>

              {/* DOB */}
              <td className="px-5 py-3.5 text-gray-600">
                {student.dateOfBirth}
              </td>

              {/* Session */}
              <td className="px-5 py-3.5 text-gray-600">
                {student.admissionSession}
              </td>

              {/* Term */}
              <td className="px-5 py-3.5">
                <Badge
                  color={
                    student.currentTerm ===
                    "FIRST"
                      ? "orange"
                      : student.currentTerm ===
                          "SECOND"
                        ? "blue"
                        : "green"
                  }
                >
                  {student.currentTerm}
                </Badge>
              </td>

              {/* Actions */}
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-1">
                  <Btn
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      onView(student)
                    }
                  >
                    <Icons.Eye />
                  </Btn>

                  <Btn
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      onEdit(student)
                    }
                  >
                    <Icons.Edit />
                  </Btn>

                  <Btn
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      onDelete(student.teacherId)
                    }
                    className="text-red-400 hover:text-red-600"
                  >
                    <Icons.Trash />
                  </Btn>
                </div>
              </td>
            </tr>
          ))}

          {students.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="px-5 py-12 text-center text-gray-400"
              >
                No students found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}