import React from "react";

import {
  Btn,
  Input,
  Select,
} from "../../../../components/ui/CbtSharedComponents";

import { Student } from "./AdminCbtStudentPage";

interface Props {
  form: Student;

  setForm: React.Dispatch<
    React.SetStateAction<Student>
  >;

  editing: string | null;

  onCancel: () => void;

  onSubmit: () => void;
}

export default function AdminCbtStudentForm({
  form,
  setForm,
  editing,
  onCancel,
  onSubmit,
}: Props) {
  return (
    <div className="space-y-4">
      {/* Names */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name"
          required
          value={form.firstname}
          onChange={(
            e: React.ChangeEvent<HTMLInputElement>
          ) =>
            setForm({
              ...form,
              firstname: e.target.value,
            })
          }
          placeholder="First name"
        />

        <Input
          label="Last Name"
          required
          value={form.lastname}
          onChange={(
            e: React.ChangeEvent<HTMLInputElement>
          ) =>
            setForm({
              ...form,
              lastname: e.target.value,
            })
          }
          placeholder="Last name"
        />
      </div>

      {/* Gender */}
      <Select
        label="Gender"
        required
        value={form.gender}
        onChange={(
          e: React.ChangeEvent<HTMLSelectElement>
        ) =>
          setForm({
            ...form,
            gender: e.target.value,
          })
        }
      >
        <option value="">
          Select gender
        </option>

        <option value="Male">
          Male
        </option>

        <option value="Female">
          Female
        </option>
      </Select>

      {/* DOB */}
      <Input
        label="Date of Birth"
        type="date"
        required
        value={form.dateOfBirth}
        onChange={(
          e: React.ChangeEvent<HTMLInputElement>
        ) =>
          setForm({
            ...form,
            dateOfBirth: e.target.value,
          })
        }
      />

      {/* Address */}
      <Input
        label="Home Address"
        value={form.homeAddress}
        onChange={(
          e: React.ChangeEvent<HTMLInputElement>
        ) =>
          setForm({
            ...form,
            homeAddress: e.target.value,
          })
        }
        placeholder="Full address"
      />

      {/* Session & Term */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Admission Session"
          required
          value={form.admissionSession}
          onChange={(
            e: React.ChangeEvent<HTMLInputElement>
          ) =>
            setForm({
              ...form,
              admissionSession:
                e.target.value,
            })
          }
          placeholder="2023/2024"
        />

        <Select
          label="Current Term"
          required
          value={form.currentTerm}
          onChange={(
            e: React.ChangeEvent<HTMLSelectElement>
          ) =>
            setForm({
              ...form,
              currentTerm:
                e.target.value,
            })
          }
        >
          <option value="FIRST">
            FIRST
          </option>

          <option value="SECOND">
            SECOND
          </option>

          <option value="THIRD">
            THIRD
          </option>
        </Select>
      </div>

      {/* Teacher */}
      <Input
        label="Teacher ID"
        value={form.teacherId}
        onChange={(
          e: React.ChangeEvent<HTMLInputElement>
        ) =>
          setForm({
            ...form,
            teacherId: e.target.value,
          })
        }
        placeholder="Teacher UUID"
      />

      {/* Password */}
      {!editing && (
        <Input
          label="Password"
          type="password"
          required
          value={form.password}
          onChange={(
            e: React.ChangeEvent<HTMLInputElement>
          ) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
          placeholder="Set password"
        />
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Btn
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Btn>

        <Btn
          onClick={onSubmit}
          className="flex-1"
        >
          {editing
            ? "Save Changes"
            : "Add Student"}
        </Btn>
      </div>
    </div>
  );
}