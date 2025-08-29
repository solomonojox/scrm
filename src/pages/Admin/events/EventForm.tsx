import React, { useState } from "react";
import { toast } from "react-toastify";
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

const EventForm: React.FC<EventFormProps> = ({ onClose, onEventAdded }) => {
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    venue: "",
    date: "",
    time: "",
    type: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const getSelectedOption = (value: string, options: OptionType[]) => {
    return options.find((option) => option.value === value) || null;
  };

  const handleSelectChange = (name: string, selectedOption: OptionType | null) => {
    setFormData((prev) => ({
      ...prev,
      [name]: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError("");

    const payload = {
      eventTitle: formData.title,
      eventDescription: formData.description,
      eventVenue: formData.venue,
      eventDate: formData.date,
      eventTime: formData.time,
      eventType: formData.type,
    };

    try {
      const res = await eventsService.addEvent(payload);
      toast.success(res.responseMessage || "Event added!");
      onEventAdded();
      setTimeout(() => {
        onClose();
        setFormData({
          title: "",
          description: "",
          venue: "",
          date: "",
          time: "",
          type: "",
        });
        setImagePreview(null);
      }, 2000);
    } catch (err: any) {
      const msg = err.response?.data?.responseMessage || "Submission failed";
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
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
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
                  name="title"
                  placeholder="Enter event title"
                  required
                  className="border px-3 py-2 rounded text-sm"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>

              {/* Venue */}
              <div className="flex flex-col">
                <label htmlFor="venue" className="text-sm font-medium mb-2">
                  Event Venue
                </label>
                <input
                  id="venue"
                  type="text"
                  name="venue"
                  placeholder="Enter event venue"
                  required
                  className="border px-3 py-2 rounded text-sm"
                  value={formData.venue}
                  onChange={handleInputChange}
                />
              </div>

              {/* Date */}
              <div className="flex flex-col">
                <label htmlFor="date" className="text-sm font-medium mb-2">
                  Event Date
                </label>
                <input
                  id="date"
                  type="date"
                  name="date"
                  required
                  className="border px-3 py-2 rounded text-sm"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>

              {/* Time */}
              <div className="flex flex-col">
                <label htmlFor="time" className="text-sm font-medium mb-2">
                  Event Time
                </label>
                <input
                  id="time"
                  type="time"
                  name="time"
                  required
                  className="border px-3 py-2 rounded text-sm"
                  value={formData.time}
                  onChange={handleInputChange}
                />
              </div>

              {/* Type (Select) */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                <Select
                  options={eventTypeOptions}
                  value={getSelectedOption(formData.type, eventTypeOptions)}
                  onChange={(selected) => handleSelectChange("type", selected)}
                  placeholder="Select event type"
                  className="text-sm"
                  isSearchable
                />
              </div>

              {/* Description */}
              <div className="flex flex-col md:col-span-2">
                <label htmlFor="description" className="text-sm font-medium mb-2">
                  Event Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Enter event description"
                  required
                  className="border px-3 py-2 rounded text-sm resize-none"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                />
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
