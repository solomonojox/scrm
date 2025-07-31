// src/pages/Admin/AllGuardians.tsx
import React, { useState, useEffect } from "react";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaBell,
  FaEnvelope,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../Admin/Adminheader";
import Side from "../Admin/AdminSidebar";
import { onboardingService } from "../../Services/Auth/onboarding";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Store/store";
import { fetchGuardiansFailure, fetchGuardiansStart, fetchGuardiansSuccess } from "../../Store/Guardian/guardianSlice";




const AllGuardians: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const fetchedRecord = useSelector((state: RootState) => state.getGuardian.listRecords)
  const fetchedLoading = useSelector((state: RootState)=> state.getGuardian.loading)
  const error = useSelector((state: RootState)=> state.getGuardian.error)
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

  // 1) Fetch all guardians
  useEffect(() => {
    if(!fetchedLoading){
      fetchGuardian()
    }else{
      setLoading(false)
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

  // Example delete handler (you’ll need to implement this in your service)
  const handleDelete = async (id: string) => {
    console.log(id)
    if (!window.confirm("Are you sure you want to delete this guardian?")) return;
    try {
      await onboardingService.deleteGuardian(id);
      await fetchGuardian()
      toast.success("Deleted!");
    } catch(error) {
      toast.error("Delete failed");
      // console.log(error)
    }
  };

  return (
    <>
      <Header />
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="mt-[70px] min-h-screen flex flex-col md:flex-row">
        {/* Sidebar */}
        <div
          className={`fixed md:static z-50 top-0 left-0 h-full bg-white shadow-md
            md:w-1/5 w-2/3 transition-transform duration-300 ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0`}
        >
          <Side />
        </div>
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main */}
        <div className="w-full md:w-4/5 bg-gray-100 p-4">
          {/* Top Bar */}
          <div className="flex justify-between items-center bg-white px-4 py-3 shadow rounded mb-4">
            <div className="flex items-center gap-4">
              <button
                className="md:hidden text-2xl"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                ☰
              </button>
              <input
                type="text"
                placeholder="Search"
                className="border px-4 py-2 rounded-2xl w-40 md:w-1/3 bg-gray-200"
              />
            </div>
            <div className="flex items-center gap-6">
              <FaEnvelope className="text-xl cursor-pointer" />
              <FaBell className="text-xl cursor-pointer" />
              <div className="flex items-center gap-2">
                <img
                  src="https://api.dicebear.com/7.x/adventurer/svg?seed=Admin"
                  alt="admin"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-bold">Gold Academy</p>
                  <p className="text-gray-500">Admin</p>
                </div>
              </div>
            </div>
          </div>

          {/* Breadcrumb & Add */}
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-gray-600">
              Home{" "}
              <span className="text-orange-500 font-semibold">
                : All Guardians
              </span>
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-orange-500 text-white px-4 py-2 rounded shadow hover:bg-orange-600"
            >
              Add Guardian
            </button>
          </div>

          {/* Table */}
          <div className="bg-white shadow rounded overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="p-3"><input type="checkbox" /></th>
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
                {fetchedRecord.map((g) => (
                  <tr key={g.guardianId} className="border-t hover:bg-gray-100">
                    <td className="p-3"><input type="checkbox" /></td>
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
                ))}
              </tbody>
            </table>
            <div className="p-3 text-center text-sm text-gray-600">
              Page 1 of 1
            </div>
          </div>

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
                  <h2 className="text-lg font-semibold mb-4 text-center">
                    Add Guardian
                  </h2>

                  {formError && (
                    <p className="text-red-600 mb-2 text-center">
                      {formError}
                    </p>
                  )}

                  <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                  >
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
                        required={["firstName", "lastName", "phone"].includes(
                          key
                        )}
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
