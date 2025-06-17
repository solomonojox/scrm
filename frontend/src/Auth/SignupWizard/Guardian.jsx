import { useState, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
const baseUrl = process.env.REACT_APP_BASEURL;
import TermsModal from './TermsModal';
const Guardian = ({ nextStep }) => {
  const [showTerms, setShowTerms] = useState(false);

  const handleAgree = () => {
    setShowTerms(false);
    // optionally save agreement state
  };

  const handleDecline = () => {
    setShowTerms(false);
    // optionally show a warning or prevent form progress
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    nextStep(); // move to next step
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleSubmit} className="p-10 lg:px-20 space-y-6 w-full max-w-5xl bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="SchoolName" className="block mb-2 font-semibold text-gray-700 text-lg">
              School Name
            </label>
            <input
              type="text"
              id="SchoolName"
              name="SchoolName"
              placeholder="Enter school name"
              className="w-full p-4 border rounded-md outline-none focus:border-primary text-base"
            />
          </div>

          <div>
            <label htmlFor="SchoolEmail" className="block mb-2 font-semibold text-gray-700 text-lg">
              School Email
            </label>
            <input
              type="email"
              id="SchoolEmail"
              name="SchoolEmail"
              placeholder="Enter school email"
              className="w-full p-4 border rounded-md outline-none focus:border-primary text-base"
            />
          </div>

          <div>
            <label htmlFor="SchoolPhone" className="block mb-2 font-semibold text-gray-700 text-lg">
              School Phone
            </label>
            <input
              type="text"
              id="SchoolPhone"
              name="SchoolPhone"
              placeholder="Enter school phone"
              className="w-full p-4 border rounded-md outline-none focus:border-primary text-base"
            />
          </div>

          <div>
            <label htmlFor="Address" className="block mb-2 font-semibold text-gray-700 text-lg">
              Address
            </label>
            <input
              type="text"
              id="Address"
              name="Address"
              placeholder="Enter address"
              className="w-full p-4 border rounded-md outline-none focus:border-primary text-base"
            />
          </div>

          <div>
            <label htmlFor="TypeOfSchool" className="block mb-2 font-semibold text-gray-700 text-lg">
              Type of School
            </label>
            <select
              id="TypeOfSchool"
              name="TypeOfSchool"
              className="w-full p-4 border rounded-md outline-none focus:border-primary text-base"
            >
              <option value="">Select type</option>
              <option value="Primary">Primary</option>
              <option value="Secondary">Secondary</option>
              <option value="College">College</option>
            </select>
          </div>

          <div>
            <label htmlFor="Country" className="block mb-2 font-semibold text-gray-700 text-lg">
              Country
            </label>
            <input
              type="text"
              id="Country"
              name="Country"
              placeholder="Enter country"
              className="w-full p-4 border rounded-md outline-none focus:border-primary text-base"
            />
          </div>

          <div>
            <label htmlFor="State" className="block mb-2 font-semibold text-gray-700 text-lg">
              State
            </label>
            <input
              type="text"
              id="State"
              name="State"
              placeholder="Enter state"
              className="w-full p-4 border rounded-md outline-none focus:border-primary text-base"
            />
          </div>

          <div>
            <label htmlFor="City" className="block mb-2 font-semibold text-gray-700 text-lg">
              City
            </label>
            <input
              type="text"
              id="City"
              name="City"
              placeholder="Enter city"
              className="w-full p-4 border rounded-md outline-none focus:border text-lg"
            />
          </div>
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
        <div className="flex mt-10">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-24 rounded-lg text-lg shadow-md transition duration-200"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default Guardian;
