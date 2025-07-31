import React, { useEffect, useState } from "react";
import { FaSearch, FaBell, FaComment } from "react-icons/fa";
import Adminheader from "./Adminheader";
import AdminSidebar from "./AdminSidebar";
import { sessionService } from "../../Services/Session";

const AllSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSessions, setSelectedSessions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' | 'view' | 'edit'
  const [formData, setFormData] = useState({
    schoolId: "",
    sessionId: "",
    sessionName: "",
    startDate: "",
    endDate: ""
  });

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await sessionService.getAllRegisteredSessions();
        if (Array.isArray(data)) {
          setSessions(data);
        } else if (data?.sessions && Array.isArray(data.sessions)) {
          setSessions(data.sessions);
        } else {
          setSessions([]);
        }
      } catch (error) {
        console.error("API failed. Using fallback.", error);
        setSessions([
          {
            schoolId: "SCH001",
            sessionId: "S001",
            sessionName: "Term 1 - 2025",
            startDate: "2025-01-10",
            endDate: "2025-04-20"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const handleSelectAll = (e) => {
    setSelectedSessions(e.target.checked ? sessions.map(s => s.sessionId) : []);
  };

  const handleSelectOne = (id) => {
    setSelectedSessions(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openModal = (mode, session = null) => {
    setModalMode(mode);
    setFormData(session || {
      schoolId: "",
      sessionId: "",
      sessionName: "",
      startDate: "",
      endDate: ""
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalMode("add");
  };

  const handleAddSession = async (e) => {
    e.preventDefault();
    try {
      const newSession = await sessionService.addSession(formData);
      setSessions(prev => [...prev, newSession]);
      closeModal();
    } catch (err) {
      alert("Failed to add session.");
      console.error(err);
    }
  };

  const handleUpdateSession = async (e) => {
    e.preventDefault();
    try {
      const updated = await sessionService.updateSession(formData.sessionId, formData);
      setSessions(prev => prev.map(s => (s.sessionId === updated.sessionId ? updated : s)));
      closeModal();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (window.confirm("Are you sure you want to delete this session?")) {
      try {
        await sessionService.deleteSession(sessionId);
        setSessions(prev => prev.filter(s => s.sessionId !== sessionId));
      } catch (err) {
        console.error("Delete failed", err);
        alert("Failed to delete session.");
      }
    }
  };

  const isReadOnly = modalMode === "view";
  const allSelected = sessions.length > 0 && selectedSessions.length === sessions.length;

  return (
    <div className="bg-[#f8f8f8] font-sans text-[13px] text-[#333] min-h-screen">
      <Adminheader />
      <AdminSidebar />

      <div className="flex-1 pl-64 mt-[80px]">
        {/* Topbar */}
        <div className="flex flex-col sm:flex-row justify-between items-center ml-1 px-6 py-4 rounded-md bg-white shadow-md">
          <div className="w-full max-w-sm">
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
              <FaSearch className="text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="ml-2 bg-transparent outline-none w-full text-sm"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <FaBell className="text-gray-500 hover:text-orange-500 cursor-pointer" />
            <FaComment className="text-gray-500 hover:text-orange-500 cursor-pointer" />
            <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 space-x-2">
              <img
                src="https://storage.googleapis.com/a1aa/image/05c98d25-08e9-4bce-610b-3688b9c7b241.jpg"
                className="w-8 h-8 rounded-full"
                alt="Admin"
              />
              <div className="text-xs">
                <div className="font-semibold text-gray-700">Gold Academy</div>
                <div className="text-gray-400">Admin</div>
              </div>
            </div>
          </div>
        </div>

        {/* Breadcrumb and Add */}
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="flex items-center justify-between mb-3">
            <nav className="flex items-center space-x-1 text-[13px] text-[#666] font-normal select-none">
              <span>Home</span>
              <svg className="w-3 h-3 text-[#666]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <span className="font-semibold text-[#d46b00]">All Sessions</span>
            </nav>
            <button
              onClick={() => openModal("add")}
              className="flex items-center gap-1 bg-[#f07e00] hover:bg-[#d46b00] text-white text-[13px] font-semibold rounded px-3 py-1.5"
            >
              Add Session
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-md shadow-md">
              <thead className="border-b border-[#ddd]">
                <tr className="text-[13px] font-semibold select-none">
                  <th className="w-[40px] px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={handleSelectAll}
                    />
                  </th>
                  {[
                    "School ID", "Session ID", "Session Name", "Start Date", "End Date", "Actions"
                  ].map((h, i) => (
                    <th key={i} className={`px-4 py-3 ${h === "Actions" ? "text-center" : ""}`}>
                      <div className={`flex items-center ${h === "Actions" ? "justify-center" : ""}`}> {h} <i className="fas fa-sort text-[#666] text-[10px] ml-1"></i> </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" className="text-center py-6">Loading...</td></tr>
                ) : sessions.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-6">No sessions found.</td></tr>
                ) : (
                  sessions.map((session) => (
                    <tr key={session.sessionId} className="bg-white border-b border-[#eee]">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedSessions.includes(session.sessionId)}
                          onChange={() => handleSelectOne(session.sessionId)}
                        />
                      </td>
                      <td className="px-4 py-4">{session.schoolId}</td>
                      <td className="px-4 py-4">{session.sessionId}</td>
                      <td className="px-4 py-4">{session.sessionName}</td>
                      <td className="px-4 py-4">{new Date(session.startDate).toLocaleDateString()}</td>
                      <td className="px-4 py-4">{new Date(session.endDate).toLocaleDateString()}</td>
                      <td className="px-4 py-4 text-center space-x-2">
                        <i className="fas fa-eye text-blue-600 cursor-pointer" onClick={() => openModal("view", session)} />
                        <i className="fas fa-edit text-green-600 cursor-pointer" onClick={() => openModal("edit", session)} />
                        <i className="fas fa-trash-alt text-red-500 cursor-pointer" onClick={() => handleDeleteSession(session.sessionId)} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="bg-white w-full max-w-3xl mx-4 md:mx-0 rounded-md overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            {/* Header */}
            <header className="bg-[#ef6f0f] flex justify-between items-center px-4 py-2">
              <h1 className="text-white font-semibold text-base">
                {modalMode === "add" && "Add New Session"}
                {modalMode === "view" && "View Session"}
                {modalMode === "edit" && "Edit Session"}
              </h1>
              <button
                onClick={closeModal}
                aria-label="Close"
                className="text-white text-xl font-bold leading-none"
              >
                &times;
              </button>
            </header>

            {/* Form */}
            <form
              onSubmit={modalMode === "edit" ? handleUpdateSession : handleAddSession}
              className="p-4 sm:p-6 space-y-4"
            >
              {[ // Input fields
                { label: "School ID", name: "schoolId", type: "text" },
                { label: "Session ID", name: "sessionId", type: "text" },
                { label: "Session Name", name: "sessionName", type: "text" },
                { label: "Start Date", name: "startDate", type: "date" },
                { label: "End Date", name: "endDate", type: "date" }
              ].map(({ label, name, type }) => (
                <div key={name}>
                  <label htmlFor={name} className="block text-gray-700 text-sm mb-1">
                    {label}
                  </label>
                  <div className="relative">
                    <input
                      id={name}
                      name={name}
                      type={type}
                      placeholder={`Enter ${label}`}
                      value={formData[name]}
                      onChange={handleInputChange}
                      readOnly={isReadOnly}
                      required
                      className={`w-full border border-[#d17a0a] rounded-md px-3 py-2 pr-10 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#d17a0a] ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                    />
                    {type === "date" && (
                      <i className="fas fa-calendar-alt absolute right-3 top-1/2 -translate-y-1/2 text-gray-700"></i>
                    )}
                  </div>
                </div>
              ))}

              {/* Footer Buttons */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-300 px-3 py-1 rounded text-sm"
                >
                  Close
                </button>
                {modalMode !== "view" && (
                  <button
                    type="submit"
                    className="bg-[#f07e00] hover:bg-[#d46b00] text-white px-3 py-1 rounded text-sm"
                  >
                    {modalMode === "edit" ? "Update" : "Save"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllSessions;
