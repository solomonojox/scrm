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

// ---------- Validation schema ----------
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
  gender: "" as any, // cleared by validation; kept empty for controlled Select
};

const StudentForm: React.FC<StudentFormProps> = ({ onClose, onSubmitSuccess, editData }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDataReady, setIsDataReady] = useState(!editData);
  const [file, setFile] = useState<File | null>(null);

  // Redux-sourced option data
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

  // Prefill form when editing
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

  // ---------- Options ----------
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
              {/* Image Upload */}
              {editData && (
                <>
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
                  {file && (
                    <button
                      type="button"
                      className="absolute bg-primary hover:bg-amber-700 px-2 py-1 rounded-lg text-white top-12 right-1/2 translate-x-3/2"
                      onClick={handleUploadImage}
                    >
                      Upload
                    </button>
                  )}
                </>
              )}

              {/* First name */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">First name*</label>
                <input
                  type="text"
                  placeholder="First Name"
                  className={`border px-3 py-2 rounded text-sm w-full ${
                    errors.firstname ? "border-red-500" : ""
                  }`}
                  {...register("firstname")}
                />
                {errors.firstname && (
                  <p className="text-red-600 text-xs mt-1">{errors.firstname.message}</p>
                )}
              </div>

              {/* Last name */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Last name*</label>
                <input
                  type="text"
                  placeholder="Last Name"
                  className={`border px-3 py-2 rounded text-sm w-full ${
                    errors.lastname ? "border-red-500" : ""
                  }`}
                  {...register("lastname")}
                />
                {errors.lastname && (
                  <p className="text-red-600 text-xs mt-1">{errors.lastname.message}</p>
                )}
              </div>

              {/* Date of Birth */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth*
                </label>
                <input
                  type="date"
                  className={`border px-3 py-2 rounded text-sm w-full ${
                    errors.dateOfBirth ? "border-red-500" : ""
                  }`}
                  max={new Date().toISOString().split("T")[0]}
                  {...register("dateOfBirth")}
                />
                {errors.dateOfBirth && (
                  <p className="text-red-600 text-xs mt-1">{errors.dateOfBirth.message}</p>
                )}
              </div>

              {/* Home Address */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Home Address*</label>
                <input
                  type="text"
                  placeholder="Home Address"
                  className={`border px-3 py-2 rounded text-sm w-full ${
                    errors.homeAddress ? "border-red-500" : ""
                  }`}
                  {...register("homeAddress")}
                />
                {errors.homeAddress && (
                  <p className="text-red-600 text-xs mt-1">{errors.homeAddress.message}</p>
                )}
              </div>

              {/* Gender */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender*</label>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={genderOptions}
                      value={getSelectedOption(field.value, genderOptions)}
                      onChange={(selected) => field.onChange(selected ? selected.value : "")}
                      placeholder="Select Gender"
                      className="text-sm"
                      isSearchable
                    />
                  )}
                />
                {errors.gender && (
                  <p className="text-red-600 text-xs mt-1">{errors.gender.message}</p>
                )}
              </div>

              {/* Guardian */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Guardian*</label>
                <Controller
                  name="guardianId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={guardianOptions}
                      value={getSelectedOption(field.value, guardianOptions)}
                      onChange={(selected) => field.onChange(selected ? selected.value : "")}
                      placeholder="Select Guardian"
                      className="text-sm"
                      isSearchable
                    />
                  )}
                />
                {errors.guardianId && (
                  <p className="text-red-600 text-xs mt-1">{errors.guardianId.message}</p>
                )}
              </div>

              {/* Teacher */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Teacher</label>
                <Controller
                  name="teacherId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={teacherOptions}
                      value={getSelectedOption(field.value, teacherOptions)}
                      onChange={(selected) => field.onChange(selected ? selected.value : "")}
                      placeholder="Select Teacher"
                      className="text-sm"
                      isSearchable
                    />
                  )}
                />
              </div>

              {/* Current Term */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Term*
                </label>
                <Controller
                  name="currentTerm"
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={termOptions}
                      value={getSelectedOption(field.value, termOptions)}
                      onChange={(selected) => field.onChange(selected ? selected.value : "")}
                      placeholder="Select Term"
                      className="text-sm"
                    />
                  )}
                />
                {errors.currentTerm && (
                  <p className="text-red-600 text-xs mt-1">{errors.currentTerm.message}</p>
                )}
              </div>

              {/* Session */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Session*</label>
                <Controller
                  name="sessionId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={sessionOptions}
                      value={getSelectedOption(field.value, sessionOptions)}
                      onChange={(selected) => field.onChange(selected ? selected.value : "")}
                      placeholder="Select Session"
                      className="text-sm"
                      isSearchable
                    />
                  )}
                />
                {errors.sessionId && (
                  <p className="text-red-600 text-xs mt-1">{errors.sessionId.message}</p>
                )}
              </div>

              {/* Classroom */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Classroom*</label>
                <Controller
                  name="classroomId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={classroomOptions}
                      value={getSelectedOption(field.value, classroomOptions)}
                      onChange={(selected) => field.onChange(selected ? selected.value : "")}
                      placeholder="Select Classroom"
                      className="text-sm"
                      isSearchable
                    />
                  )}
                />
                {errors.classroomId && (
                  <p className="text-red-600 text-xs mt-1">{errors.classroomId.message}</p>
                )}
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