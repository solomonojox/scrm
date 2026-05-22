import React from "react";
import { Btn, Input } from "../../../../components/ui/CbtSharedComponents";
import { TeacherForm } from "./AdminCbtTeachersPage";

interface Props {
  form: TeacherForm;
  setForm: React.Dispatch<React.SetStateAction<TeacherForm>>;
  editing: string | null;
  onCancel: () => void;
  onSubmit: () => void;
  submitting: boolean;
}

export default function AdminCbtTeachersForm({ form, setForm, editing, onCancel, onSubmit, submitting }: Props) {
  const set = (key: keyof TeacherForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) => setForm((p) => ({ ...p, [key]: e.target.value }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input label="First Name" required value={form.firstname} disabled={submitting} onChange={set("firstname")} placeholder="Sunday" />
        <Input label="Last Name"  required value={form.lastname}  disabled={submitting} onChange={set("lastname")}  placeholder="Iniobong" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="Email" type="email" required value={form.email} disabled={submitting} onChange={set("email")} placeholder="teacher@school.ng" />
        <Input label="Phone" type="tel"   required value={form.phone} disabled={submitting} onChange={set("phone")} placeholder="08020832924" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="Religion"       value={form.religion}      disabled={submitting} onChange={set("religion")}      placeholder="Christianity" />
        {/* <Input label="Username" required value={form.username} disabled={submitting} onChange={set("username")} placeholder="sunday.iniobong" /> */}
        {!editing && (
          <Input label="Password" type="password" required value={form.password} disabled={submitting} onChange={set("password")} placeholder="Set password" />
        )}
      </div>

      <Input label="Home Address" value={form.homeAddress} disabled={submitting} onChange={set("homeAddress")} placeholder="12, Main Street, Lagos" />

      <div className="grid grid-cols-2 gap-4">
        <Input label="Nationality"    value={form.nationality}   disabled={submitting} onChange={set("nationality")}   placeholder="Nigerian" />
        <Input label="State of Origin" value={form.stateOfOrigin} disabled={submitting} onChange={set("stateOfOrigin")} placeholder="Lagos" />
        
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="Date of Birth"   type="date" value={form.dateOfBirth}    disabled={submitting} onChange={set("dateOfBirth")} />
        <Input label="Employment Date" type="date" value={form.employmentDate} disabled={submitting} onChange={set("employmentDate")} />
      </div>

      <div className="h-px bg-gray-100" />
      <div className="flex gap-3">
        <Btn variant="outline" onClick={onCancel} disabled={submitting} className="flex-1">Cancel</Btn>
        <Btn onClick={onSubmit} disabled={submitting} loading={submitting} className="flex-1">
          {submitting ? editing ? "Saving…" : "Adding…" : editing ? "Save Changes" : "Add Teacher"}
        </Btn>
      </div>
    </div>
  );
}