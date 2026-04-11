import React from "react";

interface Student {
  studentId: string;
  firstname: string;
  lastname: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string | null;
  guardianId?: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  classroomId?: string;
  classroomName?: string;
  schoolId?: string;
  teacherId?: string;
  imagePath?: string | null;
  photo?: string | null;
}

interface Props {
  student: Student;
  onBack: () => void;
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
}

const AVATAR_COLORS = [
  { bg: "#EEEDFE", text: "#3C3489" },
  { bg: "#E1F5EE", text: "#085041" },
  { bg: "#FAECE7", text: "#993C1D" },
  { bg: "#E6F1FB", text: "#0C447C" },
  { bg: "#FBEAF0", text: "#72243E" },
];

const Field = ({ label, value }: { label: string; value?: string | null }) => (
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

const formatDate = (iso?: string) => {
  if (!iso) return undefined;
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
};

// Resolve image path to a usable URL — adjust base URL to match your server
const resolveImage = (imagePath?: string | null): string | null => {
  if (!imagePath) return null;
  if (imagePath.startsWith("http")) return imagePath;
  // Strip Windows absolute paths; keep relative ones
  const relative = imagePath.replace(/^[A-Z]:\\.*?UploadedImages[\\/]/, "UploadedImages/");
  return `https://educat.codeweb.com.ng/${relative}`;
};

const AdminStudentDetails: React.FC<Props> = ({ student, onBack, onEdit, onDelete }) => {
  const initials = `${student.firstname?.[0] ?? ""}${student.lastname?.[0] ?? ""}`.toUpperCase();
  const colorIndex = (initials.charCodeAt(0) ?? 0) % AVATAR_COLORS.length;
  const color = AVATAR_COLORS[colorIndex];
  const photoUrl = resolveImage(student.imagePath);

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
        ← Back to students
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
              {student.firstname} {student.lastname}
            </h2>
            <p className="text-sm mt-0.5" style={{ color: "var(--color-text-secondary, #888)" }}>
              {student.classroomName ?? "No class assigned"}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {student.classroomName && (
                <span
                  className="inline-block text-xs px-3 py-0.5 rounded-full font-medium"
                  style={{ background: "#E6F1FB", color: "#0C447C" }}
                >
                  {student.classroomName}
                </span>
              )}
              {student.gender && (
                <span
                  className="inline-block text-xs px-3 py-0.5 rounded-full font-medium"
                  style={{ background: "#EEEDFE", color: "#3C3489" }}
                >
                  {student.gender}
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
            onClick={() => onEdit(student)}
            className="flex-1 py-2 rounded-lg text-sm font-medium"
            style={{
              background: "var(--color-text-primary, #1a1a1a)",
              color: "var(--color-background-primary, #fff)",
              border: "none",
            }}
          >
            Edit student
          </button>
          <button
            onClick={() => onDelete(student.studentId)}
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
          <Field label="First name" value={student.firstname} />
          <Field label="Last name" value={student.lastname} />
          <Field label="Date of birth" value={formatDate(student.dateOfBirth)} />
          <Field label="Gender" value={student.gender} />
          <div className="col-span-2">
            <Field label="Home address" value={student.address} />
          </div>
        </div>
      </div>

      {/* Academic information */}
      <div
        className="bg-white rounded-2xl border mb-4 p-5"
        style={{ borderColor: "var(--color-border-tertiary, #e5e5e5)" }}
      >
        <p
          className="text-xs font-medium uppercase tracking-wide mb-3"
          style={{ color: "var(--color-text-secondary, #888)", letterSpacing: "0.06em" }}
        >
          Academic information
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Classroom" value={student.classroomName} />
          <Field label="Classroom ID" value={student.classroomId} />
          <Field label="Teacher ID" value={student.teacherId} />
          <Field label="Student ID" value={student.studentId} />
        </div>
      </div>

      {/* Guardian information */}
      <div
        className="bg-white rounded-2xl border mb-4 p-5"
        style={{ borderColor: "var(--color-border-tertiary, #e5e5e5)" }}
      >
        <p
          className="text-xs font-medium uppercase tracking-wide mb-3"
          style={{ color: "var(--color-text-secondary, #888)", letterSpacing: "0.06em" }}
        >
          Guardian information
        </p>

        {student.guardianName ? (
          <>
            <div
              className="flex items-center gap-3 mb-3 p-3 rounded-lg"
              style={{ background: "var(--color-background-secondary, #f9f9f8)" }}
            >
              {(() => {
                const gi =
                  `${student.guardianName?.split(" ")[0]?.[0] ?? ""}${student.guardianName?.split(" ")[1]?.[0] ?? ""}`.toUpperCase();
                const gc = AVATAR_COLORS[(gi.charCodeAt(0) ?? 0) % AVATAR_COLORS.length];
                return (
                  <>
                    <div
                      className="shrink-0 flex items-center justify-center rounded-full text-sm font-medium"
                      style={{ width: 40, height: 40, background: gc.bg, color: gc.text }}
                    >
                      {gi}
                    </div>
                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: "var(--color-text-primary, #1a1a1a)" }}
                      >
                        {student.guardianName}
                      </p>
                      <p className="text-xs" style={{ color: "var(--color-text-secondary, #888)" }}>
                        Guardian
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Phone" value={student.guardianPhone} />
              <Field label="Email" value={student.guardianEmail} />
            </div>
          </>
        ) : (
          <p className="text-sm italic" style={{ color: "var(--color-text-secondary, #aaa)" }}>
            No guardian linked
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminStudentDetails;
