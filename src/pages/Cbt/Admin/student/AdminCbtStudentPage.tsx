import { useContext, useEffect, useMemo, useState } from "react";
import { Badge, Btn, ConfirmDialog, Modal } from "../../../../components/ui/CbtSharedComponents";
import { Icons } from "../../../../assets/icons/Icon";
import { useAuth } from "../../../../Context/Auth/useAuth";
import { AdminCbtStudentService } from "../../../../Services/Cbt/Admin/student/AdminCbtStudentService";
import { AdminCbtTeacherService } from "../../../../Services/Cbt/Admin/teacher/AdminCbtTeacherService";
import { Teacher } from "../Teacher/AdminCbtTeachersPage";
import AdminCbtStudentsTable from "./AdminCbtStudentTable";
import AdminCbtStudentsForm from "./AdminCbtStudentForm";
import { AppContext } from "../../../../Context/AppContext";
import { fetchAdminCbtStudentFailure, fetchAdminCbtStudentStart, fetchAdminCbtStudentSuccess } from "../../../../Store/cbt/admin/student/adminCbtStudentSlice";
import { AppDispatch, RootState } from "../../../../Store/store";
import { useDispatch, useSelector } from "react-redux";

export interface Student {
  studentId: string;
  studentNo: string;
  firstname: string;
  lastname: string;
  gender?: string | null;
  dateOfBirth?: string;
  homeAddress?: string;
  admissionSession?: string | null;
  currentTerm?: string | null;
  imagePath?: string | null;
  schoolId: string;
}

export type StudentForm = {
  firstname: string;
  lastname: string;
  gender: string;
  dateOfBirth: string;
  homeAddress: string;
  admissionSession: string;
  currentTerm: string;
  password: string;
  teacherId: string;
};

export const initialStudentForm: StudentForm = {
  firstname: "",
  lastname: "",
  gender: "",
  dateOfBirth: "",
  homeAddress: "",
  admissionSession: "",
  currentTerm: "",
  password: "",
  teacherId: "",
};

