import { useContext, useEffect, useMemo, useState } from "react";
import { Badge, Btn, ConfirmDialog, Modal } from "../../../../components/ui/CbtSharedComponents";
import { Icons } from "../../../../assets/icons/Icon";
import AdminCbtExaminationTable from "./AdminCbtExaminationTable";
import AdminCbtExaminationForm from "./AdminCbtExaminationForm";
import { useAuth } from "../../../../Context/Auth/useAuth";
import { AdminCbtExaminationService } from "../../../../Services/Cbt/Admin/examination/AdminCbtExaminationService";
import { AdminCbtExaminerService } from "../../../../Services/Cbt/Admin/examiner/AdminCbtExaminerService";
import { AppContext } from "../../../../Context/AppContext";
import { ExaminerExamService } from "../../../../Services/Cbt/Examiner/examinations";
import { toast } from "react-toastify";
import AssignTeachers from "./modals/AssignTeachers";
import AssignStudents from "./modals/AssignStudents";

export type ExamType = "WAEC" | "NECO" | "JAMB" | "GCE" | "INTERNAL";
export type ExamTerm = "FIRST" | "SECOND" | "THIRD";
export type ExamStatus = "DRAFT" | "SCHEDULED" | "ACTIVE" | "COMPLETED";

export interface Examiner {
  teacherId: string;
  firstname: string;
  lastname: string;
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
  assignedTeachers?: assignedTeachers[]
  assignedStudents?: Student[]
}

