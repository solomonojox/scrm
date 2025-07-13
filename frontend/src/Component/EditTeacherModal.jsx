import React, { useState, useRef } from "react";

/**
 * AddTeacherModal – modal dialog for creating a new teacher.
 *
 * Props:
 *  - isOpen   (boolean)  : controls visibility
 *  - onClose  (function) : called when modal should close
 *  - onSave   (function) : called with the new teacher object on submit
 */
const AddTeacherModal = ({ isOpen, onClose, onSave }) => {
  const [form, setForm] = useState({
    schoolId: "", // staff ID / school ID
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    username: "",
    address: "",
    nationality: "",
    origin: "", // state of origin
    gender: "",
    religion: "",
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const fileRef = useRef(null);

  /* ----------------------------- handlers ------------------------------ */
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImageChange = (file) => {
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleImageChange(e.dataTransfer.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    /* ------------------------------------------------------------------ */
    // Build teacher object; fall back to Date.now() for unique ID
    const newTeacher = {
      id: form.schoolId || Date.now(),
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
      address: form.address,
      nationality: form.nationality,
      origin: form.origin,
      gender: form.gender,
      religion: form.religion,
      email: form.email,
      username: form.username,
      avatar: avatarPreview ||
        "https://ui-avatars.com/api/?name=" +
          encodeURIComponent(`${form.firstName}+${form.lastName}`),
    };

    // 🚀 Pass the data up
    onSave?.(newTeacher);

    // Optionally: upload avatarFile here before calling onSave
    // e.g., await uploadAvatar(avatarFile);

    onClose?.();
  };

  if (!isOpen) return null;

  /* --------------------------- modal markup --------------------------- */
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-2xl shadow-lg animate-fadeIn overflow-hidden">
        {/* Header */}
        <header className="bg-orange-600 text-white flex items-center justify-between px-4 py-3">
          <h2 className="flex-grow text-center font-semibold">Edit Teacher</h2>
          <button aria-label="Close" className="text-2xl font-bold" onClick={onClose}>
            &times;
          </button>
        </header>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-4 max-h-[75vh] overflow-y-auto space-y-4">
          {/* Avatar upload */}
          <div
            className="flex justify-center mb-6 relative"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <div
              className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer overflow-hidden shadow-inner relative"
              onClick={() => fileRef.current?.click()}
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="avatar preview" className="object-cover w-full h-full" />
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

          {/* Text fields */}
          {[
            { label: "School ID", name: "schoolId" },
            { label: "First Name", name: "firstName" },
            { label: "Last Name", name: "lastName" },
            { label: "Phone Number", name: "phone", type: "tel" },
            { label: "Email", name: "email", type: "email" },
            { label: "Username", name: "username" },
            { label: "Home Address", name: "address" },
            { label: "Nationality", name: "nationality" },
            { label: "State of Origin", name: "origin" },
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
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

          {/* Submit */}
          <button type="submit" className="w-full bg-orange-600 text-white font-semibold py-2 rounded-md shadow hover:bg-orange-700">
            Save Teacher
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTeacherModal;
