import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { teacherService } from "../../../Services/Teachers/TeacherService";
import { useAuth } from "../../../Context/Auth/useAuth";

interface TeacherFormProps {
  onClose: () => void;
  onSubmitSuccess: () => void;
  editData: any;
}

const TeacherForm: React.FC<TeacherFormProps> = ({ onClose, onSubmitSuccess, editData }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    nationality: "",
    state: "",
    religion: "",
    email: "",
    username: "",
  });

  // Set initial form data when editData changes
  useEffect(() => {
    if (editData) {
      setFormData({
        firstName: editData.firstname || "",
        lastName: editData.lastname || "",
        phone: editData.phone || "",
        address: editData.homeAddress || "",
        nationality: editData.nationality || "",
        state: editData.stateOfOrigin || "",
        religion: editData.religion || "",
        email: editData.email || "",
        username: editData.username || "",
      });
      if (editData.imageUrl) {
        setImagePreview(editData.imageUrl);
      }
    }
  }, [editData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error("Image size should be less than 2MB");
        return;
      }
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName) {
      setFormError("First name and last name are required");
      return false;
    }
    if (!formData.phone) {
      setFormError("Phone number is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setFormError("");

    const payload = {
      schoolId: user?.schoolId,
      firstname: formData.firstName.trim(),
      lastname: formData.lastName.trim(),
      phone: formData.phone.trim(),
      homeAddress: formData.address.trim(),
      nationality: formData.nationality.trim(),
      stateOfOrigin: formData.state.trim(),
      religion: formData.religion.trim(),
      email: formData.email.trim(),
      username: formData.username.trim(),
    };

    try {
      if (editData) {
        await teacherService.update(editData.teacherId, payload);
        toast.success("Teacher updated successfully!");
      } else {
        const res = await teacherService.create(payload);
        console.log(res)
        toast.success("Teacher added successfully!");
      }

      onSubmitSuccess();
      if (!editData) {
        setFormData({
          firstName: "",
          lastName: "",
          phone: "",
          address: "",
          nationality: "",
          state: "",
          religion: "",
          email: "",
          username: "",
        });
        setImagePreview(null);
      }
    } catch (err: any) {
      const msg = err.response?.data?.responseMessage ||
        (editData ? "Update failed" : "Submission failed");
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
          <h2 className="text-lg font-semibold mb-4 text-center">
            {editData ? "Edit Teacher" : "Add Teacher"}
          </h2>
          {formError && <p className="text-red-600 mb-4 text-center">{formError}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="relative col-span-2 w-20 h-20 mx-auto mb-4 rounded-full bg-orange-100 border-2 border-orange-400 overflow-hidden cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="flex items-center justify-center h-full text-orange-400 font-bold text-xl">
                    +
                  </span>
                )}
              </label>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name*</label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  required
                  className="border px-3 py-2 rounded text-sm w-full"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name*</label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  required
                  className="border px-3 py-2 rounded text-sm w-full"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number*</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  required
                  className="border px-3 py-2 rounded text-sm w-full"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="border px-3 py-2 rounded text-sm w-full"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  className="border px-3 py-2 rounded text-sm w-full"
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Home Address</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Home Address"
                  className="border px-3 py-2 rounded text-sm w-full"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                <input
                  type="text"
                  name="nationality"
                  placeholder="Nationality"
                  className="border px-3 py-2 rounded text-sm w-full"
                  value={formData.nationality}
                  onChange={handleInputChange}
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">State of Origin</label>
                <input
                  type="text"
                  name="state"
                  placeholder="State of Origin"
                  className="border px-3 py-2 rounded text-sm w-full"
                  value={formData.state}
                  onChange={handleInputChange}
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
                <input
                  type="text"
                  name="religion"
                  placeholder="Religion"
                  className="border px-3 py-2 rounded text-sm w-full"
                  value={formData.religion}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="col-span-2 flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded text-sm hover:bg-gray-100"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-orange-500 text-white rounded text-sm hover:bg-orange-600 disabled:opacity-50"
              >
                {loading ? (
                  editData ? "Updating..." : "Saving..."
                ) : (
                  editData ? "Update" : "Submit"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeacherForm;