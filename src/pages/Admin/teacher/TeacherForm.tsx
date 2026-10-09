import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { teacherService } from "../../../Services/Teachers/TeacherService";
import { useAuth } from "../../../Context/Auth/useAuth";

interface TeacherFormProps {
  onClose: () => void;
  onSubmitSuccess: () => void;
  editData: any;
}

const teacherSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").min(2, "First name must be at least 2 characters"),
  lastName: z.string().trim().min(1, "Last name is required").min(2, "Last name must be at least 2 characters"),
  phone: z.string().trim().min(1, "Phone number is required").regex(/^[0-9+\-\s()]{10,}$/, "Please enter a valid phone number"),
  address: z.string().trim().min(1, "Home address is required"),
  nationality: z.string().trim().min(1, "Nationality is required"),
  state: z.string().trim().min(1, "State of origin is required"),
  religion: z.string().trim().min(1, "Religion is required"),
  email: z.string().trim().email("Please enter a valid email address").or(z.literal("")),
  username: z.string().trim().min(1, "Username is required").optional().or(z.literal("")),
  employmentDate: z.string().min(1, "Employment date is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
});

type TeacherFormValues = z.infer<typeof teacherSchema>;

const defaultValues: TeacherFormValues = {
  firstName: "",
  lastName: "",
  phone: "",
  address: "",
  nationality: "",
  state: "",
  religion: "",
  email: "",
  username: "",
  employmentDate: "",
  dateOfBirth: "",
};

