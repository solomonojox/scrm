import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { sessionService } from "../../../Services/Session";
import { useAuth } from "../../../Context/Auth/useAuth";

interface SessionFormProps {
  onClose: () => void;
  onSessionAdded: () => void;
  editData?: any;
}

const sessionSchema = z
  .object({
    sessionId: z.string().trim().min(1, "Session ID is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
  })
  .refine((data) => !data.startDate || !data.endDate || new Date(data.endDate) >= new Date(data.startDate), {
    message: "End date must be on or after start date",
    path: ["endDate"],
  });

type SessionFormValues = z.infer<typeof sessionSchema>;

const defaultValues: SessionFormValues = {
  sessionId: "",
  startDate: "",
  endDate: "",
};

const SessionForm: React.FC<SessionFormProps> = ({ onClose, onSessionAdded, editData }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SessionFormValues>({
    resolver: zodResolver(sessionSchema),
    defaultValues,
    mode: "onBlur",
  });

  useEffect(() => {
    if (editData) {
      reset({
        sessionId: editData.sessionId || "",
        startDate: editData.startDate ? editData.startDate.split("T")[0] : "",
        endDate: editData.endDate ? editData.endDate.split("T")[0] : "",
      });
    } else {
      reset(defaultValues);
    }
  }, [editData, reset]);

  const onSubmit = async (values: SessionFormValues) => {
    setLoading(true);
    setFormError("");

    const payload = {
      schoolId: user?.schoolId,
      sessionId: values.sessionId.trim(),
      startDate: new Date(values.startDate).toISOString(),
      endDate: new Date(values.endDate).toISOString(),
    };

    try {
      if (editData) {
        toast.info("Edit service unavailable. Please try again later.");
      } else {
        const res = await sessionService.addSession(payload);
        toast.success(res.responseMessage || "Session added successfully!");
        onSessionAdded();
        setTimeout(() => {
          onClose();
          reset(defaultValues);
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

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
      <div
        className="bg-white rounded-lg w-full max-w-md sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-orange-500 h-2 rounded-t-lg" />
        <div className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4 text-center">{editData ? "Edit Session" : "Add Session"}</h2>
          {formError && <p className="text-red-600 mb-4 text-center">{formError}</p>}
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Session ID</label>
              <input
                type="text"
                placeholder="Session ID eg. 2023/2024"
                className={`border px-3 py-2 rounded text-sm w-full ${errors.sessionId ? "border-red-500" : ""}`}
                {...register("sessionId")}
              />
              {errors.sessionId && <p className="text-red-600 text-xs mt-1">{errors.sessionId.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                className={`border px-3 py-2 rounded text-sm w-full ${errors.startDate ? "border-red-500" : ""}`}
                {...register("startDate")}
              />
              {errors.startDate && <p className="text-red-600 text-xs mt-1">{errors.startDate.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                className={`border px-3 py-2 rounded text-sm w-full ${errors.endDate ? "border-red-500" : ""}`}
                {...register("endDate")}
              />
              {errors.endDate && <p className="text-red-600 text-xs mt-1">{errors.endDate.message}</p>}
            </div>

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

export default SessionForm;