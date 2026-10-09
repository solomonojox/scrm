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

// Grouped for the sectioned layout; the schema and payload are untouched
const sections: { title: string; icon: string; fields: (keyof GuardianFormValues)[] }[] = [
  { title: "Identity", icon: "👤", fields: ["firstname", "lastname", "relationship"] },
  { title: "Contact", icon: "📞", fields: ["phone", "email", "username"] },
  { title: "Location", icon: "📍", fields: ["homeAddress", "workAddress", "nationality", "stateOfOrigin"] },
  { title: "Other Details", icon: "📋", fields: ["religion", "occupation", "nin", "bvn"] },
];

const fieldMeta: Record<
  keyof GuardianFormValues,
  { label: string; type: string; required?: boolean; span?: "full" }
> = {
  firstname: { label: "First Name", type: "text", required: true },
  lastname: { label: "Last Name", type: "text", required: true },
  relationship: { label: "Relationship", type: "text", required: true },
  phone: { label: "Phone Number", type: "tel", required: true },
  email: { label: "Email", type: "email" },
  username: { label: "Username", type: "text" },
  homeAddress: { label: "Home Address", type: "text", required: true, span: "full" },
  workAddress: { label: "Work Address", type: "text" },
  nationality: { label: "Nationality", type: "text", required: true },
  stateOfOrigin: { label: "State of Origin", type: "text", required: true },
  religion: { label: "Religion", type: "text", required: true },
  occupation: { label: "Occupation", type: "text" },
  nin: { label: "NIN", type: "text" },
  bvn: { label: "BVN", type: "text" },
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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, loading]);

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
        const res = await guardianService.update(editData.guardianId, payload);
        toast.success(res?.responseMessage || "Guardian updated successfully!");
        onGuardianAdded();
        setTimeout(() => {
          onClose();
          reset(defaultValues);
          setImagePreview(null);
        }, 1500);
      } else {
        const res = await guardianService.create(payload);
        toast.success(res?.responseMessage || "Guardian added!");
        onGuardianAdded();
        setTimeout(() => {
          onClose();
          reset(defaultValues);
          setImagePreview(null);
        }, 1500);
      }
    } catch (err: any) {
      const msg = getErrorMessage(err);
      setFormError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const initials =
    `${(document.querySelector<HTMLInputElement>('input[name="firstname"]')?.value || "").charAt(0)}` || "";

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
        aria-labelledby="guardian-form-title"
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
          <h2 id="guardian-form-title" className="text-xl font-semibold text-slate-900">
            {editData ? "Edit Guardian" : "Add Guardian"}
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">
            {editData ? "Update this guardian's information" : "Fill in the guardian's details below"}
          </p>
        </div>

        <div className="px-6 py-4 overflow-y-auto">
          {formError && (
            <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {formError}
            </p>
          )}

          <form id="guardian-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            {/* <div className="flex justify-center">
              <label className="relative w-20 h-20 overflow-hidden bg-orange-100 border-2 border-orange-300 border-dashed rounded-full cursor-pointer group">
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

            {sections.map((section) => (
              <div key={section.title}>
                <h3 className="flex items-center gap-2 mb-3 text-xs font-semibold tracking-wide text-orange-600 uppercase">
                  <span>{section.icon}</span>
                  {section.title}
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {section.fields.map((key) => {
                    const meta = fieldMeta[key];
                    return (
                      <div key={key} className={meta.span === "full" ? "sm:col-span-2" : "col-span-1"}>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          {meta.label}
                          {meta.required && <span className="ml-0.5 text-red-500">*</span>}
                        </label>
                        <input
                          type={meta.type}
                          placeholder={meta.label}
                          className={`w-full px-3 py-2 text-sm border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 ${
                            errors[key] ? "border-red-500" : "border-gray-300"
                          }`}
                          {...register(key)}
                        />
                        {errors[key] && (
                          <p className="mt-1 text-xs text-red-600">{errors[key]?.message}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </form>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-slate-50 border-slate-100 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 text-sm font-medium bg-white border rounded-lg text-slate-700 border-slate-200 hover:bg-slate-100 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="guardian-form"
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-lg shadow-sm bg-gradient-to-b from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 hover:shadow-md active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            {loading && (
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            )}
            {loading ? "Saving…" : editData ? "Update Guardian" : "Add Guardian"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuardianForm;