// src/Components/Admin/SchoolFeeForm.tsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Select from "react-select";
import { useSelector } from "react-redux";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { schoolFeeService } from "../../../Services/Schfee";
import { useAuth } from "../../../Context/Auth/useAuth";
import { RootState } from "../../../Store/store";

interface StudentFormProps {
  onClose: () => void;
  onSubmitSuccess: () => void;
  editData: any;
}

interface OptionType {
  value: string;
  label: string;
}

const SchoolFeeForm: React.FC<StudentFormProps> = ({ onClose, onSubmitSuccess, editData }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [classroomId, setClassroomId] = useState("");
  const [formData, setFormData] = useState({
    amount: "",
    termId: "",
    sessionId: "",
    className: "",
  });

  // Get data from Redux store
  const sessions = useSelector((state: RootState) => state.getSession.listRecords);
  const classrooms = useSelector((state: RootState) => state.getClassrooms.listRecords);
  const sessionTerms = useSelector((state: RootState) => state.getSessionTerm.listRecords);

  // Set initial form data when editData changes
  useEffect(() => {
    if (editData) {
      setFormData({
        amount: editData.amount ?? "",
        termId: editData.termId || "",
        sessionId: editData.sessionId || "",
        className: editData.className || "",
      });
    }
  }, [editData]);

  // Prepare options for react-select
  const sessionOptions: OptionType[] = sessions.map((session) => ({
    value: session.sessionId,
    label: session.sessionId,
  }));

  const sessionTermOptions: OptionType[] = sessionTerms.map((term) => ({
    value: term.sessionTermId,
    label: `${term.term}`,
  }));

  const classroomNameOptions: OptionType[] = classrooms.map((classroom) => ({
    value: classroom.name,
    label: `${classroom.name} (Capacity: ${classroom.capacity})`,
  }));

  const getSelectedOption = (value: string, options: OptionType[]) => {
    return options.find((option) => option.value === value) || null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, selectedOption: OptionType | null) => {
    if (name === "className") {
      const selectedClassroom = classrooms.find(
        (classroom) => classroom.name === selectedOption?.value,
      );
      setClassroomId(selectedClassroom?.classroomId || "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const numericAmount = Number(formData.amount);
    if (!formData.amount || Number.isNaN(numericAmount) || numericAmount <= 0) {
      return setFormError("Enter an amount greater than 0");
    }
    if (!formData.sessionId) return setFormError("Please select a session");
    if (!formData.termId) return setFormError("Please select a term");
    if (!formData.className) return setFormError("Please select a classroom");

    setLoading(true);

    const payload = {
      schoolId: localStorage.getItem("schoolId"),
      classroomId,
      sessionId: formData.sessionId,
      termId: formData.termId,
      amount: numericAmount,
      className: formData.className,
    };

    try {
      if (editData) {
        await schoolFeeService.update(editData.studentId, payload);
        toast.success("School fee updated successfully!");
      } else {
        await schoolFeeService.addSchoolFee(payload);
        toast.success("School fee added successfully!");
      }

      onSubmitSuccess();
      if (!editData) {
        setFormData({ amount: "", termId: "", sessionId: "", className: "" });
      }
      onClose();
    } catch (err) {
      const msg = getErrorMessage(err);
      toast.error(msg);
      setFormError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, loading]);

  const inputClass =
    "w-full border border-gray-300 px-3 py-2 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:bg-gray-50";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={() => !loading && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="school-fee-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white shadow-2xl rounded-2xl ring-1 ring-black/5"
      >
        <div className="h-1.5 w-full bg-linear-to-r from-orange-500 to-amber-400" />

        <form onSubmit={handleSubmit} noValidate>
          <div className="px-6 pt-6 pb-2">
            <h2 id="school-fee-title" className="text-xl font-semibold text-slate-900">
              {editData ? "Edit School Fee" : "Add School Fee"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {editData
                ? "Update the details for this school fee."
                : "Add a new school fee for a class, session and term."}
            </p>

            {formError && (
              <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {formError}
              </p>
            )}

            <div className="mt-5 space-y-4">
              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₦)</label>
                <input
                  type="number"
                  name="amount"
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="0.00"
                  className={inputClass}
                />
              </div>

              {/* Session */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Session</label>
                <Select
                  options={sessionOptions}
                  value={getSelectedOption(formData.sessionId, sessionOptions)}
                  onChange={(selected) => handleSelectChange("sessionId", selected)}
                  isDisabled={loading}
                  isSearchable
                  isClearable
                  placeholder="Select session"
                  noOptionsMessage={() => "No sessions found"}
                  className="text-sm"
                />
              </div>

              {/* Term */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Term</label>
                <Select
                  options={sessionTermOptions}
                  value={getSelectedOption(formData.termId, sessionTermOptions)}
                  onChange={(selected) => handleSelectChange("termId", selected)}
                  isDisabled={loading}
                  isSearchable
                  isClearable
                  placeholder="Select term"
                  noOptionsMessage={() => "No terms found"}
                  className="text-sm"
                />
              </div>

              {/* Classroom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Classroom</label>
                <Select
                  options={classroomNameOptions}
                  value={getSelectedOption(formData.className, classroomNameOptions)}
                  onChange={(selected) => handleSelectChange("className", selected)}
                  isDisabled={loading}
                  isSearchable
                  isClearable
                  placeholder="Select classroom"
                  noOptionsMessage={() => "No classrooms found"}
                  className="text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 px-6 py-4 mt-4 border-t bg-slate-50 border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium bg-white border rounded-lg text-slate-700 hover:bg-slate-100 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-60"
            >
              {loading
                ? editData
                  ? "Updating…"
                  : "Saving…"
                : editData
                  ? "Update"
                  : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SchoolFeeForm;