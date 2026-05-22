import { useContext, useEffect, useMemo, useState } from "react";
import { Badge, Btn, ConfirmDialog, Modal } from "../../../../components/ui/CbtSharedComponents";
import { Icons } from "../../../../assets/icons/Icon";
import AdminCbtExaminationTable from "./AdminCbtExaminationTable";
import AdminCbtExaminationForm from "./AdminCbtExaminationForm";
import { useAuth } from "../../../../Context/Auth/useAuth";
import { AdminCbtExaminationService } from "../../../../Services/Cbt/Admin/examination/AdminCbtExaminationService";
import { AdminCbtExaminerService } from "../../../../Services/Cbt/Admin/examiner/AdminCbtExaminerService";
import { AppContext } from "../../../../Context/AppContext";

export type ExamType = "WAEC" | "NECO" | "JAMB" | "GCE" | "INTERNAL";
export type ExamTerm = "FIRST" | "SECOND" | "THIRD";
export type ExamStatus = "DRAFT" | "SCHEDULED" | "ACTIVE" | "COMPLETED";

export interface Examiner {
  id: string;
  fullname: string;
  email: string;
  isActive?: boolean;
}

export interface Examination {
  id: string;
  title: string;
  examType: ExamType;
  term: ExamTerm;
  status: ExamStatus;
  academicSession: string;
  durationMinutes: number;
  classLevel?: string | null;
  subjectId: string;
  schoolId: string;
  examDate?: string | null;
  isPublished: boolean;
  passingScore?: number | null;
  instructions?: string | null;
  examinerId?: string | null;
  questions: unknown[];
}

export type ExaminationForm = {
  title: string;
  examType: ExamType;
  term: ExamTerm;
  academicSession: string;
  durationMinutes: number;
  classLevel: string;
  subjectId: string;
  scheduledDate: string;
  passingScore: string;
  instructions: string;
};

export const initialExaminationForm: ExaminationForm = {
  title: "",
  examType: "INTERNAL",
  term: "FIRST",
  academicSession: "",
  durationMinutes: 60,
  classLevel: "",
  subjectId: "",
  scheduledDate: "",
  passingScore: "",
  instructions: "",
};

export default function AdminCbtExaminationsPage() {
  const { cbtUser } = useAuth();
  const { notifySuccess, notifyError } = useContext(AppContext);
  const [examinations, setExaminations] = useState<Examination[]>([]);
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 1,
  });
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<ExaminationForm>(initialExaminationForm);
  const [editing, setEditing] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Assign examiner modal
  const [assignModal, setAssignModal] = useState(false);
  const [assignTarget, setAssignTarget] = useState<Examination | null>(null);
  const [examiners, setExaminers] = useState<Examiner[]>([]);
  const [fetchingExaminers, setFetchingExaminers] = useState(false);
  const [selectedExaminers, setSelectedExaminers] = useState<string[]>([]);
  const [assigning, setAssigning] = useState(false);

  // Inline action loading states keyed by exam id
  const [togglingPublish, setTogglingPublish] = useState<string | null>(null);
  const [togglingActivate, setTogglingActivate] = useState<string | null>(null);

  /* ── Fetch examinations ── */
  const fetchExaminations = async (page = 1) => {
    if (!cbtUser?.schoolId) return;
    setFetching(true);
    try {
      const res = await AdminCbtExaminationService.getBySchool(cbtUser.schoolId, page, 10);
      setExaminations(res.data);
      setPagination({
        pageNumber: res.pageNumber,
        pageSize: res.pageSize,
        totalCount: res.totalCount,
        totalPages: res.totalPages,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchExaminations(1);
  }, [cbtUser?.schoolId]);

  /* ── Fetch examiners for assign modal ── */
  const openAssignModal = async (exam: Examination) => {
    setAssignTarget(exam);
    setSelectedExaminers(exam.examinerId ? [exam.examinerId] : []);
    setAssignModal(true);
    setFetchingExaminers(true);
    try {
      const data = await AdminCbtExaminerService.getBySchool(cbtUser?.schoolId ?? "");
      setExaminers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingExaminers(false);
    }
  };

  const toggleExaminerSelection = (id: string) => {
    setSelectedExaminers((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id],
    );
  };

  const saveAssignment = async () => {
    if (!assignTarget) return;
    setAssigning(true);
    try {
      // Assign each selected examiner — adjust to your API shape
      for (const examinerId of selectedExaminers) {
        await AdminCbtExaminationService;
      }
      setExaminations((prev) =>
        prev.map((e) =>
          e.id === assignTarget.id ? { ...e, examinerId: selectedExaminers[0] ?? null } : e,
        ),
      );
      setAssignModal(false);
      setAssignTarget(null);
    } catch (err) {
      console.error(err);
    } finally {
      setAssigning(false);
    }
  };

  /* ── Publish toggle ── */
  const togglePublish = async (exam: Examination) => {
    setTogglingPublish(exam.id);
    try {
      if (exam.isPublished) {
        await AdminCbtExaminationService;
      } else {
        await AdminCbtExaminationService;
      }
      setExaminations((prev) =>
        prev.map((e) => (e.id === exam.id ? { ...e, isPublished: !e.isPublished } : e)),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setTogglingPublish(null);
    }
  };

  /* ── Activate / Deactivate ── */
  const toggleActivate = async (exam: Examination) => {
    setTogglingActivate(exam.id);
    try {
      if (exam.status === "ACTIVE") {
        await AdminCbtExaminationService.deactivate(exam.id);
        setExaminations((prev) =>
          prev.map((e) => (e.id === exam.id ? { ...e, status: "SCHEDULED" } : e)),
        );
      } else {
        await AdminCbtExaminationService.activate(exam.id);
        setExaminations((prev) =>
          prev.map((e) => (e.id === exam.id ? { ...e, status: "ACTIVE" } : e)),
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTogglingActivate(null);
    }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return examinations.filter((e) =>
      `${e.title} ${e.examType} ${e.term} ${e.status} ${e.academicSession}`
        .toLowerCase()
        .includes(q),
    );
  }, [examinations, search]);

  /* ── Create / Edit ── */
  const openAdd = () => {
    setForm(initialExaminationForm);
    setEditing(null);
    setModal(true);
  };

  const openEdit = (exam: Examination) => {
    setForm({
      title: exam.title,
      examType: exam.examType,
      term: exam.term,
      academicSession: exam.academicSession,
      durationMinutes: exam.durationMinutes,
      classLevel: exam.classLevel ?? "",
      subjectId: exam.subjectId,
      scheduledDate: exam.examDate ? exam.examDate.split("T")[0] : "",
      passingScore: exam.passingScore != null ? String(exam.passingScore) : "",
      instructions: exam.instructions ?? "",
    });
    setEditing(exam.id);
    setModal(true);
  };

  const save = async () => {
    setSubmitting(true);
    try {
      const payload = {
        title: form.title,
        examType: form.examType,
        term: form.term,
        academicSession: form.academicSession,
        duration: String(form.durationMinutes),
        classLabel: form.classLevel,
        subjectId: form.subjectId,
        scheduledDate: form.scheduledDate || undefined,
        passingScore: form.passingScore ? Number(form.passingScore) : 0,
        instructions: form.instructions,
        schoolId: cbtUser?.schoolId ?? "",
      };
      if (editing) {
       const res = await AdminCbtExaminationService.update(editing, payload);
        await fetchExaminations(pagination.pageNumber);

       if (res) {
          notifySuccess("Examination updated and is now active.");
        }
      } else {
        await AdminCbtExaminationService.create(payload);
        await fetchExaminations(1);
      }
      setModal(false);
      setForm(initialExaminationForm);
      setEditing(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await AdminCbtExaminationService.delete(deleteTarget);
      notifySuccess("Examination deleted successfully.");
      setExaminations((prev) => prev.filter((e) => e.id !== deleteTarget));
      setPagination((p) => ({ ...p, totalCount: p.totalCount - 1 }));
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen font-sans">
      <div className="mx-auto max-w-6xl space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-orange-500">
              Administration
            </p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-gray-900">Examinations</h1>
            <p className="mt-0.5 text-sm text-gray-500">Create and manage school examinations</p>
          </div>
          <Btn onClick={openAdd} disabled={fetching}>
            <Icons.Plus />
            Create Exam
          </Btn>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "Total Exams",
              value: pagination.totalCount,
              icon: "ti-book",
              accent: "bg-orange-500",
              ring: "ring-orange-100",
              text: "text-orange-600",
              bg: "bg-orange-50",
            },
            {
              label: "This Page",
              value: examinations.length,
              icon: "ti-layout-list",
              accent: "bg-slate-400",
              ring: "ring-slate-100",
              text: "text-slate-500",
              bg: "bg-slate-50",
            },
            {
              label: "Total Pages",
              value: pagination.totalPages,
              icon: "ti-file-stack",
              accent: "bg-blue-500",
              ring: "ring-blue-100",
              text: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              label: "Scheduled",
              value: examinations.filter((e) => e.status === "SCHEDULED").length,
              icon: "ti-calendar-check",
              accent: "bg-emerald-500",
              ring: "ring-emerald-100",
              text: "text-emerald-600",
              bg: "bg-emerald-50",
            },
          ].map(({ label, value, icon, accent, ring, text, bg }) => (
            <div
              key={label}
              className="relative overflow-hidden rounded-2xl border border-gray-100 px-5 py-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className={`absolute inset-x-0 top-0 h-1 rounded-t-2xl ${accent}`} />
              <div className="mt-1 flex items-start justify-between">
                <div>
                  <p className="text-[10px] md:text-xs font-semibold uppercase tracking-widest text-gray-400">
                    {label}
                  </p>
                  <p className="mt-1.5 text-2xl md:text-3xl font-black tracking-tight text-gray-900">
                    {value}
                  </p>
                </div>
                <div
                  className={`flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-xl ${bg} ring-4 ${ring}`}
                >
                  <i className={`ti ${icon} ${text}`} style={{ fontSize: 20 }} aria-hidden="true" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Table card */}
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300">
                <Icons.Search />
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search title, type, term…"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm placeholder-gray-300 focus:border-orange-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-400/10"
              />
            </div>
            <Badge color="orange" className="whitespace-nowrap">
              {filtered.length} shown
            </Badge>
          </div>

          <AdminCbtExaminationTable
            examinations={filtered}
            onEdit={openEdit}
            onDelete={(id) => setDeleteTarget(id)}
            onAssign={openAssignModal}
            onTogglePublish={togglePublish}
            onToggleActivate={toggleActivate}
            togglingPublish={togglingPublish}
            togglingActivate={togglingActivate}
            fetching={fetching}
          />

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
              <p className="text-xs text-gray-400">
                Page <span className="font-semibold text-gray-600">{pagination.pageNumber}</span> of{" "}
                {pagination.totalPages} · {pagination.totalCount} records
              </p>
              <div className="flex gap-2">
                <Btn
                  size="sm"
                  variant="outline"
                  disabled={pagination.pageNumber <= 1 || fetching}
                  onClick={() => fetchExaminations(pagination.pageNumber - 1)}
                >
                  Previous
                </Btn>
                <Btn
                  size="sm"
                  variant="outline"
                  disabled={pagination.pageNumber >= pagination.totalPages || fetching}
                  onClick={() => fetchExaminations(pagination.pageNumber + 1)}
                >
                  Next
                </Btn>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create / Edit modal */}
      <Modal
        open={modal}
        onClose={() => !submitting && setModal(false)}
        title={editing ? "Edit Examination" : "Create Examination"}
      >
        <AdminCbtExaminationForm
          form={form}
          setForm={setForm}
          editing={editing}
          onCancel={() => setModal(false)}
          onSubmit={save}
          submitting={submitting}
        />
      </Modal>

      {/* Assign Examiner modal */}
      <Modal
        open={assignModal}
        onClose={() => !assigning && setAssignModal(false)}
        title={`Assign Examiners — ${assignTarget?.title ?? ""}`}
      >
        <div className="space-y-4">
          {fetchingExaminers ? (
            <div className="flex flex-col items-center gap-3 py-10">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
              <p className="text-sm text-gray-400">Loading examiners…</p>
            </div>
          ) : examiners.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">
              No examiners found for this school.
            </p>
          ) : (
            <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
              {examiners.map((examiner) => {
                const selected = selectedExaminers.includes(examiner.id);
                const initials = examiner.fullname
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("");
                const hue =
                  examiner.fullname.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
                return (
                  <button
                    key={examiner.id}
                    onClick={() => toggleExaminerSelection(examiner.id)}
                    className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all ${
                      selected
                        ? "border-orange-300 bg-orange-50 ring-2 ring-orange-200"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-black text-white"
                      style={{ background: `hsl(${hue},65%,52%)` }}
                    >
                      {initials}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{examiner.fullname}</p>
                      <p className="text-xs text-gray-400">{examiner.email}</p>
                    </div>
                    <div
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                        selected ? "border-orange-500 bg-orange-500" : "border-gray-300"
                      }`}
                    >
                      {selected && (
                        <svg
                          className="h-3 w-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {selectedExaminers.length > 0 && (
            <p className="text-xs font-medium text-orange-600">
              {selectedExaminers.length} examiner{selectedExaminers.length > 1 ? "s" : ""} selected
            </p>
          )}

          <div className="h-px bg-gray-100" />
          <div className="flex gap-3">
            <Btn
              variant="outline"
              onClick={() => setAssignModal(false)}
              disabled={assigning}
              className="flex-1"
            >
              Cancel
            </Btn>
            <Btn
              onClick={saveAssignment}
              disabled={assigning || selectedExaminers.length === 0}
              loading={assigning}
              className="flex-1"
            >
              {assigning ? "Assigning…" : "Assign Selected"}
            </Btn>
          </div>
        </div>
      </Modal>

      {/* Delete dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => !deleting && setDeleteTarget(null)}
        onConfirm={remove}
        loading={deleting}
      />
    </div>
  );
}
