import React, { useState } from "react";
import { FaComment } from "react-icons/fa";
import { toast } from "react-toastify";
import { guardianService } from "../../../Services/Guardian/guardian";
import { classroomService } from "../../../Services/Classroom";
import Select from "react-select";
import { RootState } from "../../../Store/store";
import { useSelector } from "react-redux";

interface GuardianFormProps {
  onClose: () => void;
  onGuardianAdded: () => void;
}

interface OptionType {
  value: string;
  label: string;
}

const ClassroomForm: React.FC<GuardianFormProps> = ({ onClose, onGuardianAdded }) => {
  const teachers = useSelector((state: RootState) => state.getTeacher.listRecords);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    teacherId: "",
    capacity: "",
  });

  const teacherOptions: OptionType[] = teachers.map((teacher) => ({
    value: teacher.teacherId,
    label: `${teacher.firstname} ${teacher.lastname} (${teacher.phone})`,
  }));

  const getSelectedOption = (value: string, options: OptionType[]) => {
    return options.find((option) => option.value === value) || null;
  };

  const handleSelectChange = (
    name: string,
    selectedOption: OptionType | { value: number } | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

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
      name: formData.name,
      teacherId: formData.teacherId,
      capacity: formData.capacity,
    };

    try {
      const res = await classroomService.addClassroom(payload);
      toast.success("Classroom added!");
      onGuardianAdded();
      setTimeout(() => {
        onClose();
        setFormData({
          name: "",
          teacherId: "",
          capacity: "",
        });
        setImagePreview(null);
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
          <h2 className="text-lg font-semibold mb-4 text-center">Add Classroom</h2>
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
            {[
              ["name", "Name"],
              ["capacity", "Capacity"],
            ].map(([key, label]) => (
              <div className="col-span-1" key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1 px-2">{label}</label>
                <input
                  type={key === "email" ? "email" : "text"}
                  name={key}
                  placeholder={label}
                  required={["schoolId", "name", "capacity"].includes(key)}
                  className="border px-3 py-2 rounded text-sm w-full"
                  value={formData[key]}
                  onChange={handleInputChange}
                />
              </div>
            ))}

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Teacher</label>
              <Select
                options={teacherOptions}
                value={getSelectedOption(formData.teacherId, teacherOptions)}
                onChange={(selected) => handleSelectChange("teacherId", selected)}
                placeholder="Select Teacher"
                className="text-sm"
                isSearchable
                required
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

export default ClassroomForm;
