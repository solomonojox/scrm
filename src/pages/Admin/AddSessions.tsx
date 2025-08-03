import React, { useEffect, useState } from "react";
import { FaSearch, FaBell, FaComment } from "react-icons/fa";
import Adminheader from "./Adminheader";
import AdminSidebar from "./AdminSidebar";
import { sessionService } from "../../Services/Session";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Store/store";
import { fetchSessionFailure, fetchSessionStart, fetchSessionSuccess } from "../../Store/sessionSlice";

// Define types for better type safety
interface Session {
  schoolId: string;
  sessionId: string;
  sessionName: string;
  startDate: string;
  endDate: string;
}

interface FormData {
  schoolId: string;
  sessionId: string;
  sessionName: string;
  startDate: string;
  endDate: string;
}

const AddSessions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const fetchedRecord = useSelector((state: RootState) => state.getSession.listRecords);
  const sessions: Session[] = fetchedRecord || [];
  const fetchedLoading = useSelector((state: RootState) => state.getSession.loading);
  const error = useSelector((state: RootState) => state.getSession.error);
  
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "view" | "edit">("add");
  const [formData, setFormData] = useState<FormData>({
    schoolId: "",
    sessionId: "",
    sessionName: "",
    startDate: "",
    endDate: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all sessions on component mount
  useEffect(() => {
    if (!fetchedLoading && sessions.length === 0) {
      fetchSession();
    }
  }, [dispatch, fetchedLoading, sessions.length]);

  // Fetch sessions function
  const fetchSession = async () => {
    dispatch(fetchSessionStart());
    try {
      const data = await sessionService.getAllRegisteredSessions();
      console.log("Fetched Sessions:", data);
      dispatch(fetchSessionSuccess(data));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch sessions';
      dispatch(fetchSessionFailure(errorMessage));
    }
  };

  // Handle select all checkbox
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedSessions(e.target.checked ? sessions.map(s => s.sessionId) : []);
  };

  // Handle individual checkbox selection
  const handleSelectOne = (id: string) => {
    setSelectedSessions(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Open modal with specified mode
  const openModal = (mode: "add" | "view" | "edit", session: Session | null = null) => {
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

  // Close modal and reset state
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
    setIsSubmitting(false);
  };

  // Handle adding new session
  const handleAddSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await sessionService.addSession(formData);
      // Refetch sessions instead of manually updating state
      await fetchSession();
      closeModal();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add session';
      alert(`Failed to add session: ${errorMessage}`);
      console.error('Add session error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle updating existing session
  const handleUpdateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await sessionService.updateSession(formData.sessionId, formData);
      // Refetch sessions instead of manually updating state
      await fetchSession();
      closeModal();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update session';
      alert(`Failed to update session: ${errorMessage}`);
      console.error('Update session error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle deleting session
  const handleDeleteSession = async (sessionId: string) => {
    if (window.confirm("Are you sure you want to delete this session?")) {
      try {
        await sessionService.deleteSession(sessionId);
        // Refetch sessions instead of manually updating state
        await fetchSession();
        // Remove from selected sessions if it was selected
        setSelectedSessions(prev => prev.filter(id => id !== sessionId));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete session';
        alert(`Failed to delete session: ${errorMessage}`);
        console.error('Delete session error:', err);
      }
    }
  };

  // Loading state
  if (fetchedLoading && sessions.length === 0) {
    return (
      <div className="bg-[#f8f8f8] font-sans text-[13px] text-[#333] min-h-screen">
        <Adminheader />
        <AdminSidebar />
        <div className="flex-1 pl-64 mt-[80px] flex items-center justify-center">
          <div className="text-center">Loading sessions...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-[#f8f8f8] font-sans text-[13px] text-[#333] min-h-screen">
        <Adminheader />
        <AdminSidebar />
        <div className="flex-1 pl-64 mt-[80px] flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <button
              onClick={fetchSession}
              className="bg-[#f07e00] hover:bg-[#d46b00] text-white px-4 py-2 rounded"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

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
                placeholder="Search sessions..."
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
              className="flex items-center gap-1 bg-[#f07e00] hover:bg-[#d46b00] text-white text-[13px] font-semibold rounded px-3 py-1.5 transition-colors"
            >
              Add Session
            </button>
          </div>

          {/* Sessions count */}
          <div className="mb-4 text-sm text-gray-600">
            Total Sessions: {sessions.length}
            {selectedSessions.length > 0 && ` | Selected: ${selectedSessions.length}`}
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
                      className="cursor-pointer"
                    />
                  </th>
                  {["School ID", "Session ID", "Session Name", "Start Date", "End Date", "Actions"].map((h, i) => (
                    <th key={i} className={`px-4 py-3 ${h === "Actions" ? "text-center" : "text-left"}`}>
                      <div className={`flex items-center ${h === "Actions" ? "justify-center" : ""}`}>
                        {h}
                        {h !== "Actions" && <i className="fas fa-sort text-[#666] text-[10px] ml-1" />}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sessions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      No sessions found.
                      <br />
                      <button
                        onClick={() => openModal("add")}
                        className="mt-2 text-[#f07e00] hover:underline"
                      >
                        Add your first session
                      </button>
                    </td>
                  </tr>
                ) : (
                  sessions.map((session, index) => (
                    <tr key={session.sessionId || index} className="bg-white border-b border-[#eee] hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedSessions.includes(session.sessionId)}
                          onChange={() => handleSelectOne(session.sessionId)}
                          className="cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-4">{session.schoolId}</td>
                      <td className="px-4 py-4">{session.sessionId}</td>
                      <td className="px-4 py-4">{session.sessionName}</td>
                      <td className="px-4 py-4">
                        {session.startDate ? new Date(session.startDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-4 py-4">
                        {session.endDate ? new Date(session.endDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex justify-center space-x-2">
                          <i 
                            className="fas fa-eye text-blue-600 cursor-pointer hover:text-blue-800 transition-colors" 
                            onClick={() => openModal("view", session)}
                            title="View session"
                          />
                          <i 
                            className="fas fa-edit text-green-600 cursor-pointer hover:text-green-800 transition-colors" 
                            onClick={() => openModal("edit", session)}
                            title="Edit session"
                          />
                          <i 
                            className="fas fa-trash-alt text-red-500 cursor-pointer hover:text-red-700 transition-colors" 
                            onClick={() => handleDeleteSession(session.sessionId)}
                            title="Delete session"
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white w-full max-w-2xl rounded-md overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <header className="bg-[#ef6f0f] flex justify-between items-center px-6 py-3">
              <h1 className="text-white font-semibold text-lg">
                {modalMode === "add" && "Add New Session"}
                {modalMode === "view" && "View Session"}
                {modalMode === "edit" && "Edit Session"}
              </h1>
              <button
                onClick={closeModal}
                aria-label="Close"
                className="text-white text-xl font-bold leading-none hover:text-gray-200 transition-colors"
                disabled={isSubmitting}
              >
                &times;
              </button>
            </header>

            {/* Form */}
            <form
              onSubmit={modalMode === "edit" ? handleUpdateSession : handleAddSession}
              className="p-6 space-y-6"
            >
              {[
                { label: "School ID", name: "schoolId", type: "text" },
                { label: "Session ID", name: "sessionId", type: "text" },
                { label: "Session Name", name: "sessionName", type: "text" },
                { label: "Start Date", name: "startDate", type: "date" },
                { label: "End Date", name: "endDate", type: "date" }
              ].map(({ label, name, type }) => (
                <div key={name}>
                  <label htmlFor={name} className="block text-gray-700 text-base mb-1">
                    {label} {!isReadOnly && <span className="text-red-500">*</span>}
                  </label>
                  <div className="relative">
                    <input
                      id={name}
                      name={name}
                      type={type}
                      placeholder={`Enter ${label}`}
                      value={formData[name as keyof FormData]}
                      onChange={handleInputChange}
                      readOnly={isReadOnly}
                      required={!isReadOnly}
                      disabled={isSubmitting}
                      className={`w-full border border-[#d17a0a] rounded-md px-4 py-3 pr-10 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#d17a0a] transition-colors ${
                        isReadOnly || isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""
                      }`}
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
                  disabled={isSubmitting}
                  className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Processing..." : "Close"}
                </button>
                {modalMode !== "view" && (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#f07e00] hover:bg-[#d46b00] text-white px-4 py-2 rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSubmitting && <i className="fas fa-spinner fa-spin"></i>}
                    {isSubmitting 
                      ? (modalMode === "edit" ? "Updating..." : "Saving...")
                      : (modalMode === "edit" ? "Update" : "Save")
                    }
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

export default AddSessions;