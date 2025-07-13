// src/components/EditStudentModal.jsx
import React, { useState, useRef, useEffect } from "react";

const EditStudentModal = ({ isOpen, onClose, student = {}, onSave }) => {
  /* ---------- local state pre‑filled with student data ---------- */
  const [form, setForm] = useState({
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
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const fileRef = useRef(null);

  /* ---------- populate state when modal opens ---------- */
  useEffect(() => {
    if (isOpen && student) {
      setForm({
        schoolId: student.schoolId ?? "",
        firstName: student.firstName ?? "",
        lastName: student.lastName ?? "",
        phone: student.phone ?? "",
        address: student.address ?? "",
        nationality: student.nationality ?? "",
        stateOfOrigin: student.stateOfOrigin ?? "",
        gender: student.gender ?? "",
        religion: student.religion ?? "",
        email: student.email ?? "",
        username: student.username ?? "",
      });
      setAvatarPreview(student.avatar ?? null);
      setAvatarFile(null);
    }
  }, [isOpen, student]);

  /* ---------- handlers ---------- */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (file) => {
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = { ...student, ...form, avatarFile };
    onSave?.(updated);   // ⬅️ send back to parent
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-2xl shadow-lg animate-fadeIn overflow-hidden">
        {/* Header */}
        <header className="bg-orange-600 text-white flex items-center justify-between px-4 py-3">
          <h2 className="flex-grow text-center font-semibold">Edit Student</h2>
          <button aria-label="Close" className="text-2xl font-bold" onClick={onClose}>
            &times;
          </button>
        </header>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-4 max-h-[75vh] overflow-y-auto space-y-4">
          {/* Avatar */}
          <div
            className="flex justify-center mb-6 relative"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleImageChange(e.dataTransfer.files[0]);
            }}
          >
            <div
              className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer overflow-hidden shadow-inner relative"
              onClick={() => fileRef.current?.click()}
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="avatar" className="object-cover w-full h-full" />
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

          {/* Text inputs */}
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

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-orange-600 text-white font-semibold py-2 rounded-md shadow hover:bg-orange-700"
          >
            Update Student
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditStudentModal;
