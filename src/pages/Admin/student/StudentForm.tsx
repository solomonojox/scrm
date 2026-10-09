import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Select from "react-select";
import { studentService } from "../../../Services/Student/StudentService";
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

const studentSchema = z.object({
  firstname: z
    .string()
    .trim()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters"),
  lastname: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((val) => new Date(val) <= new Date(), {
      message: "Date of birth cannot be in the future",
    }),
  homeAddress: z.string().trim().min(1, "Home address is required"),
  guardianId: z.string().min(1, "Please select a guardian"),
  teacherId: z.string().optional(),
  currentTerm: z.string().min(1, "Please select a term"),
  sessionId: z.string().min(1, "Please select a session"),
  classroomId: z.string().min(1, "Please select a classroom"),
  gender: z.enum(["Male", "Female"], {
    message: "Please select a gender",
  }),
});

type StudentFormValues = z.infer<typeof studentSchema>;

const emptyValues: StudentFormValues = {
  firstname: "",
  lastname: "",
  dateOfBirth: "",
  homeAddress: "",
  guardianId: "",
  teacherId: "",
  currentTerm: "1",
  sessionId: "",
  classroomId: "",
  gender: "" as any,
};

// Shared react-select styling so dropdowns match the redesigned inputs
const selectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    minHeight: "38px",
    borderRadius: "0.5rem",
    borderColor: state.isFocused ? "#fb923c" : "#d1d5db",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(253, 186, 116, 0.5)" : "none",
    "&:hover": { borderColor: "#fb923c" },
    fontSize: "0.875rem",
  }),
  option: (base: any, state: any) => ({
    ...base,
    fontSize: "0.875rem",
    backgroundColor: state.isSelected ? "#f97316" : state.isFocused ? "#fff7ed" : "white",
    color: state.isSelected ? "white" : "#1f2937",
  }),
};

