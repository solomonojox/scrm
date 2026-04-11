import React from "react";
import { Guardian } from "../../../Types/Guardian/guardianTypes";

interface Props {
  guardian: Guardian;
  onBack: () => void;
  onEdit: (guardian: Guardian) => void;
  onDelete: (id: string) => void;
}

const AdminGuardianDetails: React.FC<Props> = ({ guardian, onBack, onEdit, onDelete }) => {
  const initials = `${guardian.firstname?.[0] ?? ""}${guardian.lastname?.[0] ?? ""}`.toUpperCase();

  const avatarColors: Record<string, { bg: string; text: string }> = {
    A: { bg: "#EEEDFE", text: "#3C3489" },
    B: { bg: "#E1F5EE", text: "#085041" },
    C: { bg: "#FAECE7", text: "#993C1D" },
    D: { bg: "#E6F1FB", text: "#0C447C" },
  };
  const colorKey = initials[0] ?? "A";
  const color = avatarColors[colorKey] ?? avatarColors["A"];

  const religionBadge =
    guardian.religion?.toLowerCase() === "christian"
      ? { bg: "#E1F5EE", text: "#085041" }
      : guardian.religion?.toLowerCase() === "muslim"
      ? { bg: "#EEEDFE", text: "#3C3489" }
      : { bg: "#F1EFE8", text: "#444441" };

  const Field = ({ label, value }: { label: string; value?: string }) => (
    <div className="rounded-lg p-3" style={{ background: "var(--color-bg-secondary, #f9f9f8)" }}>
      <p className="text-xs mb-1" style={{ color: "var(--color-text-secondary, #888)" }}>{label}</p>
      {value ? (
        <p className="text-sm font-medium" style={{ color: "var(--color-text-primary, #1a1a1a)" }}>{value}</p>
      ) : (
        <p className="text-sm italic" style={{ color: "var(--color-text-secondary, #aaa)" }}>Not provided</p>
      )}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm mb-5 px-3 py-1.5 rounded-lg border transition-colors hover:bg-gray-200"
        style={{ borderColor: "var(--color-border-tertiary, #ddd)", color: "var(--color-text-secondary, #888)" }}
      >
        ← Back to guardians
      </button>

      {/* Header card */}
      <div className="bg-white rounded-2xl border mb-4 p-5" style={{ borderColor: "var(--color-border-tertiary, #e5e5e5)" }}>
        <div className="flex items-start gap-4">
          <div
            className="shrink-0 flex items-center justify-center rounded-full text-lg font-medium"
            style={{ width: 56, height: 56, background: color.bg, color: color.text }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-medium truncate" style={{ color: "var(--color-text-primary, #1a1a1a)" }}>
              {guardian.firstname} {guardian.lastname}
            </h2>
            <p className="text-sm mt-0.5" style={{ color: "var(--color-text-secondary, #888)" }}>
              {guardian.email ?? "No email"} &nbsp;·&nbsp; {guardian.phone ?? "No phone"}
            </p>
            {guardian.religion && (
              <span
                className="inline-block text-xs px-3 py-0.5 rounded-full font-medium mt-2"
                style={{ background: religionBadge.bg, color: religionBadge.text }}
              >
                {guardian.religion}
              </span>
            )}
          </div>
        </div>

        {/* <div className="border-t mt-4 pt-4 flex gap-3" style={{ borderColor: "var(--color-border-tertiary, #e5e5e5)" }}>
          <button
            onClick={() => onEdit(guardian)}
            className="flex-1 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ background: "var(--color-text-primary, #1a1a1a)", color: "var(--color-background-primary, #fff)", border: "none" }}
          >
            Edit guardian
          </button>
          <button
            onClick={() => onDelete(guardian.guardianId)}
            className="flex-1 py-2 rounded-lg text-sm font-medium"
            style={{ background: "#FCEBEB", color: "#A32D2D", border: "0.5px solid #F7C1C1" }}
          >
            Delete
          </button>
        </div> */}
      </div>

      {/* Personal info */}
      <div className="bg-white rounded-2xl border mb-4 p-5" style={{ borderColor: "var(--color-border-tertiary, #e5e5e5)" }}>
        <p className="text-xs font-medium uppercase tracking-wide mb-3" style={{ color: "var(--color-text-secondary, #888)", letterSpacing: "0.06em" }}>
          Personal information
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Field label="First name" value={guardian.firstname} />
          <Field label="Last name" value={guardian.lastname} />
          <Field label="Nationality" value={guardian.nationality} />
          <Field label="State of origin" value={guardian.stateOfOrigin} />
          <Field label="Religion" value={guardian.religion} />
          <Field label="Occupation" value={(guardian as any).occupation} />
        </div>
      </div>

      {/* Contact details */}
      <div className="bg-white rounded-2xl border mb-4 p-5" style={{ borderColor: "var(--color-border-tertiary, #e5e5e5)" }}>
        <p className="text-xs font-medium uppercase tracking-wide mb-3" style={{ color: "var(--color-text-secondary, #888)", letterSpacing: "0.06em" }}>
          Contact details
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Phone" value={guardian.phone} />
          <Field label="Email" value={guardian.email} />
          <div className="col-span-2">
            <Field label="Home address" value={guardian.homeAddress} />
          </div>
        </div>
      </div>

      {/* Linked students — render only if data exists */}
      {(guardian as any).students?.length > 0 && (
        <div className="bg-white rounded-2xl border mb-4 p-5" style={{ borderColor: "var(--color-border-tertiary, #e5e5e5)" }}>
          <p className="text-xs font-medium uppercase tracking-wide mb-3" style={{ color: "var(--color-text-secondary, #888)", letterSpacing: "0.06em" }}>
            Linked students
          </p>
          <div className="flex flex-col gap-2">
            {(guardian as any).students.map((student: any, i: number) => {
              const si = `${student.firstname?.[0] ?? ""}${student.lastname?.[0] ?? ""}`.toUpperCase();
              const sc = i % 2 === 0 ? { bg: "#EEEDFE", text: "#3C3489" } : { bg: "#E1F5EE", text: "#085041" };
              return (
                <div
                  key={student.studentId ?? i}
                  className="flex items-center gap-3 p-3 rounded-lg"
                  style={{ background: "var(--color-bg-secondary, #f9f9f8)" }}
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
                      {student.class ?? ""}{student.relationship ? ` · ${student.relationship}` : ""}
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

export default AdminGuardianDetails;