import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../../../Context/Auth/useAuth";
import { RootState } from "../../../Store/store";
import { useSelector } from "react-redux";
import { sessionTermService } from "../../../Services/SessionTerm";

interface SessionTermFormProps {
  onClose: () => void;
  onSessionAdded: () => void;
  editData?: any;
}

interface OptionType {
  value: string | number | undefined;
  label: string;
}

const sessionTermSchema = z
  .object({
    sessionKey: z.string().min(1, "Please select a session"),
    termName: z.string().min(1, "Please select a term"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
  })
  .refine((data) => !data.startDate || !data.endDate || new Date(data.endDate) >= new Date(data.startDate), {
    message: "End date must be on or after start date",
    path: ["endDate"],
  });

type SessionTermFormValues = z.infer<typeof sessionTermSchema>;

const defaultValues: SessionTermFormValues = {
  sessionKey: "",
  termName: "",
  startDate: "",
  endDate: "",
};

const SessionTermForm: React.FC<SessionTermFormProps> = ({ onClose, onSessionAdded, editData }) => {
  const { user } = useAuth();
  const sessions = useSelector((state: RootState) => state.getSession.listRecords || []);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SessionTermFormValues>({
    resolver: zodResolver(sessionTermSchema),
    defaultValues,
    mode: "onBlur",
  });

  const sessionOptions: OptionType[] = sessions.map((session: any) => ({
    value: session?.sessionKey,
    label: session?.sessionId,
  }));

  const getSelectedOption = (value: string | number | undefined, options: OptionType[]) => {
    return options.find((option) => option.value === value) || null;
  };

  const termNameOptions = [
    { value: "First Term", label: "First Term" },
    { value: "Second Term", label: "Second Term" },
    { value: "Third Term", label: "Third Term" },
  ];

  useEffect(() => {
    if (editData) {
      reset({
        sessionKey: editData.sessionKey || "",
        termName: editData.termName || "",
        startDate: editData.startDate ? editData.startDate.split("T")[0] : "",
        endDate: editData.endDate ? editData.endDate.split("T")[0] : "",
      });
    } else {
      reset(defaultValues);
    }
  }, [editData, reset]);

  const onSubmit = async (values: SessionTermFormValues) => {
    setLoading(true);
    setFormError("");

    const payload = {
      schoolId: user?.schoolId,
      sessionKey: values.sessionKey,
      termName: values.termName,
      startDate: new Date(values.startDate).toISOString(),
      endDate: new Date(values.endDate).toISOString(),
    };

    try {
      if (editData) {
        toast.success("Term updated successfully!");
      } else {
        await sessionTermService.addSessionTerm(payload);
        toast.success("Term added successfully!");
      }
      onSessionAdded();
      setTimeout(() => {
        onClose();
        reset(defaultValues);
      }, 1500);
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
          <h2 className="text-lg font-semibold mb-4 text-center">{editData ? "Edit Term" : "Add Term"}</h2>
          {formError && <p className="text-red-600 mb-4 text-center">{formError}</p>}
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Session*</label>
              <Controller
                name="sessionKey"
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
              {errors.sessionKey && <p className="text-red-600 text-xs mt-1">{errors.sessionKey.message}</p>}
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Term*</label>
              <Controller
                name="termName"
                control={control}
                render={({ field }) => (
                  <Select
                    options={termNameOptions}
                    value={termNameOptions.find((option) => option.value === field.value) || null}
                    onChange={(selected) => field.onChange(selected ? selected.value : "")}
                    placeholder="Select Term"
                    className="text-sm"
                    isSearchable
                  />
                )}
              />
              {errors.termName && <p className="text-red-600 text-xs mt-1">{errors.termName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <input
                    type="date"
                    className={`border px-3 py-2 rounded text-sm w-full ${errors.startDate ? "border-red-500" : ""}`}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.startDate && <p className="text-red-600 text-xs mt-1">{errors.startDate.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <input
                    type="date"
                    className={`border px-3 py-2 rounded text-sm w-full ${errors.endDate ? "border-red-500" : ""}`}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
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

export default SessionTermForm;
