import React, { useContext, useEffect, useRef, useState } from "react";
import { FaCamera, FaEdit, FaSpinner, FaCheck, FaTimes, FaUserTie } from "react-icons/fa";
import imageAssets from "../../../assets/imageAssets";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../Store/store";
import { teacherService } from "../../../Services/Teachers/TeacherService";
import { useAuth } from "../../../Context/Auth/useAuth";
import {
  fetchATeacherStart,
  fetchTeacherFailure,
  fetchTeacherStart,
  fetchTeacherSuccess,
} from "../../../Store/Teachers/teacherSlice";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import toast from 'react-toastify';
import { AppContext } from "../../../Context/AppContext";

// Grouped fields for the sectioned layout. Same ids/types/disable flags as before.
const fieldSections: {
  title: string;
  icon: string;
  fields: { label: string; id: string; type: string; disable?: boolean }[];
}[] = [
  {
    title: "Identity",
    icon: "👤",
    fields: [
      { label: "First Name", id: "firstname", type: "text" },
      { label: "Last Name", id: "lastname", type: "text" },
      { label: "Role", id: "role", type: "text" },
      { label: "Date of Birth", id: "dateOfBirth", type: "date" },
    ],
  },
  {
    title: "Contact",
    icon: "📞",
    fields: [
      { label: "Phone Number", id: "phone", type: "text" },
      { label: "Email", id: "email", type: "email", disable: true },
      { label: "Username", id: "username", type: "text" },
      { label: "Home Address", id: "homeAddress", type: "text" },
    ],
  },
  {
    title: "Background",
    icon: "📋",
    fields: [
      { label: "Nationality", id: "nationality", type: "text" },
      { label: "State of Origin", id: "stateOfOrigin", type: "text" },
      { label: "Religion", id: "religion", type: "text" },
      { label: "Employment Date", id: "employmentDate", type: "date", disable: true },
    ],
  },
];

