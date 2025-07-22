import React, { useState, useRef } from "react";

const AddStudentModal = ({ isOpen, onClose, onSave }) => {
  const initialForm = {
    schoolId: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    nationality: "",
    stateOfOrigin: "",
    gender: "",
    religion: "",
    email: "",
    username: "",
    class: "",
    dob: "",
  };

  const [form, setForm] = useState(initialForm);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const fileRef = useRef(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (file) => {
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleImageChange(e.dataTransfer.files[0]);
  };

  const resetForm = () => {
    setForm(initialForm);
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newStudent = {
      id: Date.now(),
      ...form,
      avatar: avatarPreview,
      guardianId: 10001,
      teacherId: 10001,
    };

    onSave?.(newStudent);
    resetForm();     // ✅ Clear form fields
    onClose?.();     // ✅ Close modal
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-4xl shadow-lg animate-fadeIn overflow-hidden">
        {/* Header */}
        <header className="bg-orange-600 text-white flex items-center justify-between px-4 py-3">
          <h2 className="flex-grow text-center font-semibold">Add Student</h2>
          <button
            aria-label="Close"
            className="text-2xl font-bold"
            onClick={() => {
              resetForm();
              onClose?.();
            }}
          >
            &times;
          </button>
        </header>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="p-6 max-h-[80vh] overflow-y-auto space-y-6"
        >
          {/* Avatar Upload */}
          <div
            className="flex justify-center"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <div
              className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer overflow-hidden shadow-inner relative"
              onClick={() => fileRef.current?.click()}
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="avatar preview"
                  className="object-cover w-full h-full"
                />
              ) : (
                <>
                  <span className="text-3xl text-gray-500">+</span>
                  <div className="absolute bottom-1 right-1 bg-orange-600 rounded-full p-1 shadow-md">
                    <i className="fas fa-camera text-white text-xs" />
                  </div>
                </>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileRef}
              className="hidden"
              onChange={(e) => handleImageChange(e.target.files[0])}
            />
          </div>

          {/* Grid Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "School ID", name: "schoolId" },
              { label: "First Name", name: "firstName" },
              { label: "Last Name", name: "lastName" },
              { label: "Phone Number", name: "phone", type: "tel" },
              { label: "Email", name: "email", type: "email" },
              { label: "Username", name: "username" },
              { label: "Home Address", name: "address" },
              { label: "Nationality", name: "nationality" },
              { label: "State of Origin", name: "stateOfOrigin" },
              { label: "Date of Birth", name: "dob", type: "date" },
              { label: "Class", name: "class" },
            ].map(({ label, name, type = "text" }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 text-sm"
                  required
                />
              </div>
            ))}

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-sm"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Religion */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Religion
              </label>
              <select
                name="religion"
                value={form.religion}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-sm"
                required
              >
                <option value="">Select Religion</option>
                <option value="Christianity">Christianity</option>
                <option value="Islam">Islam</option>
                <option value="Traditional">Traditional</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-orange-600 text-white font-semibold py-2 rounded-md shadow hover:bg-orange-700"
          >
            Save Student
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStudentModal;
