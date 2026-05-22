import { useContext, useEffect, useMemo, useState } from "react";
import { Badge, Btn, ConfirmDialog, Modal } from "../../../../components/ui/CbtSharedComponents";
import { Icons } from "../../../../assets/icons/Icon";
import AdminCbtTeachersTable from "./AdminCbtTeachersTable";
import AdminCbtTeachersForm from "./AdminCbtTeachersForm";
import { useAuth } from "../../../../Context/Auth/useAuth";
import { AdminCbtTeacherService } from "../../../../Services/Cbt/Admin/teacher/AdminCbtTeacherService";
import { AppContext } from "../../../../Context/AppContext";

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
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "Total Teachers",
              value: activeCount,
              icon: "ti-users",
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
              label: "This School",
              value: teachers.filter((t) => t.schoolId === cbtUser?.schoolId).length,
              icon: "ti-building-school",
              accent: "bg-blue-500",
              ring: "ring-blue-100",
              text: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              label: "Recent",
              value: teachers.filter(
                (t) =>
                  t.employmentDate &&
                  new Date(t.employmentDate) > new Date(Date.now() - 90 * 86400000),
              ).length,
              icon: "ti-calendar-check",
              accent: "bg-emerald-500",
              ring: "ring-emerald-100",
              text: "text-emerald-600",
              bg: "bg-emerald-50",
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
