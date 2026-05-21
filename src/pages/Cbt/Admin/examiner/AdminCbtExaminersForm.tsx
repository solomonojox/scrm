import React from "react";

import { Btn, Input } from "../../../../components/ui/CbtSharedComponents";

import { Examiner, ExaminerForm } from "./AdminCbtExaminersPage";

interface Props {
  form: ExaminerForm;
  setForm: React.Dispatch<React.SetStateAction<ExaminerForm>>;
  editing: string | null;
  onCancel: () => void;
  onSubmit: () => void;
  submitting: boolean;
}

export default function AdminCbtExaminersForm({
  form,
  setForm,
  editing,
  onCancel,
  onSubmit,
  submitting,
}: Props) {
  return (
    <div className="space-y-4">
      {/* Full Name */}
      <Input
        label="Full Name"
        required
        value={form.fullname}
        disabled={submitting}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setForm({ ...form, fullname: e.target.value })
        }
        placeholder="Dr. John Smith"
      />

      {/* Email */}
      <Input
        label="Email"
        type="email"
        required
        value={form.email}
        disabled={submitting}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setForm({ ...form, email: e.target.value })
        }
        placeholder="examiner@org.ng"
      />

      {/* Password — only shown when creating */}
      {!editing && (
        <Input
          label="Password"
          type="password"
          required
          value={form.password}
          disabled={submitting}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setForm({ ...form, password: e.target.value })
          }
          placeholder="Set password"
        />
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Btn
          variant="outline"
          onClick={onCancel}
          disabled={submitting}
          className="flex-1"
        >
          Cancel
        </Btn>

        <Btn
          onClick={onSubmit}
          disabled={submitting}
          className="flex-1"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                />
              </svg>
              {editing ? "Saving..." : "Adding..."}
            </span>
          ) : editing ? (
            "Save Changes"
          ) : (
            "Add Examiner"
          )}
        </Btn>
      </div>
    </div>
  );
}