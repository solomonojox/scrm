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
import { GraduationCap, ListFilter, User, UserRound } from "lucide-react";

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

  const statCards = [
    {
      id: 1,
      title: "Total Students",
      value: fetchedAdminCbtStudentRecord.length,
      icon: GraduationCap,
      borderClass: "border-orange-500",
      bgClass: "bg-orange-50",
      iconTextClass: "text-orange-500",
      description: "Active enrolled students",
    },
    {
      id: 2,
      title: "Shown",
      value: filtered.length,
      icon: ListFilter,
      borderClass: "border-slate-400",
      bgClass: "bg-slate-50",
      iconTextClass: "text-slate-500",
      description: "Matching current search",
    },
    {
      id: 3,
      title: "Male",
      value: fetchedAdminCbtStudentRecord.filter((s) => s.gender?.toLowerCase() === "male").length,
      icon: User,
      borderClass: "border-blue-500",
      bgClass: "bg-blue-50",
      iconTextClass: "text-blue-500",
      description: "Male students",
    },
    {
      id: 4,
      title: "Female",
      value: fetchedAdminCbtStudentRecord.filter((s) => s.gender?.toLowerCase() === "female").length,
      icon: UserRound,
      borderClass: "border-pink-500",
      bgClass: "bg-pink-50",
      iconTextClass: "text-pink-500",
      description: "Female students",
    },
  ];

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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map(({ id, title, value, icon: Icon, borderClass, bgClass, iconTextClass, description }) => (
            <div
              key={id}
              className={`group w-full rounded-lg border-t-2 bg-white p-4 shadow-md transition-all duration-200 hover:shadow-lg ${borderClass}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center space-x-2">
                    <div className={`rounded-lg p-2 ${bgClass}`}>
                      <Icon className={`h-4 w-4 ${iconTextClass}`} />
                    </div>
                    <h2 className="text-sm font-semibold text-gray-600">{title}</h2>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-gray-800">
                    {typeof value === "number" ? value.toLocaleString() : value}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">{description}</p>
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