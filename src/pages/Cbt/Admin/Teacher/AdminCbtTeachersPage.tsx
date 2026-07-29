import { useContext, useEffect, useMemo, useState } from "react";
import { Badge, Btn, ConfirmDialog, Modal } from "../../../../components/ui/CbtSharedComponents";
import { Icons } from "../../../../assets/icons/Icon";
import AdminCbtTeachersTable from "./AdminCbtTeachersTable";
import AdminCbtTeachersForm from "./AdminCbtTeachersForm";
import { useAuth } from "../../../../Context/Auth/useAuth";
import { AdminCbtTeacherService } from "../../../../Services/Cbt/Admin/teacher/AdminCbtTeacherService";
import { AppContext } from "../../../../Context/AppContext";
import { Building2, CalendarCheck, ListFilter, Users2 } from "lucide-react";

export interface Teacher {
  teacherId: string;
  schoolId: string;
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  username?: string;
  dateOfBirth?: string;
  employmentDate?: string;
  homeAddress?: string;
  nationality?: string;
  stateOfOrigin?: string;
  religion?: string;
  imagePath?: string | null;
}

export type TeacherForm = {
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  password: string;
  homeAddress: string;
  nationality: string;
  stateOfOrigin: string;
  religion: string;
  dateOfBirth: string;
  employmentDate: string;
};

export const initialTeacherForm: TeacherForm = {
  firstname: "",
  lastname: "",
  phone: "",
  email: "",
  password: "",
  homeAddress: "",
  nationality: "",
  stateOfOrigin: "",
  religion: "",
  dateOfBirth: "",
  employmentDate: "",
};

export default function AdminCbtTeachersPage() {
  const { cbtUser } = useAuth();
  const { notifySuccess, notifyError } = useContext(AppContext);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<TeacherForm>(initialTeacherForm);
  const [editing, setEditing] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!cbtUser?.schoolId) return;
      setFetching(true);
      try {
        const data = await AdminCbtTeacherService.getBySchool(cbtUser.schoolId);
        setTeachers(data ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };
    load();
  }, [cbtUser?.schoolId]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return teachers.filter((t) =>
      `${t.firstname} ${t.lastname} ${t.email} ${t.phone}`.toLowerCase().includes(q),
    );
  }, [teachers, search]);

  const activeCount = teachers.length;

  const openAdd = () => {
    setForm(initialTeacherForm);
    setEditing(null);
    setModal(true);
  };

  const openEdit = (t: Teacher) => {
    setForm({
      firstname: t.firstname,
      lastname: t.lastname,
      phone: t.phone,
      email: t.email,
      password: "",
      homeAddress: t.homeAddress ?? "",
      nationality: t.nationality ?? "",
      stateOfOrigin: t.stateOfOrigin ?? "",
      religion: t.religion ?? "",
      dateOfBirth: t.dateOfBirth ? t.dateOfBirth.split("T")[0] : "",
      employmentDate: t.employmentDate ? t.employmentDate.split("T")[0] : "",
    });
    setEditing(t.teacherId);
    setModal(true);
  };

  const save = async () => {
    setSubmitting(true);
    try {
      const payload = { ...form, schoolId: cbtUser?.schoolId ?? "" };
      if (editing) {
       const res = await AdminCbtTeacherService.update(editing, payload);
        setTeachers((prev) =>
          prev.map((t) => (t.teacherId === editing ? { ...t, ...payload } : t)),
        );

        notifySuccess("Teacher updated successfully.");
      } else {
        const created = await AdminCbtTeacherService.create(payload);
        setTeachers((prev) => [
          ...prev,
          created?.data ?? { ...payload, teacherId: crypto.randomUUID() },
        ]);

        notifySuccess("Teacher created successfully.");
      }
      setModal(false);
      setForm(initialTeacherForm);
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
      const res = await AdminCbtTeacherService.delete(deleteTarget);
      setTeachers((prev) => prev.filter((t) => t.teacherId !== deleteTarget));
      setDeleteTarget(null);
      notifySuccess("Teacher deleted successfully.");
    } catch (err) {
      notifyError("Failed to delete teacher.");
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const statCards = [
    {
      id: 1,
      title: "Total Teachers",
      value: activeCount,
      icon: Users2,
      borderClass: "border-orange-500",
      bgClass: "bg-orange-50",
      iconTextClass: "text-orange-500",
      description: "Registered teaching staff",
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
      title: "This School",
      value: teachers.filter((t) => t.schoolId === cbtUser?.schoolId).length,
      icon: Building2,
      borderClass: "border-blue-500",
      bgClass: "bg-blue-50",
      iconTextClass: "text-blue-500",
      description: "Assigned to your school",
    },
    {
      id: 4,
      title: "Recent",
      value: teachers.filter(
        (t) => t.employmentDate && new Date(t.employmentDate) > new Date(Date.now() - 90 * 86400000),
      ).length,
      icon: CalendarCheck,
      borderClass: "border-emerald-500",
      bgClass: "bg-emerald-50",
      iconTextClass: "text-emerald-500",
      description: "Hired in the last 90 days",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/60 font-sans">
      <div className="mx-auto max-w-6xl space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-orange-500">
              Administration
            </p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-gray-900">Teachers</h1>
            <p className="mt-0.5 text-sm text-gray-500">Manage teaching staff for your school</p>
          </div>
          <Btn onClick={openAdd} disabled={fetching}>
            <Icons.Plus />
            Add Teacher
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
                placeholder="Search name, email or phone…"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm placeholder-gray-300 focus:border-orange-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-400/10"
              />
            </div>
            <Badge color="orange" className="whitespace-nowrap">
              {filtered.length} shown
            </Badge>
          </div>

          <AdminCbtTeachersTable
            teachers={filtered}
            onEdit={openEdit}
            onDelete={(id) => setDeleteTarget(id)}
            fetching={fetching}
          />
        </div>
      </div>

      <Modal
        open={modal}
        onClose={() => !submitting && setModal(false)}
        title={editing ? "Edit Teacher" : "Add Teacher"}
      >
        <AdminCbtTeachersForm
          form={form}
          setForm={setForm}
          editing={editing}
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