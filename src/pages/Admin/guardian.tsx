// src/pages/Admin/AllGuardians.tsx
import React, { useState, useEffect, useMemo } from "react";
import { FaEye, FaEdit, FaTrash, FaBell, FaEnvelope, FaSearch, FaComment } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from 'xlsx'
import { onboardingService } from "../../Services/Auth/onboarding";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Store/store";
import {
  fetchGuardiansFailure,
  fetchGuardiansStart,
  fetchGuardiansSuccess,
} from "../../Store/Guardian/guardianSlice";
import asset from "../../assets/imageAssets"; // Assuming you have an excel icon in your assets
import { Guardian } from "../../Types/Guardian/guardianTypes";

const AllGuardians: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const fetchedRecord = useSelector((state: RootState) => state.getGuardian.listRecords);
  const fetchedLoading = useSelector((state: RootState) => state.getGuardian.loading);
  const error = useSelector((state: RootState) => state.getGuardian.error);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    nationality: "",
    state: "",
    religion: "",
    email: "",
    username: "",
    occupation: "",
    workAddress: "",
    relationship: "",
    nin: "",
    bvn: "",
  });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const [searchQuery, setSearchQuery] = useState("");
  const [headerSearchQuery, setHeaderSearchQuery] = useState("");

  // Memoized filtered data
  const filteredRecords = useMemo(() => {
    if (!searchQuery.trim()) return fetchedRecord;
    
    const query = searchQuery.toLowerCase();
    return fetchedRecord.filter((guardian: Guardian) =>
      guardian.firstname?.toLowerCase().includes(query) ||
      guardian.lastname?.toLowerCase().includes(query) ||
      guardian.phone?.toLowerCase().includes(query) ||
      guardian.email?.toLowerCase().includes(query) ||
      guardian.nationality?.toLowerCase().includes(query) ||
      guardian.stateOfOrigin?.toLowerCase().includes(query) ||
      guardian.religion?.toLowerCase().includes(query) ||
      guardian.homeAddress?.toLowerCase().includes(query)
    );
  }, [fetchedRecord, searchQuery]);

  // Pagination calculations based on filtered data
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectAll(false);
    setSelectedIds([]);
  };

  // Toggle select all checkboxes
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentRecords.map((g) => g.guardianId));
    }
    setSelectAll(!selectAll);
  };

  const toggleCheckbox = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Handle search query change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to the first page whenever search changes
    setSelectAll(false);
    setSelectedIds([]);
  };

  // Handle header search query change
  const handleHeaderSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeaderSearchQuery(e.target.value);
    setSearchQuery(e.target.value); // Sync with main search
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredRecords); // Converts the list to a sheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Guardians Details'); // Add sheet to workbook
    XLSX.writeFile(wb, "guardians.xlsx"); // Download the file
  };

  // 1) Fetch all guardians
  useEffect(() => {
    if (!fetchedLoading) {
      fetchGuardian();
    } else {
      setLoading(false);
    }
  }, [dispatch]);

  // Refetch Guardion
  const fetchGuardian = async () => {
    dispatch(fetchGuardiansStart());
    try {
      const data = await onboardingService.getAllGuardians();
      dispatch(fetchGuardiansSuccess(data));
    } catch (err) {
      dispatch(fetchGuardiansFailure((err as Error).message));
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  // 2) Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  // 3) Submit new guardian
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError("");

    const payload = {
      schoolId: "d5bca6af-0658-4f9d-a6a4-08ddcc154429",
      firstname: formData.firstName,
      lastname: formData.lastName,
      relationship: formData.relationship,
      phone: formData.phone,
      occupation: formData.occupation,
      homeAddress: formData.address,
      workAddress: formData.workAddress,
      stateOfOrigin: formData.state,
      nationality: formData.nationality,
      religion: formData.religion,
      email: formData.email,
      username: formData.username,
      nin: formData.nin,
      bvn: formData.bvn,
    };

    try {
      const res = await onboardingService.guardian(payload);
      toast.success(res.responseMessage || "Guardian added!");

      // Refresh list
      const updated = await onboardingService.getAllGuardians();
      // setGuardians(updated);

      // Auto‑close modal after 2s
      setTimeout(() => {
        setIsModalOpen(false);
        setFormData({
          firstName: "",
          lastName: "",
          phone: "",
          address: "",
          nationality: "",
          state: "",
          religion: "",
          email: "",
          username: "",
          occupation: "",
          workAddress: "",
          relationship: "",
          nin: "",
          bvn: "",
        });
        setImagePreview(null);
      }, 2000);
    } catch (err: any) {
      const msg = err.response?.data?.responseMessage || "Submission failed";
      setFormError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Example delete handler (you'll need to implement this in your service)
  const handleDelete = async (id: string) => {
    console.log(id);
    if (!window.confirm("Are you sure you want to delete this guardian?")) return;
    try {
      await onboardingService.deleteGuardian(id);
      await fetchGuardian();
      toast.success("Deleted!");
    } catch (error) {
      toast.error("Delete failed");
      // console.log(error)
    }
  };

  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    document.title = "EduCat Guardian";
  }, []);

  return (
    <>
      <div>
        {/* Main */}
        <div className="w-full bg-gray-100 p-4">
          <div className="flex flex-col sm:flex-row justify-between items-center ml-1 px-6 py-4 mt-[8px] rounded-md bg-white shadow-md">
            <div className="w-full max-w-sm">
              <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                <FaSearch className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  value={headerSearchQuery}
                  onChange={handleHeaderSearchChange}
                  className="ml-2 bg-transparent outline-none w-full text-sm"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <FaBell
                className="text-gray-500 hover:text-orange-500 cursor-pointer"
                onClick={() => setShowModal(true)}
              />

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
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-gray-600">
              Home <span className="text-orange-500 font-semibold">: All Guardians</span>
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-orange-500 text-white px-4 py-2 rounded shadow hover:bg-orange-600"
            >
              Add Guardian
            </button>
          </div>

          {/* Search and Export */}
          <div className="flex items-center justify-between gap-4 lg:w-[70%] w-full ">
            <input
              type="text"
              placeholder="Search guardian here"
              value={searchQuery}
              onChange={handleSearchChange}
              className="px-4 py-2 border border-gray-300 rounded w-full"
            />

            <button
              onClick={exportToExcel}
              title="Export to CSV"
              className="border"
            >
              <img className="h-6 w-6" src={asset.excelLogo} />
            </button>
          </div>

          {/* Search Results Info */}
          {searchQuery && (
            <div className="mt-2 mb-4 text-sm text-gray-600">
              Showing {filteredRecords.length} result{filteredRecords.length !== 1 ? 's' : ''} for "{searchQuery}"
              {filteredRecords.length === 0 && (
                <span className="text-red-500 ml-2">No guardians found</span>
              )}
            </div>
          )}

          {/* Table */}
          <div className="bg-white shadow rounded overflow-x-auto mt-8">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="p-3">
                    <input
                      className="cursor-pointer w-[15px] h-[15px]"
                      type="checkbox"
                      checked={selectAll}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="p-3">Photo</th>
                  <th className="p-3">First Name</th>
                  <th className="p-3">Last Name</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Address</th>
                  <th className="p-3">Nationality</th>
                  <th className="p-3">State</th>
                  <th className="p-3">Religion</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-8 text-center text-gray-500">
                      {searchQuery ? "No guardians found matching your search" : "No guardians available"}
                    </td>
                  </tr>
                ) : (
                  currentRecords.map((g, index) => (
                    <tr
                      key={g.guardianId}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-gray-100"
                      } border-t hover:bg-gray-100`}
                    >
                      <td className="p-3">
                        <input
                          type="checkbox"
                          className="cursor-pointer w-[15px] h-[15px]"
                          checked={selectedIds.includes(g.guardianId)}
                          onChange={() => toggleCheckbox(g.guardianId)}
                        />
                      </td>
                      <td className="p-3">
                        <img
                          src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${g.firstname}`}
                          alt="avatar"
                          className="w-10 h-10 rounded-full"
                        />
                      </td>
                      <td className="p-3">{g.firstname}</td>
                      <td className="p-3">{g.lastname}</td>
                      <td className="p-3">{g.phone}</td>
                      <td className="p-3">{g.homeAddress}</td>
                      <td className="p-3">{g.nationality}</td>
                      <td className="p-3">{g.stateOfOrigin}</td>
                      <td className="p-3">{g.religion}</td>
                      <td className="p-3 flex gap-2 text-blue-600">
                        <FaEye className="cursor-pointer" />
                        <FaEdit className="cursor-pointer text-green-600" />
                        <FaTrash
                          className="cursor-pointer text-red-600"
                          onClick={() => handleDelete(g.guardianId)}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination UI */}
          {filteredRecords.length > 0 && (
            <div className="p-3 my-8 text-center text-sm text-gray-600 flex justify-center items-center gap-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-10 py-2 border ${
                  currentPage === 1
                    ? "bg-white text-black border-gray-600 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600 cursor-pointer text-white "
                } rounded disabled:opacity-40`}
              >
                Prev
              </button>
              <span>
                Page {currentPage} of {totalPages} 
                {searchQuery && ` (${filteredRecords.length} results)`}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-10 py-2 border ${
                  currentPage === totalPages
                    ? "bg-white text-black border-gray-600 cursor-not-allowed"
                    : "bg-orange-500 text-white hover:bg-orange-600"
                } rounded disabled:opacity-40`}
              >
                Next
              </button>
            </div>
          )}

          {/* Modal */}
          {isModalOpen && (
            <div
              className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50"
              onClick={() => setIsModalOpen(false)}
            >
              <div
                className="bg-white rounded-lg w-[90%] max-w-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-orange-500 h-2 rounded-t-lg" />
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-4 text-center">Add Guardian</h2>

                  {formError && <p className="text-red-600 mb-2 text-center">{formError}</p>}

                  <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="relative col-span-2 w-20 h-20 mx-auto mb-2 rounded-full bg-orange-100 border-2 border-orange-400 overflow-hidden cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="flex items-center justify-center h-full text-orange-400 font-bold text-xl">
                          +
                        </span>
                      )}
                    </label>

                    {[
                      ["firstName", "First Name"],
                      ["lastName", "Last Name"],
                      ["phone", "Phone Number"],
                      ["address", "Home Address"],
                      ["nationality", "Nationality"],
                      ["state", "State of Origin"],
                      ["religion", "Religion"],
                      ["email", "Email"],
                      ["username", "Username"],
                      ["occupation", "Occupation"],
                      ["workAddress", "Work Address"],
                      ["relationship", "Relationship"],
                      ["nin", "NIN"],
                      ["bvn", "BVN"],
                    ].map(([key, label]) => (
                      <input
                        key={key}
                        type={key === "email" ? "email" : "text"}
                        name={key}
                        placeholder={label}
                        required={["firstName", "lastName", "phone"].includes(key)}
                        className="border px-2 py-1 rounded text-sm"
                        value={formData[key]}
                        onChange={handleInputChange}
                      />
                    ))}

                    <div className="col-span-2 flex justify-end gap-2 mt-3">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-3 py-1 border rounded text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-3 py-1 bg-orange-500 text-white rounded text-sm hover:bg-orange-600"
                      >
                        {loading ? "Saving…" : "Submit"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AllGuardians;