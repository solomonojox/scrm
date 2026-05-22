import { Btn } from "../../../../components/ui/CbtSharedComponents";
import { Icons } from "../../../../assets/icons/Icon";
import { Teacher } from "./AdminCbtTeachersPage";

interface Props {
  teachers: Teacher[];
  onEdit: (teacher: Teacher) => void;
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

export default function AdminCbtTeachersTable({ teachers, onEdit, onDelete, fetching }: Props) {
  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20">
        <div className="relative flex h-12 w-12 items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-full bg-orange-200 opacity-60" />
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
        </div>
        <p className="text-sm font-medium text-gray-400">Loading teachers…</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/60">
            {["Teacher", "Contact", "Employment Date", "Actions"].map((h) => (
              <th key={h} className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-widest text-gray-400">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {teachers.map((teacher) => (
            <tr key={teacher.teacherId} className="group transition-colors duration-150 hover:bg-orange-50/40">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <Avatar name={`${teacher.firstname} ${teacher.lastname}`} />
                  <div>
                    <p className="font-semibold text-gray-900 group-hover:text-orange-700 transition-colors">
                      {teacher.firstname} {teacher.lastname}
                    </p>
                    <p className="text-xs text-gray-400">{teacher.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <p className="text-gray-700 text-sm">{teacher.phone}</p>
              </td>
              <td className="px-6 py-4">
                {teacher.employmentDate ? (
                  <code className="rounded-md bg-gray-100 px-2 py-0.5 font-mono text-xs text-gray-500">
                    {new Date(teacher.employmentDate).toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" })}
                  </code>
                ) : <span className="text-xs text-gray-300">—</span>}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1">
                  <Btn size="sm" variant="ghost" onClick={() => onEdit(teacher)} className="text-orange-300 hover:text-orange-600"><Icons.Edit /></Btn>
                  <Btn size="sm" variant="ghost" onClick={() => onDelete(teacher.teacherId)} className="text-red-400 hover:text-red-600"><Icons.Trash /></Btn>
                </div>
              </td>
            </tr>
          ))}
          {teachers.length === 0 && (
            <tr><td colSpan={4} className="px-6 py-16 text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-300"><Icons.Search /></div>
                <p className="text-sm font-medium text-gray-400">No teachers found</p>
                <p className="text-xs text-gray-300">Try adjusting your search or add a new teacher</p>
              </div>
            </td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}