export default function TeacherProfile() {
  const { user } = useAuth();
  const { notifySuccess, notifyError } = useContext(AppContext);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const fetchedRecord = useSelector((state: RootState) => state.getTeacher.selectedTeacher);
  const fetchedLoading = useSelector((state: RootState) => state.getTeacher.loading);
  const error = useSelector((state: RootState) => state.getTeacher.error);

  // 🔑 toggle editing state
  const [isEditing, setIsEditing] = useState(false);

  // 🔑 form state
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    homeAddress: "",
    nationality: "",
    stateOfOrigin: "",
    role: "",
    religion: "",
    email: "",
    username: "",
    schoolId: "",
    dateOfBirth: "",
    employmentDate: "",
  });

  // helper: format ISO date strings for <input type="date">
  const toDateInputValue = (value?: string | null) => {
    if (!value) return "";
    return value.split("T")[0];
  };

  // populate form when data fetched
  useEffect(() => {
    if (fetchedRecord) {
      setFormData({
        firstname: fetchedRecord?.firstname || "",
        lastname: fetchedRecord?.lastname || "",
        phone: fetchedRecord?.phone || "",
        homeAddress: fetchedRecord?.homeAddress || "",
        nationality: fetchedRecord?.nationality || "",
        stateOfOrigin: fetchedRecord?.stateOfOrigin || "",
        role: fetchedRecord?.role || "",
        religion: fetchedRecord?.religion || "",
        email: fetchedRecord?.email || "",
        username: fetchedRecord?.username || "",
        schoolId: fetchedRecord?.schoolId || "",
        dateOfBirth: toDateInputValue(fetchedRecord?.dateOfBirth),
        employmentDate: toDateInputValue(fetchedRecord?.employmentDate),
      });
    }
  }, [fetchedRecord]);

  // ── Picture upload: commented out for now ──────────────────────────────
  // const handleCameraClick = () => {
  //   fileInputRef.current?.click();
  // };

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) {
  //     const file = e.target.files[0];
  //     console.log("Selected file:", file);
  //   }
  // };


  useEffect(() => {
    if (user?.id && !fetchedLoading) {
      fetchTeacher();
    }
  }, [user, dispatch]);

  const fetchTeacher = async () => {
    dispatch(fetchTeacherStart());

    try {
      const data = await teacherService.getById(user?.id);
      dispatch(fetchATeacherStart(data));
    } catch (err: any) {
      dispatch(fetchTeacherFailure(err.message));
    }
  };

  // handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // client-side validation mirroring backend rules, to avoid round-tripping
  // on SchoolId / Username / DateOfBirth / HomeAddress / EmploymentDate
  const validateForm = (): string | null => {
    if (!formData.schoolId || !formData.schoolId.trim()) {
      return "School ID is required";
    }

    if (!formData.username || !formData.username.trim()) {
      return "Username is required";
    }
    if (formData.username.trim().length < 3) {
      return "Username must be at least 3 characters long";
    }
    if (!/^[a-zA-Z0-9_]+$/.test(formData.username.trim())) {
      return "Username can only contain letters, numbers, and underscores";
    }

    if (!formData.dateOfBirth) {
      return "Date of birth is required";
    } else {
      const dob = new Date(formData.dateOfBirth);
      const hundredYearsAgo = new Date();
      hundredYearsAgo.setFullYear(hundredYearsAgo.getFullYear() - 100);
      if (isNaN(dob.getTime()) || dob < hundredYearsAgo || dob > new Date()) {
        return "Date of birth must be within the last 100 years";
      }
    }

    if (!formData.homeAddress || !formData.homeAddress.trim()) {
      return "Home address is required";
    }
    if (formData.homeAddress.trim().length < 10) {
      return "Home address must be at least 10 characters long";
    }

    if (!formData.employmentDate) {
      return "Employment date is required";
    }

    return null;
  };

  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      notifyError(validationError);
      return;
    }

    setLoading(true);

    try {
      // call API to update
      await teacherService.update(user?.id, formData);

      notifySuccess("Profile updated successfully");
      fetchTeacher();
      setIsEditing(false);
    } catch (error: any) {
      const msg = getErrorMessage(error)
      notifyError(msg);
    } finally {
      setLoading(false);
    }
  };

  const initials =
    `${formData.firstname?.[0] ?? ""}${formData.lastname?.[0] ?? ""}`.toUpperCase() || "T";

  return (
    <div className="min-h-screen p-4 bg-gray-100 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="mb-4 text-xl font-bold text-gray-800">Personal Information</h2>

        <div className="overflow-hidden bg-white shadow-lg rounded-2xl ring-1 ring-black/5">
          {/* Banner */}
          <div className="relative w-full">
            <img
              src={imageAssets.color}
              alt="Orange gradient banner"
              className="w-full h-37.5 object-cover bg-[#EE7306]"
            />
          </div>

          {/* Avatar + Name + Actions */}
          <div className="flex flex-col items-center gap-4 px-4 -mt-14 sm:flex-row sm:items-end sm:justify-between md:px-8">
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              {/* ── Picture area: commented out for now, initials shown instead ── */}
              <div className="relative flex items-center justify-center w-28 h-28 text-3xl font-bold text-white bg-orange-400 border-4 border-white rounded-full shadow-md sm:w-24 sm:h-24">
                {initials}
                {/*
                <img
                  src={imageAssets.man}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
                <div
                  className="absolute bottom-1 right-1 z-10 bg-[#EE7306] rounded-full p-2 border-2 border-white cursor-pointer"
                  title="Change profile picture"
                  onClick={handleCameraClick}
                >
                  <FaCamera className="text-white text-sm" />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                */}
              </div>


              <div className="text-center sm:pb-1 sm:text-left">
                <p className="text-lg font-bold leading-none text-gray-900">
                  {fetchedRecord?.firstname} {fetchedRecord?.lastname}
                </p>
                <p className="flex items-center justify-center gap-1 mt-3 md:mt-10 text-xs font-semibold text-gray-500 sm:justify-start">
                  <FaUserTie className="text-orange-500" />
                  {fetchedRecord?.role || "Teacher"}
                </p>
                {/*
                <div className="flex justify-center gap-3 mt-3 sm:justify-start">
                  <button
                    type="button"
                    onClick={handleCameraClick}
                    className="bg-[#EE7306] text-white text-[12px] px-4 py-2 rounded-md font-bold"
                  >
                    Change Picture
                  </button>
                  <button
                    type="button"
                    disabled
                    className="bg-gray-300 text-white text-[12px] px-4 py-2 rounded-md font-bold cursor-not-allowed"
                  >
                    Delete Picture
                  </button>
                </div>
                */}
              </div>
            </div>

            {/* Edit Profile Toggle */}
            <button
              type="button"
              onClick={() => setIsEditing((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-4 py-2 rounded-full transition-colors ${
                isEditing
                  ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  : "bg-orange-50 text-orange-600 hover:bg-orange-100"
              }`}
            >
              {isEditing ? <FaTimes /> : <FaEdit />}
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {/* Form */}
          <div className="p-4 mt-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {fieldSections.map((section) => (
                <div key={section.title}>
                  <h3 className="flex items-center gap-2 pb-2 mb-4 text-xs font-semibold tracking-wide text-orange-600 uppercase border-b border-gray-100">
                    <span>{section.icon}</span>
                    {section.title}
                  </h3>
                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                    {section.fields.map((field) => (
                      <div key={field.id}>
                        <label
                          htmlFor={field.id}
                          className="flex items-center gap-1 mb-1 text-xs font-bold text-gray-700"
                        >
                          {field.label}
                          {field.disable && (
                            <span className="px-1.5 py-0.5 rounded-full bg-gray-100 text-[9px] font-medium text-gray-400 normal-case">
                              Locked
                            </span>
                          )}
                        </label>
                        <input
                          id={field.id}
                          type={field.type}
                          value={(formData as any)[field.id] || ""}
                          onChange={handleChange}
                          readOnly={!isEditing || field.disable}
                          className={`w-full rounded-lg px-3 py-2.5 text-sm transition-colors ${
                            isEditing
                              ? `border focus:outline-none ${
                                  field.disable
                                    ? "text-gray-400 border-gray-200 bg-gray-50"
                                    : "focus:ring-2 focus:ring-orange-300 border-gray-300 focus:border-orange-400"
                                }`
                              : "bg-gray-50 cursor-not-allowed border border-gray-200 outline-none text-gray-700"
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Save Button */}
              {isEditing && (
                <div className="flex items-center justify-end gap-3 pt-4 mt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    disabled={loading}
                    className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white rounded-lg shadow-sm bg-gradient-to-b from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 hover:shadow-md active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaCheck className="text-xs" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}