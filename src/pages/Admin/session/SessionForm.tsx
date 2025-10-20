import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { sessionService } from "../../../Services/Session";
import { useAuth } from "../../../Context/Auth/useAuth";

interface SessionFormProps {
  onClose: () => void;
  onSessionAdded: () => void;
  editData?: any;
}

const SessionForm: React.FC<SessionFormProps> = ({ onClose, onSessionAdded, editData }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    sessionId: "",
    // sessionName: "",
    startDate: "",
    endDate: ""
  });

  // console.log(editData)

  const sessionNameOptions = [
    { value: "First term", label: "First Term" },
    { value: "Second term", label: "Second Term" },
    { value: "Third term", label: "Third Term" }
  ];

  useEffect(() => {
    if (editData) {
      setFormData({
        sessionId: editData.sessionId || "",
        // sessionName: editData.sessionName || "",
        startDate: editData.startDate || "",
        endDate: editData.endDate || ""
      });
    }
  }, [editData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (selectedOption: any) => {
    setFormData(prev => ({ ...prev, sessionName: selectedOption.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError("");

    const payload = {
      schoolId: user?.schoolId,
      sessionId: formData.sessionId,
      // sessionName: formData.sessionName,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString()
    };

    try {
      if (editData) {
        toast.info("Edit service unavailable. Please try again later.");
      } else {

        const res = await sessionService.addSession(payload);
        toast.success(res.responseMessage || "Session added successfully!");
        onSessionAdded();
        setTimeout(() => {
          onClose();
          setFormData({
            sessionId: "",
            // sessionName: "",
            startDate: "",
            endDate: ""
          });
        }, 2000);
      }
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
          <h2 className="text-lg font-semibold mb-4 text-center">Add Session</h2>
          {formError && <p className="text-red-600 mb-4 text-center">{formError}</p>}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Session ID</label>
              <input
                type="text"
                name="sessionId"
                placeholder="Session ID eg. 2023/2024"
                required
                className="border px-3 py-2 rounded text-sm w-full"
                value={formData.sessionId}
                onChange={handleInputChange}
              />
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Term</label>
              <Select
                options={sessionNameOptions}
                value={sessionNameOptions.find(opt => opt.value === formData.sessionName)}
                name="sessionName"
                onChange={handleSelectChange}
                placeholder="Select Term"
                className="text-sm"
                required
              />
            </div> */}

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
                {loading ? "Saving…" : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SessionForm;