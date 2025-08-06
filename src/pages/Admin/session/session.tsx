import React, { useState, useEffect, useMemo } from "react";
import { FaEye, FaEdit, FaTrash, FaRegBell, FaSearch, FaComment, FaFilter } from "react-icons/fa";
import { BsFileEarmarkPdfFill } from "react-icons/bs";
import { BiMessageAlt } from "react-icons/bi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import autoTable from "jspdf-autotable";
import { onboardingService } from "../../../Services/Auth/onboarding";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../Store/store";
import {
  fetchGuardiansFailure,
  fetchGuardiansStart,
  fetchGuardiansSuccess,
} from "../../../Store/Guardian/guardianSlice";
import asset from "../../../assets/imageAssets";
import { Guardian } from "../../../Types/Guardian/guardianTypes";
import { guardianService } from "../../../Services/Guardian/guardian";

// Define religion enum
type ReligionFilter = 'all' | 'christian' | 'muslim';

const AllGuardians: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const fetchedRecord = useSelector((state: RootState) => state.getGuardian.listRecords);
  const fetchedLoading = useSelector((state: RootState) => state.getGuardian.loading);
  const error = useSelector((state: RootState) => state.getGuardian.error);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const [searchQuery, setSearchQuery] = useState("");
  const [headerSearchQuery, setHeaderSearchQuery] = useState("");
  const [religionFilter, setReligionFilter] = useState<ReligionFilter>('all');
  const [showReligionFilter, setShowReligionFilter] = useState(false);

  const filteredRecords = useMemo(() => {
    let filtered = fetchedRecord;

    // Apply religion filter
    if (religionFilter !== 'all') {
      filtered = filtered.filter((guardian: Guardian) =>
        guardian.religion?.toLowerCase() === religionFilter
      );
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((guardian: Guardian) =>
        guardian.firstname?.toLowerCase().includes(query) ||
        guardian.lastname?.toLowerCase().includes(query) ||
        guardian.phone?.toLowerCase().includes(query) ||
        guardian.email?.toLowerCase().includes(query) ||
        guardian.nationality?.toLowerCase().includes(query) ||
        guardian.stateOfOrigin?.toLowerCase().includes(query) ||
        guardian.religion?.toLowerCase().includes(query) ||
        guardian.homeAddress?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [fetchedRecord, searchQuery, religionFilter]);

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectAll(false);
    setSelectedIds([]);
  };

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
    setSelectAll(false);
    setSelectedIds([]);
  };

  const handleHeaderSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeaderSearchQuery(e.target.value);
    setSearchQuery(e.target.value);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredRecords);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Guardians Details');
    XLSX.writeFile(wb, "guardians.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const title = "Guardians List";
    const headers = [
      ["First Name", "Last Name", "Phone", "Address", "Nationality", "State", "Religion"]
    ];

    const data = filteredRecords.map((guardian: Guardian) => [
      guardian.firstname || '',
      guardian.lastname || '',
      guardian.phone || '',
      guardian.homeAddress || '',
      guardian.nationality || '',
      guardian.stateOfOrigin || '',
      guardian.religion || ''
    ]);

    doc.text(title, 14, 15);
    autoTable(doc, {
      head: headers,
      body: data,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [255, 165, 0] } // Orange header
    });

    doc.save("guardians.pdf");
  };

  useEffect(() => {
    if (!fetchedLoading) {
      fetchGuardian();
    } else {
      setLoading(false);
    }
  }, [dispatch]);

  const fetchGuardian = async () => {
    dispatch(fetchGuardiansStart());
    try {
      const data = await guardianService.getAll();
      dispatch(fetchGuardiansSuccess(data));
    } catch (err) {
      dispatch(fetchGuardiansFailure((err as Error).message));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

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
      const res = await guardianService.create(payload);
      toast.success(res.responseMessage || "Guardian added!");
      const updated = await guardianService.getAll();
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

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this guardian?")) return;
    try {
      await onboardingService.deleteGuardian(id);
      await fetchGuardian();
      toast.success("Deleted!");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    document.title = "EduCat Guardian";
  }, []);


  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <ToastContainer />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white shadow-md rounded-2xl p-2 mb-4">
          <div className="w-full sm:w-auto mb-4 sm:mb-0">
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-full sm:w-80">
              <FaSearch className="text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search"
                value={headerSearchQuery}
                onChange={handleHeaderSearchChange}
                className="ml-2 bg-transparent outline-none w-full text-sm py-1.5"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <FaRegBell className="text-gray-500 text-2xl hover:text-orange-500 cursor-pointer" />
            <BiMessageAlt className="text-gray-500 text-2xl hover:text-orange-500 cursor-pointer" />
            <div className="flex items-center rounded-full px-3 py-1 space-x-2">
              <img
                src="https://storage.googleapis.com/a1aa/image/05c98d25-08e9-4bce-610b-3688b9c7b241.jpg"
                className="w-14 h-14 rounded-full"
                alt="Admin"
              />
              <div className="text-xs">
                <div className="font-semibold text-gray-700">Gold Academy</div>
                <div className="text-gray-400">Admin</div>
              </div>
            </div>
          </div>
        </div>

        {/* Breadcrumb & Add Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <p className="text-sm text-gray-600 mb-4 sm:mb-0">
            Home <span className="text-orange-500 font-semibold">: All Guardians</span>
          </p>
          <div className="gap-4 flex items-center sm:flex-wrap">
            <div className="relative">
              <button
                onClick={() => setShowReligionFilter(!showReligionFilter)}
                className="flex items-center gap-2 border p-2 rounded hover:bg-gray-100"
              >
                <FaFilter className="text-orange-500" />
                <span>Filter</span>
              </button>
              {showReligionFilter && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setReligionFilter('all');
                        setShowReligionFilter(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${religionFilter === 'all' ? 'bg-orange-100 text-orange-700' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      All Religions
                    </button>
                    <button
                      onClick={() => {
                        setReligionFilter('christian');
                        setShowReligionFilter(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${religionFilter === 'christian' ? 'bg-orange-100 text-orange-700' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      Christian
                    </button>
                    <button
                      onClick={() => {
                        setReligionFilter('muslim');
                        setShowReligionFilter(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${religionFilter === 'muslim' ? 'bg-orange-100 text-orange-700' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      Muslim
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={exportToExcel}
              title="Export to Excel"
              className="border p-2 rounded hover:bg-gray-100"
            >
              <img className="h-6 w-6" src={asset.excelLogo} alt="Excel export" />
            </button>

            <button
              onClick={exportToPDF}
              title="Export to PDF"
              className="border p-2 rounded hover:bg-gray-100"
            >
              {/* <img className="h-6 w-6" src={asset.pdfLogo} alt="PDF export" /> */}
              <BsFileEarmarkPdfFill className="text-red-500 text-2xl" />
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-600 w-full sm:w-auto"
            >
              Add Guardian
            </button>
          </div>
        </div>

        {/* Search and Filter Info */}
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          {(searchQuery || religionFilter !== 'all') && (
            <div className="text-sm text-gray-600">
              Showing {filteredRecords.length} result{filteredRecords.length !== 1 ? "s" : ""}
              {searchQuery && ` for "${searchQuery}"`}
              {religionFilter !== 'all' && ` (Filtered by ${religionFilter})`}
              {filteredRecords.length === 0 && (
                <span className="text-red-500 ml-2">No guardians found</span>
              )}
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10">
              <tr>
                <th className="p-3 min-w-[50px]">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={toggleSelectAll}
                    className="cursor-pointer w-4 h-4"
                  />
                </th>
                <th className="p-3 min-w-[80px]">Photo</th>
                <th className="p-3 min-w-[120px]">First Name</th>
                <th className="p-3 min-w-[120px]">Last Name</th>
                <th className="p-3 min-w-[120px]">Phone</th>
                <th className="p-3 min-w-[200px]">Address</th>
                <th className="p-3 min-w-[120px]">Nationality</th>
                <th className="p-3 min-w-[120px]">State</th>
                <th className="p-3 min-w-[120px]">Religion</th>
                <th className="p-3 min-w-[120px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-gray-500">
                    {searchQuery
                      ? "No guardians found matching your search"
                      : "No guardians available"}
                  </td>
                </tr>
              ) : (
                currentRecords.map((g, index) => (
                  <tr
                    key={g.guardianId}
                    className={`border-t hover:bg-gray-100 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(g.guardianId)}
                        onChange={() => toggleCheckbox(g.guardianId)}
                        className="cursor-pointer w-4 h-4"
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
                    <td className="p-3 flex gap-3">
                      <FaEye className="cursor-pointer text-blue-600 hover:text-blue-800" />
                      <FaEdit className="cursor-pointer text-green-600 hover:text-green-800" />
                      <FaTrash
                        className="cursor-pointer text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(g.guardianId)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredRecords.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 p-4 text-sm text-gray-600">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-6 py-2 border rounded ${currentPage === 1
                ? "bg-white text-black border-gray-600 cursor-not-allowed"
                : "bg-orange-500 text-white hover:bg-orange-600"
                }`}
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
              className={`px-6 py-2 border rounded ${currentPage === totalPages
                ? "bg-white text-black border-gray-600 cursor-not-allowed"
                : "bg-orange-500 text-white hover:bg-orange-600"
                }`}
            >
              Next
            </button>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
            <div
              className="bg-white rounded-lg w-full max-w-md sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-orange-500 h-2 rounded-t-lg" />
              <div className="p-4 sm:p-6">
                <h2 className="text-lg font-semibold mb-4 text-center">Add Guardian</h2>
                {formError && <p className="text-red-600 mb-4 text-center">{formError}</p>}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="relative col-span-2 w-20 h-20 mx-auto mb-4 rounded-full bg-orange-100 border-2 border-orange-400 overflow-hidden cursor-pointer">
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
                      className="border px-3 py-2 rounded text-sm w-full"
                      value={formData[key]}
                      onChange={handleInputChange}
                    />
                  ))}
                  <div className="col-span-2 flex justify-end gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 border rounded text-sm hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-orange-500 text-white rounded text-sm hover:bg-orange-600 disabled:opacity-50"
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
  );
};

export default AllGuardians;