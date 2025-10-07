import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Select from "react-select";
import { useAuth } from "../../../Context/Auth/useAuth";
import { RootState } from "../../../Store/store";
import { useSelector } from "react-redux";
import { sessionTermService } from "../../../Services/SessionTerm";

interface SessionTermFormProps {
  onClose: () => void;
  onSessionAdded: () => void;
  editData?: any;
}

interface OptionType {
  value: string | number| undefined;
  label: string;
}

const SessionTermForm: React.FC<SessionTermFormProps> = ({ onClose, onSessionAdded, editData }) => {
  const { user } = useAuth();
  const sessions = useSelector((state: RootState) => state.getSession.listRecords);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    sessionKey: "",
    termName: "",
    startDate: "",
    endDate: "",
  });

  const sessionOptions: OptionType[] = sessions.map((session) => ({
    value: session?.sessionKey,
    label: session?.sessionId,
  }));

  const getSelectedOption = (value: string, options: OptionType[]) => {
    return options.find((option) => option.value === value) || null;
  };

  const termNameOptions = [
    { value: "First term", label: "First Term" },
    { value: "Second term", label: "Second Term" },
    { value: "Third term", label: "Third Term" },
  ];

  // Prefill form when editing
  useEffect(() => {
    if (editData) {
      setFormData({
        sessionKey: editData.sessionKey || "",
        termName: editData.termName || "",
        startDate: editData.startDate ? editData.startDate.split("T")[0] : "",
        endDate: editData.endDate ? editData.endDate.split("T")[0] : "",
      });
      
    } else {
      // Reset when switching back to add mode
      setFormData({
        sessionKey: "",
        termName: "",
        startDate: "",
        endDate: "",
      });
    }
  }, [editData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (
    name: string,
    selectedOption: OptionType | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError("");

    const payload = {
      schoolId: user?.schoolId,
      sessionKey: formData.sessionKey,
      termName: formData.termName,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
    };

    try {
      if (editData) {
        // Call update service
        // await sessionTermService.delete(editData.sessionTermId, payload);
        toast.success("Term updated successfully!");
      } else {
        // Call add service
        await sessionTermService.addSessionTerm(payload);
        toast.success("Term added successfully!");
      }
      onSessionAdded();
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      const msg = err.response?.data?.responseMessage || "Submission failed";
      setFormError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
      <div
        className="bg-white rounded-lg w-full max-w-md sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-orange-500 h-2 rounded-t-lg" />
        <div className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4 text-center">
            {editData ? "Edit Term" : "Add Term"}
          </h2>
          {formError && <p className="text-red-600 mb-4 text-center">{formError}</p>}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Session */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Session*</label>
              <Select
                options={sessionOptions}
                value={getSelectedOption(formData.sessionKey, sessionOptions)}
                onChange={(selected) => handleSelectChange("sessionKey", selected)}
                placeholder="Select Session"
                className="text-sm"
                isSearchable
                required
              />
            </div>

            {/* Term */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Term*</label>
              <Select
                options={termNameOptions}
                value={getSelectedOption(formData.termName, termNameOptions)}
                onChange={(selected) => handleSelectChange("termName", selected)}
                placeholder="Select Term"
                className="text-sm"
                isSearchable
                required
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                required
                className="border px-3 py-2 rounded text-sm w-full"
                value={formData.startDate}
                onChange={handleInputChange}
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                name="endDate"
                required
                className="border px-3 py-2 rounded text-sm w-full"
                value={formData.endDate}
                onChange={handleInputChange}
              />
            </div>

            {/* Buttons */}
            <div className="col-span-2 flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded text-sm hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-orange-500 text-white rounded text-sm hover:bg-orange-600 disabled:opacity-50"
              >
                {loading ? "Saving…" : editData ? "Update" : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SessionTermForm;
