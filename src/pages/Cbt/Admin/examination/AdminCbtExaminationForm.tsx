import React from "react";
import { Btn, Input, Select } from "../../../../components/ui/CbtSharedComponents";
import { ExaminationForm, ExamType, ExamTerm } from "./AdminCbtExaminationsPage";

interface Props {
  form: ExaminationForm;
  setForm: React.Dispatch<React.SetStateAction<ExaminationForm>>;
  editing: string | null;
  onCancel: () => void;
  onSubmit: () => void;
  submitting: boolean;
}

const EXAM_TYPES: ExamType[]  = ["INTERNAL", "WAEC", "NECO", "JAMB", "GCE"];
const EXAM_TERMS: ExamTerm[]  = ["FIRST", "SECOND", "THIRD"];

export default function AdminCbtExaminationForm({
  form,
  setForm,
  editing,
  onCancel,
  onSubmit,
  submitting,
}: Props) {
  const set = (key: keyof ExaminationForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <div className="space-y-4">

      {/* Title */}
      <Input
        label="Exam Title"
        required
        value={form.title}
        disabled={submitting}
        onChange={set("title")}
        placeholder="e.g. Chemistry Final Exam"
      />

      {/* Exam Type + Term */}
      <div className="grid grid-cols-2 gap-4">
        <Select label="Exam Type" required value={form.examType} disabled={submitting} onChange={set("examType")}>
          {EXAM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </Select>

        <Select label="Term" required value={form.term} disabled={submitting} onChange={set("term")}>
          {EXAM_TERMS.map((t) => <option key={t} value={t}>{t} TERM</option>)}
        </Select>
      </div>

      {/* Academic Session + Duration */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Academic Session"
          required
          value={form.academicSession}
          disabled={submitting}
          onChange={set("academicSession")}
          placeholder="2025/2026"
        />

        <Input
          label="Duration (minutes)"
          type="number"
          required
          value={String(form.durationMinutes)}
          disabled={submitting}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, durationMinutes: Number(e.target.value) }))
          }
          placeholder="60"
        />
      </div>

      {/* Subject ID + Class Level */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Subject ID"
          required
          value={form.subjectId}
          disabled={submitting}
          onChange={set("subjectId")}
          placeholder="Subject UUID"
        />

        <Input
          label="Class Level"
          value={form.classLevel}
          disabled={submitting}
          onChange={set("classLevel")}
          placeholder="e.g. SS 3"
        />
      </div>

      {/* Scheduled Date + Passing Score */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Scheduled Date"
          type="date"
          value={form.scheduledDate}
          disabled={submitting}
          onChange={set("scheduledDate")}
        />

        <Input
          label="Passing Score"
          type="number"
          value={form.passingScore}
          disabled={submitting}
          onChange={set("passingScore")}
          placeholder="e.g. 50"
        />
      </div>

      {/* Instructions */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
          Instructions
        </label>
        <textarea
          value={form.instructions}
          disabled={submitting}
          onChange={set("instructions")}
          placeholder="Any instructions for students…"
          rows={3}
          className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-300 transition-all focus:border-orange-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-400/10 disabled:opacity-50"
        />
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100" />

      {/* Actions */}
      <div className="flex gap-3">
        <Btn variant="outline" onClick={onCancel} disabled={submitting} className="flex-1">
          Cancel
        </Btn>

        <Btn onClick={onSubmit} disabled={submitting} loading={submitting} className="flex-1">
          {submitting
            ? editing ? "Saving…" : "Creating…"
            : editing ? "Save Changes" : "Create Examination"}
        </Btn>
      </div>
    </div>
  );
}