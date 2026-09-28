import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import Select from "react-select";
import { otherFeeService } from "../../../../Services/Admin/otherFee";
import { GuardianOption, OtherFee, StudentOption } from "../../../../Types/Admin/otherFee";
import { getErrorMessage } from "../../../../utils/getErrorMessage";
import { formatNaira } from "../../../../utils/formatters";

interface RecordOtherFeePaymentModalProps {
  schoolId: string;
  fees: OtherFee[];
  onClose: () => void;
  onRecorded: () => void;
}

interface GuardianSelectOption {
  value: string;
  label: string;
}

const generateReference = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const stamp = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `REF-${stamp}-${rand}`;
};

const RecordOtherFeePaymentModal: React.FC<RecordOtherFeePaymentModalProps> = ({
  schoolId,
  fees,
  onClose,
  onRecorded,
}) => {
  const [feeId, setFeeId] = useState(fees[0]?.otherFeeId ?? "");
  const [guardianId, setGuardianId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [amount, setAmount] = useState(fees[0] ? String(fees[0].amount) : "");
  const [reference, setReference] = useState("");

  const [guardians, setGuardians] = useState<GuardianOption[]>([]);
  const [guardiansLoading, setGuardiansLoading] = useState(true);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const selectedFee = useMemo(() => fees.find((f) => f.otherFeeId === feeId), [fees, feeId]);

  const guardianOptions: GuardianSelectOption[] = useMemo(
    () =>
      guardians.map((g) => ({
        value: g.guardianId,
        label: `${g.name}${g.phone ? ` (${g.phone})` : ""}`,
      })),
    [guardians],
  );

  // Load guardians once
  useEffect(() => {
    let ignore = false;
    const load = async () => {
      setGuardiansLoading(true);
      try {
        const list = await otherFeeService.getGuardians(schoolId);
        if (!ignore) setGuardians(list);
      } catch (err) {
        if (!ignore) setFormError(`Could not load guardians: ${getErrorMessage(err)}`);
      } finally {
        if (!ignore) setGuardiansLoading(false);
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, [schoolId]);

  // Load that guardian's students whenever the guardian changes
  useEffect(() => {
    setStudentId("");
    setStudents([]);
    if (!guardianId) return;

    let ignore = false;
    const load = async () => {
      setStudentsLoading(true);
      try {
        const list = await otherFeeService.getGuardianStudents(guardianId);
        if (ignore) return;
        setStudents(list);
        if (list.length === 1) setStudentId(list[0].studentId); // only one child: preselect
      } catch (err) {
        if (!ignore) setFormError(`Could not load students: ${getErrorMessage(err)}`);
      } finally {
        if (!ignore) setStudentsLoading(false);
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, [guardianId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, submitting]);

  const handleFeeChange = (id: string) => {
    setFeeId(id);
    const fee = fees.find((f) => f.otherFeeId === id);
    if (fee) setAmount(String(fee.amount)); // prefill; the admin can lower it for part payments
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const numericAmount = Number(amount);
    if (!feeId) return setFormError("Please select a fee");
    if (!guardianId) return setFormError("Please select a guardian");
    if (!studentId) return setFormError("Please select a student");
    if (!amount || Number.isNaN(numericAmount) || numericAmount <= 0) {
      return setFormError("Enter an amount greater than 0");
    }

    setSubmitting(true);
    try {
      const res = await otherFeeService.recordPayment({
        otherFeeId: feeId,
        studentId,
        schoolId,
        guardianId,
        amount: numericAmount,
        transactionReference: reference.trim() || generateReference(),
      });
      toast.success(res.responseMessage || "Payment recorded");
      onRecorded();
      onClose();
    } catch (err) {
      const msg = getErrorMessage(err);
      setFormError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full border border-gray-300 px-3 py-2 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:bg-gray-50";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={() => !submitting && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="record-payment-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white shadow-2xl rounded-2xl ring-1 ring-black/5"
      >
        <div className="h-1.5 w-full bg-linear-to-r from-orange-500 to-amber-400" />

        <form onSubmit={handleSubmit} noValidate>
          <div className="px-6 pt-6 pb-2">
            <h2 id="record-payment-title" className="text-xl font-semibold text-slate-900">
              Record Payment
            </h2>
            <p className="mt-1 text-sm text-slate-500">Record a manual payment for an other fee.</p>

            {formError && (
              <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {formError}
              </p>
            )}

            <div className="mt-5 space-y-4">
              {/* Fee */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fee</label>
                <select
                  value={feeId}
                  onChange={(e) => handleFeeChange(e.target.value)}
                  disabled={submitting}
                  className={inputClass}
                >
                  {fees.map((f) => (
                    <option key={f.otherFeeId} value={f.otherFeeId}>
                      {f.feeName} — {formatNaira(f.amount)}
                    </option>
                  ))}
                </select>
                {selectedFee?.description && (
                  <p className="text-xs text-gray-500 mt-1">{selectedFee.description}</p>
                )}
              </div>

              {/* Guardian */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Guardian</label>
                <Select
                  options={guardianOptions}
                  value={guardianOptions.find((o) => o.value === guardianId) ?? null}
                  onChange={(selected) => setGuardianId(selected ? selected.value : "")}
                  isLoading={guardiansLoading}
                  isDisabled={submitting}
                  isSearchable
                  isClearable
                  placeholder={guardiansLoading ? "Loading guardians…" : "Search guardian"}
                  noOptionsMessage={() => "No guardians found"}
                  className="text-sm"
                />
              </div>

              {/* Student */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                <select
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  disabled={!guardianId || studentsLoading || submitting}
                  className={inputClass}
                >
                  <option value="">
                    {!guardianId
                      ? "Select a guardian first"
                      : studentsLoading
                        ? "Loading students…"
                        : students.length === 0
                          ? "No students linked to this guardian"
                          : "Select student"}
                  </option>
                  {students.map((s) => (
                    <option key={s.studentId} value={s.studentId}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount + reference */}
              <div className="">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₦)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={submitting}
                    placeholder="0.00"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 px-6 py-4 mt-4 border-t bg-slate-50 border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium bg-white border rounded-lg text-slate-700 hover:bg-slate-100 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
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

export default RecordOtherFeePaymentModal;