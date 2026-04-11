import React from "react";
import { TeacherType } from "../../../Types/Teacher/teacherType";

interface Props {
  teacher: TeacherType;
  onBack: () => void;
  onEdit: (teacher: TeacherType) => void;
  onDelete: (id: string) => void;
}

const AVATAR_COLORS = [
  { bg: "#EEEDFE", text: "#3C3489" },
  { bg: "#E1F5EE", text: "#085041" },
  { bg: "#FAECE7", text: "#993C1D" },
  { bg: "#E6F1FB", text: "#0C447C" },
  { bg: "#FBEAF0", text: "#72243E" },
];

const Field = ({ label, value }: { label: string; value?: string }) => (
  <div
    className="rounded-lg p-3"
    style={{ background: "var(--color-background-secondary, #f9f9f8)" }}
  >
    <p className="text-xs mb-1" style={{ color: "var(--color-text-secondary, #888)" }}>
      {label}
    </p>
    {value ? (
      <p className="text-sm font-medium" style={{ color: "var(--color-text-primary, #1a1a1a)" }}>
        {value}
      </p>
    ) : (
      <p className="text-sm italic" style={{ color: "var(--color-text-secondary, #aaa)" }}>
        Not provided
      </p>
    )}
  </div>
);

const AdminTeacherDetails: React.FC<Props> = ({ teacher, onBack, onEdit, onDelete }) => {
  const initials = `${teacher.firstname?.[0] ?? ""}${teacher.lastname?.[0] ?? ""}`.toUpperCase();
  const colorIndex = (initials.charCodeAt(0) ?? 0) % AVATAR_COLORS.length;
  const color = AVATAR_COLORS[colorIndex];

  const religionBadge =
    teacher.religion?.toLowerCase() === "christian"
      ? { bg: "#E1F5EE", text: "#085041" }
      : teacher.religion?.toLowerCase() === "muslim"
      ? { bg: "#EEEDFE", text: "#3C3489" }
      : { bg: "#F1EFE8", text: "#444441" };

  return (
    <div className="max-w-3xl mx-auto">

      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm mb-5 px-3 py-1.5 rounded-lg border transition-colors hover:bg-gray-200"
        style={{
          borderColor: "var(--color-border-tertiary, #ddd)",
          color: "var(--color-text-secondary, #888)",
        }}
      >
        ← Back to teachers
      </button>

      {/* Header card */}
      <div
        className="bg-white rounded-2xl border mb-4 p-5"
        style={{ borderColor: "var(--color-border-tertiary, #e5e5e5)" }}
      >
        <div className="flex items-start gap-4">
          <div
            className="shrink-0 flex items-center justify-center rounded-full text-lg font-medium"
            style={{ width: 56, height: 56, background: color.bg, color: color.text }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h2
              className="text-lg font-medium truncate"
              style={{ color: "var(--color-text-primary, #1a1a1a)" }}
            >
              {teacher.firstname} {teacher.lastname}
            </h2>
            <p className="text-sm mt-0.5" style={{ color: "var(--color-text-secondary, #888)" }}>
              {teacher.email ?? "No email"} &nbsp;·&nbsp; {teacher.phone ?? "No phone"}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {teacher.religion && (
                <span
                  className="inline-block text-xs px-3 py-0.5 rounded-full font-medium"
                  style={{ background: religionBadge.bg, color: religionBadge.text }}
                >
                  {teacher.religion}
                </span>
              )}
              {(teacher as any).subject && (
                <span
                  className="inline-block text-xs px-3 py-0.5 rounded-full font-medium"
                  style={{ background: "#E6F1FB", color: "#0C447C" }}
                >
                  {(teacher as any).subject}
                </span>
              )}
              {(teacher as any).employmentStatus && (
                <span
                  className="inline-block text-xs px-3 py-0.5 rounded-full font-medium"
                  style={{ background: "#EAF3DE", color: "#3B6D11" }}
                >
                  {(teacher as any).employmentStatus}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* <div
          className="border-t mt-4 pt-4 flex gap-3"
          style={{ borderColor: "var(--color-border-tertiary, #e5e5e5)" }}
        >
          <button
            onClick={() => onEdit(teacher)}
            className="flex-1 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              background: "var(--color-text-primary, #1a1a1a)",
              color: "var(--color-background-primary, #fff)",
              border: "none",
            }}
          >
            Edit teacher
          </button>
          <button
            onClick={() => onDelete(teacher?.teacherId ?? "")}
            className="flex-1 py-2 rounded-lg text-sm font-medium"
            style={{ background: "#FCEBEB", color: "#A32D2D", border: "0.5px solid #F7C1C1" }}
          >
            Delete
          </button>
        </div> */}
      </div>

      {/* Personal information */}
      <div
        className="bg-white rounded-2xl border mb-4 p-5"
        style={{ borderColor: "var(--color-border-tertiary, #e5e5e5)" }}
      >
        <p
          className="text-xs font-medium uppercase tracking-wide mb-3"
          style={{ color: "var(--color-text-secondary, #888)", letterSpacing: "0.06em" }}
        >
          Personal information
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Field label="First name" value={teacher.firstname} />
          <Field label="Last name" value={teacher.lastname} />
          <Field label="Nationality" value={teacher.nationality} />
          <Field label="State of origin" value={teacher.stateOfOrigin} />
          <Field label="Religion" value={teacher.religion} />
          <Field label="Date of birth" value={(teacher as any).dateOfBirth} />
        </div>
      </div>

      {/* Professional information */}
      {/* <div
        className="bg-white rounded-2xl border mb-4 p-5"
        style={{ borderColor: "var(--color-border-tertiary, #e5e5e5)" }}
      >
        <p
          className="text-xs font-medium uppercase tracking-wide mb-3"
          style={{ color: "var(--color-text-secondary, #888)", letterSpacing: "0.06em" }}
        >
          Professional information
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Subject" value={(teacher as any).subject} />
          <Field label="Qualification" value={(teacher as any).qualification} />
          <Field label="Employment status" value={(teacher as any).employmentStatus} />
          <Field label="Years of experience" value={(teacher as any).yearsOfExperience?.toString()} />
          <Field label="Staff ID" value={(teacher as any).staffId} />
          <Field label="Date joined" value={(teacher as any).dateJoined} />
        </div>
      </div> */}

      {/* Contact details */}
      <div
        className="bg-white rounded-2xl border mb-4 p-5"
        style={{ borderColor: "var(--color-border-tertiary, #e5e5e5)" }}
      >
        <p
          className="text-xs font-medium uppercase tracking-wide mb-3"
          style={{ color: "var(--color-text-secondary, #888)", letterSpacing: "0.06em" }}
        >
          Contact details
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Phone" value={teacher.phone} />
          <Field label="Email" value={teacher.email} />
          <div className="col-span-2">
            <Field label="Home address" value={teacher.homeAddress} />
          </div>
        </div>
      </div>

      {/* Assigned classes — render only if data exists */}
      {(teacher as any).classes?.length > 0 && (
        <div
          className="bg-white rounded-2xl border mb-4 p-5"
          style={{ borderColor: "var(--color-border-tertiary, #e5e5e5)" }}
        >
          <p
            className="text-xs font-medium uppercase tracking-wide mb-3"
            style={{ color: "var(--color-text-secondary, #888)", letterSpacing: "0.06em" }}
          >
            Assigned classes
          </p>
          <div className="flex flex-wrap gap-2">
            {(teacher as any).classes.map((cls: string, i: number) => (
              <span
                key={i}
                className="text-xs px-3 py-1.5 rounded-lg font-medium"
                style={{ background: "#E6F1FB", color: "#0C447C" }}
              >
                {cls}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Assigned students — render only if data exists */}
      {(teacher as any).students?.length > 0 && (
        <div
          className="bg-white rounded-2xl border mb-4 p-5"
          style={{ borderColor: "var(--color-border-tertiary, #e5e5e5)" }}
        >
          <p
            className="text-xs font-medium uppercase tracking-wide mb-3"
            style={{ color: "var(--color-text-secondary, #888)", letterSpacing: "0.06em" }}
          >
            Assigned students
          </p>
          <div className="flex flex-col gap-2">
            {(teacher as any).students.map((student: any, i: number) => {
              const si = `${student.firstname?.[0] ?? ""}${student.lastname?.[0] ?? ""}`.toUpperCase();
              const sc = AVATAR_COLORS[i % AVATAR_COLORS.length];
              return (
                <div
                  key={student.studentId ?? i}
                  className="flex items-center gap-3 p-3 rounded-lg"
                  style={{ background: "var(--color-background-secondary, #f9f9f8)" }}
                >
                  <div
                    className="shrink-0 flex items-center justify-center rounded-full text-xs font-medium"
                    style={{ width: 32, height: 32, background: sc.bg, color: sc.text }}
                  >
                    {si}
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--color-text-primary, #1a1a1a)" }}>
                      {student.firstname} {student.lastname}
                    </p>
                    <p className="text-xs" style={{ color: "var(--color-text-secondary, #888)" }}>
                      {student.class ?? ""}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminTeacherDetails;