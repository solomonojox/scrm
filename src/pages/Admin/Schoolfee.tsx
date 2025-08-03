import React, { useEffect, useState } from 'react';
import Adminheader from './Adminheader';
import AdminSidebar from './AdminSidebar';
import { schoolFeeService } from '../../Services/Schfee';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../Store/store';
import { fetchSchoolFeeFailure, fetchSchoolFeeStart, fetchSchoolFeeSuccess } from '../../Store/schoolFeeSlice';

interface SchoolFee {
  id?: string;
  schoolId: string;
  sessionId: string;
  amount: number;
  classroomId: string;
}

type ModalMode = 'add' | 'view' | 'edit';

export default function SchoolFeesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const fetchedRecord = useSelector((state: RootState) => state.getSchoolFee.listRecords);
  const schoolFees = fetchedRecord || [];
  const fetchedLoading = useSelector((state: RootState) => state.getSchoolFee.loading);
  const error = useSelector((state: RootState) => state.getSchoolFee.error);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("add");
  const [formData, setFormData] = useState<SchoolFee>({
    schoolId: '',
    sessionId: '',
    amount: 0,
    classroomId: ''
  });
  const [selectedFee, setSelectedFee] = useState<SchoolFee | null>(null);

  // Fetch all school fees on component mount
  useEffect(() => {
    if (!fetchedLoading) {
      fetchSchoolFee();
    } else {
      setLoading(false);
    }
  }, [dispatch]);

  // Fetch school fees function
  const fetchSchoolFee = async () => {
    dispatch(fetchSchoolFeeStart());
    try {
      const data = await schoolFeeService.getAllSchoolFees();
      dispatch(fetchSchoolFeeSuccess(data));
    } catch (err) {
      dispatch(fetchSchoolFeeFailure((err as Error).message));
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Modal functions
  const openModal = (mode: ModalMode, fee: SchoolFee | null = null) => {
    setModalMode(mode);
    setSelectedFee(fee);
    setFormData({
      schoolId: fee?.schoolId || '',
      sessionId: fee?.sessionId || '',
      amount: fee?.amount || 0,
      classroomId: fee?.classroomId || ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedFee(null);
    setFormData({
      schoolId: '',
      sessionId: '',
      amount: 0,
      classroomId: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value
    }));
  };

  const handleAddFee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await schoolFeeService.addSchoolFee(formData);
      await fetchSchoolFee();
      closeModal();
    } catch (err) {
      console.error('Add failed:', err);
    }
  };

  const handleUpdateFee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFee?.id) return;

    try {
      await schoolFeeService.updateSchoolFee(selectedFee.id, formData);
      await fetchSchoolFee();
      closeModal();
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const handleDeleteFee = async (id: string) => {
    if (!window.confirm('Delete this fee?')) return;
    try {
      await schoolFeeService.deleteSchoolFee(id);
      await fetchSchoolFee();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const isReadOnly = modalMode === 'view';

  return (
    <div >
      <div className="px-4 sm:px-6 pb-6 space-y-6 w-full">
        <header className="flex flex-col sm:flex-row sm:justify-between items-center gap-4 bg-white rounded-lg shadow px-4 py-3">
          <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 w-full max-w-md">
            <i className="fas fa-search text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent text-sm placeholder-gray-400 text-gray-700 focus:outline-none ml-2 w-full"
            />
          </div>
          <button
            onClick={() => openModal("add")}
            className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded px-4 py-2"
          >
            Add School Fees
          </button>
        </header>

        {/* Table */}
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="text-xs font-semibold text-gray-700 text-left">
                <th className="pl-4 pr-6 py-2">School ID</th>
                <th className="px-6 py-2">Session ID</th>
                <th className="px-6 py-2">Amount</th>
                <th className="px-6 py-2">Classroom ID</th>
                <th className="pr-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {schoolFees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-gray-500 py-6">
                    No school fees found.
                  </td>
                </tr>
              ) : (
                schoolFees.map((fee: SchoolFee, i: number) => (
                  <tr key={fee.id || i} className="bg-white shadow rounded-lg">
                    <td className="pl-4 pr-6 py-4 text-xs text-gray-600">{fee.schoolId}</td>
                    <td className="px-6 py-4 text-xs text-gray-600">{fee.sessionId}</td>
                    <td className="px-6 py-4 text-xs text-gray-600">{fee.amount}</td>
                    <td className="px-6 py-4 text-xs text-gray-600">{fee.classroomId}</td>
                    <td className="pr-4 py-4 text-center space-x-3">
                      <button
                        onClick={() => openModal("view", fee)}
                        className="text-indigo-600 hover:text-indigo-700 text-sm"
                      >
                        <i className="fas fa-eye" />
                      </button>
                      <button
                        onClick={() => openModal("edit", fee)}
                        className="text-green-600 hover:text-green-700 text-sm"
                      >
                        <i className="fas fa-edit" />
                      </button>
                      <button
                        onClick={() => fee.id && handleDeleteFee(fee.id)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        <i className="fas fa-trash-alt" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={closeModal}
          >

            <div
              className="bg-white w-full max-w-2xl rounded-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <header className="bg-[#ef6f0f] flex justify-between items-center px-6 py-3">
                <h1 className="text-white font-semibold text-lg">
                  {modalMode === "add" && "Add School Fee"}
                  {modalMode === "view" && "View School Fee"}
                  {modalMode === "edit" && "Edit School Fee"}
                </h1>
                <button onClick={closeModal} className="text-white text-xl font-bold">&times;</button>
              </header>

              <form
                onSubmit={modalMode === "edit" ? handleUpdateFee : handleAddFee}
                className="p-6 space-y-6"
              >
                {(["schoolId", "sessionId", "amount", "classroomId"] as const).map((field) => (
                  <div key={field}>
                    <label className="block text-gray-700 text-base mb-1">
                      {field.charAt(0).toUpperCase() + field.slice(1).replace("Id", " ID")}
                    </label>
                    <input
                      name={field}
                      type={field === "amount" ? "number" : "text"}
                      placeholder={`Enter ${field}`}
                      value={formData[field]}
                      onChange={handleInputChange}
                      readOnly={isReadOnly}
                      required
                      className={`w-full border border-[#d17a0a] rounded-md px-4 py-3 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#d17a0a] ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""
                        }`}
                    />
                  </div>
                ))}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-gray-300 px-4 py-2 rounded text-sm"
                  >
                    Close
                  </button>
                  {modalMode !== "view" && (
                    <button
                      type="submit"
                      className="bg-[#f07e00] hover:bg-[#d46b00] text-white px-4 py-2 rounded text-sm"
                    >
                      {modalMode === "edit" ? "Update" : "Save"}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Pagination */}
        <footer className="text-xs text-gray-600 flex justify-center mt-4">
          <div className="flex items-center space-x-2">
            <i className="fas fa-caret-left" />
            <span>Page 1 of 1</span>
            <i className="fas fa-caret-right" />
          </div>
        </footer>
      </div>
    </div>
  );
}