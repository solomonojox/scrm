import { useMemo, useState } from "react";

import { blankTeacher, initTeachers } from "../../../../Data/Data";

import { Btn, ConfirmDialog, Modal } from "../../../../components/ui/CbtSharedComponents";

import { Icons } from "../../../../assets/icons/Icon";
import AdminCbtTeachersTable from "./AdminCbtTeachersTable";
import AdminCbtTeachersForm from "./AdminCbtTeachersForm";

export interface Teacher {
  id?: string;

  firstname: string;

  lastname: string;

  phone: string;

  username: string;

  email: string;

  homeAddress: string;

  nationality: string;

  stateOfOrigin: string;

  religion: string;

  dateOfBirth: string;

  employmentDate: string;

  password?: string;
}

export default function AdminCbtTeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>(initTeachers);

  const [modal, setModal] = useState(false);

  const [form, setForm] = useState<Teacher>(blankTeacher);

  const [editing, setEditing] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return teachers.filter((teacher) =>
      `${teacher.firstname} ${teacher.lastname} ${teacher.email}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [teachers, search]);

  const openAdd = () => {
    setForm(blankTeacher);

    setEditing(null);

    setModal(true);
  };

  const openEdit = (teacher: Teacher) => {
    setForm({ ...teacher });

    setEditing(teacher.email);

    setModal(true);
  };

  const save = () => {
    if (editing) {
      setTeachers((prev) =>
        prev.map((teacher) =>
          teacher.id === editing
            ? {
                ...form,
                id: editing,
              }
            : teacher,
        ),
      );
    } else {
      setTeachers((prev) => [
        ...prev,
        {
          ...form,
          id: `T${Date.now()}`,
        },
      ]);
    }

    setModal(false);
  };

  const remove = () => {
    setTeachers((prev) => prev.filter((teacher) => teacher.id !== deleteTarget));

    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6 p-6 font-sans">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Teachers</h1>

          <p className="mt-0.5 text-sm text-gray-500">Manage teaching staff</p>
        </div>

        <Btn onClick={openAdd}>
          <Icons.Plus />
          Add Teacher
        </Btn>
      </div>

      {/* Search */}
      <div className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icons.Search />
          </span>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search teachers..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
      </div>

      {/* Table / Cards */}
      <AdminCbtTeachersTable
        teachers={filtered}
        onEdit={openEdit}
        onDelete={(id) => setDeleteTarget(id)}
      />

      {/* Modal */}
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={editing ? "Edit Teacher" : "Add New Teacher"}
      >
        <AdminCbtTeachersForm
          form={form}
          setForm={setForm}
          editing={editing}
          onCancel={() => setModal(false)}
          onSubmit={save}
        />
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={remove}
      />
    </div>
  );
}
