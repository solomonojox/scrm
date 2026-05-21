import { useEffect, useMemo, useState } from "react";

import {
  Badge,
  Btn,
  ConfirmDialog,
  Modal,
} from "../../../../components/ui/CbtSharedComponents";

import { Icons } from "../../../../assets/icons/Icon";

import AdminCbtExaminersTable from "./AdminCbtExaminersTable";
import AdminCbtExaminersForm from "./AdminCbtExaminersForm";
import { useAuth } from "../../../../Context/Auth/useAuth";
import { AdminCbtExaminerService } from "../../../../Services/Cbt/Admin/examiner/AdminCbtExaminerService";

export interface Examiner {
  id?: string;
  fullname: string;
  email: string;
  password?: string;
  schoolId: string;
  isActive?: boolean;
}

export type ExaminerForm = {
  fullname: string;
  email: string;
  password: string;
  schoolId: string;
};

const initialFormState: ExaminerForm = {
  fullname: "",
  email: "",
  password: "",
  schoolId: "",
};

export default function AdminCbtExaminersPage() {
  const { cbtUser } = useAuth();

  const [examiners, setExaminers] = useState<Examiner[]>([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<ExaminerForm>(initialFormState);
  const [editing, setEditing] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchExaminers = async () => {
      if (!cbtUser?.schoolId) return;

      setFetching(true);
      try {
        const data = await AdminCbtExaminerService.getBySchool(cbtUser.schoolId);
        setExaminers(data);
      } catch (err) {
        console.error("Failed to fetch examiners:", err);
      } finally {
        setFetching(false);
      }
    };

    fetchExaminers();
  }, [cbtUser?.schoolId]);

  const filtered = useMemo(() => {
    return examiners.filter((e) =>
      `${e.fullname} ${e.email} ${e.schoolId} ${e.isActive}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [examiners, search]);

  const openAdd = () => {
    setForm({ ...initialFormState, schoolId: cbtUser?.schoolId ?? "" });
    setEditing(null);
    setModal(true);
  };

  const openEdit = (examiner: Examiner) => {
    setForm({
      fullname: examiner.fullname,
      email: examiner.email,
      password: "",
      schoolId: examiner.schoolId,
    });
    setEditing(examiner.id ?? null);
    setModal(true);
  };

  const save = async () => {
    setSubmitting(true);
    try {
      if (editing) {
        const updated = await AdminCbtExaminerService.update(editing, {
          fullname: form.fullname,
          email: form.email,
        });
        setExaminers((prev) =>
          prev.map((e) => (e.id === editing ? { ...e, ...updated } : e))
        );
      } else {
        const created = await AdminCbtExaminerService.create({
          fullname: form.fullname,
          email: form.email,
          password: form.password,
          schoolId: cbtUser?.schoolId ?? "",
        });
        setExaminers((prev) => [...prev, created]);
      }

      setModal(false);
      setForm({ ...initialFormState, schoolId: cbtUser?.schoolId ?? "" });
      setEditing(null);
    } catch (err) {
      console.error("Examiner save failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      await AdminCbtExaminerService.delete(deleteTarget);
      setExaminers((prev) => prev.filter((e) => e.id !== deleteTarget));
      setDeleteTarget(null);
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 p-6 font-sans">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Examiners</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Manage exam supervisors & examiners
          </p>
        </div>

        <Btn onClick={openAdd} disabled={fetching}>
          <Icons.Plus />
          Add Examiner
        </Btn>
      </div>

      {/* Search & Table */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex gap-3 border-b border-gray-100 p-4">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Icons.Search />
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search examiners..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <Badge color="orange">{filtered.length} examiners</Badge>
        </div>

        <AdminCbtExaminersTable
          examiners={filtered as (Examiner & { id: string })[]}
          onEdit={openEdit}
          onDelete={(id) => setDeleteTarget(id)}
          fetching={fetching}
        />
      </div>

      {/* Modal */}
      <Modal
        open={modal}
        onClose={() => !submitting && setModal(false)}
        title={editing ? "Edit Examiner" : "Add New Examiner"}
      >
        <AdminCbtExaminersForm
          form={form}
          setForm={setForm}
          editing={editing}
          onCancel={() => setModal(false)}
          onSubmit={save}
          submitting={submitting}
        />
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => !deleting && setDeleteTarget(null)}
        onConfirm={remove}
        loading={deleting}
      />
    </div>
  );
}