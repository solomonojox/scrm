import { Btn, Badge } from "../../../../components/ui/CbtSharedComponents";
import { Icons } from "../../../../assets/icons/Icon";
import { Examination, ExamStatus, ExamType } from "./AdminCbtExaminationsPage";

interface Props {
  examinations: Examination[];
  onEdit: (exam: Examination) => void;
  onDelete: (id: string) => void;
  onAssign: (exam: Examination) => void;
  onTogglePublish: (exam: Examination) => void;
  onToggleActivate: (exam: Examination) => void;
  togglingPublish: string | null;
  togglingActivate: string | null;
  fetching: boolean;
}

const statusConfig: Record<ExamStatus, { label: string; color: "gray" | "blue" | "green" | "red" | "orange" }> = {
  DRAFT:     { label: "Draft",     color: "gray"   },
  SCHEDULED: { label: "Scheduled", color: "blue"   },
  ACTIVE:    { label: "Active",    color: "green"  },
  COMPLETED: { label: "Completed", color: "orange" },
};

const examTypeColors: Record<ExamType, string> = {
  INTERNAL: "bg-purple-100 text-purple-700",
  WAEC:     "bg-blue-100 text-blue-700",
  NECO:     "bg-teal-100 text-teal-700",
  JAMB:     "bg-amber-100 text-amber-700",
  GCE:      "bg-pink-100 text-pink-700",
};

/* Publish toggle switch */
function PublishSwitch({ published, loading, onToggle }: { published: boolean; loading: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      disabled={loading}
      title={published ? "Unpublish" : "Publish"}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${
        published ? "bg-orange-500" : "bg-gray-200"
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${
          published ? "translate-x-4" : "translate-x-0.5"
        }`}
      />
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent" />
        </span>
      )}
    </button>
  );
}

export default function AdminCbtExaminationTable({
  examinations,
  onEdit,
  onDelete,
  onAssign,
  onTogglePublish,
  onToggleActivate,
  togglingPublish,
  togglingActivate,
  fetching,
}: Props) {
  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20">
        <div className="relative flex h-12 w-12 items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-full bg-orange-200 opacity-60" />
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
        </div>
        <p className="text-sm font-medium text-gray-400">Loading examinations…</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/60">
            {["Title", "Type", "Term / Session", "Duration", "Qs", "Status", "Published", "Access", "Actions"].map((h) => (
              <th key={h} className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-50">
          {examinations.map((exam) => {
            const status   = statusConfig[exam.status] ?? { label: exam.status, color: "gray" as const };
            const isActive = exam.status === "ACTIVE";
            const canActivate = ["SCHEDULED", "ACTIVE", "DRAFT"].includes(exam.status);

            return (
              <tr key={exam.id} className="group transition-colors duration-150 hover:bg-orange-50/40">

                {/* Title */}
                <td className="px-4 py-4 min-w-40">
                  <p className="font-semibold text-gray-900 group-hover:text-orange-700 transition-colors leading-tight">
                    {exam.title}
                  </p>
                  {exam.classLevel && (
                    <p className="mt-0.5 text-xs text-gray-400">{exam.classLevel}</p>
                  )}
                </td>

                {/* Exam type */}
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-bold whitespace-nowrap ${examTypeColors[exam.examType] ?? "bg-gray-100 text-gray-600"}`}>
                    {exam.examType}
                  </span>
                </td>

                {/* Term / Session */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <p className="text-gray-700 text-xs font-medium">{exam.term} TERM</p>
                  <code className="mt-0.5 block rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-500">
                    {exam.academicSession}
                  </code>
                </td>

                {/* Duration */}
                <td className="px-4 py-4 text-gray-500 whitespace-nowrap">{exam.durationMinutes} min</td>

                {/* Question count */}
                <td className="px-4 py-4">
                  <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-orange-100 px-2 text-xs font-bold text-orange-700">
                    {exam.questions.length}
                  </span>
                </td>

                {/* Status badge */}
                <td className="px-4 py-4">
                  <Badge color={status.color}>{status.label}</Badge>
                </td>

                {/* Publish toggle */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <PublishSwitch
                      published={exam.isPublished}
                      loading={togglingPublish === exam.id}
                      onToggle={() => onTogglePublish(exam)}
                    />
                    <span className={`text-xs font-medium ${exam.isPublished ? "text-orange-600" : "text-gray-400"}`}>
                      {exam.isPublished ? "Live" : "Off"}
                    </span>
                  </div>
                </td>

                {/* Activate / Deactivate */}
                <td className="px-4 py-4">
                  {canActivate ? (
                    <Btn
                      size="sm"
                      variant={isActive ? "danger" : "outline"}
                      disabled={togglingActivate === exam.id}
                      loading={togglingActivate === exam.id}
                      onClick={() => onToggleActivate(exam)}
                      className="whitespace-nowrap"
                    >
                      {togglingActivate === exam.id
                        ? isActive ? "Deactivating…" : "Activating…"
                        : isActive ? "Deactivate" : "Activate"
                      }
                    </Btn>
                  ) : (
                    <span className="text-xs text-gray-300">—</span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1">
                    {/* Assign examiner */}
                    <Btn
                      size="sm"
                      variant="ghost"
                      onClick={() => onAssign(exam)}
                      title="Assign examiner"
                      className="text-blue-800 hover:text-blue-600"
                    >
                      <Icons.Users />
                    </Btn>

                    {/* View */}
                    {/* <Btn
                      size="sm"
                      variant="ghost"
                      onClick={() => onView(exam)}
                      title="View"
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Icons.Eye />
                    </Btn> */}

                    {/* Edit */}
                    <Btn
                      size="sm"
                      variant="ghost"
                      onClick={() => onEdit(exam)}
                      title="Edit"
                      className="text-orange-300 hover:text-orange-600"
                    >
                      <Icons.Edit />
                    </Btn>

                    {/* Delete */}
                    <Btn
                      size="sm"
                      variant="ghost"
                      onClick={() => onDelete(exam.id)}
                      title="Delete"
                      className="text-red-400 hover:text-red-600"
                    >
                      <Icons.Trash />
                    </Btn>
                  </div>
                </td>
              </tr>
            );
          })}

          {examinations.length === 0 && (
            <tr>
              <td colSpan={9} className="px-5 py-16 text-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-300">
                    <Icons.Search />
                  </div>
                  <p className="text-sm font-medium text-gray-400">No examinations found</p>
                  <p className="text-xs text-gray-300">Try adjusting your search or create a new exam</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}