export default function AdminCbtStudentPage() {
  const { cbtUser } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const { notifySuccess, notifyError } = useContext(AppContext);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<StudentForm>(initialStudentForm);
  const [editing, setEditing] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);
  const [fetchingTeachers, setFetchingTeachers] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchedAdminCbtStudentRecord = useSelector(
    (state: RootState) => state.getAdminCbtStudents.listRecords,
  );
  const fetchedAdminCbtTeacherRecord = useSelector(
    (state: RootState) => state.getAdminCbtTeachers.listRecords,
  );

  const fetchedAdminCbtStudentLoading = useSelector(
    (state: RootState) => state.getAdminCbtStudents.loading,
  );
 

  // Fetch examiners on mount or when schoolId changes
  useEffect(() => {
    if (cbtUser?.schoolId) {
      fetchStudents();
    }
  }, [cbtUser?.schoolId]);

  const fetchStudents = async () => {
    if (!cbtUser?.schoolId) return;
    // setLoading(true);
    dispatch(fetchAdminCbtStudentStart());
    
    try {
      const students = await AdminCbtStudentService.getBySchool(cbtUser.schoolId);
      dispatch(fetchAdminCbtStudentSuccess(students ?? []));
    } catch (err) {
      const msg = (err as Error).message;
      dispatch(fetchAdminCbtStudentFailure(msg));
      notifyError(`Failed to fetch students: ${msg}`);
    }
  };

  const loadTeachers = async () => {
    if (fetchedAdminCbtTeacherRecord.length > 0) return; // already loaded
    setFetchingTeachers(true);
    try {
      const data = await AdminCbtTeacherService.getBySchool(cbtUser?.schoolId ?? "");
      // setTeachers(data ?? []);
      
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingTeachers(false);
    }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return fetchedAdminCbtStudentRecord.filter((s) =>
      `${s.firstname} ${s.lastname} ${s.studentNo} ${s.gender}`.toLowerCase().includes(q),
    );
  }, [fetchedAdminCbtStudentRecord, search]);

  const openAdd = async () => {
    setForm(initialStudentForm);
    setEditing(null);
    setModal(true);
    await loadTeachers();
  };

  const openEdit = async (s: Student) => {
    setForm({
      firstname: s.firstname,
      lastname: s.lastname,
      gender: s.gender ?? "",
      dateOfBirth: s.dateOfBirth ? s.dateOfBirth.split("T")[0] : "",
      homeAddress: s.homeAddress ?? "",
      admissionSession: s.admissionSession ?? "",
      currentTerm: s.currentTerm ?? "",
      password: "",
      teacherId: "",
    });
    setEditing(s.studentId);
    setModal(true);
    await loadTeachers();
  };

  const save = async () => {
    setSubmitting(true);
    try {
      const payload = { ...form, schoolId: cbtUser?.schoolId ?? "" };
      if (editing) {
        const response = await AdminCbtStudentService.update(editing, payload);

        if (response?.data) {
          fetchStudents(); // Refresh list after update
          notifySuccess("Student updated successfully.");
        }
      } else {
        const created = await AdminCbtStudentService.create(payload);
        if (created) {
          fetchStudents(); // Refresh list after creation
        }
      }
      notifySuccess("Student created successfully.");
      setModal(false);
      setForm(initialStudentForm);
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
      const response = await AdminCbtStudentService.delete(deleteTarget);
      fetchStudents();
      setDeleteTarget(null);
      notifySuccess("Student deleted successfully.");
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/60 font-sans">
      <div className="mx-auto max-w-6xl space-y-6 p-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-orange-500">
              Administration
            </p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-gray-900">Students</h1>
            <p className="mt-0.5 text-sm text-gray-500">Manage student enrolment for your school</p>
          </div>
          <Btn onClick={openAdd} disabled={fetching}>
            <Icons.Plus />
            Add Student
          </Btn>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "Total Students",
              value: fetchedAdminCbtStudentRecord.length,
              icon: "ti-school",
              accent: "bg-orange-500",
              ring: "ring-orange-100",
              text: "text-orange-600",
              bg: "bg-orange-50",
            },
            {
              label: "Shown",
              value: filtered.length,
              icon: "ti-layout-list",
              accent: "bg-slate-400",
              ring: "ring-slate-100",
              text: "text-slate-500",
              bg: "bg-slate-50",
            },
            {
              label: "Male",
              value: fetchedAdminCbtStudentRecord.filter((s) => s.gender?.toLowerCase() === "male").length,
              icon: "ti-user",
              accent: "bg-blue-500",
              ring: "ring-blue-100",
              text: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              label: "Female",
              value: fetchedAdminCbtStudentRecord.filter((s) => s.gender?.toLowerCase() === "female").length,
              icon: "ti-user",
              accent: "bg-pink-500",
              ring: "ring-pink-100",
              text: "text-pink-600",
              bg: "bg-pink-50",
            },
          ].map(({ label, value, icon, accent, ring, text, bg }) => (
            <div
              key={label}
              className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className={`absolute inset-x-0 top-0 h-1 rounded-t-2xl ${accent}`} />
              <div className="mt-1 flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    {label}
                  </p>
                  <p className="mt-1.5 text-3xl font-black tracking-tight text-gray-900">{value}</p>
                </div>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg} ring-4 ${ring}`}
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
                placeholder="Search name, student no or gender…"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm placeholder-gray-300 focus:border-orange-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-400/10"
              />
            </div>
            <Badge color="orange" className="whitespace-nowrap">
              {filtered.length} shown
            </Badge>
          </div>

          <AdminCbtStudentsTable
            students={filtered as (Student & { studentId: string })[]}
            onEdit={openEdit}
            onDelete={(id) => setDeleteTarget(id)}
            fetching={fetching}
          />
        </div>
      </div>

      <Modal
        open={modal}
        onClose={() => !submitting && setModal(false)}
        title={editing ? "Edit Student" : "Add Student"}
      >
        <AdminCbtStudentsForm
          form={form}
          setForm={setForm}
          editing={editing}
          teachers={fetchedAdminCbtTeacherRecord as Teacher[]}
          fetchingTeachers={fetchingTeachers}
          onCancel={() => setModal(false)}
          onSubmit={save}
          submitting={submitting}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => !deleting && setDeleteTarget(null)}
        onConfirm={remove}
        loading={deleting}
      />
    </div>
  );
}
