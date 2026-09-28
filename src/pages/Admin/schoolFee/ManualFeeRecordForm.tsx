// src/Pages/Admin/Payments/ManualFeeRecordForm.tsx
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { StudentType } from "../../../Types/Student/studentTypes";
import { Guardian } from "../../../Types/Guardian/guardianTypes";
import { Session } from "../../../Types/sessionType";

interface Classroom {
  classroomId: string;
  schoolId: string;
  name: string;
  capacity: number;
  teacherId: string;
}

export interface PaymentTerm {
  paymentTermId: string;
  name: string;
}

interface ManualFeeRecordData {
  studentId: string;
  classroomId: string;
  amount: number;
  paymentTermId: string;
  guardianId: string;
  sessionId: string;
  schoolId: string;
}

interface ManualFeeRecordProps {
  onSubmit: (data: ManualFeeRecordData) => Promise<void>;
  students: StudentType[];
  classrooms: Classroom[];
  paymentTerms: PaymentTerm[];
  guardians?: Guardian[];
  isLoading?: boolean;
  schoolId: string;
  sessionId: Session[];
  /** Called when user closes the modal (backdrop, ESC, or Clear button) */
  onClose?: () => void;
}

const inputClass =
  "w-full border border-gray-300 px-3 py-2 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:bg-gray-50 disabled:text-gray-400";

