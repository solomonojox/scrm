import React, { useState } from "react";
import { FaCamera } from "react-icons/fa";

const AddStudentModal = ({ isOpen, onClose, onSave }) => {
  const initialForm = {
    schoolId: "",
    firstname: "",
    lastname: "",
    enteredClass: 0,
    dateOfBirth: "",
    homeAddress: "",
    guardianId: "",
    teacherId: "",
    currentTerm: 0,
    sessionId: "",
    classroomId: "",
    gender: "",
    avatar: null,
  };

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar") {
      setForm({ ...form, avatar: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const payload = {
        schoolId: form.schoolId,
        firstname: form.firstname,
        lastname: form.lastname,
        enteredClass: parseInt(form.enteredClass, 10),
        currentTerm: parseInt(form.currentTerm, 10),
        dateOfBirth: new Date(form.dateOfBirth).toISOString(),
        homeAddress: form.homeAddress,
        guardianId: form.guardianId,
        teacherId: form.teacherId,
        sessionId: form.sessionId,
        classroomId: form.classroomId,
        gender: form.gender,
      };

      const res = await fetch(
        "https://scrmapi.tranquility.org.ng/api/Student/AddStudent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Failed to add student");
      }

      const newStudent = await res.json();

      if (form.avatar) {
        const imageForm = new FormData();
        imageForm.append("file", form.avatar);

        const uploadRes = await fetch(
          `https://scrmapi.tranquility.org.ng/api/Student/UploadImage/${newStudent.id}`,
          {
            method: "POST",
            body: imageForm,
          }
        );

        if (!uploadRes.ok) {
          const errText = await uploadRes.text();
          console.warn("Image upload failed:", errText);
        } else {
          const upd = await uploadRes.json();
          newStudent.avatar = upd.avatar ?? newStudent.avatar;
        }
      }

      onSave?.(newStudent);
      resetForm();
      onClose?.();
    } catch (err) {
      console.error("Submit error:", err);
      setErrorMsg(err.message || "Submit failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg w-full max-w-4xl shadow-lg overflow-hidden">
        <header className="bg-orange-600 text-white px-4 py-3 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Add Student</h2>
          <button
            onClick={() => {
              resetForm();
              onClose?.();
            }}
            className="text-white text-2xl font-bold"
          >
            &times;
          </button>
        </header>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errorMsg && (
            <div className="bg-red-100 text-red-700 p-2 rounded">{errorMsg}</div>
          )}

          <div className="flex justify-center">
            <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-gray-300">
              <img
                src={form.avatar ? URL.createObjectURL(form.avatar) : "/default-avatar.png"}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer">
                <FaCamera className="text-white text-xl" />
                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[{ label: "School ID", name: "schoolId" },
              { label: "First Name", name: "firstname" },
              { label: "Last Name", name: "lastname" },
              { label: "Entered Class", name: "enteredClass", type: "number" },
              { label: "Date of Birth", name: "dateOfBirth", type: "date" },
              { label: "Home Address", name: "homeAddress" },
              { label: "Guardian ID", name: "guardianId" },
              { label: "Teacher ID", name: "teacherId" },
              { label: "Current Term", name: "currentTerm", type: "number" },
              { label: "Session ID", name: "sessionId" },
              { label: "Classroom ID", name: "classroomId" }].map(({ label, name, type = "text" }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 text-sm"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-4 py-2 rounded text-white font-semibold ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-orange-600 hover:bg-orange-700"
            }`}
          >
            {loading ? "Saving..." : "Save Student"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStudentModal;
