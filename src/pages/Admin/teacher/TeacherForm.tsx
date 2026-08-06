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
    control,
    formState: { errors },
  } = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherSchema),
    defaultValues,
    mode: "onBlur",
  });

  // Helper function to format date for input[type="date"]
  const formatDateForInput = (dateString: string | null | undefined): string => {
    if (!dateString) return "";
    
    try {
      // Handle various date formats
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) return "";
      
      // Format as YYYY-MM-DD
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  // Set initial form data when editData changes
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // 2MB limit
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

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4">
      <div
        className="bg-white rounded-lg w-full max-w-md sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-orange-500 h-2 rounded-t-lg" />
        <div className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center text-gray-800">
            {editData ? "Edit Teacher" : "Add Teacher"}
          </h2>
          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4 text-center text-sm">
              {formError}
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="relative col-span-2 w-20 h-20 mx-auto mb-4 rounded-full bg-orange-100 border-2 border-orange-400 overflow-hidden cursor-pointer hover:border-orange-500 transition-colors">
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

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter first name"
                  className={`border border-gray-300 px-3 py-2 rounded text-sm w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.firstName ? "border-red-500" : ""}`}
                  {...register("firstName")}
                />
                {errors.firstName && <p className="text-red-600 text-xs mt-1">{errors.firstName.message}</p>}
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter last name"
                  className={`border border-gray-300 px-3 py-2 rounded text-sm w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.lastName ? "border-red-500" : ""}`}
                  {...register("lastName")}
                />
                {errors.lastName && <p className="text-red-600 text-xs mt-1">{errors.lastName.message}</p>}
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  className={`border border-gray-300 px-3 py-2 rounded text-sm w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.phone ? "border-red-500" : ""}`}
                  {...register("phone")}
                />
                {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone.message}</p>}
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  className={`border border-gray-300 px-3 py-2 rounded text-sm w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.email ? "border-red-500" : ""}`}
                  {...register("email")}
                />
                {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  placeholder="Enter username"
                  className={`border border-gray-300 px-3 py-2 rounded text-sm w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.username ? "border-red-500" : ""}`}
                  {...register("username")}
                />
                {errors.username && <p className="text-red-600 text-xs mt-1">{errors.username.message}</p>}
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Home Address</label>
                <input
                  type="text"
                  placeholder="Enter home address"
                  className={`border border-gray-300 px-3 py-2 rounded text-sm w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.address ? "border-red-500" : ""}`}
                  {...register("address")}
                />
                {errors.address && <p className="text-red-600 text-xs mt-1">{errors.address.message}</p>}
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                <input
                  type="text"
                  placeholder="Enter nationality"
                  className={`border border-gray-300 px-3 py-2 rounded text-sm w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.nationality ? "border-red-500" : ""}`}
                  {...register("nationality")}
                />
                {errors.nationality && <p className="text-red-600 text-xs mt-1">{errors.nationality.message}</p>}
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State of Origin
                </label>
                <input
                  type="text"
                  placeholder="Enter state of origin"
                  className={`border border-gray-300 px-3 py-2 rounded text-sm w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.state ? "border-red-500" : ""}`}
                  {...register("state")}
                />
                {errors.state && <p className="text-red-600 text-xs mt-1">{errors.state.message}</p>}
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
                <input
                  type="text"
                  placeholder="Enter religion"
                  className={`border border-gray-300 px-3 py-2 rounded text-sm w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.religion ? "border-red-500" : ""}`}
                  {...register("religion")}
                />
                {errors.religion && <p className="text-red-600 text-xs mt-1">{errors.religion.message}</p>}
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employment Date
                </label>
                <input
                  type="date"
                  className={`border border-gray-300 px-3 py-2 rounded text-sm w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.employmentDate ? "border-red-500" : ""}`}
                  max={new Date().toISOString().split('T')[0]}
                  {...register("employmentDate")}
                />
                {errors.employmentDate && <p className="text-red-600 text-xs mt-1">{errors.employmentDate.message}</p>}
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  className={`border border-gray-300 px-3 py-2 rounded text-sm w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.dateOfBirth ? "border-red-500" : ""}`}
                  max={new Date().toISOString().split('T')[0]}
                  {...register("dateOfBirth")}
                />
                {errors.dateOfBirth && <p className="text-red-600 text-xs mt-1">{errors.dateOfBirth.message}</p>}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-orange-500 text-white rounded text-sm hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? editData
                    ? "Updating..."
                    : "Saving..."
                  : editData
                  ? "Update Teacher"
                  : "Add Teacher"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeacherForm;