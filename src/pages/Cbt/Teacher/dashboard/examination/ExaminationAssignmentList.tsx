import React, { useState, useEffect } from "react";
import { cbtTeacherExamService } from "../../../../../Services/Cbt/Teacher/cbtTeacherExamService";
import { toast } from "react-toastify";
import AddExamQuestions from "./AddExamQuestions"; // adjust path as needed

// ─── Types ────────────────────────────────────────────────────────────────────

interface ExamAssignment {
  id: string;
  examinationId: string;
  examinationTitle: string;
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
  assignedByExaminerId: string;
  examinerName: string;
  status: number;
  notes: string;
  createdAt: string;
  respondedAt: string | null;
}

interface RespondPayload {
  accept: boolean;
  notes: string;
}

interface SingleQuestionPayload {
  examinationId: string;
  questionType: string;
  questionText: string;
  options: { text: string; isCorrect: boolean }[];
}

interface BulkQuestionsPayload {
  examinationId: string;
  questions: SingleQuestionPayload[];
}

type ActionType = "accept" | "reject";
type QuestionMode = "single" | "bulk";

// ─── Status helpers ───────────────────────────────────────────────────────────

const STATUS_LABELS: Record<number, { label: string; className: string }> = {
  0: { label: "Pending", className: "status-pending" },
  1: { label: "Accepted", className: "status-accepted" },
  2: { label: "Rejected", className: "status-rejected" },
};

function getStatus(status: number) {
  return STATUS_LABELS[status] ?? { label: "Unknown", className: "status-unknown" };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

interface ConfirmModalProps {
  open: boolean;
  actionType: ActionType;
  assignment: ExamAssignment | null;
  onConfirm: (notes: string) => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open, actionType, assignment, onConfirm, onCancel,
}) => {
  const [notes, setNotes] = useState("");

  useEffect(() => { if (open) setNotes(""); }, [open]);

  if (!open || !assignment) return null;

  const isAccept = actionType === "accept";

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className={`modal-card ${isAccept ? "modal-accept" : "modal-reject"}`}>
        <div className={`modal-icon ${isAccept ? "icon-accept" : "icon-reject"}`}>
          {isAccept ? (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>

        <h2 className="modal-title">
          {isAccept ? "Accept Exam Assignment?" : "Reject Exam Assignment?"}
        </h2>

        <p className="modal-body">
          You are about to <strong>{isAccept ? "accept" : "reject"}</strong> the assignment for{" "}
          <strong>{assignment.examinationTitle}</strong> assigned by{" "}
          <strong>{assignment.examinerName}</strong>.
          {!isAccept && " This action will notify the examiner of your decision."}
        </p>

        <div className="form-group">
          <label htmlFor="modal-notes" className="form-label">
            Notes <span className="label-hint">(optional)</span>
          </label>
          <textarea
            id="modal-notes"
            className="form-textarea"
            rows={3}
            placeholder={isAccept ? "Add any remarks..." : "Provide a reason for rejection..."}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button
            className={`btn ${isAccept ? "btn-accept" : "btn-reject"}`}
            onClick={() => onConfirm(notes)}
          >
            {isAccept ? "Yes, Accept" : "Yes, Reject"}
          </button>
        </div>
      </div>
    </div>
  );
};

const ExaminationAssignmentList: React.FC = () => {
  const [assignments, setAssignments] = useState<ExamAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Accept/Reject modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<ExamAssignment | null>(null);
  const [actionType, setActionType] = useState<ActionType>("accept");
  const [actionLoading, setActionLoading] = useState(false);

  // Add questions panel
  const [questionPanelOpen, setQuestionPanelOpen] = useState(false);
  const [questionMode, setQuestionMode] = useState<QuestionMode>("single");
  const [questionTarget, setQuestionTarget] = useState<ExamAssignment | null>(null);

  useEffect(() => { fetchAssignments(); }, []);

  async function fetchAssignments() {
    setLoading(true);
    setError(null);
    try {
      const res = await cbtTeacherExamService.getExams();
      setAssignments(res);
    } catch {
      setError("Failed to load assignments. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function openModal(assignment: ExamAssignment, type: ActionType) {
    setSelectedAssignment(assignment);
    setActionType(type);
    setModalOpen(true);
  }

  async function handleConfirm(notes: string) {
    if (!selectedAssignment) return;
    const payload: RespondPayload = { accept: actionType === "accept", notes };
    setActionLoading(true);
    try {
      const res = await cbtTeacherExamService.respondToAssignment(payload, selectedAssignment.id);
      setModalOpen(false);
      if (res.status === false) {
        toast.info(res?.responseMessage || "Something went wrong");
      } else {
        toast.success("Action was successful");
        fetchAssignments();
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.responseMessage || "Something went wrong. Please try again.");
    } finally {
      setActionLoading(false);
    }
  }

  function openQuestionPanel(assignment: ExamAssignment, mode: QuestionMode) {
    setQuestionTarget(assignment);
    setQuestionMode(mode);
    setQuestionPanelOpen(true);
  }

  async function handleAddSingle(payload: SingleQuestionPayload): Promise<void> {
    try {
      const res = await cbtTeacherExamService.addSingleExamQuestion(payload)
      toast.success("Question added successfully");
      fetchAssignments()
    } catch (error: any) {
      toast.error(error?.response?.data?.responseMessage || "Unknown error occured")
    }
  }

  async function handleAddBulk(payload: BulkQuestionsPayload): Promise<void> {
    try{
      await cbtTeacherExamService.addBulkExamQuestion(payload)
      toast.success(`${payload.questions.length} question(s) added successfully`);
    } catch(error: any){
      toast.error(error?.response?.data?.responseMessage || "Unknown error occured")
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{styles}</style>

      <div className="eal-container">
        <div className="eal-header">
          <div>
            <h1 className="eal-title">Exam Assignments</h1>
            <p className="eal-subtitle">Review and respond to exam assignments from examiners.</p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={fetchAssignments} disabled={loading}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M23 4v6h-6M1 20v-6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Refresh
          </button>
        </div>

        {loading && (
          <div className="state-box">
            <div className="spinner" />
            <p>Loading assignments…</p>
          </div>
        )}

        {error && !loading && (
          <div className="state-box state-error">
            <p>{error}</p>
            <button className="btn btn-ghost btn-sm" onClick={fetchAssignments}>Retry</button>
          </div>
        )}

        {!loading && !error && assignments.length === 0 && (
          <div className="state-box">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" opacity="0.3">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p>No assignments found.</p>
          </div>
        )}

        {!loading && !error && assignments.length > 0 && (
          <div className="table-wrapper">
            <table className="eal-table">
              <thead>
                <tr>
                  <th>Exam Title</th>
                  <th>Teacher</th>
                  <th>Assigned By</th>
                  <th>Date Assigned</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((a) => {
                  const { label, className } = getStatus(a.status);
                  const isPending = a.status === 0;
                  const isAccepted = a.status === 1;

                  return (
                    <tr key={a.id}>
                      <td>
                        <span className="cell-primary">{a.examinationTitle}</span>
                        <span className="cell-secondary">{a.examinationId.slice(0, 8)}…</span>
                      </td>
                      <td>
                        <span className="cell-primary">{a.teacherName}</span>
                        <span className="cell-secondary">{a.teacherEmail}</span>
                      </td>
                      <td>{a.examinerName}</td>
                      <td>{formatDate(a.createdAt)}</td>
                      <td>
                        <span className={`status-badge ${className}`}>{label}</span>
                      </td>
                      <td>
                        <div className="action-group">
                          {/* Accept / Reject — only for pending */}
                          {isPending && (
                            <>
                              <button className="btn btn-accept btn-sm" onClick={() => openModal(a, "accept")}>
                                Accept
                              </button>
                              <button className="btn btn-reject btn-sm" onClick={() => openModal(a, "reject")}>
                                Reject
                              </button>
                            </>
                          )}

                          {/* Add Questions — only for accepted assignments */}
                          {isAccepted && (
                            <>
                              <button
                                className="btn btn-add-q btn-sm"
                                onClick={() => openQuestionPanel(a, "single")}
                                title="Add a single question"
                              >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                                </svg>
                                Add Question
                              </button>
                              <button
                                className="btn btn-bulk-q btn-sm"
                                onClick={() => openQuestionPanel(a, "bulk")}
                                title="Add multiple questions at once"
                              >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                                  <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                                  <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                                  <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                                  <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                                </svg>
                                Bulk Add
                              </button>
                            </>
                          )}

                          {/* Rejected state — no actions */}
                          {!isPending && !isAccepted && (
                            <span className="cell-secondary">
                              {a.respondedAt ? formatDate(a.respondedAt) : "—"}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Accept/Reject confirm modal */}
      <ConfirmModal
        open={modalOpen}
        actionType={actionType}
        assignment={selectedAssignment}
        onConfirm={handleConfirm}
        onCancel={() => !actionLoading && setModalOpen(false)}
      />

      {actionLoading && (
        <div className="modal-overlay">
          <div className="spinner spinner-lg" />
        </div>
      )}

      {/* Add Questions slide-in panel */}
      {questionTarget && (
        <AddExamQuestions
          open={questionPanelOpen}
          mode={questionMode}
          examinationId={questionTarget.examinationId}
          examinationTitle={questionTarget.examinationTitle}
          onClose={() => setQuestionPanelOpen(false)}
          onAddSingle={handleAddSingle}
          onAddBulk={handleAddBulk}
        />
      )}
    </>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = `
  .eal-container {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    padding: 24px;
    max-width: 1100px;
    margin: 0 auto;
    color: #1a1f2e;
  }

  .eal-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 24px;
    gap: 16px;
    flex-wrap: wrap;
  }

  .eal-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 4px;
    color: #0f172a;
  }

  .eal-subtitle {
    font-size: 0.875rem;
    color: #64748b;
    margin: 0;
  }

  /* Table */
  .table-wrapper {
    overflow-x: auto;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    box-shadow: 0 1px 4px rgba(0,0,0,.05);
  }

  .eal-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
  }

  .eal-table thead { background: #f8fafc; }

  .eal-table th {
    text-align: left;
    padding: 12px 16px;
    font-weight: 600;
    color: #475569;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: .04em;
    border-bottom: 1px solid #e2e8f0;
    white-space: nowrap;
  }

  .eal-table td {
    padding: 14px 16px;
    border-bottom: 1px solid #f1f5f9;
    vertical-align: middle;
  }

  .eal-table tbody tr:last-child td { border-bottom: none; }
  .eal-table tbody tr:hover { background: #f8fafc; }

  .cell-primary {
    display: block;
    font-weight: 500;
    color: #1e293b;
  }

  .cell-secondary {
    display: block;
    font-size: 0.75rem;
    color: #94a3b8;
    margin-top: 2px;
  }

  /* Status badges */
  .status-badge {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: .03em;
  }

  .status-pending  { background: #fef9c3; color: #854d0e; }
  .status-accepted { background: #dcfce7; color: #166534; }
  .status-rejected { background: #fee2e2; color: #991b1b; }
  .status-unknown  { background: #f1f5f9; color: #64748b; }

  /* Buttons */
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 7px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    border: none;
    transition: background .15s, transform .1s, box-shadow .15s;
    white-space: nowrap;
  }

  .btn:active { transform: scale(.97); }
  .btn-sm { padding: 6px 12px; font-size: 0.8rem; }

  .btn-ghost {
    background: transparent;
    border: 1px solid #e2e8f0;
    color: #475569;
  }
  .btn-ghost:hover { background: #f1f5f9; }

  .btn-accept {
    background: #16a34a;
    color: #fff;
    box-shadow: 0 1px 3px rgba(22,163,74,.25);
  }
  .btn-accept:hover { background: #15803d; }

  .btn-reject {
    background: #dc2626;
    color: #fff;
    box-shadow: 0 1px 3px rgba(220,38,38,.25);
  }
  .btn-reject:hover { background: #b91c1c; }

  .btn-add-q {
    background: #4f46e5;
    color: #fff;
    box-shadow: 0 1px 3px rgba(79,70,229,.25);
  }
  .btn-add-q:hover { background: #4338ca; }

  .btn-bulk-q {
    background: #0891b2;
    color: #fff;
    box-shadow: 0 1px 3px rgba(8,145,178,.25);
  }
  .btn-bulk-q:hover { background: #0e7490; }

  .action-group {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    align-items: center;
  }

  /* State boxes */
  .state-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 60px 24px;
    color: #94a3b8;
    font-size: 0.9rem;
    text-align: center;
    border: 1px dashed #e2e8f0;
    border-radius: 10px;
  }

  .state-error {
    background: #fff5f5;
    border-color: #fecaca;
    color: #dc2626;
  }

  /* Spinner */
  .spinner {
    width: 28px;
    height: 28px;
    border: 3px solid #e2e8f0;
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin .7s linear infinite;
  }
  .spinner-lg { width: 44px; height: 44px; border-width: 4px; }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* Confirm Modal */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.5);
    backdrop-filter: blur(3px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
    padding: 16px;
  }

  .modal-card {
    background: #fff;
    border-radius: 14px;
    padding: 32px;
    max-width: 440px;
    width: 100%;
    box-shadow: 0 20px 60px rgba(0,0,0,.2);
    animation: modal-in .2s ease;
  }

  @keyframes modal-in {
    from { opacity: 0; transform: scale(.95) translateY(8px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }

  .modal-accept { border-top: 4px solid #16a34a; }
  .modal-reject { border-top: 4px solid #dc2626; }

  .modal-icon {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
  }

  .icon-accept { background: #dcfce7; color: #16a34a; }
  .icon-reject { background: #fee2e2; color: #dc2626; }

  .modal-title {
    font-size: 1.15rem;
    font-weight: 700;
    text-align: center;
    margin: 0 0 10px;
    color: #0f172a;
  }

  .modal-body {
    font-size: 0.875rem;
    color: #475569;
    text-align: center;
    margin: 0 0 20px;
    line-height: 1.6;
  }

  .form-group { margin-bottom: 20px; }

  .form-label {
    display: block;
    font-size: 0.8rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 6px;
  }

  .label-hint {
    font-weight: 400;
    color: #9ca3af;
  }

  .form-textarea {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #d1d5db;
    border-radius: 7px;
    font-size: 0.875rem;
    font-family: inherit;
    color: #1e293b;
    resize: vertical;
    box-sizing: border-box;
    transition: border-color .15s;
  }
  .form-textarea:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59,130,246,.1);
  }

  .modal-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }
`;

export default ExaminationAssignmentList;
