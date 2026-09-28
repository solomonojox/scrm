import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../../../Context/Auth/useAuth";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { subjectTeacherService } from "../../../Services/Teachers/subject/subjectTeacher";

interface AddSubjectModalProps {
  schoolId: string;
  classroomId: string;
  classroomName: string;
  onClose: () => void;
  onAdded: () => void;
}

const subjectSchema = z.object({
  subjectName: z.string().trim().min(2, "Subject name must be at least 2 characters"),
  description: z.string().trim().optional(),
});

type SubjectFormValues = z.infer<typeof subjectSchema>;

const AddSubjectModal: React.FC<AddSubjectModalProps> = ({
  schoolId,
  classroomId,
  classroomName,
  onClose,
  onAdded,
}) => {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectSchema),
    defaultValues: { subjectName: "", description: "" },
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, submitting]);

  const onSubmit = async (values: SubjectFormValues) => {
    // user.id = teacher's nameidentifier claim, user.termId = active session term
    if (!user?.id || !user?.termId) {
      const msg = "Could not read your session details. Please log in again.";
      setFormError(msg);
      toast.error(msg);
      return;
    }

    setSubmitting(true);
    setFormError("");
    try {
      await subjectTeacherService.add({
        schoolId,
        classroomId,
        teacherId: user.id,
        sessionTermId: user.termId,
        subjectName: values.subjectName.trim(),
        description: values.description?.trim() || "No description",
      });
      toast.success("Subject added!");
      onAdded();
      onClose();
    } catch (err) {
      const msg = getErrorMessage(err);
      setFormError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={() => !submitting && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-subject-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md overflow-hidden bg-white shadow-2xl rounded-2xl ring-1 ring-black/5"
      >
        <div className="h-1.5 w-full bg-linear-to-r from-orange-500 to-amber-400" />

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="px-6 pt-6 pb-2">
            <h2 id="add-subject-title" className="text-xl font-semibold text-slate-900">
              Add Subject
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              New subject for <span className="font-medium text-orange-600">{classroomName}</span>
            </p>

            {formError && (
              <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {formError}
              </p>
            )}

            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject name
                </label>
                <input
                  type="text"
                  autoFocus
                  placeholder="e.g. Mathematics"
                  className={`w-full border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 ${
                    errors.subjectName ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("subjectName")}
                />
                {errors.subjectName && (
                  <p className="text-red-600 text-xs mt-1">{errors.subjectName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Short description"
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-300"
                  {...register("description")}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 px-6 py-4 mt-4 border-t bg-slate-50 border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium bg-white border rounded-lg text-slate-700 hover:bg-slate-100 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-60"
            >
              {submitting ? "Saving…" : "Add Subject"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubjectModal;