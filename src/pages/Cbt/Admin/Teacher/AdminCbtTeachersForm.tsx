import React from "react";

import {
  Btn,
  Input,
  Select,
} from "../../../../components/ui/CbtSharedComponents";

import { Teacher } from "./AdminCbtTeachersPage";

interface Props {
  form: Teacher;

  setForm: React.Dispatch<
    React.SetStateAction<Teacher>
  >;

  editing: string | null;

  onCancel: () => void;

  onSubmit: () => void;
}

export default function AdminCbtTeachersForm({
  form,
  setForm,
  editing,
  onCancel,
  onSubmit,
}: Props) {
  const religions = [
    "Christianity",
    "Islam",
    "Traditional",
    "Other",
  ];

  return (
    <div className="space-y-4">
      {/* Names */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="First Name"
          required
          value={form.firstname}
          onChange={(
            e: React.ChangeEvent<HTMLInputElement>
          ) =>
            setForm({
              ...form,
              firstname:
                e.target.value,
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
              lastname:
                e.target.value,
            })
          }
          placeholder="Last name"
        />
      </div>

      {/* Phone & Username */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Phone"
          value={form.phone}
          onChange={(
            e: React.ChangeEvent<HTMLInputElement>
          ) =>
            setForm({
              ...form,
              phone: e.target.value,
            })
          }
          placeholder="080XXXXXXXX"
        />

        <Input
          label="Username"
          required
          value={form.username}
          onChange={(
            e: React.ChangeEvent<HTMLInputElement>
          ) =>
            setForm({
              ...form,
              username:
                e.target.value,
            })
          }
          placeholder="username"
        />
      </div>

      {/* Email */}
      <Input
        label="Email"
        type="email"
        required
        value={form.email}
        onChange={(
          e: React.ChangeEvent<HTMLInputElement>
        ) =>
          setForm({
            ...form,
            email: e.target.value,
          })
        }
        placeholder="email@school.edu"
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
            homeAddress:
              e.target.value,
          })
        }
        placeholder="Full address"
      />

      {/* Nationality & State */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Nationality"
          value={form.nationality}
          onChange={(
            e: React.ChangeEvent<HTMLInputElement>
          ) =>
            setForm({
              ...form,
              nationality:
                e.target.value,
            })
          }
          placeholder="Nigerian"
        />

        <Input
          label="State of Origin"
          value={form.stateOfOrigin}
          onChange={(
            e: React.ChangeEvent<HTMLInputElement>
          ) =>
            setForm({
              ...form,
              stateOfOrigin:
                e.target.value,
            })
          }
          placeholder="Lagos"
        />
      </div>

      {/* Religion */}
      <Select
        label="Religion"
        value={form.religion}
        onChange={(
          e: React.ChangeEvent<HTMLSelectElement>
        ) =>
          setForm({
            ...form,
            religion:
              e.target.value,
          })
        }
      >
        <option value="">
          Select religion
        </option>

        {religions.map((religion) => (
          <option
            key={religion}
            value={religion}
          >
            {religion}
          </option>
        ))}
      </Select>

      {/* Dates */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Date of Birth"
          type="date"
          value={form.dateOfBirth}
          onChange={(
            e: React.ChangeEvent<HTMLInputElement>
          ) =>
            setForm({
              ...form,
              dateOfBirth:
                e.target.value,
            })
          }
        />

        <Input
          label="Employment Date"
          type="date"
          value={form.employmentDate}
          onChange={(
            e: React.ChangeEvent<HTMLInputElement>
          ) =>
            setForm({
              ...form,
              employmentDate:
                e.target.value,
            })
          }
        />
      </div>

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
              password:
                e.target.value,
            })
          }
          placeholder="Set password"
        />
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <Btn
          variant="outline"
          onClick={onCancel}
          className="flex-1 justify-center"
        >
          Cancel
        </Btn>

        <Btn
          onClick={onSubmit}
          className="flex-1 justify-center"
        >
          {editing
            ? "Save Changes"
            : "Add Teacher"}
        </Btn>
      </div>
    </div>
  );
}