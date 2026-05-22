import { Btn } from "../../../../components/ui/CbtSharedComponents";
import { Icons } from "../../../../assets/icons/Icon";
import { Student } from "./AdminCbtStudentPage";

interface Props {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
  fetching: boolean;
}

function Avatar({ name }: { name: string }) {
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  const hue = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-black text-white shadow-sm"
      style={{ background: `hsl(${hue},65%,52%)` }}>
      {initials}
    </div>
  );
}

export default function AdminCbtStudentsTable({ students, onEdit, onDelete, fetching }: Props) {
  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20">
        <div className="relative flex h-12 w-12 items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-full bg-orange-200 opacity-60" />
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
        </div>
        <p className="text-sm font-medium text-gray-400">Loading students…</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/60">
            {["Student", "Student No", "Gender", "Session / Term", "Actions"].map((h) => (
              <th key={h} className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-widest text-gray-400">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {students.map((student) => (
            <tr key={student.studentId} className="group transition-colors duration-150 hover:bg-orange-50/40">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <Avatar name={`${student.firstname} ${student.lastname}`} />
                  <div>
                    <p className="font-semibold text-gray-900 group-hover:text-orange-700 transition-colors">
                      {student.firstname} {student.lastname}
                    </p>
                    <p className="text-xs text-gray-400">{student.homeAddress ?? "—"}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <code className="rounded-md bg-gray-100 px-2 py-0.5 font-mono text-xs text-gray-600">
                  {student.studentNo || "—"}
                </code>
              </td>
              <td className="px-6 py-4">
                {student.gender ? (
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1
                    ${student.gender.toLowerCase() === "male"
                      ? "bg-blue-50 text-blue-700 ring-blue-200"
                      : "bg-pink-50 text-pink-700 ring-pink-200"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${student.gender.toLowerCase() === "male" ? "bg-blue-500" : "bg-pink-500"}`} />
                    {student.gender.charAt(0).toUpperCase() + student.gender.slice(1)}
                  </span>
                ) : <span className="text-xs text-gray-300">—</span>}
              </td>
              <td className="px-6 py-4">
                <p className="text-xs font-medium text-gray-700">{student.admissionSession ?? "—"}</p>
                <p className="text-xs text-gray-400">{student.currentTerm ?? "—"}</p>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1 ">
                  <Btn size="sm" variant="ghost" onClick={() => onEdit(student)} className="text-orange-300 hover:text-orange-600"><Icons.Edit /></Btn>
                  <Btn size="sm" variant="ghost" onClick={() => onDelete(student.studentId)} className="text-red-400 hover:text-red-600"><Icons.Trash /></Btn>
                </div>
              </td>
            </tr>
          ))}
          {students.length === 0 && (
            <tr><td colSpan={5} className="px-6 py-16 text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-300"><Icons.Search /></div>
                <p className="text-sm font-medium text-gray-400">No students found</p>
                <p className="text-xs text-gray-300">Try adjusting your search or add a new student</p>
              </div>
            </td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}