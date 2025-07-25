import React, { useState, useEffect, useRef } from "react";
import { Camera } from "lucide-react";

const EditStudentModal = ({ isOpen, onClose, student = {}, onSave }) => {
  const [form, setForm] = useState({
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
    avatar: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && student) {
      setForm({
        schoolId: student.schoolId ?? "",
        firstname: student.firstname ?? "",
        lastname: student.lastname ?? "",
        enteredClass: student.enteredClass ?? 0,
        dateOfBirth: student.dateOfBirth?.split("T")[0] ?? "",
        homeAddress: student.homeAddress ?? "",
        guardianId: student.guardianId ?? "",
        teacherId: student.teacherId ?? "",
        currentTerm: student.currentTerm ?? 0,
        sessionId: student.sessionId ?? "",
        classroomId: student.classroomId ?? "",
        avatar: null,
      });
      setErrorMsg("");
    }
  }, [isOpen, student]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar") {
      setForm({ ...form, avatar: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const resetForm = () => {
    setForm({
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
      avatar: null,
    });
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!student?.id) {
      setErrorMsg("Student ID is missing.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const payload = {
        ...form,
        enteredClass: parseInt(form.enteredClass),
        currentTerm: parseInt(form.currentTerm),
        dateOfBirth: new Date(form.dateOfBirth).toISOString(),
      };

      const response = await fetch(
        `https://scrmapi.tranquility.org.ng/api/Student/UpdateStudent/${student.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to update student.");
      }

      const updated = await response.json();

      if (form.avatar) {
        const formData = new FormData();
        formData.append("file", form.avatar);
        await fetch(
          `https://scrmapi.tranquility.org.ng/api/Student/UploadImage/${student.id}`,
          {
            method: "POST",
            body: formData,
          }
        );
      }

      onSave?.(updated);
      resetForm();
      onClose?.();
    } catch (error) {
      console.error("Update failed:", error);
      setErrorMsg(error.message || "Error updating student.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg w-full max-w-4xl shadow-lg overflow-hidden">
        <header className="bg-orange-600 text-white flex items-center justify-between px-4 py-3">
          <h2 className="flex-grow text-center font-semibold">Edit Student</h2>
          <button
            className="text-2xl font-bold"
            onClick={() => {
              resetForm();
              onClose?.();
            }}
          >
            &times;
          </button>
        </header>

        <form
          onSubmit={handleSubmit}
          className="p-6 max-h-[80vh] overflow-y-auto space-y-6"
        >
          {errorMsg && (
            <div className="bg-red-100 text-red-700 p-2 rounded">
              {errorMsg}
            </div>
          )}

          <div className="flex justify-center">
            <div
              className="relative w-24 h-24 rounded-full overflow-hidden border border-gray-300 cursor-pointer"
              onClick={() => fileInputRef.current.click()}
            >
              {form.avatar ? (
                <img
                  src={URL.createObjectURL(form.avatar)}
                  alt="Preview"
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gray-100">
                  <Camera className="text-gray-500" />
                </div>
              )}
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={handleChange}
                ref={fileInputRef}
                className="hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[{
              label: "School ID",
              name: "schoolId"
            }, {
              label: "First Name",
              name: "firstname"
            }, {
              label: "Last Name",
              name: "lastname"
            }, {
              label: "Entered Class",
              name: "enteredClass",
              type: "number"
            }, {
              label: "Date of Birth",
              name: "dateOfBirth",
              type: "date"
            }, {
              label: "Home Address",
              name: "homeAddress"
            }, {
              label: "Guardian ID",
              name: "guardianId"
            }, {
              label: "Teacher ID",
              name: "teacherId"
            }, {
              label: "Current Term",
              name: "currentTerm",
              type: "number"
            }, {
              label: "Session ID",
              name: "sessionId"
            }, {
              label: "Classroom ID",
              name: "classroomId"
            }].map(({ label, name, type = "text" }) => (
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
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 text-white font-semibold py-2 rounded-md shadow hover:bg-orange-700 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Student"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditStudentModal;
