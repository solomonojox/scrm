import React, { useState, useContext, useCallback, useEffect } from 'react';
import axios from 'axios';
import { AppContext } from '../../../context/AppContext'; 
import { motion } from 'framer-motion';

import { useNavigate } from 'react-router-dom';
const baseUrl = process.env.REACT_APP_BASEURL; 





const SchoolAdminRegister = ({ nextStep }) => {
  const { notifySuccess, notifyError, showOverlay, hideOverlay } = useContext(AppContext);
 

  const [schoolId, setSchoolId] = useState('');
  const [data, setData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
   const navigate = useNavigate();
  useEffect(() => {
    const storedId = localStorage.getItem('schoolId');
    if (storedId) {
      setSchoolId(storedId);
      console.log('Retrieved schoolId:', storedId);
    } else {
      console.warn('No schoolId in localStorage. User may need to register first.');
    }
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!schoolId) {
      notifyError?.('No School ID found. Please register a school first.');
      return;
    }
    if (!data.fullName || !data.email || !data.password) {
      notifyError?.('Please fill in all fields before submitting.');
      return;
    }

    setIsSubmitting(true);
    showOverlay?.();
    try {
      const payload = {
        schoolId,
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      };
      const res = await axios.post(
        `${baseUrl}/api/SchoolAdmin/Register`,
        payload
      );
      console.log('Admin registered:', res.data);
      notifySuccess?.('School admin registered successfully.');

      nextStep?.();
      navigate('/login')

      navigate('/registration-successful')

    } catch (error) {
      console.error('Registration error:', error);
      const msg = error.response?.data?.message
        || error.response?.data?.responseMessage
        || 'Something went wrong. Please try again.';
      notifyError?.(msg);
    } finally {
      hideOverlay?.();
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen  p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white  p-8 space-y-6"
      >
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Register School Admin
        </h2>

        {!schoolId && (
          <p className="text-center text-red-500 mb-4">
            No School ID found. Please register a school first.
          </p>
        )}

        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block mb-2 font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={data.fullName}
            onChange={handleChange}
            placeholder="Enter full name"
            required
            className="w-full p-3 border border-gray-300 rounded-lg outline-none 
              focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block mb-2 font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={data.email}
            onChange={handleChange}
            placeholder="Enter email"
            required
            className="w-full p-3 border border-gray-300 rounded-lg outline-none 
              focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block mb-2 font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={data.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
            className="w-full p-3 border border-gray-300 rounded-lg outline-none 
              focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
          />
        </div>

        <div className="flex justify-center mt-4">
          <motion.button
            type="submit"
            disabled={isSubmitting || !schoolId}
            whileHover={!isSubmitting && schoolId ? { scale: 1.03 } : {}}
            whileTap={!isSubmitting && schoolId ? { scale: 0.97 } : {}}
            className={`font-medium py-3 px-10 rounded-xl shadow-md transition-colors
              ${isSubmitting || !schoolId
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-orange-500 hover:bg-orange-600 text-white cursor-pointer'
              }
            `}
          >
            {isSubmitting ? 'Submitting...' : 'Register'}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default SchoolAdminRegister;
