import React, { useState, useContext, useCallback } from 'react';
import axios from 'axios';
import TermsModal from '../TermsModal';
import { AppContext } from '../../../context/AppContext';
import { motion } from 'framer-motion';

const baseUrl = process.env.REACT_APP_BASEURL;

const Guardian = ({ nextStep }) => {
  const [showTerms, setShowTerms] = useState(false);
  const { notifySuccess, notifyError, showOverlay, hideOverlay } = useContext(AppContext);

  const [data, setData] = useState({
    schoolName: '',
    schoolEmail: '',
    schoolPhone: '',
    address: '',
    typeOfSchool: '',
    country: '',
    state: '',
    city: '',
    ownerName: '',
    ownerPhone: '',
    ownerEmail: '',
    password: '',
    hasAgreedToTerms: false,
  });

  const handleAgree = () => {
    setShowTerms(false);
    setData(prev => ({ ...prev, hasAgreedToTerms: true }));
    notifySuccess && notifySuccess('Terms accepted. You can proceed.');
  };

  const handleDecline = () => {
    setShowTerms(false);
    setData(prev => ({ ...prev, hasAgreedToTerms: false }));
    notifyError && notifyError('You must agree to the terms to proceed.');
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.hasAgreedToTerms) {
      notifyError && notifyError('You must agree to the terms and conditions before continuing.');
      setShowTerms(true);
      return;
    }

    showOverlay && showOverlay();
    try {
      const res = await axios.post(`${baseUrl}/api/School/RegisterSchool`, data);
<<<<<<< HEAD
      console.log('Submitted successfully:', res.data);
      notifySuccess && notifySuccess('School registered successfully.');
      const registeredSchoolId = res?.data?.data?.schoolId;
      if (registeredSchoolId) {
        localStorage.setItem('schoolId', registeredSchoolId);
      }
      nextStep && nextStep();
    } catch (error) {
      console.error('Submission error:', error);
      const msg = error.response?.data?.message || 'Something went wrong. Please try again.';
      notifyError && notifyError(msg);
    } finally {
      hideOverlay && hideOverlay();
=======
      console.log("Submitted successfully:", res.data);
      notifySuccess("School registration successful!");
      nextStep(); // ✅ Move to next step after success
    } catch (error) {
      console.error("Submission error:", error);
      notifyError(error.response ? error.response.data.responseMessage : error.message);
      console.error("Error details:", error.response ? error.response.data : error.message);
    }
    finally{
      hideOverlay()
>>>>>>> DevBranch
    }
  };

  // Field definitions for DRY rendering
  const fields = [
    { label: 'School Name', name: 'schoolName', type: 'text' },
    { label: 'School Email', name: 'schoolEmail', type: 'email' },
    { label: 'School Phone', name: 'schoolPhone', type: 'text' },
    { label: 'Address', name: 'address', type: 'text' },
    { label: 'Country', name: 'country', type: 'text' },
    { label: 'State', name: 'state', type: 'text' },
    { label: 'City', name: 'city', type: 'text' },
    { label: 'Owner Name', name: 'ownerName', type: 'text' },
    { label: 'Owner Phone', name: 'ownerPhone', type: 'text' },
    { label: 'Owner Email', name: 'ownerEmail', type: 'email' },
    { label: 'Password', name: 'password', type: 'password' },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8 space-y-8"
      >
        <h2 className="text-3xl font-semibold text-gray-800 text-center">
          Register School
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.slice(0, 7).map(({ label, name, type }) => (
            <div key={name}>
              <label
                htmlFor={name}
                className="block mb-2 font-medium text-gray-700"
              >
                {label}
              </label>
              <input
                type={type}
                id={name}
                name={name}
                value={data[name]}
                onChange={handleChange}
                placeholder={`Enter ${label}`}
                required
                className="w-full p-3 border border-gray-300 rounded-lg outline-none 
                           focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
              />
            </div>
          ))}

          <div>
            <label
              htmlFor="typeOfSchool"
              className="block mb-2 font-medium text-gray-700"
            >
              Type of School
            </label>
            <select
              id="typeOfSchool"
              name="typeOfSchool"
              value={data.typeOfSchool}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg outline-none
                         focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
            >
              <option value="">Select type</option>
              <option value="Primary">Primary</option>
              <option value="Secondary">Secondary</option>
              <option value="College">College</option>
            </select>
          </div>

          {fields.slice(7).map(({ label, name, type }) => (
            <div key={name}>
              <label
                htmlFor={name}
                className="block mb-2 font-medium text-gray-700"
              >
                {label}
              </label>
              <input
                type={type}
                id={name}
                name={name}
                value={data[name]}
                onChange={handleChange}
                placeholder={`Enter ${label}`}
                required
                className="w-full p-3 border border-gray-300 rounded-lg outline-none 
                           focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
              />
            </div>
          ))}
        </div>

        <div className="pt-4">
          <button
            type="button"
            onClick={() => setShowTerms(true)}
            className="text-sm text-orange-600 underline hover:text-orange-800"
          >
            View Terms and Conditions
          </button>
          {!data.hasAgreedToTerms ? (
            <p className="text-sm text-red-500 mt-2">
              You must accept terms to proceed.
            </p>
          ) : (
            <p className="text-sm text-green-600 mt-2">Terms accepted ✓</p>
          )}
        </div>

        <TermsModal
          isOpen={showTerms}
          onAgree={handleAgree}
          onDecline={handleDecline}
        />

        <div className="flex justify-center mt-6">
          <motion.button
            type="submit"
            disabled={!data.hasAgreedToTerms}
            whileHover={
              data.hasAgreedToTerms
                ? { scale: 1.03 }
                : {}
            }
            whileTap={
              data.hasAgreedToTerms
                ? { scale: 0.97 }
                : {}
            }
            className={`font-medium py-4 px-16 rounded-xl shadow-md transition-colors
              ${
                data.hasAgreedToTerms
                  ? 'bg-orange-500 hover:bg-orange-600 text-white cursor-pointer'
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'
              }
            `}
          >
            Next
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default Guardian;