const ManualFeeRecordForm: React.FC<ManualFeeRecordProps> = ({
  onSubmit,
  students,
  classrooms,
  paymentTerms,
  guardians,
  isLoading = false,
  schoolId,
  sessionId,
  onClose,
}) => {
  const [sessionValue, setSessionValue] = useState("");
  const [classroomId, setClassroomId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [guardianId, setGuardianId] = useState("");
  const [paymentTermId, setPaymentTermId] = useState("");
  const [amount, setAmount] = useState("");

  const [filteredStudents, setFilteredStudents] = useState<StudentType[]>(students);
  const [filteredGuardians, setFilteredGuardians] = useState<Guardian[]>(guardians ?? []);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const selectedStudent = students.find((s) => s.studentId === studentId) || null;

  // Filter students by classroom
  useEffect(() => {
    if (classroomId) {
      const list = students.filter((s) => s.classroomId === classroomId);
      setFilteredStudents(list);
      if (studentId && !list.find((s) => s.studentId === studentId)) {
        setStudentId("");
      }
    } else {
      setFilteredStudents(students);
    }
  }, [classroomId, students, studentId]);

  // Auto-set guardian when student changes
  useEffect(() => {
    if (selectedStudent?.guardianId) {
      setGuardianId(selectedStudent.guardianId);
    }
  }, [selectedStudent]);

  // Filter guardians to the selected student's guardian
  useEffect(() => {
    if (guardians && selectedStudent) {
      const g = guardians.find((x) => x.guardianId === selectedStudent.guardianId);
      setFilteredGuardians(g ? [g] : []);
    } else {
      setFilteredGuardians(guardians ?? []);
    }
  }, [selectedStudent, guardians]);

  // Close on ESC key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) {
        onClose?.();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, submitting]);

  const resetForm = () => {
    setSessionValue("");
    setClassroomId("");
    setStudentId("");
    setGuardianId("");
    setPaymentTermId("");
    setAmount("");
    setFormError("");
  };

  // close the modal
  const closeModal = () => onClose?.();

  // Backdrop click: close the modal
  const handleBackdropClick = () => {
    if (submitting) return;
    onClose?.();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const numericAmount = Number(amount);
    if (!sessionValue) return setFormError("Please select a session");
    if (!classroomId) return setFormError("Please select a classroom");
    if (!studentId) return setFormError("Please select a student");
    if (!guardianId) return setFormError("Please select a guardian");
    if (!paymentTermId) return setFormError("Please select a payment term");
    if (!amount || Number.isNaN(numericAmount) || numericAmount <= 0) {
      return setFormError("Enter an amount greater than 0");
    }

    setSubmitting(true);
    try {
      await onSubmit({
        studentId,
        classroomId,
        sessionId: sessionValue,
        amount: numericAmount,
        paymentTermId,
        guardianId,
        schoolId,
      });
      resetForm();
      onClose?.();
    } catch (err: any) {
      const msg =
        err?.response?.data?.responseMessage ||
        err?.message ||
        "Failed to record fee payment";
      setFormError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="record-fee-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white shadow-2xl rounded-2xl ring-1 ring-black/5"
      >
        <div className="h-1.5 w-full bg-linear-to-r from-orange-500 to-amber-400" />

        <form onSubmit={handleSubmit} noValidate>
          <div className="px-6 pt-6 pb-2">
            <h2 id="record-fee-title" className="text-xl font-semibold text-slate-900">
              Record School Fee Payment
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Record a manual payment for a student's school fee.
            </p>

            {formError && (
              <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {formError}
              </p>
            )}

            <div className="mt-5 space-y-4">
              {/* Session */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Session</label>
                <select
                  value={sessionValue}
                  onChange={(e) => setSessionValue(e.target.value)}
                  disabled={submitting || isLoading}
                  className={inputClass}
                >
                  <option value="">Select session</option>
                  {sessionId?.map((s) => (
                    <option key={s.sessionId} value={s.sessionId}>
                      {s.sessionId}
                    </option>
                  ))}
                </select>
              </div>

              {/* Classroom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Classroom</label>
                <select
                  value={classroomId}
                  onChange={(e) => setClassroomId(e.target.value)}
                  disabled={submitting || isLoading}
                  className={inputClass}
                >
                  <option value="">Select classroom</option>
                  {classrooms?.map((c) => (
                    <option key={c.classroomId} value={c.classroomId}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Student */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                <select
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  disabled={!classroomId || submitting || isLoading}
                  className={inputClass}
                >
                  <option value="">
                    {!classroomId
                      ? "Select a classroom first"
                      : filteredStudents.length === 0
                        ? "No students in this classroom"
                        : "Select student"}
                  </option>
                  {filteredStudents.map((s) => (
                    <option key={s.studentId} value={s.studentId}>
                      {s.firstname} {s.lastname}
                    </option>
                  ))}
                </select>
              </div>

              {/* Guardian */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Guardian</label>
                <select
                  value={guardianId}
                  onChange={(e) => setGuardianId(e.target.value)}
                  disabled={submitting || isLoading}
                  className={inputClass}
                >
                  <option value="">Select guardian</option>
                  {filteredGuardians.map((g) => (
                    <option key={g.guardianId} value={g.guardianId}>
                      {g.firstname} {g.lastname}
                      {g.phone ? ` (${g.phone})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Payment Term */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Term</label>
                <select
                  value={paymentTermId}
                  onChange={(e) => setPaymentTermId(e.target.value)}
                  disabled={submitting || isLoading}
                  className={inputClass}
                >
                  <option value="">Select payment term</option>
                  {paymentTerms?.map((term) => (
                    <option key={term.paymentTermId} value={term.paymentTermId}>
                      {term.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₦)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={submitting || isLoading}
                  placeholder="0.00"
                  className={inputClass}
                />
              </div>

              {/* Student Info Card */}
              {selectedStudent && (
                <div className="rounded-lg border border-gray-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-800 mb-3">Student Information</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="text-gray-800">
                        {selectedStudent.firstname} {selectedStudent.lastname}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Guardian</p>
                      <p className="text-gray-800">{selectedStudent.guardianName || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Guardian Phone</p>
                      <p className="text-gray-800">{selectedStudent.guardianPhone || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Classroom</p>
                      <p className="text-gray-800">{selectedStudent.classroomName || "—"}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 px-6 py-4 mt-4 border-t bg-slate-50 border-slate-100">
            <button
              type="button"
              onClick={closeModal}
              disabled={submitting || isLoading}
              className="px-4 py-2 text-sm font-medium bg-white border rounded-lg text-slate-700 hover:bg-slate-100 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || isLoading}
              className="px-4 py-2 text-sm font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-60"
            >
              {submitting ? "Recording…" : "Record Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManualFeeRecordForm;