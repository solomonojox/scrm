import { Btn } from "../../../../components/ui/CbtSharedComponents";
import { Icons } from "../../../../assets/icons/Icon";
import { Examiner } from "./AdminCbtExaminersPage";

interface Props {
  examiners: (Examiner & { id: string })[];
  onEdit: (examiner: Examiner) => void;
  onDelete: (id: string) => void;
  fetching: boolean;
}

export default function AdminCbtExaminersTable({
  examiners,
  onEdit,
  onDelete,
  fetching,
}: Props) {
  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-400">
        <svg
          className="h-7 w-7 animate-spin text-orange-400"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
          />
        </svg>
        <span className="text-sm">Loading examiners...</span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {["Examiner", "Email", "Status", "Actions"].map((header) => (
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
          {examiners.map((examiner, index) => (
            <tr
              key={examiner.id}
              className={`border-b border-gray-50 transition-colors hover:bg-orange-50/30 ${
                index % 2 === 0 ? "" : "bg-gray-50/30"
              }`}
            >
              {/* Examiner */}
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-amber-400 to-orange-500 text-xs font-bold text-white">
                    {examiner.fullname
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <span className="font-semibold text-gray-900">
                    {examiner.fullname}
                  </span>
                </div>
              </td>

              {/* Email */}
              <td className="px-5 py-3.5 text-gray-600">{examiner.email}</td>

              {/* Status */}
              <td className="px-5 py-3.5">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    examiner.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {examiner.isActive ? "Active" : "Inactive"}
                </span>
              </td>

              {/* Actions */}
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-1">
                  <Btn
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(examiner)}
                  >
                    <Icons.Edit />
                  </Btn>

                  <Btn
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(examiner.id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <Icons.Trash />
                  </Btn>
                </div>
              </td>
            </tr>
          ))}

          {examiners.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="px-5 py-12 text-center text-gray-400"
              >
                No examiners found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}