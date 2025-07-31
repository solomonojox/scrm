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
        } else if (data && Array.isArray(data.sessions)) {
          setSessions(data.sessions);
        } else {
          setSessions([]);
        }
      } catch (error) {
        console.error("API failed. Using mock data.", error);
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
    setSelectedSessions(e.target.checked ? sessions.map((s) => s.sessionId) : []);
  };

  const handleSelectOne = (sessionId) => {
    setSelectedSessions((prev) =>
      prev.includes(sessionId) ? prev.filter((id) => id !== sessionId) : [...prev, sessionId]
    );
  };

  const allSelected =
    sessions.length > 0 && selectedSessions.length === sessions.length;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSession = async (e) => {
    e.preventDefault();
    try {
      const savedSession = await sessionService.addSession(formData);
      setSessions((prev) => [...prev, savedSession]);
      closeModal();
    } catch (error) {
      alert("Failed to add session.");
      console.error("Add session error:", error);
    }
  };

  const handleViewSession = (session) => {
    setFormData(session);
    setModalMode("view");
    setShowModal(true);
  };

  const handleEditSession = (session) => {
    setFormData(session);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleUpdateSession = async (e) => {
    e.preventDefault();
    try {
      const updated = await sessionService.updateSession(formData.sessionId, formData);
      setSessions((prev) =>
        prev.map((s) => (s.sessionId === updated.sessionId ? updated : s))
      );
      closeModal();
    } catch (err) {
      console.error("Failed to update session:", err);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalMode("add");
    setFormData({
      schoolId: "",
      sessionId: "",
      sessionName: "",
      startDate: "",
      endDate: ""
    });
  };

  const isReadOnly = modalMode === "view";

  return (
    <div className="bg-[#f8f8f8] font-sans text-[13px] text-[#333] min-h-screen">
      <Adminheader />
      <AdminSidebar />
      <div className="flex-1 pl-64 mt-[80px]">
        {/* Topbar */}
        {/* ...topbar and breadcrumb remain unchanged... */}
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

        {/* Breadcrumb & Add */}
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
              type="button"
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1 bg-[#f07e00] hover:bg-[#d46b00] text-white text-[13px] font-semibold rounded px-3 py-1.5"
            >
              Add Session
            </button>
          </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-md shadow-[0_3px_6px_0_rgba(0,0,0,0.16)]">
            <thead className="border-b border-[#ddd]">
              <tr className="text-[13px] text-[#333] font-semibold select-none">
                <th className="w-[40px] px-4 py-3 text-left">
                  <input type="checkbox" checked={allSelected} onChange={handleSelectAll} />
                </th>
                {["School ID", "Session ID", "Session Name", "Start Date", "End Date", "Actions"].map((h, i) => (
                  <th key={i} className={`px-4 py-3 ${h === "Actions" ? "text-center" : ""}`}>
                    <div className={`flex items-center gap-1 ${h === "Actions" ? "justify-center" : ""}`}>
                      {h}
                      <i className="fas fa-sort text-[#666] text-[10px]" />
                    </div>
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
                      <input type="checkbox" checked={selectedSessions.includes(session.sessionId)} onChange={() => handleSelectOne(session.sessionId)} />
                    </td>
                    <td className="px-4 py-4">{session.schoolId}</td>
                    <td className="px-4 py-4">{session.sessionId}</td>
                    <td className="px-4 py-4">{session.sessionName}</td>
                    <td className="px-4 py-4">{new Date(session.startDate).toLocaleDateString()}</td>
                    <td className="px-4 py-4">{new Date(session.endDate).toLocaleDateString()}</td>
                    <td className="px-4 py-4 text-center space-x-2">
                      <i className="fas fa-eye text-blue-600 cursor-pointer" onClick={() => handleViewSession(session)} />
                      <i className="fas fa-edit text-green-600 cursor-pointer" onClick={() => handleEditSession(session)} />
                      <i className="fas fa-trash-alt text-red-500 cursor-pointer" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">
              {modalMode === "add" && "Add New Session"}
              {modalMode === "view" && "View Session Details"}
              {modalMode === "edit" && "Edit Session"}
            </h2>
            <form onSubmit={modalMode === "edit" ? handleUpdateSession : handleAddSession} className="space-y-3">
              {["schoolId", "sessionId", "sessionName", "startDate", "endDate"].map((field) => (
                <div key={field}>
                  <label className="block text-sm capitalize mb-1">{field.replace(/Id/, " ID")}</label>
                  <input
                    type={field.includes("Date") ? "date" : "text"}
                    name={field}
                    required
                    value={formData[field]}
                    onChange={handleInputChange}
                    readOnly={isReadOnly}
                    className={`w-full border rounded px-3 py-2 text-sm ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  />
                </div>
              ))}
              <div className="flex justify-end gap-2">
                <button type="button" onClick={closeModal} className="bg-gray-300 px-3 py-1 rounded text-sm">Close</button>
                {modalMode !== "view" && (
                  <button type="submit" className="bg-[#f07e00] hover:bg-[#d46b00] text-white px-3 py-1 rounded text-sm">
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
