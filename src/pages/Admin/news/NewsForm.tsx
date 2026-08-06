import React, { useState } from "react";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { newsService } from "../../../Services/News";

interface NewsFormProps {
  onClose: () => void;
  onNewsAdded: () => void;
}

const newsSchema = z.object({
  title: z.string().trim().min(1, "Title is required").min(3, "Title must be at least 3 characters"),
  content: z.string().trim().min(1, "Content is required").min(10, "Content must be at least 10 characters"),
});

type NewsFormValues = z.infer<typeof newsSchema>;

const defaultValues: NewsFormValues = {
  title: "",
  content: "",
};

const NewsForm: React.FC<NewsFormProps> = ({ onClose, onNewsAdded }) => {
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsFormValues>({
    resolver: zodResolver(newsSchema),
    defaultValues,
    mode: "onBlur",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const onSubmit = async (values: NewsFormValues) => {
    setLoading(true);
    setFormError("");

    const payload = {
      title: values.title.trim(),
      content: values.content.trim(),
    };

    try {
      const res = await newsService.addNews(payload);
      toast.success((res as any)?.responseMessage || "News added!");
      onNewsAdded();
      setTimeout(() => {
        onClose();
        reset(defaultValues);
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
          <h2 className="text-lg font-semibold mb-4 text-center">Add News</h2>
          {formError && <p className="text-red-600 mb-4 text-center">{formError}</p>}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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

            {/* Title field */}
            <div className="flex flex-col">
              <label htmlFor="title" className="text-sm font-medium mb-2">
                Title
              </label>
              <input
                id="title"
                type="text"
                placeholder="Title"
                className={`border px-3 py-3 rounded text-sm w-full ${errors.title ? "border-red-500" : ""}`}
                {...register("title")}
              />
              {errors.title && <p className="text-red-600 text-xs mt-1">{errors.title.message}</p>}
            </div>

            {/* Content field (full width) */}
            <div className="flex flex-col">
              <label htmlFor="content" className="text-sm font-medium mb-2">
                Content
              </label>
              <textarea
                id="content"
                placeholder="Enter your content..."
                className={`border px-3 py-2 rounded text-sm w-full resize-none min-h-30 ${errors.content ? "border-red-500" : ""}`}
                {...register("content")}
              />
              {errors.content && <p className="text-red-600 text-xs mt-1">{errors.content.message}</p>}
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-3 mt-4">
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

export default NewsForm;
