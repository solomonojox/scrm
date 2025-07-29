import React, { useState } from "react";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaBell,
  FaEnvelope,
  FaSearch,
  FaComment,
} from "react-icons/fa";
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
      <div className="mt-[70px] min-h-screen flex">
        <Side />
        <div className="flex-1 p-4 space-y-4">
          {/* Topbar */}
          <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 rounded-md bg-white shadow-md">
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

          <div className="flex justify-between items-center">
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

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
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
                        <img
                          src={imagePreview}
                          alt="preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="flex items-center justify-center h-full text-orange-400 font-bold text-2xl">
                          +
                        </span>
                      )}
                    </label>
                  </div>

                  <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      required
                      className="border px-3 py-2 rounded"
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      required
                      className="border px-3 py-2 rounded"
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                    <input
                      type="text"
                      name="phone"
                      placeholder="Phone Number"
                      required
                      className="border px-3 py-2 rounded"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                    <input
                      type="text"
                      name="address"
                      placeholder="Home Address"
                      className="border px-3 py-2 rounded"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                    <input
                      type="text"
                      name="nationality"
                      placeholder="Nationality"
                      className="border px-3 py-2 rounded"
                      value={formData.nationality}
                      onChange={handleInputChange}
                    />
                    <input
                      type="text"
                      name="state"
                      placeholder="State of Origin"
                      className="border px-3 py-2 rounded"
                      value={formData.state}
                      onChange={handleInputChange}
                    />
                    <input
                      type="text"
                      name="religion"
                      placeholder="Religion"
                      className="border px-3 py-2 rounded"
                      value={formData.religion}
                      onChange={handleInputChange}
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      className="border px-3 py-2 rounded"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                    <input
                      type="text"
                      name="username"
                      placeholder="Username"
                      className="border px-3 py-2 rounded"
                      value={formData.username}
                      onChange={handleInputChange}
                    />
                    <input
                      type="text"
                      name="occupation"
                      placeholder="Occupation"
                      className="border px-3 py-2 rounded"
                      value={formData.occupation}
                      onChange={handleInputChange}
                    />
                    <input
                      type="text"
                      name="workAddress"
                      placeholder="Work Address"
                      className="border px-3 py-2 rounded"
                      value={formData.workAddress}
                      onChange={handleInputChange}
                    />
                    <input
                      type="text"
                      name="relationship"
                      placeholder="Relationship"
                      className="border px-3 py-2 rounded"
                      value={formData.relationship}
                      onChange={handleInputChange}
                    />

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
