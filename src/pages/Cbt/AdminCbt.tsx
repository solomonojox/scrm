import React, { useState } from "react";
import { Edit, Trash2, UserPlus, Users, X } from "lucide-react";

const EducatAdmin = () => {
  const [activeTab, setActiveTab] = useState("students");
  const [showModal, setShowModal] = useState(false);

  const students = [
    { name: "John Smith", email: "john@school.edu", class: "Grade 12A", status: "active" },
    { name: "Emma Johnson", email: "emma@school.edu", class: "Grade 11B", status: "active" },
    { name: "Michael Brown", email: "michael@school.edu", class: "Grade 12A", status: "active" },
  ];

  const teachers = [
    { name: "Dr. Sarah Wilson", email: "sarah@school.edu", subject: "Mathematics", status: "active" },
    { name: "Prof. James Lee", email: "james@school.edu", subject: "Physics", status: "active" },
  ];

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    class: "",
    subject: "",
    password: "",
    dob: "",
    gender: "",
    section: "",
    guardianName: "",
    guardianEmail: "",
    guardianPhone: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`${activeTab === "students" ? "Student" : "Teacher"} added successfully!`);
    setFormData({
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      class: "",
      subject: "",
      password: "",
      dob: "",
      gender: "",
      section: "",
      guardianName: "",
      guardianEmail: "",
      guardianPhone: "",
    });
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-orange-50 p-6 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-orange-600">Educat CBT Dashboard</h1>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[ 
          { title: "Total Students", count: 3, note: "Active students in school" },
          { title: "Total Teachers", count: 2, note: "Active teachers in school" },
          { title: "Total Users", count: 5, note: "All registered users" },
        ].map((card, i) => (
          <div key={i} className="bg-white shadow-sm border border-orange-100 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-600 font-semibold">{card.title}</h3>
                <p className="text-3xl font-bold text-orange-600">{card.count}</p>
                <span className="text-sm text-gray-500">{card.note}</span>
              </div>
              <Users className="text-orange-400 w-8 h-8" />
            </div>
          </div>
        ))}
      </div>

      {/* User Management */}
      <div className="bg-white shadow-sm border border-orange-100 rounded-xl p-6">
        <div className="flex flex-wrap items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">User Management</h2>

          <div className="flex items-center space-x-4">
            {/* Tabs */}
            <div className="bg-orange-100 rounded-full flex p-1">
              <button
                onClick={() => setActiveTab("students")}
                className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                  activeTab === "students"
                    ? "bg-orange-500 text-white"
                    : "text-gray-700 hover:text-orange-600"
                }`}
              >
                Students
              </button>
              <button
                onClick={() => setActiveTab("teachers")}
                className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                  activeTab === "teachers"
                    ? "bg-orange-500 text-white"
                    : "text-gray-700 hover:text-orange-600"
                }`}
              >
                Teachers
              </button>
            </div>

            {/* Add Button */}
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              {activeTab === "students" ? "Add Student" : "Add Teacher"}
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            className="w-full border border-orange-100 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-orange-100 text-gray-700 text-sm">
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">
                  {activeTab === "students" ? "Class" : "Subject"}
                </th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(activeTab === "students" ? students : teachers).map((user, i) => (
                <tr key={i} className="border-b border-orange-100 hover:bg-orange-50 transition">
                  <td className="p-3 font-medium">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">
                    {activeTab === "students" ? user.class : user.subject}
                  </td>
                  <td className="p-3">
                    <span className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full">
                      {user.status}
                    </span>
                  </td>
                  <td className="p-3 flex items-center space-x-3">
                    <button className="text-orange-500 hover:text-orange-600">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-500 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* === Student Modal (your exact version) === */}
      {showModal && activeTab === "students" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-orange-500"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-semibold text-orange-600 mb-4">
              Add New Student
            </h3>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Original unchanged student form fields */}
              <input type="text" name="firstname" placeholder="First Name *" value={formData.firstname} onChange={handleChange} className="border border-orange-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none" required />
              <input type="text" name="lastname" placeholder="Last Name *" value={formData.lastname} onChange={handleChange} className="border border-orange-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none" required />
              <input type="email" name="email" placeholder="Email *" value={formData.email} onChange={handleChange} className="border border-orange-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none" required />
              <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="border border-orange-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none" />
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="border border-orange-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none" required />
              <select name="gender" value={formData.gender} onChange={handleChange} className="border border-orange-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none" required>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <select name="class" value={formData.class} onChange={handleChange} className="border border-orange-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none" required>
                <option value="">Select Class</option>
                <option value="Grade 10A">Grade 10A</option>
                <option value="Grade 11B">Grade 11B</option>
                <option value="Grade 12A">Grade 12A</option>
              </select>
              <select name="section" value={formData.section} onChange={handleChange} className="border border-orange-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none" required>
                <option value="">Select Section</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
              <input type="text" name="guardianName" placeholder="Guardian Name *" value={formData.guardianName} onChange={handleChange} className="col-span-2 border border-orange-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none" required />
              <input type="email" name="guardianEmail" placeholder="Guardian Email" value={formData.guardianEmail} onChange={handleChange} className="border border-orange-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none" />
              <input type="text" name="guardianPhone" placeholder="Guardian Phone" value={formData.guardianPhone} onChange={handleChange} className="border border-orange-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none" />
              <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="col-span-2 border border-orange-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none" />
              <p className="text-sm text-gray-500 col-span-2">
                This password will be sent to the guardian’s email.
              </p>

              <div className="flex justify-end space-x-3 col-span-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-orange-300 text-orange-600 rounded-lg hover:bg-orange-100">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold">
                  Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* === Teacher Modal === */}
      {showModal && activeTab === "teachers" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-orange-500"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-semibold text-orange-600 mb-2">
              Add New Teacher
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Enter the teacher’s basic information below.
            </p>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="firstname" placeholder="First Name *" value={formData.firstname} onChange={handleChange} required className="border border-orange-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none" />
              <input type="text" name="lastname" placeholder="Last Name *" value={formData.lastname} onChange={handleChange} required className="border border-orange-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none" />
              <input type="email" name="email" placeholder="Email *" value={formData.email} onChange={handleChange} required className="border border-orange-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none" />
              <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="border border-orange-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none" />
              <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="col-span-2 border border-orange-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none" />

              <div className="flex justify-end space-x-3 col-span-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-orange-300 text-orange-600 rounded-lg hover:bg-orange-100">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold">
                  Add Teacher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EducatAdmin;
