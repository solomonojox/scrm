import React, { useState } from 'react';
import axios from 'axios';

const baseUrl = process.env.REACT_APP_BASEURL;

const AddAdmin = ({ nextStep }) => {
  const [formData, setFormData] = useState({
    schoolId: '',
    fullName: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(
        `${baseUrl}/api/SchoolAdmin/Register`,
        formData
      );
      console.log('Admin registered:', response.data);
      nextStep();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center pt-12 pb-24 min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="p-10 lg:px-20 space-y-6 w-full max-w-5xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="schoolId" className="block mb-2 font-semibold text-gray-700 text-lg">
              School ID
            </label>
            <input
              type="text"
              id="schoolId"
              name="schoolId"
              value={formData.schoolId}
              onChange={handleChange}
              placeholder="Enter school ID"
              className="w-full p-4 border rounded-md outline-none focus:border-primary text-base"
              required
            />
          </div>

          <div>
            <label htmlFor="fullName" className="block mb-2 font-semibold text-gray-700 text-lg">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
              className="w-full p-4 border rounded-md outline-none focus:border-primary text-base"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-2 font-semibold text-gray-700 text-lg">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="w-full p-4 border rounded-md outline-none focus:border-primary text-base"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 font-semibold text-gray-700 text-lg">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full p-4 border rounded-md outline-none focus:border-primary text-base"
              required
            />
          </div>
        </div>

        {error && <p className="text-red-600 pt-2">{error}</p>}

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAdmin;