const StudentForm: React.FC<StudentFormProps> = ({ onClose, onSubmitSuccess, editData }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDataReady, setIsDataReady] = useState(!editData);
  const [file, setFile] = useState<File | null>(null);

  const guardians = useSelector((state: RootState) => state.getGuardian.listRecords || []);
  const teachers = useSelector((state: RootState) =>
    Array.isArray(state.getTeacher.listRecords) ? state.getTeacher.listRecords : []
  );
  const sessions = useSelector((state: RootState) => state.getSession.listRecords || []);
  const classrooms = useSelector((state: RootState) => state.getClassrooms.listRecords || []);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: emptyValues,
    mode: "onBlur",
  });

  useEffect(() => {
    if (editData) {
      const timer = setTimeout(() => {
        reset({
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
          sessionId: editData.sessionId
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
      reset(emptyValues);
      setIsDataReady(true);
    }
  }, [editData, reset]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, loading]);

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
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ];

  const getSelectedOption = (value: string | undefined, options: OptionType[]) => {
    if (!value) return null;
    return options.find((option) => option.value === String(value)) || null;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      setImagePreview(URL.createObjectURL(selected));
      setFile(selected);
    }
  };

  const handleUploadImage = async () => {
    if (!file || !editData) return;
    try {
      const uploadData = new FormData();
      uploadData.append("file", file);

      const res = await studentService.uploadPhoto(editData.studentId, uploadData);
      toast.success(res.responseMessage || "Image uploaded successfully!");
    } catch (err: any) {
      const msg = getErrorMessage(err);
      setFormError(msg);
      toast.error(msg);
    }
  };

  const onSubmit = async (values: StudentFormValues) => {
    setLoading(true);
    setFormError("");

    const payload = {
      schoolId: user?.schoolId,
      firstname: values.firstname.trim(),
      lastname: values.lastname.trim(),
      dateOfBirth: values.dateOfBirth,
      homeAddress: values.homeAddress.trim(),
      guardianId: values.guardianId,
      teacherId: values.teacherId,
      currentTerm: Number(values.currentTerm),
      sessionId: values.sessionId,
      classroomId: values.classroomId,
      gender: values.gender,
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
        reset(emptyValues);
        setImagePreview(null);
        setFile(null);
      }
    } catch (err: any) {
      const msg = getErrorMessage(err);
      setFormError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const todayMax = new Date().toISOString().split("T")[0];

  if (!isDataReady && editData) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-3 px-8 py-6 bg-white shadow-2xl rounded-2xl">
          <svg className="w-6 h-6 text-orange-500 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
            <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <p className="text-sm text-slate-600">Loading student data...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-[fadeIn_150ms_ease-out]"
      onClick={() => !loading && onClose()}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes popIn {
          from { opacity: 0; transform: translateY(12px) scale(0.97) }
          to { opacity: 1; transform: translateY(0) scale(1) }
        }
      `}</style>

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="student-form-title"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden bg-white shadow-2xl rounded-2xl ring-1 ring-black/5 animate-[popIn_200ms_cubic-bezier(0.16,1,0.3,1)] flex flex-col"
      >
        <div className="h-1.5 w-full shrink-0 bg-linear-to-r from-orange-500 via-amber-500 to-orange-400" />

        <button
          type="button"
          aria-label="Close"
          disabled={loading}
          onClick={onClose}
          className="absolute p-2 transition-colors rounded-full top-4 right-4 text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-40"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="px-6 pt-6 pb-3 shrink-0">
          <h2 id="student-form-title" className="text-xl font-semibold text-slate-900">
            {editData ? "Edit Student" : "Add Student"}
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">
            {editData ? "Update this student's information" : "Fill in the student's details below"}
          </p>
        </div>

        <div className="px-6 pb-4 overflow-y-auto">
          {formError && (
            <p className="mb-4 text-sm text-center text-red-600">{formError}</p>
          )}

          <form id="student-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            {editData && (
              <div className="flex flex-col items-center gap-2">
                {/* <label className="relative w-20 h-20 overflow-hidden transition-colors bg-orange-100 border-2 border-orange-300 border-dashed rounded-full cursor-pointer group hover:border-orange-400">
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  {imagePreview ? (
                    <img src={imagePreview} alt="preview" className="object-cover w-full h-full" />
                  ) : (
                    <span className="flex flex-col items-center justify-center h-full text-orange-400 group-hover:text-orange-500">
                      <span className="text-2xl leading-none">+</span>
                      <span className="text-[10px] font-medium">Photo</span>
                    </span>
                  )}
                </label> */}
                {file && (
                  <button
                    type="button"
                    className="px-3 py-1 text-xs font-medium text-white rounded-full bg-orange-500 hover:bg-orange-600"
                    onClick={handleUploadImage}
                  >
                    Upload photo
                  </button>
                )}
              </div>
            )}

            {/* Identity */}
            <div>
              <h3 className="flex items-center gap-2 mb-3 text-xs font-semibold tracking-wide text-orange-600 uppercase">
                <span>👤</span> Identity
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="col-span-1">
                  <label className="block mb-1 text-sm font-medium text-gray-700">First name*</label>
                  <input
                    type="text"
                    placeholder="First Name"
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 ${
                      errors.firstname ? "border-red-500" : "border-gray-300"
                    }`}
                    {...register("firstname")}
                  />
                  {errors.firstname && (
                    <p className="mt-1 text-xs text-red-600">{errors.firstname.message}</p>
                  )}
                </div>

                <div className="col-span-1">
                  <label className="block mb-1 text-sm font-medium text-gray-700">Last name*</label>
                  <input
                    type="text"
                    placeholder="Last Name"
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 ${
                      errors.lastname ? "border-red-500" : "border-gray-300"
                    }`}
                    {...register("lastname")}
                  />
                  {errors.lastname && (
                    <p className="mt-1 text-xs text-red-600">{errors.lastname.message}</p>
                  )}
                </div>

                <div className="col-span-1">
                  <label className="block mb-1 text-sm font-medium text-gray-700">Date of Birth*</label>
                  <input
                    type="date"
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 ${
                      errors.dateOfBirth ? "border-red-500" : "border-gray-300"
                    }`}
                    max={todayMax}
                    {...register("dateOfBirth")}
                  />
                  {errors.dateOfBirth && (
                    <p className="mt-1 text-xs text-red-600">{errors.dateOfBirth.message}</p>
                  )}
                </div>

                <div className="col-span-1">
                  <label className="block mb-1 text-sm font-medium text-gray-700">Gender*</label>
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <Select
                        options={genderOptions}
                        value={getSelectedOption(field.value, genderOptions)}
                        onChange={(selected) => field.onChange(selected ? selected.value : "")}
                        placeholder="Select Gender"
                        styles={selectStyles}
                        isSearchable
                      />
                    )}
                  />
                  {errors.gender && <p className="mt-1 text-xs text-red-600">{errors.gender.message}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block mb-1 text-sm font-medium text-gray-700">Home Address*</label>
                  <input
                    type="text"
                    placeholder="Home Address"
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 ${
                      errors.homeAddress ? "border-red-500" : "border-gray-300"
                    }`}
                    {...register("homeAddress")}
                  />
                  {errors.homeAddress && (
                    <p className="mt-1 text-xs text-red-600">{errors.homeAddress.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* School assignment */}
            <div>
              <h3 className="flex items-center gap-2 mb-3 text-xs font-semibold tracking-wide text-orange-600 uppercase">
                <span>🏫</span> School Assignment
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="col-span-1">
                  <label className="block mb-1 text-sm font-medium text-gray-700">Guardian*</label>
                  <Controller
                    name="guardianId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        options={guardianOptions}
                        value={getSelectedOption(field.value, guardianOptions)}
                        onChange={(selected) => field.onChange(selected ? selected.value : "")}
                        placeholder="Select Guardian"
                        styles={selectStyles}
                        isSearchable
                      />
                    )}
                  />
                  {errors.guardianId && (
                    <p className="mt-1 text-xs text-red-600">{errors.guardianId.message}</p>
                  )}
                </div>

                <div className="col-span-1">
                  <label className="block mb-1 text-sm font-medium text-gray-700">Teacher</label>
                  <Controller
                    name="teacherId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        options={teacherOptions}
                        value={getSelectedOption(field.value, teacherOptions)}
                        onChange={(selected) => field.onChange(selected ? selected.value : "")}
                        placeholder="Select Teacher"
                        styles={selectStyles}
                        isSearchable
                      />
                    )}
                  />
                </div>

                <div className="col-span-1">
                  <label className="block mb-1 text-sm font-medium text-gray-700">Current Term*</label>
                  <Controller
                    name="currentTerm"
                    control={control}
                    render={({ field }) => (
                      <Select
                        options={termOptions}
                        value={getSelectedOption(field.value, termOptions)}
                        onChange={(selected) => field.onChange(selected ? selected.value : "")}
                        placeholder="Select Term"
                        styles={selectStyles}
                      />
                    )}
                  />
                  {errors.currentTerm && (
                    <p className="mt-1 text-xs text-red-600">{errors.currentTerm.message}</p>
                  )}
                </div>

                <div className="col-span-1">
                  <label className="block mb-1 text-sm font-medium text-gray-700">Session*</label>
                  <Controller
                    name="sessionId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        options={sessionOptions}
                        value={getSelectedOption(field.value, sessionOptions)}
                        onChange={(selected) => field.onChange(selected ? selected.value : "")}
                        placeholder="Select Session"
                        styles={selectStyles}
                        isSearchable
                      />
                    )}
                  />
                  {errors.sessionId && (
                    <p className="mt-1 text-xs text-red-600">{errors.sessionId.message}</p>
                  )}
                </div>

                <div className="sm:col-span-2 mb-10">
                  <label className="block mb-1 text-sm font-medium text-gray-700">Classroom*</label>
                  <Controller
                    name="classroomId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        options={classroomOptions}
                        value={getSelectedOption(field.value, classroomOptions)}
                        onChange={(selected) => field.onChange(selected ? selected.value : "")}
                        placeholder="Select Classroom"
                        styles={selectStyles}
                        isSearchable
                      />
                    )}
                  />
                  {errors.classroomId && (
                    <p className="mt-1 text-xs text-red-600">{errors.classroomId.message}</p>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-slate-50 border-slate-100 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 text-sm font-medium border rounded-lg border-gray-300 hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="student-form"
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-lg shadow-sm bg-gradient-to-b from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 hover:shadow-md active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            {loading && (
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            )}
            {loading ? (editData ? "Updating..." : "Saving...") : editData ? "Update" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentForm;