import { useState } from "react";
import { Btn, Badge, Modal } from "../../../../components/ui/CbtSharedComponents";
import { Icons } from "../../../../assets/icons/Icon";
import { Examination, ExamStatus, ExamType } from "./AdminCbtExaminationsPage";
import { Users, Users2, ListChecks, MoreVertical, Pencil, Trash2 } from "lucide-react";

interface Props {
  examinations: Examination[];
  onEdit: (exam: Examination) => void;
  onDelete: (id: string) => void;
  onAssign: (exam: Examination, type: "teacher" | "student") => void;
  onTogglePublish: (exam: Examination) => void;
  onToggleActivate: (exam: Examination) => void;
  onReviewQuestions: (exam: Examination) => void;
  togglingPublish: string | null;
  togglingActivate: string | null;
  fetching: boolean;
}

const statusConfig: Record<ExamStatus, { label: string; color: "gray" | "blue" | "green" | "red" | "orange" }> = {
  DRAFT: { label: "Draft", color: "gray" },
  SCHEDULED: { label: "Scheduled", color: "blue" },
  ACTIVE: { label: "Active", color: "green" },
  COMPLETED: { label: "Completed", color: "orange" },
};

const examTypeColors: Record<ExamType, string> = {
  INTERNAL: "bg-purple-100 text-purple-700",
  WAEC: "bg-blue-100 text-blue-700",
  NECO: "bg-teal-100 text-teal-700",
  JAMB: "bg-amber-100 text-amber-700",
  GCE: "bg-pink-100 text-pink-700",
};

/* Publish toggle switch */
function PublishSwitch({ published, loading, onToggle }: { published: boolean; loading: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      disabled={loading}
      title={published ? "Unpublish" : "Publish"}
      aria-label={published ? "Unpublish this exam" : "Publish this exam"}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${published ? "bg-orange-500" : "bg-gray-200"}
      `}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${published ? "translate-x-4" : "translate-x-0.5"
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

/* Actions modal — one clean, labeled list per exam */
function ExamActionsModal({
  exam,
  open,
  onClose,
  onEdit,
  onDelete,
  onAssign,
  onReviewQuestions,
  pendingCount,
}: {
  exam: Examination;
  open: boolean;
  onClose: () => void;
  onEdit: (exam: Examination) => void;
  onDelete: (id: string) => void;
  onAssign: (exam: Examination, type: "teacher" | "student") => void;
  onReviewQuestions: (exam: Examination) => void;
  pendingCount: number;
}) {
  const run = (fn: () => void) => {
    onClose();
    fn();
  };

  const items: {
    label: string;
    description: string;
    icon: React.ReactNode;
    onClick: () => void;
    tone: string;
    iconBg: string;
    badge?: number;
    destructive?: boolean;
  }[] = [
    {
      label: "Review questions",
      description: pendingCount > 0
        ? `${pendingCount} question${pendingCount > 1 ? "s" : ""} waiting for your approval`
        : "View and manage all submitted questions",
      icon: <ListChecks className="h-4.5 w-4.5" />,
      onClick: () => run(() => onReviewQuestions(exam)),
      tone: "text-emerald-700",
      iconBg: "bg-emerald-50",
      badge: pendingCount > 0 ? pendingCount : undefined,
    },
    {
      label: "Assign teacher",
      description: "Choose which teacher invigilates this exam",
      icon: <Users2 className="h-4.5 w-4.5" />,
      onClick: () => run(() => onAssign(exam, "teacher")),
      tone: "text-blue-700",
      iconBg: "bg-blue-50",
    },
    {
      label: "Assign students",
      description: "Select which students can sit this exam",
      icon: <Users className="h-4.5 w-4.5" />,
      onClick: () => run(() => onAssign(exam, "student")),
      tone: "text-purple-700",
      iconBg: "bg-purple-50",
    },
    {
      label: "Edit exam",
      description: "Update the title, duration, dates, and settings",
      icon: <Pencil className="h-4.5 w-4.5" />,
      onClick: () => run(() => onEdit(exam)),
      tone: "text-orange-700",
      iconBg: "bg-orange-50",
    },
    {
      label: "Delete exam",
      description: "Permanently remove this exam — this cannot be undone",
      icon: <Trash2 className="h-4.5 w-4.5" />,
      onClick: () => run(() => onDelete(exam.id)),
      tone: "text-red-700",
      iconBg: "bg-red-50",
      destructive: true,
    },
  ];

  return (
    <Modal open={open} onClose={onClose} title={`Actions — ${exam.title}`}>
      <div className="space-y-1.5">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={item.onClick}
            className={`flex w-full items-start gap-3 rounded-xl px-3.5 py-3 text-left transition-colors hover:bg-gray-50 ${
              item.destructive ? "mt-2 border-t border-gray-100 pt-4" : ""
            }`}
          >
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.iconBg} ${item.tone}`}>
              {item.icon}
            </span>
            <span className="flex-1 min-w-0 pt-0.5">
              <span className="flex items-center gap-1.5">
                <span className={`text-sm font-semibold ${item.tone}`}>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                    {item.badge}
                  </span>
                )}
              </span>
              <span className="mt-0.5 block text-xs text-gray-400 leading-snug">{item.description}</span>
            </span>
          </button>
        ))}
      </div>
    </Modal>
  );
}

export default function AdminCbtExaminationTable({
  examinations,
  onEdit,
  onDelete,
  onAssign,
  onTogglePublish,
  onToggleActivate,
  onReviewQuestions,
  togglingPublish,
  togglingActivate,
  fetching,
}: Props) {
  const [actionsExam, setActionsExam] = useState<Examination | null>(null);

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
            const status = statusConfig[exam.status] ?? { label: exam.status, color: "gray" as const };
            const isActive = exam.status === "ACTIVE";
            const canActivate = ["SCHEDULED", "ACTIVE", "DRAFT"].includes(exam.status);

            const pendingCount = exam.questions?.filter((q: any) => q.reviewStatus === "PENDING" || !q.reviewStatus).length ?? 0;

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
                  <button
                    onClick={() => onReviewQuestions(exam)}
                    title={pendingCount > 0 ? `${pendingCount} question(s) awaiting your review` : "View all submitted questions"}
                    aria-label={pendingCount > 0 ? `${pendingCount} question(s) awaiting your review` : "View all submitted questions"}
                    className="group/qbtn relative inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-orange-100 px-2 text-xs font-bold text-orange-700 transition-colors hover:bg-orange-200"
                  >
                    {exam?.questions?.length ?? 0}
                    {pendingCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                        {pendingCount}
                      </span>
                    )}
                  </button>
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
                  <button
                    onClick={() => setActionsExam(exam)}
                    title="View actions for this exam"
                    aria-label="View actions for this exam"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
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

      {/* Actions modal for whichever exam is selected */}
      {actionsExam && (
        <ExamActionsModal
          exam={actionsExam}
          open={!!actionsExam}
          onClose={() => setActionsExam(null)}
          onEdit={onEdit}
          onDelete={onDelete}
          onAssign={onAssign}
          onReviewQuestions={onReviewQuestions}
          pendingCount={
            actionsExam.questions?.filter((q: any) => q.reviewStatus === "PENDING" || !q.reviewStatus).length ?? 0
          }
        />
      )}
    </div>
  );
}