import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../../../Context/Auth/useAuth";
import { teacherSubjectService } from "../../../../Services/Teachers/subject/TeacherSubjectService";

interface CbtSubjectFormProps {
  onClose: () => void;
  onSessionAdded: () => void;
  editData?: any;
}

const CbtSubjectForm: React.FC<CbtSubjectFormProps> = ({ onClose, onSessionAdded, editData }) => {
  const { cbtUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    subjectName: "",
    description: "",
  });

  // console.log(editData)

  useEffect(() => {
    if (editData) {
      setFormData({
        subjectName: editData.subjectName || "",
        description: editData.description || "",
      });
    }
  }, [editData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError("");

    const payload = {
      teacherId: cbtUser?.id,
      schoolId: cbtUser?.schoolId,
      subjectName: formData.subjectName,
      description: formData.description,
    };

    try {
      if (editData) {
        await teacherSubjectService.update(editData.id, payload);
        toast.success("Subject updated successfully!");
        onSessionAdded();
        setTimeout(() => {
          onClose();
          setFormData({ subjectName: "", description: "" });
        }, 2000);
      } else {
        const res = await teacherSubjectService.create(payload);
        toast.success(res.responseMessage || "Subject added successfully!");
        onSessionAdded();
        setTimeout(() => {
          onClose();
          setFormData({
            subjectName: "",
            description: "",
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
          <h2 className="text-lg font-semibold mb-4 text-center">Add Subject</h2>
          {formError && <p className="text-red-600 mb-4 text-center">{formError}</p>}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
              <input
                type="text"
                name="subjectName"
                required
                className="border px-3 py-2 rounded text-sm w-full"
                value={formData.subjectName}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                name="description"
                required
                className="border px-3 py-2 rounded text-sm w-full"
                value={formData.description}
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

export default CbtSubjectForm;
