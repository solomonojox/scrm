import { useContext, useEffect, useMemo, useState } from "react";

import { Badge, Btn, ConfirmDialog, Modal } from "../../../../components/ui/CbtSharedComponents";
import { Icons } from "../../../../assets/icons/Icon";
import AdminCbtExaminersTable from "./AdminCbtExaminersTable";
import AdminCbtExaminersForm from "./AdminCbtExaminersForm";
import { useAuth } from "../../../../Context/Auth/useAuth";
import { AdminCbtExaminerService } from "../../../../Services/Cbt/Admin/examiner/AdminCbtExaminerService";
import { AppContext } from "../../../../Context/AppContext";
import { AppDispatch, RootState } from "../../../../Store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminCbtExaminerFailure,
  fetchAdminCbtExaminerStart,
  fetchAdminCbtExaminerSuccess,
} from "../../../../Store/cbt/examiner/adminCbtExaminerSlice";

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
  const dispatch = useDispatch<AppDispatch>();
  const { notifySuccess, notifyError } = useContext(AppContext);
  
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<ExaminerForm>(initialFormState);
  const [editing, setEditing] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const fetchedAdminCbtExaminerRecord = useSelector(
    (state: RootState) => state.getAdminCbtExaminers.listRecords,
  );
  const fetchedAdminCbtExaminerLoading = useSelector(
    (state: RootState) => state.getAdminCbtExaminers.loading,
  );
 

  // Fetch examiners on mount or when schoolId changes
  useEffect(() => {
    if (cbtUser?.schoolId) {
      fetchExaminers();
    }
  }, [cbtUser?.schoolId]);

  const fetchExaminers = async () => {
    if (!cbtUser?.schoolId) return;
    setLoading(true);
    dispatch(fetchAdminCbtExaminerStart());
    
    try {
      const examiners = await AdminCbtExaminerService.getBySchool(cbtUser.schoolId);
      dispatch(fetchAdminCbtExaminerSuccess(examiners));
    } catch (err) {
      const msg = (err as Error).message;
      dispatch(fetchAdminCbtExaminerFailure(msg));
      notifyError(`Failed to fetch examiners: ${msg}`);
    }finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ ...initialFormState, schoolId: cbtUser?.schoolId ?? "" });
    setEditing(null);
  };

  const filtered = useMemo(() => {
    const searchTerm = search.toLowerCase();
    return fetchedAdminCbtExaminerRecord.filter((e) =>
      e.fullname.toLowerCase().includes(searchTerm) ||
      e.email.toLowerCase().includes(searchTerm) ||
      e.schoolId.toLowerCase().includes(searchTerm) ||
      (e.isActive ? "active" : "inactive").includes(searchTerm)
    );
  }, [fetchedAdminCbtExaminerRecord, search]);

  const openAdd = () => {
    resetForm();
    setModal(true);
  };

  const openEdit = (examiner: Examiner) => {
    setForm({
      fullname: examiner.fullname,
      email: examiner.email,
      password: "", // Password field will be optional in edit mode
      schoolId: examiner.schoolId,
    });
    setEditing(examiner.id ?? null);
    setModal(true);
  };

  const save = async () => {
    if (!form.fullname.trim() || !form.email.trim()) {
      notifyError("Please fill in all required fields");
      return;
    }

    if (!editing && !form.password.trim()) {
      notifyError("Password is required for new examiners");
      return;
    }

    setSubmitting(true);
    
    try {
      if (editing) {
        await AdminCbtExaminerService.update(editing, {
          fullname: form.fullname.trim(),
          email: form.email.trim(),
        });
        notifySuccess("Examiner updated successfully.");
      } else {
        await AdminCbtExaminerService.create({
          fullname: form.fullname.trim(),
          email: form.email.trim(),
          password: form.password,
          schoolId: cbtUser?.schoolId ?? "",
        });
        notifySuccess("Examiner created successfully.");
      }
      
      await fetchExaminers(); // Ensure fresh data after operation
      setModal(false);
      resetForm();
    } catch (err) {
      console.error("Examiner save failed:", err);
      const errorMessage = (err as Error).message;
      notifyError(`Failed to ${editing ? 'update' : 'create'} examiner: ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    
    try {
      await AdminCbtExaminerService.delete(deleteTarget);
      await fetchExaminers(); // Refresh the list
      setDeleteTarget(null);
      notifySuccess("Examiner deleted successfully.");
    } catch (err) {
      console.error("Delete failed:", err);
      const errorMessage = (err as Error).message;
      notifyError(`Failed to delete examiner: ${errorMessage}`);
    } finally {
      setDeleting(false);
    }
  };

  const handleModalClose = () => {
    if (!submitting) {
      setModal(false);
      resetForm();
    }
  };

  const handleDeleteDialogClose = () => {
    if (!deleting) {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6 p-6 font-sans">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Examiners</h1>
          <p className="mt-0.5 text-sm text-gray-500">Manage exam supervisors & examiners</p>
        </div>

        <Btn 
          onClick={openAdd} 
          disabled={fetchedAdminCbtExaminerLoading}
          aria-label="Add new examiner"
        >
          <Icons.Plus />
          Add Examiner
        </Btn>
      </div>

      {/* Search & Table */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Icons.Search />
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search examiners by name, email, or school..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              aria-label="Search examiners"
            />
          </div>

          <Badge color="orange" className="whitespace-nowrap">
            {filtered.length} / {fetchedAdminCbtExaminerRecord.length} examiners
          </Badge>
        </div>

        <AdminCbtExaminersTable
          examiners={filtered as (Examiner & { id: string })[]}
          onEdit={openEdit}
          onDelete={(id) => setDeleteTarget(id)}
          fetching={loading}
        />
      </div>

      {/* Add/Edit Modal */}
      <Modal
        open={modal}
        onClose={handleModalClose}
        title={editing ? "Edit Examiner" : "Add New Examiner"}
      >
        <AdminCbtExaminersForm
          form={form}
          setForm={setForm}
          editing={editing}
          onCancel={handleModalClose}
          onSubmit={save}
          submitting={submitting}
        />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => !deleting && setDeleteTarget(null)}
        onConfirm={remove}
        loading={deleting}
      />
    </div>
  );
}