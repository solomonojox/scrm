import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { studentService } from "../../../Services/Student/StudentService";
import Select from "react-select";
import { RootState } from "../../../Store/store";
import { useSelector } from "react-redux";
import { schoolFeeService } from "../../../Services/Schfee";
import { useAuth } from "../../../Context/Auth/useAuth";

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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    amount: 0,
    // currentTerm: 0,
    sessionId: "",
    classroomId: "",
    className: "",
  });

  // Get data from Redux store
  const sessions = useSelector((state: RootState) => state.getSession.listRecords);
  const classrooms = useSelector((state: RootState) => state.getClassrooms.listRecords);
  // console.log(classrooms);

  // Set initial form data when editData changes
  useEffect(() => {
    if (editData) {
      setFormData({
        amount: editData.amount || "",
        // currentTerm: editData.currentTerm || 0,
        sessionId: editData.sessionId || "",
        classroomId: editData.classroomId || "",
        className: editData.className || "",
      });
    }
  }, [editData]);

  // Prepare options for react-select

  const sessionOptions: OptionType[] = sessions.map((session) => ({
    value: session.sessionId,
    label: session.sessionId,
  }));

  const classroomOptions: OptionType[] = classrooms.map((classroom) => ({
    value: classroom.classroomId,
    label: `${classroom.name} (Capacity: ${classroom.capacity})`,
  }));

  const classroomNameOptions: OptionType[] = classrooms.map((classroom) => ({
    value: classroom.name,
    label: `${classroom.name} (Capacity: ${classroom.capacity})`,
  }));

  const termOptions: OptionType[] = [
    { value: "0", label: "First Term" },
    { value: "1", label: "Second Term" },
    { value: "2", label: "Third Term" },
  ];

  // Get the current selected options for the select fields
  const getSelectedOption = (value: string, options: OptionType[]) => {
    return options.find((option) => option.value === value) || null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "enteredClass" ? parseInt(value) : value,
    }));
  };

  const handleSelectChange = (name: string, selectedOption: OptionType | null) => {
    setFormData((prev) => ({
      ...prev,
      [name]: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError("");

    const payload = {
      schoolId: localStorage.getItem("schoolId"),
      classroomId: formData.classroomId,
      sessionId: formData.sessionId,
      termId: user?.termId,
      amount: formData.amount,
      className: formData.className,
    };

    try {
      if (editData) {
        await schoolFeeService.update(editData.studentId, payload);
        toast.success("Student updated successfully!");
      } else {
        const res = await schoolFeeService.addSchoolFee(payload);
        toast.success("Student added successfully!");
      }

      onSubmitSuccess();
      if (!editData) {
        setFormData({
          amount: 0,
          // currentTerm: 0,
          sessionId: "",
          classroomId: "",
          className: "",
        });
      }
      setImagePreview(null);
    } catch (err: any) {
      const msg =
        err.response?.data?.responseMessage || (editData ? "Update failed" : "Submission failed");
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
            {editData ? "Edit School Fee" : "Add School Fee"}
          </h2>
          {formError && <p className="text-red-600 mb-4 text-center">{formError}</p>}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="relative col-span-2 w-20 h-20 mx-auto mb-4 rounded-full bg-orange-100 border-2 border-orange-400 overflow-hidden cursor-pointer">
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              {imagePreview ? (
                <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <span className="flex items-center justify-center h-full text-orange-400 font-bold text-xl">
                  +
                </span>
              )}
            </label>

            {/* Regular input fields */}

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input
                type="text"
                name="amount"
                placeholder="Enter amount"
                className="border px-3 py-2 rounded text-sm w-full"
                value={formData.amount}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Session</label>
              <Select
                options={sessionOptions}
                value={getSelectedOption(formData.sessionId, sessionOptions)}
                onChange={(selected) => handleSelectChange("sessionId", selected)}
                placeholder="Select Session"
                className="text-sm"
              />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Classroom</label>
              <Select
                options={classroomOptions}
                value={getSelectedOption(formData.classroomId, classroomOptions)}
                onChange={(selected) => handleSelectChange("classroomId", selected)}
                placeholder="Select Classroom"
                className="text-sm"
              />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Classroom name</label>
              <Select
                options={classroomNameOptions}
                value={getSelectedOption(formData.className, classroomNameOptions)}
                onChange={(selected) => handleSelectChange("className", selected)}
                placeholder="Select Classroom name"
                className="text-sm"
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
                {loading
                  ? editData
                    ? "Updating..."
                    : "Saving..."
                  : editData
                    ? "Update"
                    : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SchoolFeeForm;