const TeacherForm: React.FC<TeacherFormProps> = ({ onClose, onSubmitSuccess, editData }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherSchema),
    defaultValues,
    mode: "onBlur",
  });

  const formatDateForInput = (dateString: string | null | undefined): string => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  useEffect(() => {
    if (editData) {
      reset({
        firstName: editData.firstname || "",
        lastName: editData.lastname || "",
        phone: editData.phone || "",
        address: editData.homeAddress || "",
        nationality: editData.nationality || "",
        state: editData.stateOfOrigin || "",
        religion: editData.religion || "",
        email: editData.email || "",
        username: editData.username || "",
        employmentDate: formatDateForInput(editData.employmentDate),
        dateOfBirth: formatDateForInput(editData.dateOfBirth),
      });
      if (editData.imageUrl) {
        setImagePreview(editData.imageUrl);
      }
    } else {
      reset(defaultValues);
    }
  }, [editData, reset]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, loading]);

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

  const onSubmit = async (values: TeacherFormValues) => {
    setLoading(true);
    setFormError("");

    const payload = {
      schoolId: user?.schoolId,
      firstname: values.firstName.trim(),
      lastname: values.lastName.trim(),
      phone: values.phone.trim(),
      homeAddress: values.address.trim(),
      nationality: values.nationality.trim(),
      stateOfOrigin: values.state.trim(),
      religion: values.religion.trim(),
      email: values.email.trim(),
      username: values.username?.trim() || "",
      employmentDate: values.employmentDate.trim(),
      dateOfBirth: values.dateOfBirth.trim(),
    };

    try {
      if (editData) {
        await teacherService.update(editData.teacherId, payload);
        toast.success("Teacher updated successfully!");
      } else {
        const res = await teacherService.create(payload);
        console.log(res);
        toast.success("Teacher added successfully!");
      }

      onSubmitSuccess();
      if (!editData) {
        reset(defaultValues);
        setImagePreview(null);
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
        aria-labelledby="teacher-form-title"
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
          <h2 id="teacher-form-title" className="text-xl font-semibold text-slate-900">
            {editData ? "Edit Teacher" : "Add Teacher"}
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">
            {editData ? "Update this teacher's information" : "Fill in the teacher's details below"}
          </p>
        </div>

        <div className="px-6 py-4 overflow-y-auto">
          {formError && (
            <div className="px-4 py-3 mb-4 text-sm text-center text-red-600 border border-red-200 rounded-lg bg-red-50">
              {formError}
            </div>
          )}

          <form id="teacher-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* <div className="flex justify-center">
              <label className="relative w-20 h-20 overflow-hidden transition-colors bg-orange-100 border-2 border-orange-300 border-dashed rounded-full cursor-pointer group hover:border-orange-400">
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                {imagePreview ? (
                  <img src={imagePreview} alt="preview" className="object-cover w-full h-full" />
                ) : (
                  <span className="flex flex-col items-center justify-center h-full text-orange-400 group-hover:text-orange-500">
                    <span className="text-2xl leading-none">+</span>
                    <span className="text-[10px] font-medium">Photo</span>
                  </span>
                )}
              </label>
            </div> */}

            {/* Identity */}
            <div>
              <h3 className="flex items-center gap-2 mb-3 text-xs font-semibold tracking-wide text-orange-600 uppercase">
                <span>👤</span> Identity
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="col-span-1">
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter first name"
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 ${errors.firstName ? "border-red-500" : "border-gray-300"}`}
                    {...register("firstName")}
                  />
                  {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName.message}</p>}
                </div>

                <div className="col-span-1">
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter last name"
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 ${errors.lastName ? "border-red-500" : "border-gray-300"}`}
                    {...register("lastName")}
                  />
                  {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName.message}</p>}
                </div>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="flex items-center gap-2 mb-3 text-xs font-semibold tracking-wide text-orange-600 uppercase">
                <span>📞</span> Contact
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="col-span-1">
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 ${errors.phone ? "border-red-500" : "border-gray-300"}`}
                    {...register("phone")}
                  />
                  {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
                </div>

                <div className="col-span-1">
                  <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 ${errors.email ? "border-red-500" : "border-gray-300"}`}
                    {...register("email")}
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
                </div>

                <div className="col-span-1">
                  <label className="block mb-1 text-sm font-medium text-gray-700">Username</label>
                  <input
                    type="text"
                    placeholder="Enter username"
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 ${errors.username ? "border-red-500" : "border-gray-300"}`}
                    {...register("username")}
                  />
                  {errors.username && <p className="mt-1 text-xs text-red-600">{errors.username.message}</p>}
                </div>

                <div className="col-span-1">
                  <label className="block mb-1 text-sm font-medium text-gray-700">Home Address</label>
                  <input
                    type="text"
                    placeholder="Enter home address"
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 ${errors.address ? "border-red-500" : "border-gray-300"}`}
                    {...register("address")}
                  />
                  {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address.message}</p>}
                </div>
              </div>
            </div>

            {/* Background */}
            <div>
              <h3 className="flex items-center gap-2 mb-3 text-xs font-semibold tracking-wide text-orange-600 uppercase">
                <span>📋</span> Background
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="col-span-1">
                  <label className="block mb-1 text-sm font-medium text-gray-700">Nationality</label>
                  <input
                    type="text"
                    placeholder="Enter nationality"
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 ${errors.nationality ? "border-red-500" : "border-gray-300"}`}
                    {...register("nationality")}
                  />
                  {errors.nationality && <p className="mt-1 text-xs text-red-600">{errors.nationality.message}</p>}
                </div>

                <div className="col-span-1">
                  <label className="block mb-1 text-sm font-medium text-gray-700">State of Origin</label>
                  <input
                    type="text"
                    placeholder="Enter state of origin"
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 ${errors.state ? "border-red-500" : "border-gray-300"}`}
                    {...register("state")}
                  />
                  {errors.state && <p className="mt-1 text-xs text-red-600">{errors.state.message}</p>}
                </div>

                <div className="col-span-1">
                  <label className="block mb-1 text-sm font-medium text-gray-700">Religion</label>
                  <input
                    type="text"
                    placeholder="Enter religion"
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 ${errors.religion ? "border-red-500" : "border-gray-300"}`}
                    {...register("religion")}
                  />
                  {errors.religion && <p className="mt-1 text-xs text-red-600">{errors.religion.message}</p>}
                </div>
              </div>
            </div>

            {/* Employment */}
            <div>
              <h3 className="flex items-center gap-2 mb-3 text-xs font-semibold tracking-wide text-orange-600 uppercase">
                <span>🗓️</span> Employment
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="col-span-1">
                  <label className="block mb-1 text-sm font-medium text-gray-700">Employment Date</label>
                  <input
                    type="date"
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 ${errors.employmentDate ? "border-red-500" : "border-gray-300"}`}
                    max={todayMax}
                    {...register("employmentDate")}
                  />
                  {errors.employmentDate && (
                    <p className="mt-1 text-xs text-red-600">{errors.employmentDate.message}</p>
                  )}
                </div>

                <div className="col-span-1">
                  <label className="block mb-1 text-sm font-medium text-gray-700">Date of Birth</label>
                  <input
                    type="date"
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 ${errors.dateOfBirth ? "border-red-500" : "border-gray-300"}`}
                    max={todayMax}
                    {...register("dateOfBirth")}
                  />
                  {errors.dateOfBirth && <p className="mt-1 text-xs text-red-600">{errors.dateOfBirth.message}</p>}
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
            className="px-5 py-2.5 text-sm font-medium border rounded-lg border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="teacher-form"
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-lg shadow-sm bg-gradient-to-b from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 hover:shadow-md active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            {loading && (
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            )}
            {loading ? (editData ? "Updating..." : "Saving...") : editData ? "Update Teacher" : "Add Teacher"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherForm;