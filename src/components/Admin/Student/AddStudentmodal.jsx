import React, { useState } from "react";

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
  };

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const resetForm = () => {
    setForm(initialForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      enteredClass: parseInt(form.enteredClass),
      currentTerm: parseInt(form.currentTerm),
      dateOfBirth: new Date(form.dateOfBirth).toISOString(),
    };

    try {
      setLoading(true);
      const res = await fetch(
        "https://scrmapi.tranquility.org.ng/api/Student/AddStudent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error: ${errorText}`);
      }

      const result = await res.json();
      onSave?.(result);
      resetForm();
      onClose?.();
    } catch (error) {
      console.error("Submit error:", error);
      alert("Failed to add student. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg w-full max-w-4xl shadow-lg overflow-hidden">
        {/* Header */}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "School ID", name: "schoolId" },
              { label: "First Name", name: "firstname" },
              { label: "Last Name", name: "lastname" },
              { label: "Entered Class", name: "enteredClass", type: "number" },
              { label: "Date of Birth", name: "dateOfBirth", type: "date" },
              { label: "Home Address", name: "homeAddress" },
              { label: "Guardian ID", name: "guardianId" },
              { label: "Teacher ID", name: "teacherId" },
              { label: "Current Term", name: "currentTerm", type: "number" },
              { label: "Session ID", name: "sessionId" },
              { label: "Classroom ID", name: "classroomId" },
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
                  required
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
            ))}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-6 py-2 rounded text-white font-semibold ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-600 hover:bg-orange-700"
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
