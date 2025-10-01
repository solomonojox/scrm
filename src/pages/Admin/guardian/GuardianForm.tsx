import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { guardianService } from "../../../Services/Guardian/guardian";
import { useAuth } from "../../../Context/Auth/useAuth";

interface GuardianFormProps {
  onClose: () => void;
  onGuardianAdded: () => void;
  editData?: any;
}

const GuardianForm: React.FC<GuardianFormProps> = ({ onClose, onGuardianAdded, editData }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
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
  });

  // Prefill form when editing
  useEffect(() => {
    if (editData) {
      setFormData({
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
      });
      if (editData.imageUrl) {
        setImagePreview(editData.imageUrl);
      }
    } else {
      setFormData({
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
      });
      setImagePreview(null);
    }
  }, [editData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    if (!formData.firstname || !formData.lastname) {
      setFormError("First name and last name are required");
      return false;
    }
    if (!formData.phone) {
      setFormError("Phone number is required");
      return false;
    }
    const phoneRegex = /^[0-9+\-\s()]{10,}$/;
    if (!phoneRegex.test(formData.phone)) {
      setFormError("Please enter a valid phone number");
      return false;
    }
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setFormError("Please enter a valid email address");
        return false;
      }
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
      firstname: formData.firstname.trim(),
      lastname: formData.lastname.trim(),
      phone: formData.phone.trim(),
      homeAddress: formData.homeAddress.trim(),
      nationality: formData.nationality.trim(),
      stateOfOrigin: formData.stateOfOrigin.trim(),
      religion: formData.religion.trim(),
      email: formData.email.trim(),
      username: formData.username.trim(),
      occupation: formData.occupation.trim(),
      workAddress: formData.workAddress.trim(),
      relationship: formData.relationship.trim(),
    };

    try {
      if (editData) {
        await guardianService.update(editData.guardianId, payload);
        toast.success("Guardian updated successfully!");
      } else {
        const res = await guardianService.create(payload);
        toast.success(res.responseMessage || "Guardian added successfully!");
      }

      onGuardianAdded();

      if (!editData) {
        setFormData({
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
        });
        setImagePreview(null);
      }

      setTimeout(() => onClose(), 1500);
    } catch (err: any) {
      const msg = err.response?.data?.responseMessage || (editData ? "Update failed" : "Submission failed");
      setFormError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4">
      <div
        className="bg-white rounded-lg w-full max-w-md sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-orange-500 h-2 rounded-t-lg" />
        <div className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center text-gray-800">
            {editData ? "Edit Guardian" : "Add Guardian"}
          </h2>
          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4 text-center text-sm">
              {formError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Avatar Upload */}
              <label className="relative col-span-2 w-20 h-20 mx-auto mb-4 rounded-full bg-orange-100 border-2 border-orange-400 overflow-hidden cursor-pointer hover:border-orange-500 transition-colors">
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                {imagePreview ? (
                  <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="flex items-center justify-center h-full text-orange-400 font-bold text-xl">
                    +
                  </span>
                )}
              </label>

              {[
                ["firstname", "First Name", "text"],
                ["lastname", "Last Name", "text"],
                ["phone", "Phone Number", "tel"],
                ["email", "Email", "email"],
                ["username", "Username", "text"],
                ["homeAddress", "Home Address", "text"],
                ["nationality", "Nationality", "text"],
                ["stateOfOrigin", "State of Origin", "text"],
                ["religion", "Religion", "text"],
                ["occupation", "Occupation", "text"],
                ["workAddress", "Work Address", "text"],
                ["relationship", "Relationship", "text"],
              ].map(([key, label, type]) => (
                <div key={key} className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                  </label>
                  <input
                    type={type}
                    name={key}
                    placeholder={`Enter ${label}`}
                    className="border border-gray-300 px-3 py-2 rounded text-sm w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    value={formData[key as keyof typeof formData]}
                    onChange={handleInputChange}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-orange-500 text-white rounded text-sm hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (editData ? "Updating..." : "Saving...") : editData ? "Update Guardian" : "Add Guardian"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GuardianForm;
