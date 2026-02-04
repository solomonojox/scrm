import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { studentService } from "../../../Services/Student/StudentService";
import Select from "react-select";
import { RootState } from "../../../Store/store";
import { useSelector } from "react-redux";
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

const StudentForm: React.FC<StudentFormProps> = ({ onClose, onSubmitSuccess, editData }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDataReady, setIsDataReady] = useState(false);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    dateOfBirth: "",
    homeAddress: "",
    guardianId: "",
    teacherId: "",
    currentTerm: "1",
    sessionId: "",
    classroomId: "",
    gender: "",
  });

  // Get data from Redux store
  const guardians = useSelector((state: RootState) => state.getGuardian.listRecords || []);
  const teachers = useSelector((state: RootState) => (Array.isArray(state.getTeacher.listRecords) ? state.getTeacher.listRecords : []));
  const sessions = useSelector((state: RootState) => state.getSession.listRecords || []);
  const classrooms = useSelector((state: RootState) => state.getClassrooms.listRecords || []);

  // Set initial form data when editing
  useEffect(() => {
    if (editData) {
      const timer = setTimeout(() => {
        setFormData({
          firstname: editData.firstname || "",
          lastname: editData.lastname || "",
          dateOfBirth: editData.dateOfBirth ? editData.dateOfBirth.split("T")[0] : "",
          homeAddress: editData.homeAddress || editData.address || "",
          guardianId: editData.guardianId ? String(editData.guardianId) : "",
          teacherId: editData.teacherId
            ? String(editData.teacherId)
            : editData.teacher?.teacherId
            ? String(editData.teacher.teacherId)
            : "",
          currentTerm: editData.currentTerm ? String(editData.currentTerm) : "1",
          sessionId:
            editData.sessionId
              ? String(editData.sessionId)
              : editData.currentSession
              ? String(editData.currentSession)
              : editData.session?.sessionId
              ? String(editData.session.sessionId)
              : "",
          classroomId: editData.classroomId ? String(editData.classroomId) : "",
          gender: editData.gender || "",
        });

        if (editData.imageUrl) {
          setImagePreview(editData.imageUrl);
        }
        setIsDataReady(true);
      }, 100);

      return () => clearTimeout(timer);
    } else {
      setIsDataReady(true);
    }
  }, [editData]);

  // Prepare options for react-select (normalize value to string)
  const guardianOptions: OptionType[] = guardians.map((guardian) => ({
    value: String(guardian.guardianId),
    label: `${guardian.firstname} ${guardian.lastname} (${guardian.phone})`,
  }));

  const teacherOptions: OptionType[] = teachers.map((teacher: any) => ({
    value: String(teacher.teacherId),
    label: `${teacher.firstname} ${teacher.lastname} (${teacher.phone})`,
  }));

  const sessionOptions: OptionType[] = sessions.map((session) => ({
    value: String(session.sessionId),
    label: session.sessionId,
  }));

  const classroomOptions: OptionType[] = classrooms.map((classroom) => ({
    value: String(classroom.classroomId),
    label: `${classroom.name} (Capacity: ${classroom.capacity})`,
  }));

  const termOptions: OptionType[] = [
    { value: "1", label: "First Term" },
    { value: "2", label: "Second Term" },
    { value: "3", label: "Third Term" },
  ];

  const genderOptions: OptionType[] = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "others", label: "Others" },
  ];

  const getSelectedOption = (value: string, options: OptionType[]) => {
    if (!value) return null;
    return options.find((option) => option.value === String(value)) || null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    if (!formData.firstname || !formData.lastname) {
      setFormError("First name and last name are required");
      return false;
    }
    if (!formData.guardianId) {
      setFormError("Please select a guardian");
      return false;
    }
    if (!formData.classroomId) {
      setFormError("Please select a classroom");
      return false;
    }
    if (!formData.sessionId) {
      setFormError("Please select a session");
      return false;
    }
    if (!formData.gender) {
      setFormError("Please select a gender");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setFormError("");

    const payload = {
      schoolId: user?.schoolId,
      firstname: formData.firstname.trim(),
      lastname: formData.lastname.trim(),
      dateOfBirth: formData.dateOfBirth,
      homeAddress: formData.homeAddress.trim(),
      guardianId: formData.guardianId,
      teacherId: formData.teacherId,
      currentTerm: Number(formData.currentTerm),
      sessionId: formData.sessionId,
      classroomId: formData.classroomId,
      gender: formData.gender,
    };

    try {
      if (editData) {
        await studentService.update(editData.studentId, payload);
        toast.success("Student updated successfully!");
      } else {
        const res = await studentService.create(payload);
        toast.success(res.responseMessage || "Student added successfully!");
      }

      onSubmitSuccess();
      if (!editData) {
        setFormData({
          firstname: "",
          lastname: "",
          dateOfBirth: "",
          homeAddress: "",
          guardianId: "",
          teacherId: "",
          currentTerm: "1",
          sessionId: "",
          classroomId: "",
          gender: "",
        });
        setImagePreview(null);
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.responseMessage || (editData ? "Update failed" : "Submission failed");
      setFormError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!isDataReady && editData) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="text-center">Loading student data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
      <div
        className="bg-white rounded-lg w-full max-w-md sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-orange-500 h-2 rounded-t-lg" />
        <div className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4 text-center">
            {editData ? "Edit Student" : "Add Student"}
          </h2>
          {formError && <p className="text-red-600 mb-4 text-center">{formError}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Image Upload */}
              <label className="relative col-span-2 w-20 h-20 mx-auto mb-4 rounded-full bg-orange-100 border-2 border-orange-400 overflow-hidden cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {imagePreview ? (
                  <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="flex items-center justify-center h-full text-orange-400 font-bold text-xl">
                    +
                  </span>
                )}
              </label>

              {/* First name */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">First name*</label>
                <input
                  type="text"
                  name="firstname"
                  required
                  placeholder="First Name"
                  className="border px-3 py-2 rounded text-sm w-full"
                  value={formData.firstname}
                  onChange={handleInputChange}
                />
              </div>

              {/* Last name */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Last name*</label>
                <input
                  type="text"
                  name="lastname"
                  required
                  placeholder="Last Name"
                  className="border px-3 py-2 rounded text-sm w-full"
                  value={formData.lastname}
                  onChange={handleInputChange}
                />
              </div>

              {/* Date of Birth */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  className="border px-3 py-2 rounded text-sm w-full"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  max={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              {/* Home Address */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Home Address</label>
                <input
                  type="text"
                  name="homeAddress"
                  placeholder="Home Address"
                  className="border px-3 py-2 rounded text-sm w-full"
                  value={formData.homeAddress}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Gender */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender*</label>
                <Select
                  options={genderOptions}
                  value={getSelectedOption(formData.gender, genderOptions)}
                  onChange={(selected) => handleSelectChange("gender", selected)}
                  placeholder="Select Gender"
                  className="text-sm"
                  isSearchable
                  required
                />
              </div>

              {/* Guardian */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Guardian*</label>
                <Select
                  options={guardianOptions}
                  value={getSelectedOption(formData.guardianId, guardianOptions)}
                  onChange={(selected) => handleSelectChange("guardianId", selected)}
                  placeholder="Select Guardian"
                  className="text-sm"
                  isSearchable
                  required
                />
              </div>

              {/* Teacher */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Teacher</label>
                <Select
                  options={teacherOptions}
                  value={getSelectedOption(formData.teacherId, teacherOptions)}
                  onChange={(selected) => handleSelectChange("teacherId", selected)}
                  placeholder="Select Teacher"
                  className="text-sm"
                  isSearchable
                />
              </div>

              {/* Current Term */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Term*
                </label>
                <Select
                  options={termOptions}
                  value={getSelectedOption(formData.currentTerm, termOptions)}
                  onChange={(selected) => handleSelectChange("currentTerm", selected)}
                  placeholder="Select Term"
                  className="text-sm"
                  required
                />
              </div>

              {/* Session */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Session*</label>
                <Select
                  options={sessionOptions}
                  value={getSelectedOption(formData.sessionId, sessionOptions)}
                  onChange={(selected) => handleSelectChange("sessionId", selected)}
                  placeholder="Select Session"
                  className="text-sm"
                  isSearchable
                  required
                />
              </div>

              {/* Classroom */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Classroom*</label>
                <Select
                  options={classroomOptions}
                  value={getSelectedOption(formData.classroomId, classroomOptions)}
                  onChange={(selected) => handleSelectChange("classroomId", selected)}
                  placeholder="Select Classroom"
                  className="text-sm"
                  isSearchable
                  required
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="col-span-2 flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded text-sm hover:bg-gray-100"
                disabled={loading}
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

export default StudentForm;
