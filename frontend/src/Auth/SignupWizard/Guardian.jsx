import { useState, useContext } from 'react';
import axios from 'axios';
import TermsModal from './TermsModal';

const baseUrl = process.env.REACT_APP_BASEURL;
import TermsModal from './TermsModal';
const Guardian = ({ nextStep }) => {
  const [formData, setFormData] = useState({
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

  const [showTerms, setShowTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAgree = () => {
    setFormData(prev => ({ ...prev, hasAgreedToTerms: true }));
    setShowTerms(false);
  };

  const handleDecline = () => {
    setFormData(prev => ({ ...prev, hasAgreedToTerms: false }));
    setShowTerms(false);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.hasAgreedToTerms) {
      setError('You must agree to the terms and conditions.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${baseUrl}/api/School/RegisterSchool`,
        formData
      );
      console.log('School registered:', response.data);
      nextStep();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center pt-12 pb-24 min-h-screen">
      <form onSubmit={handleSubmit} className="p-10 lg:px-20 space-y-6 w-full max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* School Fields */}
          {[
            { label: 'School Name', name: 'schoolName' },
            { label: 'School Email', name: 'schoolEmail', type: 'email' },
            { label: 'School Phone', name: 'schoolPhone' },
            { label: 'Address', name: 'address' },
            { label: 'Country', name: 'country' },
            { label: 'State', name: 'state' },
            { label: 'City', name: 'city' },
          ].map(({ label, name, type = 'text' }) => (
            <div key={name}>
              <label htmlFor={name} className="block mb-2 font-semibold text-gray-700 text-lg">
                {label}
              </label>
              <input
                type={type}
                id={name}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={`Enter ${label.toLowerCase()}`}
                className="w-full p-4 border rounded-md outline-none focus:border-primary text-base"
                required
              />
            </div>
          ))}

          {/* Type of School */}
          <div>
            <label htmlFor="typeOfSchool" className="block mb-2 font-semibold text-gray-700 text-lg">
              Type of School
            </label>
            <select
              id="typeOfSchool"
              name="typeOfSchool"
              value={formData.typeOfSchool}
              onChange={handleChange}
              className="w-full p-4 border rounded-md outline-none focus:border-primary text-base"
              required
            >
              <option value="">Select type</option>
              <option value="Primary">Primary</option>
              <option value="Secondary">Secondary</option>
              <option value="College">College</option>
            </select>
          </div>

          {/* Owner Info */}
          {[
            { label: 'Owner Name', name: 'ownerName' },
            { label: 'Owner Email', name: 'ownerEmail', type: 'email' },
            { label: 'Owner Phone', name: 'ownerPhone' },
            { label: 'Password', name: 'password', type: 'password' },
          ].map(({ label, name, type = 'text' }) => (
            <div key={name}>
              <label htmlFor={name} className="block mb-2 font-semibold text-gray-700 text-lg">
                {label}
              </label>
              <input
                type={type}
                id={name}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={`Enter ${label.toLowerCase()}`}
                className="w-full p-4 border rounded-md outline-none focus:border-primary text-base"
                required
              />
            </div>
          ))}
        </div>

        <TermsModal isOpen={showTerms} onAgree={handleAgree} onDecline={handleDecline} />

        <div className="pt-4">
          <button
            type="button"
            onClick={() => setShowTerms(true)}
            className="text-sm text-blue-600 underline hover:text-blue-800"
          >
            Agree To Terms and Conditions
          </button>
        </div>

        {error && <p className="text-red-600 pt-4">{error}</p>}

        <div className="flex mt-10">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-24 rounded-lg text-lg shadow-md transition duration-200"
          >
            {loading ? 'Submitting...' : 'Next'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Guardian;
