import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useAuth } from "../../../../Context/Auth/useAuth";
import { cbtAdminService } from "../../../../Services/Cbt/Admin/CbtAdminService";
import { AppDispatch, RootState } from "../../../../Store/store";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { sessionService } from "../../../../Services/Session";
import { fetchSessionFailure, fetchSessionStart, fetchSessionSuccess } from "../../../../Store/sessionSlice";

interface OptionType {
  value: string;
  label: string;
}

interface Teacher {
  teacherId: string;
  firstname: string;
  lastname: string;
  phone: string;
}

interface AdminCbtUserFormProps {
  activeTab: "students" | "teachers";
  closeModal: () => void;
  onSuccess?: () => void;
}

const AdminCbtUserForm = ({ activeTab, closeModal, onSuccess }: AdminCbtUserFormProps) => {
  const { cbtUser } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    homeAddress: "",
    dateOfBirth: "",
    gender: "",
    nationality: "",
    stateOfOrigin: "",
    religion: "",
    employmentDate: "",
    username: "",
    teacherId: "",
    // Student specific
    currentTerm: "",
    sessionId: "",
    password: ""
  });

  const sessions = useSelector((state: RootState) => state.getSession.listRecords || []);
  const fetchedLoading = useSelector((state: RootState) => state.getSession.loading);
  const teachers = useSelector((state: RootState) => state.getTeacher.listRecords || []) as Teacher[];

  useEffect(() => {
    if (!fetchedLoading) {
      fetchSession();
    };
  }, []);

  const fetchSession = async () => {
    dispatch(fetchSessionStart());
    try {
      const res = await sessionService.getAllRegisteredSessions(cbtUser?.schoolId);

      dispatch(fetchSessionSuccess(res));
    } catch (error) {
      console.error("Error fetching sessions:", error);
      dispatch(fetchSessionFailure("Failed to fetch sessions"));
    }
  };

  // Term options
  const termOptions: OptionType[] = [
    { value: "First Term", label: "First Term" },
    { value: "Second Term", label: "Second Term" },
    { value: "Third Term", label: "Third Term" },
  ];

  const sessionOptions = [
    { value: "2023/2024", label: "2023/2024" },
    { value: "2024/2025", label: "2024/2025" },
    { value: "2025/2026", label: "2025/2026" },
  ]

  // Session options
  // const sessionOptions: OptionType[] = sessions.map((session: any) => ({
  //   value: String(session.sessionId || session.id),
  //   label: session.name || `Session ${session.sessionId || session.id}`,
  // }));

  // Teacher options for student assignment
  const teacherOptions: OptionType[] = teachers?.map((teacher) => ({
    value: String(teacher.teacherId),
    label: `${teacher.firstname} ${teacher.lastname} (${teacher.phone})`,
  }));

  const getSelectedOption = (value: string, options: OptionType[]) => {
    if (!value) return null;
    return options.find((option) => option.value === String(value)) || null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, selectedOption: OptionType | null) => {
    setFormData((prev) => ({
      ...prev,
      [name]: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (activeTab === "students") {
        const studentPayload = {
          schoolId: cbtUser?.schoolId,
          firstname: formData.firstname,
          lastname: formData.lastname,
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth,
          homeAddress: formData.homeAddress,
          teacherId: formData.teacherId || "",
          currentTerm: formData.currentTerm || "",
          sessionId: formData.sessionId || "",
          password: formData.password || ""
        };

        await cbtAdminService.addStudent(studentPayload);
      } else {
        // Teacher payload - note the corrected field names to match API
        const teacherPayload = {
          schoolId: cbtUser?.schoolId,
          firstname: formData.firstname,
          lastname: formData.lastname,
          phone: formData.phone,
          homeAddress: formData.homeAddress,
          nationality: formData.nationality,
          stateoforigin: formData.stateOfOrigin, // Note: API uses 'stateoforigin' not 'stateOfOrigin'
          religion: formData.religion,
          dateOfbirth: formData.dateOfBirth, // Note: API uses 'dateOfbirth' not 'dateOfBirth'
          employmentDate: formData.employmentDate,
          email: formData.email,
          username: formData.username,
          password: formData.password || ""
        };

        await cbtAdminService.addTeacher(teacherPayload);
      }

      console.log(`${activeTab === "students" ? "Student" : "Teacher"} added successfully!`);

      if (onSuccess) {
        onSuccess();
      }

      closeModal();
    } catch (error: any) {
      const validationErrors = error?.response?.data?.errors;
      console.log(validationErrors)

      if (validationErrors) {
        // Flatten and extract all error messages from the error object
        const allErrors = Object.values(validationErrors as Record<string, string[]>).flat();
        // console.log(allErrors[0]); // Show only the first error, or loop through if needed
        alert(allErrors[0]);
      } else {
        alert(`Failed to add ${activeTab === "students" ? "student" : "teacher"}. Please try again.`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Field configuration for reusable input fields
  const renderInputField = (
    name: string,
    placeholder: string,
    type: string = "text",
    required: boolean = true,
    colSpan: number = 1
  ) => (
    <div className={`col-span-${colSpan}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {placeholder} {required && "*"}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={formData[name as keyof typeof formData]}
        onChange={handleChange}
        required={required}
        className="w-full border border-orange-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
    </div>
  );

  const renderSelectField = (
    name: string,
    label: string,
    options: OptionType[],
    required: boolean = true,
    colSpan: number = 1
  ) => (
    <div className={`col-span-${colSpan}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && "*"}
      </label>
      <Select
        options={options}
        value={getSelectedOption(formData[name as keyof typeof formData], options)}
        onChange={(selected) => handleSelectChange(name, selected)}
        placeholder={`Select ${label}`}
        className="text-sm"
        isSearchable
        isClearable={!required}
        required={required}
      />
    </div>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-6 relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 text-gray-400 hover:text-orange-500"
          type="button"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-semibold text-orange-600 mb-6">
          {activeTab === "students" ? "Add New Student" : "Add New Teacher"}
        </h3>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {/* Common Fields */}
          {renderInputField("firstname", "First Name", "text", true, 1)}
          {renderInputField("lastname", "Last Name", "text", true, 1)}

          {/* Gender Select */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender *
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border border-orange-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          {renderInputField("dateOfBirth", "Date of Birth", "date", true, 1)}
          {renderInputField("homeAddress", "Home Address", "text", true, 2)}

          {activeTab === "students" && (
            <>
              {renderSelectField("currentTerm", "Current Term", termOptions, true, 1)}
              {renderSelectField("sessionId", "Session", sessionOptions, true, 1)}
              {renderInputField("password", "Password", "text", true, 2)}
              {renderSelectField("teacherId", "Assign Teacher", teacherOptions, false, 2)}
            </>
          )}

          {activeTab === "teachers" && (
            <>
              {renderInputField("email", "Email Address", "email", true, 1)}
              {renderInputField("username", "Username", "text", true, 1)}
              {renderInputField("phone", "Phone Number", "tel", true, 1)}
              {renderInputField("nationality", "Nationality", "text", true, 1)}
              {renderInputField("stateOfOrigin", "State of Origin", "text", true, 1)}
              {renderInputField("religion", "Religion", "text", true, 1)}
              {renderInputField("employmentDate", "Employment Date", "date", true, 1)}
              {renderInputField("password", "Password", "text", true, 1)}
            </>
          )}

          <div className="flex justify-end space-x-3 w-full md:col-span-2 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={closeModal}
              disabled={loading}
              className="px-6 py-2 border border-orange-300 text-orange-600 rounded-lg hover:bg-orange-100 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Adding..." : activeTab === "students" ? "Add Student" : "Add Teacher"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCbtUserForm;