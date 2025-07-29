import React, { useState } from "react";
import { FaEye, FaEdit, FaTrash, FaBell, FaEnvelope } from "react-icons/fa";
import Header from "../Admin/Adminheader";
import Side from "../Admin/AdminSidebar";

const guardians = new Array(10).fill({
  id: "10001",
  photo: "https://api.dicebear.com/7.x/adventurer/svg?seed=Faith",
  firstName: "Faith",
  lastName: "Owen",
  phone: "0812222222",
  address: "1, broad way lagos",
  nationality: "Nigerian",
  state: "Ondo",
  religion: "Christianity",
});

const AllGuardians = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
  });

  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Guardian:", formData);
    alert("Guardian added successfully!");
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
    });
    setImagePreview(null);
  };

  return (
    <>
      <Header />
      <div className="mt-[70px] min-h-screen flex flex-col md:flex-row">
        <div
          className={`fixed md:static z-50 top-0 left-0 h-full bg-white shadow-md md:w-1/5 w-2/3 transition-transform duration-300 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
        >
          <Side />
        </div>
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <div className="w-full md:w-4/5 bg-gray-100 p-4">
          <div className="flex justify-between items-center bg-white px-4 py-3 shadow rounded mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden text-2xl text-black"
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
              <FaEnvelope className="text-xl text-black cursor-pointer" />
              <FaBell className="text-xl text-black cursor-pointer" />
              <div className="flex items-center gap-2">
                <img
                  src="https://api.dicebear.com/7.x/adventurer/svg?seed=Admin"
                  className="w-10 h-10 rounded-full"
                  alt="admin"
                />
                <div className="text-sm">
                  <p className="font-bold">Gold Academy</p>
                  <p className="text-gray-500">Admin</p>
                </div>
              </div>
            </div>
          </div>

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

          <div className="bg-white shadow rounded overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="p-3">
                    <input type="checkbox" />
                  </th>
                  <th className="p-3">School ID</th>
                  <th className="p-3">Photo</th>
                  <th className="p-3">First Name</th>
                  <th className="p-3">Last Name</th>
                  <th className="p-3">Phone Number</th>
                  <th className="p-3">Address</th>
                  <th className="p-3">Nationality</th>
                  <th className="p-3">State of Origin</th>
                  <th className="p-3">Religion</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {guardians.map((guardian, idx) => (
                  <tr key={idx} className="border-t hover:bg-gray-100">
                    <td className="p-3">
                      <input type="checkbox" />
                    </td>
                    <td className="p-3">{guardian.id}</td>
                    <td className="p-3">
                      <img
                        src={guardian.photo + `&scale=${idx}`}
                        alt="avatar"
                        className="w-10 h-10 rounded-full"
                      />
                    </td>
                    <td className="p-3">{guardian.firstName}</td>
                    <td className="p-3">{guardian.lastName}</td>
                    <td className="p-3">{guardian.phone}</td>
                    <td className="p-3">{guardian.address}</td>
                    <td className="p-3">{guardian.nationality}</td>
                    <td className="p-3">{guardian.state}</td>
                    <td className="p-3">{guardian.religion}</td>
                    <td className="p-3 flex gap-2 text-blue-600">
                      <FaEye className="cursor-pointer" />
                      <FaEdit className="cursor-pointer text-green-600" />
                      <FaTrash className="cursor-pointer text-red-600" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-3 text-center text-sm text-gray-600">
              <span className="text-orange-500">&lt;</span> Page 1 of 1{" "}
              <span className="text-orange-500">&gt;</span>
            </div>
          </div>

          {/* Removed Floating Add Guardian Button */}

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white rounded-lg w-[95%] max-w-2xl">
                <div className="bg-orange-500 h-3 rounded-t-lg"></div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4 text-center">Add Guardian</h2>
                  <div className="flex justify-center mb-4">
                    <label className="relative w-24 h-24 rounded-full bg-orange-100 border-2 border-orange-400 overflow-hidden cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      {imagePreview ? (
                        <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="flex items-center justify-center h-full text-orange-400 font-bold text-2xl">
                          +
                        </span>
                      )}
                    </label>
                  </div>

                  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="firstName" placeholder="First Name" required className="border px-3 py-2 rounded" value={formData.firstName} onChange={handleInputChange} />
                    <input type="text" name="lastName" placeholder="Last Name" required className="border px-3 py-2 rounded" value={formData.lastName} onChange={handleInputChange} />
                    <input type="text" name="phone" placeholder="Phone Number" required className="border px-3 py-2 rounded" value={formData.phone} onChange={handleInputChange} />
                    <input type="text" name="address" placeholder="Home Address" className="border px-3 py-2 rounded" value={formData.address} onChange={handleInputChange} />
                    <input type="text" name="nationality" placeholder="Nationality" className="border px-3 py-2 rounded" value={formData.nationality} onChange={handleInputChange} />
                    <input type="text" name="state" placeholder="State of Origin" className="border px-3 py-2 rounded" value={formData.state} onChange={handleInputChange} />
                    <input type="text" name="religion" placeholder="Religion" className="border px-3 py-2 rounded" value={formData.religion} onChange={handleInputChange} />
                    <input type="email" name="email" placeholder="Email" className="border px-3 py-2 rounded" value={formData.email} onChange={handleInputChange} />
                    <input type="text" name="username" placeholder="Username" className="border px-3 py-2 rounded" value={formData.username} onChange={handleInputChange} />
                    <input type="text" name="occupation" placeholder="Occupation" className="border px-3 py-2 rounded" value={formData.occupation} onChange={handleInputChange} />
                    <input type="text" name="workAddress" placeholder="Work Address" className="border px-3 py-2 rounded" value={formData.workAddress} onChange={handleInputChange} />
                    <input type="text" name="relationship" placeholder="Relationship" className="border px-3 py-2 rounded" value={formData.relationship} onChange={handleInputChange} />

                    <div className="col-span-2 flex justify-end gap-3 mt-2">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 border rounded"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                      >
                        Submit
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
