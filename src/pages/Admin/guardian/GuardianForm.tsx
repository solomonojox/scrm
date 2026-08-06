import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { guardianService } from "../../../Services/Guardian/guardian";

interface GuardianFormProps {
  onClose: () => void;
  onGuardianAdded: () => void;
  editData?: any;
}

const guardianSchema = z.object({
  firstname: z.string().trim().min(1, "First name is required").min(2, "First name must be at least 2 characters"),
  lastname: z.string().trim().min(1, "Last name is required").min(2, "Last name must be at least 2 characters"),
  phone: z.string().trim().min(1, "Phone number is required").regex(/^[0-9+\-\s()]{10,}$/, "Please enter a valid phone number"),
  homeAddress: z.string().trim().min(1, "Home address is required"),
  nationality: z.string().trim().min(1, "Nationality is required"),
  stateOfOrigin: z.string().trim().min(1, "State of origin is required"),
  religion: z.string().trim().min(1, "Religion is required"),
  email: z.string().trim().optional().or(z.literal("")),
  username: z.string().trim().optional().or(z.literal("")),
  occupation: z.string().trim().optional().or(z.literal("")),
  workAddress: z.string().trim().optional().or(z.literal("")),
  relationship: z.string().trim().min(1, "Relationship is required"),
  nin: z.string().trim().optional().or(z.literal("")),
  bvn: z.string().trim().optional().or(z.literal("")),
});

type GuardianFormValues = z.infer<typeof guardianSchema>;

const defaultValues: GuardianFormValues = {
  firstname: "",
  lastname: "",
  phone: "",
  homeAddress: "",
  nationality: "",
  stateOfOrigin: "",
  religion: "",
  email: "",
  username: "",
  occupation: "",
  workAddress: "",
  relationship: "",
  nin: "",
  bvn: "",
};

const GuardianForm: React.FC<GuardianFormProps> = ({ onClose, onGuardianAdded, editData }) => {
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GuardianFormValues>({
    resolver: zodResolver(guardianSchema),
    defaultValues,
    mode: "onBlur",
  });

  useEffect(() => {
    if (editData) {
      reset({
        firstname: editData.firstname || "",
        lastname: editData.lastname || "",
        phone: editData.phone || "",
        homeAddress: editData.homeAddress || "",
        nationality: editData.nationality || "",
        stateOfOrigin: editData.stateOfOrigin || "",
        religion: editData.religion || "",
        email: editData.email || "",
        username: editData.username || "",
        occupation: editData.occupation || "",
        workAddress: editData.workAddress || "",
        relationship: editData.relationship || "",
        nin: editData.nin ? String(editData.nin) : "",
        bvn: editData.bvn ? String(editData.bvn) : "",
      });
    } else {
      reset(defaultValues);
    }
  }, [editData, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const onSubmit = async (values: GuardianFormValues) => {
    setLoading(true);
    setFormError("");

    const payload = {
      schoolId: localStorage.getItem("schoolId") || "",
      firstname: values.firstname.trim(),
      lastname: values.lastname.trim(),
      relationship: values.relationship.trim(),
      phone: values.phone.trim(),
      occupation: values.occupation?.trim() || "",
      homeAddress: values.homeAddress.trim(),
      workAddress: values.workAddress?.trim() || "",
      stateOfOrigin: values.stateOfOrigin.trim(),
      nationality: values.nationality.trim(),
      religion: values.religion.trim(),
      email: values.email?.trim() || "",
      username: values.username?.trim() || "",
      nin: values.nin?.trim() || "",
      bvn: values.bvn?.trim() || "",
    };

    try {
      if (editData) {
        toast.info("Service unavailable. Please try again later.");
      } else {
        const res = await guardianService.create(payload);
        toast.success(res.responseMessage || "Guardian added!");
        onGuardianAdded();
        setTimeout(() => {
          onClose();
          reset(defaultValues);
          setImagePreview(null);
        }, 2000);
      }
    } catch (err: any) {
      const msg = getErrorMessage(err);
      setFormError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const fieldConfig = [
    { key: "firstname", label: "First Name", type: "text" as const },
    { key: "lastname", label: "Last Name", type: "text" as const },
    { key: "phone", label: "Phone Number", type: "tel" as const },
    { key: "homeAddress", label: "Home Address", type: "text" as const },
    { key: "nationality", label: "Nationality", type: "text" as const },
    { key: "stateOfOrigin", label: "State of Origin", type: "text" as const },
    { key: "religion", label: "Religion", type: "text" as const },
    { key: "email", label: "Email", type: "email" as const },
    { key: "username", label: "Username", type: "text" as const },
    { key: "occupation", label: "Occupation", type: "text" as const },
    { key: "workAddress", label: "Work Address", type: "text" as const },
    { key: "relationship", label: "Relationship", type: "text" as const },
    { key: "nin", label: "NIN", type: "text" as const },
    { key: "bvn", label: "BVN", type: "text" as const },
  ] as const;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
      <div
        className="bg-white rounded-lg w-full max-w-md sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-orange-500 h-2 rounded-t-lg" />
        <div className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4 text-center">{editData ? "Edit Guardian" : "Add Guardian"}</h2>
          {formError && <p className="text-red-600 mb-4 text-center">{formError}</p>}
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <span className="flex items-center justify-center h-full text-orange-400 font-bold text-xl">+</span>
              )}
            </label>
            {fieldConfig.map(({ key, label, type }) => (
              <div key={key} className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                  type={type}
                  placeholder={label}
                  className={`border px-3 py-2 rounded text-sm w-full ${errors[key] ? "border-red-500" : ""}`}
                  {...register(key)}
                />
                {errors[key] && <p className="text-red-600 text-xs mt-1">{errors[key]?.message}</p>}
              </div>
            ))}
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
                {loading ? "Saving…" : editData ? "Update" : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GuardianForm;