type assignedTeachers = {
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
  respondedAt: string;
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

export interface Student {
  studentId: string;
  studentNo: string;
  firstname: string;
  lastname: string;
  gender: string;
  dateOfBirth: string;
  homeAddress: string;
  admissionSession: string;
  currentTerm: string;
  imagePath: string;
  schoolId: string;
}

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

export default function ExaminarCbtExaminationsPage() {
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

  // Assign Teacher modal
  const [assignModal, setAssignModal] = useState(false);
  const [assignStudentModal, setAssignStudentModal] = useState(false);
  const [assignTarget, setAssignTarget] = useState<Examination | null>(null);
  const [teachers, setTeachers] = useState<Examiner[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [fetchingTeachers, setFetchingTeachers] = useState(false);
  const [fetchingStudents, setFetchingStudents] = useState(false);
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [assigning, setAssigning] = useState(false);
  // console.log(selectedStudents)

  // Inline action loading states keyed by exam id
  const [togglingPublish, setTogglingPublish] = useState<string | null>(null);
  const [togglingActivate, setTogglingActivate] = useState<string | null>(null);

  /* ── Fetch examinations ── */
  const fetchExaminations = async (page = 1) => {
    if (!cbtUser?.schoolId) return;
    setFetching(true);
    try {
      const res = await ExaminerExamService.getMyExams();
      setExaminations(res);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const [subjects, setSubjects] = useState<{
    id: string;
    subjectName: string;
    description: string;
    teacherId: string;
    schoolId: string;
  }[]>([])

  const fetchSubjects = async () => {
    try {
      if (cbtUser?.schoolId) {
        const res = await ExaminerExamService.getSubjects(cbtUser?.schoolId)
        setSubjects(res)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchExaminations(1);
    fetchSubjects()
  }, [cbtUser?.schoolId]);

  /* ── Fetch examiners for assign modal ── */
  const openAssignModal = async (exam: Examination, type: "teacher" | "student") => {
    setAssignTarget(exam);

    const preSelectedIds = exam.assignedTeachers?.map(t => t.teacherId) || [];
    setSelectedTeachers(preSelectedIds);

    if (type === "teacher") {
      setAssignModal(true);
      setFetchingTeachers(true);
      try {
        const data = await ExaminerExamService.getTeachers(cbtUser?.schoolId ?? "");
        setTeachers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setFetchingTeachers(false);
      }
    } else if (type === "student") {
      setAssignStudentModal(true);
      setFetchingStudents(true);
      try {
        const data = await ExaminerExamService.getStudents(cbtUser?.schoolId ?? "");
        setStudents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setFetchingStudents(false);
      }
    }
  };

  const toggleTeacherSelection = (id: string) => {
    setSelectedTeachers((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const toggleStudentSelection = (id: string) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const saveAssignment = async () => {
    if (!assignTarget) return;
    setAssigning(true);
    try {
      // Assign multiple selected examiners
      const payload = {
        examinationId: assignTarget.id,
        teacherIds: selectedTeachers,
        notes: ''
      }
      await ExaminerExamService.assignTeachersToExam(payload);

      // Update the examination with the first selected teacher (or null if none)
      setExaminations((prev) =>
        prev.map((e) =>
          e.id === assignTarget.id ? { ...e, examinerId: selectedTeachers[0] ?? null } : e,
        ),
      );
      setAssignModal(false);
      setAssignTarget(null);
      setSelectedTeachers([]);
      toast.success(`${selectedTeachers.length} teacher(s) assigned successfully`);
      fetchExaminations(1)
    } catch (err) {
      console.error(err);
      toast.error("Failed to assign teachers");
    } finally {
      setAssigning(false);
    }
  };

  const assignmentStudents = async () => {
    if (!assignTarget) return;
    setAssigning(true);
    try {
      // Assign multiple selected examiners
      const payload = {
        examinationId: assignTarget.id,
        studentIds: selectedStudents,
      }
      console.log(payload)
      await ExaminerExamService.assignStudentsToExam(payload);

      // Update the examination with the first selected teacher (or null if none)
      setExaminations((prev) =>
        prev.map((e) =>
          e.id === assignTarget.id ? { ...e, examinerId: selectedTeachers[0] ?? null } : e,
        ),
      );
      setAssignStudentModal(false);
      setAssignTarget(null);
      setSelectedStudents([]);
      toast.success(`${selectedTeachers.length} student(s) assigned successfully`);
      fetchExaminations(1)
    } catch (err) {
      console.error(err);
      toast.error("Failed to assign students");
    } finally {
      setAssigning(false);
    }
  };

  /* ── Publish toggle ── */
  const togglePublish = async (exam: Examination) => {
    setTogglingPublish(exam.id);
    try {
      if (exam.isPublished) {
        const res = await ExaminerExamService.unPublishExam(exam.id);
        toast.success('Unpublished Successfully')
      } else {
        const res = await ExaminerExamService.publishExam(exam.id);
        console.log(res.responseMessage)
        if (res.responseCode === "400") {
          toast.info(res.responseMessage)
        } else
          toast.success('Published Successfully')
      }

      fetchExaminations(1)
    } catch (err) {
      console.log(err);
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

      fetchExaminations(1)
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
        const res = await ExaminerExamService.update(editing, payload);
        await fetchExaminations(pagination.pageNumber);

        if (res) {
          notifySuccess("Examination updated and is now active.");
        }
      } else {
        await ExaminerExamService.create(payload);
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
      await ExaminerExamService.delete(deleteTarget);
      notifySuccess("Examination deleted successfully.");
      fetchExaminations(1)
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const assignedTeacherIds = assignTarget?.assignedTeachers?.map(t => t.teacherId) || [];

  // Filter teachers to only show unassigned ones
  const unassignedTeachers = teachers.filter(teacher =>
    !assignedTeacherIds.includes(teacher.teacherId)
  );

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
          subjects={subjects}
        />
      </Modal>

      {/* Assign teachers modal - Multiple Selection */}
      <AssignTeachers
        assignModal={assignModal}
        assigning={assigning}
        setAssignModal={setAssignModal}
        toggleSelection={toggleTeacherSelection}
        assignTarget={assignTarget}
        fetchingTeachers={fetchingTeachers}
        teachers={teachers}
        selectedTeachers={selectedTeachers}
        saveAssignment={saveAssignment}
      />

      <AssignStudents
        assignModal={assignStudentModal}
        assigning={assigning}
        setAssignModal={setAssignStudentModal}
        toggleSelection={toggleStudentSelection}
        assignTarget={assignTarget}
        fetchingStudents={fetchingStudents}
        students={students}
        selectedStudents={selectedStudents}
        saveAssignment={assignmentStudents}
      />

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
