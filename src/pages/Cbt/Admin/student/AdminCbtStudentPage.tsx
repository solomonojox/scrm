import { useMemo, useState } from "react";

import { blankStudent, initStudents } from "../../../../Data/Data";

import { Badge, Btn, ConfirmDialog, Modal } from "../../../../components/ui/CbtSharedComponents";

import { Icons } from "../../../../assets/icons/Icon";
import AdminCbtStudentTable from "./AdminCbtStudentTable";
import AdminCbtStudentForm from "./AdminCbtStudentForm";

export interface Student {
  id?: string;

  firstname: string;

  lastname: string;

  gender: string;

  dateOfBirth: string;

  homeAddress: string;

  admissionSession: string;

  currentTerm: string;

  teacherId: string;

  password?: string;
}

export default function AdminCbtStudentPage() {
  const [students, setStudents] = useState<Student[]>(initStudents);

  const [modal, setModal] = useState(false);

  const [form, setForm] = useState<Student>(blankStudent);

  const [editing, setEditing] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const [viewTarget, setViewTarget] = useState<Student | null>(null);

  const filtered = useMemo(() => {
    return students.filter((student) =>
      `${student.firstname} ${student.lastname}`.toLowerCase().includes(search.toLowerCase()),
    );
  }, [students, search]);

  const openAdd = () => {
    setForm(blankStudent);

    setEditing(null);

    setModal(true);
  };

  const openEdit = (student: Student) => {
    setForm({ ...student });

    setEditing(student.teacherId);

    setModal(true);
  };

  const save = () => {
    if (editing) {
      setStudents((prev) =>
        prev.map((student) =>
          student.id === editing
            ? {
                ...form,
                id: editing,
              }
            : student,
        ),
      );
    } else {
      setStudents((prev) => [
        ...prev,
        {
          ...form,
          id: Date.now().toString(),
        },
      ]);
    }

    setModal(false);
  };

  const remove = () => {
    setStudents((prev) => prev.filter((student) => student.id !== deleteTarget));

    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6 p-6 font-sans">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Students</h1>

          <p className="mt-0.5 text-sm text-gray-500">Manage all enrolled students</p>
        </div>

        <Btn onClick={openAdd}>
          <Icons.Plus />
          Add Student
        </Btn>
      </div>

      {/* Table Section */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        {/* Search */}
        <div className="flex gap-3 border-b border-gray-100 p-4">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Icons.Search />
            </span>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search students..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <Badge color="orange">{filtered.length} students</Badge>
        </div>

        {/* Table */}
        <AdminCbtStudentTable
          students={filtered}
          onView={setViewTarget}
          onEdit={openEdit}
          onDelete={(id) => setDeleteTarget(id)}
        />
      </div>

      {/* Add/Edit Modal */}
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={editing ? "Edit Student" : "Add New Student"}
      >
        <AdminCbtStudentForm
          form={form}
          setForm={setForm}
          editing={editing}
          onCancel={() => setModal(false)}
          onSubmit={save}
        />
      </Modal>

      {/* View Modal */}
      <Modal open={!!viewTarget} onClose={() => setViewTarget(null)} title="Student Details">
        {viewTarget && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 rounded-xl bg-orange-50 p-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-orange-400 to-orange-600 text-xl font-black text-white">
                {viewTarget.firstname[0]}
                {viewTarget.lastname[0]}
              </div>

              <div>
                <p className="text-lg font-black text-gray-900">
                  {viewTarget.firstname} {viewTarget.lastname}
                </p>

                <p className="text-sm text-gray-500">
                  {viewTarget.gender} · {viewTarget.admissionSession}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                ["Date of Birth", viewTarget.dateOfBirth],

                ["Home Address", viewTarget.homeAddress],

                ["Current Term", viewTarget.currentTerm],

                ["Teacher ID", viewTarget.teacherId],
              ].map(([key, value]) => (
                <div key={key} className="rounded-xl bg-gray-50 p-3">
                  <p className="mb-0.5 text-xs font-semibold uppercase text-gray-400">{key}</p>

                  <p className="text-sm font-semibold text-gray-800">{value}</p>
                </div>
              ))}
            </div>

            <Btn onClick={() => setViewTarget(null)} className="w-full justify-center">
              Close
            </Btn>
          </div>
        )}
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
