import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { FaStar, FaRegStar, FaTrash } from "react-icons/fa";
import { Subject, SubjectTeacher, TeacherOption } from "../../../Types/Teacher/subjectTeacher";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { subjectTeacherService } from "../../../Services/Teachers/subject/subjectTeacher";

interface SubjectTeachersModalProps {
  schoolId: string;
  subject: Subject;
  onClose: () => void;
}

const formatDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })
    : "—";

const initials = (name?: string) =>
  (name ?? "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("") || "?";

const sortPrimaryFirst = (list: SubjectTeacher[]) =>
  [...list].sort((a, b) => Number(!!b.isPrimary) - Number(!!a.isPrimary));

const SubjectTeachersModal: React.FC<SubjectTeachersModalProps> = ({
  schoolId,
  subject,
  onClose,
}) => {
  const [assigned, setAssigned] = useState<SubjectTeacher[]>([]);
  const [allTeachers, setAllTeachers] = useState<TeacherOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);
  const [assigning, setAssigning] = useState(false);

  const [busyTeacherId, setBusyTeacherId] = useState<string | null>(null);
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);

  const loadAssigned = useCallback(async () => {
    const data = await subjectTeacherService.getSubjectTeachers(schoolId, subject.subjectId);
    setAssigned(sortPrimaryFirst(data));
  }, [schoolId, subject.subjectId]);

  // Initial load: all school teachers + teachers assigned to this subject
  useEffect(() => {
    let ignore = false;
    const init = async () => {
      setLoading(true);
      setError("");
      try {
        const [teachersRes, assignedRes] = await Promise.allSettled([
          subjectTeacherService.getAllTeachers(schoolId),
          subjectTeacherService.getSubjectTeachers(schoolId, subject.subjectId),
        ]);
        if (ignore) return;

        if (teachersRes.status === "fulfilled") setAllTeachers(teachersRes.value);
        else setError(`Could not load teachers list: ${getErrorMessage(teachersRes.reason)}`);

        if (assignedRes.status === "fulfilled") {
          setAssigned(sortPrimaryFirst(assignedRes.value));
        } else {
          setError(`Could not load assigned teachers: ${getErrorMessage(assignedRes.reason)}`);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    init();
    return () => {
      ignore = true;
    };
  }, [schoolId, subject.subjectId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !assigning && !busyTeacherId) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, assigning, busyTeacherId]);

  // teacherId -> display name. Includes inactive teachers so assigned rows never show "Unknown".
  const nameById = useMemo(
    () => new Map(allTeachers.map((t) => [t.teacherId, t.name])),
    [allTeachers],
  );

  const getName = (t: SubjectTeacher) =>
    t.teacherName?.trim() || nameById.get(t.teacherId) || t.teacherEmail || "Unknown teacher";

  // Dropdown: active teachers not already on this subject
  const availableTeachers = useMemo(() => {
    const taken = new Set(assigned.map((a) => a.teacherId));
    return allTeachers.filter((t) => t.teacherId && t.active && !taken.has(t.teacherId));
  }, [allTeachers, assigned]);

  const handleAssign = async () => {
    if (!selectedTeacherId) {
      toast.warning("Please select a teacher");
      return;
    }
    setAssigning(true);
    try {
      await subjectTeacherService.assignTeacher(schoolId, subject.subjectId, {
        teacherId: selectedTeacherId,
        isPrimary,
      });
      toast.success("Teacher assigned!");
      setSelectedTeacherId("");
      setIsPrimary(false);
      await loadAssigned();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setAssigning(false);
    }
  };

  // Re-assigning with isPrimary=true promotes this teacher and demotes the previous primary
  const handleMakePrimary = async (teacherId: string) => {
    setBusyTeacherId(teacherId);
    try {
      await subjectTeacherService.assignTeacher(schoolId, subject.subjectId, {
        teacherId,
        isPrimary: true,
      });
      toast.success("Primary teacher updated");
      await loadAssigned();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setBusyTeacherId(null);
    }
  };

  const handleRemove = async (teacherId: string) => {
    setBusyTeacherId(teacherId);
    try {
      await subjectTeacherService.removeTeacher(schoolId, subject.subjectId, teacherId);
      toast.success("Teacher removed");
      setConfirmRemoveId(null);
      await loadAssigned();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setBusyTeacherId(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="subject-teachers-title"
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col w-full max-w-2xl max-h-[90vh] overflow-hidden bg-white shadow-2xl rounded-2xl ring-1 ring-black/5"
      >
        <div className="h-1.5 w-full shrink-0 bg-linear-to-r from-orange-500 to-amber-400" />

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-3 shrink-0">
          <div>
            <h2 id="subject-teachers-title" className="text-xl font-semibold text-slate-900">
              Subject Teachers
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Managing teachers for{" "}
              <span className="font-medium text-orange-600 capitalize">{subject.subjectName}</span>
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="p-2 -mr-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 pb-6 overflow-y-auto space-y-6">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Assign form */}
          <div className="p-4 border rounded-xl bg-slate-50 border-slate-100">
            <h3 className="mb-3 text-sm font-semibold text-slate-700">Assign a teacher</h3>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">Teacher</label>
                <select
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                  disabled={loading || assigning}
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-white disabled:bg-gray-50"
                >
                  <option value="">
                    {loading
                      ? "Loading teachers…"
                      : availableTeachers.length === 0
                        ? "No teachers available"
                        : "Select teacher"}
                  </option>
                  {availableTeachers.map((t) => (
                    <option key={t.teacherId} value={t.teacherId}>
                      {t.name} {t.phone && `(${t.phone})`}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={handleAssign}
                disabled={assigning || !selectedTeacherId}
                className="px-4 py-2 text-sm font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-50"
              >
                {assigning ? "Assigning…" : "Assign"}
              </button>
            </div>
            <label className="inline-flex items-center gap-2 mt-3 text-sm text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={isPrimary}
                onChange={(e) => setIsPrimary(e.target.checked)}
                className="w-4 h-4 accent-orange-500"
              />
              Make primary teacher (replaces the current primary)
            </label>
          </div>

          {/* Assigned teachers */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-700">
              Assigned teachers{" "}
              {!loading && <span className="text-slate-400">({assigned.length})</span>}
            </h3>

            {loading ? (
              <p className="py-6 text-sm text-center text-gray-500">Loading…</p>
            ) : assigned.length === 0 ? (
              <p className="py-6 text-sm text-center text-gray-500 border border-dashed rounded-xl">
                No teachers assigned to this subject yet
              </p>
            ) : (
              <ul className="space-y-2">
                {assigned.map((t, index) => {
                  const name = getName(t);
                  const busy = busyTeacherId === t.teacherId;
                  const confirming = confirmRemoveId === t.teacherId;
                  const meta = [t.teacherEmail, t.assignedAt && `Assigned ${formatDate(t.assignedAt)}`]
                    .filter(Boolean)
                    .join(" · ");

                  return (
                    <li
                      key={t.subjectTeacherId ?? t.teacherId ?? index}
                      className="flex flex-col gap-3 p-3 border rounded-xl sm:flex-row sm:items-center sm:justify-between border-slate-200"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex items-center justify-center w-10 h-10 text-sm font-semibold text-orange-700 bg-orange-100 rounded-full shrink-0">
                          {initials(name)}
                        </div>
                        <div className="min-w-0">
                          <p className="flex items-center gap-2 font-medium text-slate-800 truncate">
                            {name}
                            {t.isPrimary && (
                              <span className="px-2 py-0.5 text-[11px] font-semibold text-amber-700 bg-amber-100 rounded-full">
                                Primary
                              </span>
                            )}
                          </p>
                          {meta && <p className="text-xs text-slate-500 truncate">{meta}</p>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {confirming ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleRemove(t.teacherId)}
                              disabled={busy}
                              className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-60"
                            >
                              {busy ? "Removing…" : "Confirm remove"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmRemoveId(null)}
                              disabled={busy}
                              className="px-3 py-1.5 text-sm border rounded-lg hover:bg-slate-50"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            {!t.isPrimary && (
                              <button
                                type="button"
                                onClick={() => handleMakePrimary(t.teacherId)}
                                disabled={busy}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border rounded-lg hover:text-amber-600 hover:border-amber-300 disabled:opacity-50"
                              >
                                {busy ? <FaRegStar /> : <FaStar />}
                                Make primary
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => setConfirmRemoveId(t.teacherId)}
                              disabled={busy}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border rounded-lg hover:text-red-600 hover:border-red-300 disabled:opacity-50"
                            >
                              <FaTrash />
                              Remove
                            </button>
                          </>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectTeachersModal;