import React, { useState } from "react";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { eventsService } from "../../../Services/Events";
import Select from "react-select";

interface EventFormProps {
  onClose: () => void;
  onEventAdded: () => void;
}

interface OptionType {
  value: string;
  label: string;
}

// Event type options
const eventTypeOptions: OptionType[] = [
  { value: "Events", label: "Events" },
  { value: "Academics", label: "Academics" },
  { value: "Examination", label: "Examination" },
  { value: "Fees", label: "Fees" },
  { value: "sports", label: "sports" },
  { value: "Other", label: "Other" },
];

const eventSchema = z.object({
  title: z.string().trim().min(1, "Event title is required").min(3, "Event title must be at least 3 characters"),
  description: z.string().trim().min(1, "Description is required").min(10, "Description must be at least 10 characters"),
  venue: z.string().trim().min(1, "Venue is required"),
  date: z.string().min(1, "Event date is required"),
  time: z.string().min(1, "Event time is required"),
  type: z.string().min(1, "Please select an event type"),
});

type EventFormValues = z.infer<typeof eventSchema>;

const defaultValues: EventFormValues = {
  title: "",
  description: "",
  venue: "",
  date: "",
  time: "",
  type: "",
};

const EventForm: React.FC<EventFormProps> = ({ onClose, onEventAdded }) => {
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues,
    mode: "onBlur",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const getSelectedOption = (value: string, options: OptionType[]) => {
    return options.find((option) => option.value === value) || null;
  };

  const onSubmit = async (values: EventFormValues) => {
    setLoading(true);
    setFormError("");

    const payload = {
      eventTitle: values.title.trim(),
      eventDescription: values.description.trim(),
      eventVenue: values.venue.trim(),
      eventDate: values.date,
      eventTime: values.time,
      eventType: values.type,
    };

    try {
      const res = await eventsService.addEvent(payload);
      toast.success((res as any)?.responseMessage || "Event added!");
      onEventAdded();
      setTimeout(() => {
        onClose();
        reset(defaultValues);
        setImagePreview(null);
      }, 2000);
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
          <h2 className="text-lg font-semibold mb-4 text-center">Add Event</h2>
          {formError && <p className="text-red-600 mb-4 text-center">{formError}</p>}
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4">
            {/* Avatar upload */}
            <label className="relative w-20 h-20 mx-auto mb-4 rounded-full bg-orange-100 border-2 border-orange-400 overflow-hidden cursor-pointer">
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              {imagePreview ? (
                <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <span className="flex items-center justify-center h-full text-orange-400 font-bold text-xl">
                  +
                </span>
              )}
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div className="flex flex-col md:col-span-2">
                <label htmlFor="title" className="text-sm font-medium mb-2">
                  Event Title
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="Enter event title"
                  className={`border px-3 py-2 rounded text-sm ${errors.title ? "border-red-500" : ""}`}
                  {...register("title")}
                />
                {errors.title && <p className="text-red-600 text-xs mt-1">{errors.title.message}</p>}
              </div>

              {/* Venue */}
              <div className="flex flex-col">
                <label htmlFor="venue" className="text-sm font-medium mb-2">
                  Event Venue
                </label>
                <input
                  id="venue"
                  type="text"
                  placeholder="Enter event venue"
                  className={`border px-3 py-2 rounded text-sm ${errors.venue ? "border-red-500" : ""}`}
                  {...register("venue")}
                />
                {errors.venue && <p className="text-red-600 text-xs mt-1">{errors.venue.message}</p>}
              </div>

              {/* Date */}
              <div className="flex flex-col">
                <label htmlFor="date" className="text-sm font-medium mb-2">
                  Event Date
                </label>
                <input
                  id="date"
                  type="date"
                  className={`border px-3 py-2 rounded text-sm ${errors.date ? "border-red-500" : ""}`}
                  {...register("date")}
                />
                {errors.date && <p className="text-red-600 text-xs mt-1">{errors.date.message}</p>}
              </div>

              {/* Time */}
              <div className="flex flex-col">
                <label htmlFor="time" className="text-sm font-medium mb-2">
                  Event Time
                </label>
                <input
                  id="time"
                  type="time"
                  className={`border px-3 py-2 rounded text-sm ${errors.time ? "border-red-500" : ""}`}
                  {...register("time")}
                />
                {errors.time && <p className="text-red-600 text-xs mt-1">{errors.time.message}</p>}
              </div>

              {/* Type (Select) */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={eventTypeOptions}
                      value={getSelectedOption(field.value, eventTypeOptions)}
                      onChange={(selected) => field.onChange(selected ? selected.value : "")}
                      placeholder="Select event type"
                      className="text-sm"
                      isSearchable
                    />
                  )}
                />
                {errors.type && <p className="text-red-600 text-xs mt-1">{errors.type.message}</p>}
              </div>

              {/* Description */}
              <div className="flex flex-col md:col-span-2">
                <label htmlFor="description" className="text-sm font-medium mb-2">
                  Event Description
                </label>
                <textarea
                  id="description"
                  placeholder="Enter event description"
                  className={`border px-3 py-2 rounded text-sm resize-none ${errors.description ? "border-red-500" : ""}`}
                  rows={3}
                  {...register("description")}
                />
                {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description.message}</p>}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-2">
              <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
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

export default EventForm;
