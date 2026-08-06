import React, { useState } from "react";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { classroomService } from "../../../Services/Classroom";
import Select from "react-select";
import { RootState } from "../../../Store/store";
import { useSelector } from "react-redux";
import { getErrorMessage } from "../../../utils/getErrorMessage";

interface GuardianFormProps {
  onClose: () => void;
  onGuardianAdded: () => void;
}

interface OptionType {
  value: string;
  label: string;
}

const classroomSchema = z.object({
  name: z.string().trim().min(1, "Classroom name is required").min(2, "Classroom name must be at least 2 characters"),
  teacherId: z.string().min(1, "Please select a teacher"),
  capacity: z.string().min(1, "Capacity is required").regex(/^\d+$/, "Capacity must be a number"),
});

type ClassroomFormValues = z.infer<typeof classroomSchema>;

const defaultValues: ClassroomFormValues = {
  name: "",
  teacherId: "",
  capacity: "",
};

const ClassroomForm: React.FC<GuardianFormProps> = ({ onClose, onGuardianAdded }) => {
  const teachers = useSelector((state: RootState) => state.getTeacher.listRecords || []);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ClassroomFormValues>({
    resolver: zodResolver(classroomSchema),
    defaultValues,
    mode: "onBlur",
  });

  const teacherOptions: OptionType[] = teachers.map((teacher: any) => ({
    value: String(teacher?.teacherId ?? ""),
    label: `${teacher?.firstname ?? ""} ${teacher?.lastname ?? ""} (${teacher?.phone ?? ""})`,
  }));

  const getSelectedOption = (value: string | undefined, options: OptionType[]) => {
    return options.find((option) => option.value === value) || null;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const onSubmit = async (values: ClassroomFormValues) => {
    setLoading(true);
    setFormError("");

    const payload = {
      schoolId: localStorage.getItem("schoolId"),
      name: values.name.trim(),
      teacherId: values.teacherId,
      capacity: values.capacity,
    };

    try {
      const res = await classroomService.addClassroom(payload);
      toast.success("Classroom added!");
      onGuardianAdded();
      setTimeout(() => {
        onClose();
        reset(defaultValues);
        setImagePreview(null);
      }, 1500);
    } catch (err: any) {
      const msg = getErrorMessage(err);
      toast.error(msg);
      setFormError(msg);
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
          <h2 className="text-lg font-semibold mb-4 text-center">Add Classroom</h2>
          {formError && <p className="text-red-600 mb-4 text-center">{formError}</p>}
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="relative col-span-2 w-20 h-20 mx-auto mb-4 rounded-full bg-orange-100 border-2 border-orange-400 overflow-hidden cursor-pointer">
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              {imagePreview ? (
                <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <span className="flex items-center justify-center h-full text-orange-400 font-bold text-xl">
                  +
                </span>
              )}
            </label>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                placeholder="Name"
                className={`border px-3 py-2 rounded text-sm w-full ${errors.name ? "border-red-500" : ""}`}
                {...register("name")}
              />
              {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
              <input
                type="number"
                placeholder="Capacity"
                className={`border px-3 py-2 rounded text-sm w-full ${errors.capacity ? "border-red-500" : ""}`}
                {...register("capacity")}
              />
              {errors.capacity && <p className="text-red-600 text-xs mt-1">{errors.capacity.message}</p>}
            </div>

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
              {errors.teacherId && <p className="text-red-600 text-xs mt-1">{errors.teacherId.message}</p>}
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
                {loading ? "Saving…" : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClassroomForm;
