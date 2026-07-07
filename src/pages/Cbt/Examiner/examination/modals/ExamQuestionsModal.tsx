import { useMemo, useState } from "react";
import { Check, X, MessageSquareWarning, Loader2 } from "lucide-react";
import { Badge, Btn, Modal } from "../../../../../components/ui/CbtSharedComponents";
import { Icons } from "../../../../../assets/icons/Icon";
import { Examination } from "../AdminCbtExaminationsPage";

/* 0 = Pending, 1 = Approved, 2 = Rejected — adjust if your backend differs */
export const ApprovalStatus = {
  PENDING: 0,
  APPROVED: 1,
  REJECTED: 2,
} as const;
export type ApprovalStatusValue = (typeof ApprovalStatus)[keyof typeof ApprovalStatus];

export interface ExamQuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface ExamQuestion {
  id: string;
  examinationId: string;
  questionType: string;
  questionText: string;
  approvalStatus: ApprovalStatusValue;
  submittedByTeacherId: string;
  teacherName: string;
  approvedByExaminerId: string | null;
  approvedAt: string | null;
  rejectionReason: string | null;
  options: ExamQuestionOption[];
  createdAt: string;
}

interface Props {
  exam: Examination | null;
  questions: ExamQuestion[];
  open: boolean;
  onClose: () => void;
  /** Approve every pending question in one action */
  onApproveAll: (questionIds: string[]) => Promise<void> | void;
  /** Decline the given questionIds with a single shared reason */
  onDeclineSelected: (questionIds: string[], rejectionReason: string) => Promise<void> | void;
  loading?: boolean;
  /** True while a bulk approve/decline submission is in flight */
  submitting?: boolean;
  /** Optional live progress, e.g. { done: 2, total: 5 } */
  progress?: { done: number; total: number } | null;
}

const statusMeta: Record<ApprovalStatusValue, { label: string; color: "gray" | "green" | "red" }> =
  {
    [ApprovalStatus.PENDING]: { label: "Pending", color: "gray" },
    [ApprovalStatus.APPROVED]: { label: "Approved", color: "green" },
    [ApprovalStatus.REJECTED]: { label: "Rejected", color: "red" },
  };

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

// Confirmation Modal for Approve All
function ApproveAllConfirmationModal({
  open,
  onClose,
  onConfirm,
  pendingCount,
  submitting = false, // Default to false if not provided
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  pendingCount: number;
  submitting?: boolean; // Make optional with default
}) {
  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose} title="Approve All Questions">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-gray-600">
          You are about to approve all{" "}
          <span className="font-semibold text-orange-600">{pendingCount}</span> pending question
          {pendingCount > 1 ? "s" : ""} in this submission.
        </p>
        <p className="text-sm text-gray-600">
          This action will mark all questions as approved and cannot be undone.
        </p>
        <div className="flex items-center justify-end gap-2 pt-2">
          <Btn size="sm" variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Btn>
          <Btn size="sm" variant="primary" onClick={onConfirm} disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                Approving...
              </>
            ) : (
              <>
                <Check className="mr-1 h-3.5 w-3.5" />
                Approve All
              </>
            )}
          </Btn>
        </div>
      </div>
    </Modal>
  );
}

// Confirmation Modal for Decline Selected
function DeclineConfirmationModal({
  open,
  onClose,
  onConfirm,
  selectedIds,
  selectedCount,
  reason,
  setReason,
  submitting = false, // Default to false if not provided
  totalPending,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedIds: Set<string>;
  selectedCount: number;
  reason: string;
  setReason: (reason: string) => void;
  submitting?: boolean; // Make optional with default
  totalPending: number;
}) {
  const allSelected = selectedCount === totalPending && totalPending > 0;

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose} title="Decline Selected Questions">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-gray-600">
          You are about to decline{" "}
          <span className="font-semibold text-red-600">{selectedCount}</span> question
          {selectedCount > 1 ? "s" : ""} in this submission.
        </p>

        {allSelected && (
          <p className="text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
            Note: You are declining the entire submission.
          </p>
        )}

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-red-700">
            Rejection Reason <span className="text-red-500">*</span>
          </label>
          <textarea
            autoFocus
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Please provide a reason for declining these questions..."
            rows={3}
            className="w-full rounded-lg border border-red-200 bg-white px-3 py-2 text-xs text-gray-700 placeholder-gray-300 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-400/10"
          />
          <p className="mt-1 text-xs text-gray-400">
            This reason will be shared with the teacher for all declined questions.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Btn size="sm" variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Btn>
          <Btn
            size="sm"
            variant="danger"
            onClick={onConfirm}
            disabled={selectedCount === 0 || !reason.trim() || submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                Declining...
              </>
            ) : (
              <>
                <X className="mr-1 h-3.5 w-3.5" />
                Decline {selectedCount} Question{selectedCount > 1 ? "s" : ""}
              </>
            )}
          </Btn>
        </div>
      </div>
    </Modal>
  );
}

export default function ExamQuestionsModal({
  exam,
  questions,
  open,
  onClose,
  onApproveAll,
  onDeclineSelected,
  loading = false,
  submitting = false,
  progress,
}: Props) {
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showDeclineConfirm, setShowDeclineConfirm] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [reason, setReason] = useState("");

  const pendingQuestions = useMemo(
    () => questions.filter((q) => q.approvalStatus === ApprovalStatus.PENDING),
    [questions],
  );
  const pendingIds = useMemo(() => pendingQuestions.map((q) => q.id), [pendingQuestions]);
  const allSelected = pendingIds.length > 0 && selectedIds.size === pendingIds.length;

  if (!open || !exam) return null;

  const resetDeclineState = () => {
    setShowDeclineConfirm(false);
    setSelectedIds(new Set());
    setReason("");
  };

  const toggleQuestion = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelectedIds(allSelected ? new Set() : new Set(pendingIds));
  };

  const handleApproveAllClick = () => {
    if (pendingIds.length === 0) return;
    setShowApproveConfirm(true);
  };

  const handleConfirmApproveAll = async () => {
    await onApproveAll(pendingIds);
    setShowApproveConfirm(false);
  };

  const handleDeclineClick = () => {
    // When decline is clicked, select all pending questions by default
    setSelectedIds(new Set(pendingIds));
    setReason("");
    setShowDeclineConfirm(true);
  };

  const handleConfirmDecline = async () => {
    if (selectedIds.size === 0 || !reason.trim()) return;
    await onDeclineSelected(Array.from(selectedIds), reason.trim());
    resetDeclineState();
  };

  const handleClose = () => {
    if (submitting) return;
    setShowApproveConfirm(false);
    resetDeclineState();
    onClose();
  };

  return (
    <>
      <Modal open={open} onClose={handleClose} title={`Review submission — ${exam.title}`}>
        <div className="flex flex-col max-h-[80vh]">
          {/* Summary strip */}
          {!loading && questions.length > 0 && (
            <div className="mb-3 flex items-center justify-between rounded-xl bg-gray-50 px-4 py-2.5 text-xs shrink-0">
              <span className="font-medium text-gray-500">
                {questions.length} question{questions.length > 1 ? "s" : ""} submitted
              </span>
              {pendingIds.length > 0 ? (
                <span className="font-semibold text-orange-600">
                  {pendingIds.length} awaiting your review
                </span>
              ) : (
                <span className="font-semibold text-emerald-600">All reviewed</span>
              )}
            </div>
          )}

          {/* Scrollable question list - read-only review mode */}
          <div className="flex-1 overflow-y-auto px-1 space-y-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
                <p className="text-sm font-medium text-gray-400">Loading questions…</p>
              </div>
            ) : questions.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-16 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-300">
                  <Icons.Search />
                </div>
                <p className="text-sm font-medium text-gray-400">No questions submitted yet</p>
              </div>
            ) : (
              questions.map((q, idx) => {
                const status = statusMeta[q.approvalStatus] ?? {
                  label: "Unknown",
                  color: "gray" as const,
                };

                return (
                  <div
                    key={q.id}
                    className={`rounded-xl border p-4 shadow-sm transition-colors border-gray-100 bg-white`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-sm font-semibold text-gray-800 leading-snug">
                            <span className="mr-1.5 text-orange-500">{idx + 1}.</span>
                            {q.questionText}
                          </p>
                          <Badge color={status.color}>{status.label}</Badge>
                        </div>

                        <p className="mt-1 text-xs text-gray-400">
                          Submitted by{" "}
                          <span className="font-medium text-gray-500">{q.teacherName}</span> ·{" "}
                          {formatDate(q.createdAt)}
                        </p>

                        <ul className="mt-3 space-y-1.5">
                          {q.options.map((opt) => (
                            <li
                              key={opt.id}
                              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs ${
                                opt.isCorrect
                                  ? "bg-green-50 text-green-700 font-semibold"
                                  : "bg-gray-50 text-gray-600"
                              }`}
                            >
                              {opt.isCorrect && <Check className="h-3.5 w-3.5" />}
                              {opt.text}
                            </li>
                          ))}
                        </ul>

                        {q.approvalStatus === ApprovalStatus.REJECTED && q.rejectionReason && (
                          <div className="mt-3 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
                            <MessageSquareWarning className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                            <span>{q.rejectionReason}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom action bar - Single review actions */}
          {!loading && questions.length > 0 && (
            <div className="mt-4 shrink-0 border-t border-gray-100 pt-4">
              {submitting ? (
                <div className="flex items-center justify-center gap-2 py-2 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {progress
                    ? `Submitting review… (${progress.done}/${progress.total})`
                    : "Submitting review…"}
                </div>
              ) : pendingIds.length === 0 ? (
                <p className="text-center text-xs text-gray-400">
                  Every question in this submission has been reviewed
                </p>
              ) : (
                <div className="flex items-center justify-end gap-3">
                  <Btn
                    size="sm"
                    
                    variant="outline"
                    onClick={handleDeclineClick}
                    className="text-red-600 border-red-200 hover:bg-red-50 py-3"
                  >
                    <X className="mr-1 h-3.5 w-3.5" />
                    Decline Submission
                  </Btn>
                  <Btn className="py-3" size="sm" variant="primary" onClick={handleApproveAllClick}>
                    <Check className="mr-1 h-3.5 w-3.5" />
                    Approve Submission ({pendingIds.length})
                  </Btn>
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>

      {/* Approve All Confirmation Modal */}
      <ApproveAllConfirmationModal
        open={showApproveConfirm}
        onClose={() => setShowApproveConfirm(false)}
        onConfirm={handleConfirmApproveAll}
        pendingCount={pendingIds.length}
        submitting={submitting}
      />

      {/* Decline Confirmation Modal */}
      <DeclineConfirmationModal
        open={showDeclineConfirm}
        onClose={() => {
          setShowDeclineConfirm(false);
          setSelectedIds(new Set());
          setReason("");
        }}
        onConfirm={handleConfirmDecline}
        selectedIds={selectedIds}
        selectedCount={selectedIds.size}
        reason={reason}
        setReason={setReason}
        submitting={submitting}
        totalPending={pendingIds.length}
      />
    </>
  );
}
