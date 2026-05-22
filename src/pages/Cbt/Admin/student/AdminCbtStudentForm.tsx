import React, { useState } from "react";
import { Btn, Input } from "../../../../components/ui/CbtSharedComponents";
import { StudentForm } from "./AdminCbtStudentPage";
import { Teacher } from "../Teacher/AdminCbtTeachersPage";

interface Props {
  form: StudentForm;
  setForm: React.Dispatch<React.SetStateAction<StudentForm>>;
  editing: string | null;
  teachers: Teacher[];
  fetchingTeachers: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  submitting: boolean;
}

function TeacherSelect({
  teachers,
  fetchingTeachers,
  value,
  onChange,
  disabled,
}: {
  teachers: Teacher[];
  fetchingTeachers: boolean;
  value: string;
  onChange: (id: string) => void;
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selected = teachers.find((t) => t.teacherId === value);

  const filtered = teachers.filter((t) =>
    `${t.firstname} ${t.lastname} ${t.email}`.toLowerCase().includes(search.toLowerCase()),
  );

  const initials = (t: Teacher) => `${t.firstname[0] ?? ""}${t.lastname[0] ?? ""}`.toUpperCase();

  const hue = (name: string) => name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 360;

  return (
    <div className="relative">
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">
        Assign Teacher <span className="text-orange-500">*</span>
      </label>

      {/* Trigger */}
      <button
        type="button"
        disabled={disabled || fetchingTeachers}
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between rounded-xl border px-4 py-2.5 text-sm transition-all
          ${open ? "border-orange-400 bg-white ring-4 ring-orange-400/10" : "border-gray-200 bg-gray-50/80 hover:border-gray-300 hover:bg-white"}
          disabled:cursor-not-allowed disabled:opacity-50`}
      >
        {fetchingTeachers ? (
          <span className="flex items-center gap-2 text-gray-400">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-orange-400 border-t-transparent" />
            Loading teachers…
          </span>
        ) : selected ? (
          <span className="flex items-center gap-2.5">
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-black text-white"
              style={{
                background: `hsl(${hue(`${selected.firstname} ${selected.lastname}`)},65%,52%)`,
              }}
            >
              {initials(selected)}
            </span>
            <span className="font-medium text-gray-900">
              {selected.firstname} {selected.lastname}
            </span>
            <span className="text-xs text-gray-400">{selected.email}</span>
          </span>
        ) : (
          <span className="text-gray-400">Select a teacher…</span>
        )}
        <svg
          className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
          {/* Search inside dropdown */}
          <div className="border-b border-gray-100 p-2">
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search teachers…"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm placeholder-gray-300 focus:border-orange-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-400/10"
            />
          </div>

          <ul className="max-h-52 overflow-y-auto p-1.5">
            {filtered.length === 0 ? (
              <li className="px-3 py-4 text-center text-sm text-gray-400">No teachers match</li>
            ) : (
              filtered.map((t) => {
                const isSelected = t.teacherId === value;
                const name = `${t.firstname} ${t.lastname}`;
                return (
                  <li key={t.teacherId}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange(t.teacherId);
                        setOpen(false);
                        setSearch("");
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors
                      ${isSelected ? "bg-orange-50 text-orange-700" : "hover:bg-gray-50"}`}
                    >
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black text-white"
                        style={{ background: `hsl(${hue(name)},65%,52%)` }}
                      >
                        {initials(t)}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span
                          className={`block truncate text-sm font-semibold ${isSelected ? "text-orange-700" : "text-gray-900"}`}
                        >
                          {name}
                        </span>
                        <span className="block truncate text-xs text-gray-400">{t.email}</span>
                      </span>
                      {isSelected && (
                        <svg
                          className="h-4 w-4 shrink-0 text-orange-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

const TERMS = ["First Term", "Second Term", "Third Term"];
const GENDERS = ["male", "female"];

export default function AdminCbtStudentsForm({
  form,
  setForm,
  editing,
  teachers,
  fetchingTeachers,
  onCancel,
  onSubmit,
  submitting,
}: Props) {
  const set =
    (key: keyof StudentForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [key]: e.target.value }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name"
          required
          value={form.firstname}
          disabled={submitting}
          onChange={set("firstname")}
          placeholder="Adegbenga"
        />
        <Input
          label="Last Name"
          required
          value={form.lastname}
          disabled={submitting}
          onChange={set("lastname")}
          placeholder="Oluwatosin"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Gender select */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
            Gender
          </label>
          <select
            value={form.gender}
            disabled={submitting}
            onChange={set("gender")}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-2.5 text-sm text-gray-900 transition-all hover:bg-white focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-400/10 disabled:opacity-50"
          >
            <option value="">Select gender</option>
            {GENDERS.map((g) => (
              <option key={g} value={g}>
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Date of Birth"
          type="date"
          value={form.dateOfBirth}
          disabled={submitting}
          onChange={set("dateOfBirth")}
        />
      </div>

      <Input
        label="Home Address"
        value={form.homeAddress}
        disabled={submitting}
        onChange={set("homeAddress")}
        placeholder="10, Enifeni Street, Ikorodu"
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Admission Session"
          value={form.admissionSession}
          disabled={submitting}
          onChange={set("admissionSession")}
          placeholder="2025/2026"
        />

        {/* Current Term select */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
            Current Term
          </label>
          <select
            value={form.currentTerm}
            disabled={submitting}
            onChange={set("currentTerm")}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-2.5 text-sm text-gray-900 transition-all hover:bg-white focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-400/10 disabled:opacity-50"
          >
            <option value="">Select term</option>
            {TERMS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!editing && (
        <Input
          label="Password"
          type="password"
          required
          value={form.password}
          disabled={submitting}
          onChange={set("password")}
          placeholder="Set password"
        />
      )}

      {/* Fancy teacher picker */}
      <TeacherSelect
        teachers={teachers}
        fetchingTeachers={fetchingTeachers}
        value={form.teacherId}
        onChange={(id) => setForm((p) => ({ ...p, teacherId: id }))}
        disabled={submitting}
      />

      <div className="h-px bg-gray-100" />
      <div className="flex gap-3">
        <Btn variant="outline" onClick={onCancel} disabled={submitting} className="flex-1">
          Cancel
        </Btn>
        <Btn onClick={onSubmit} disabled={submitting} loading={submitting} className="flex-1">
          {submitting
            ? editing
              ? "Saving…"
              : "Adding…"
            : editing
              ? "Save Changes"
              : "Add Student"}
        </Btn>
      </div>
    </div>
  );
}
