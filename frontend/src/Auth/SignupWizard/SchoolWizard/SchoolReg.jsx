/* eslint-disable no-unused-vars */
import { useContext, useState } from 'react';
import axios from 'axios';
import TermsModal from '../TermsModal';
import { AppContext } from '../../../context/AppContext';
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
    hasAgreedToTerms: false
  });

  const handleAgree = () => {
  setShowTerms(false);
  setData(prev => ({ ...prev, hasAgreedToTerms: true })); 
};

const handleDecline = () => {
  setShowTerms(false);
  setData(prev => ({ ...prev, hasAgreedToTerms: false })); 
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.hasAgreedToTerms) {
      alert("You must agree to the terms and conditions before continuing.");
      return;
    }
    showOverlay();

    try {
      const res = await axios.post(`${baseUrl}/api/School/RegisterSchool`, data);
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
    }
  };

  return (
      <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleSubmit} className="p-10 lg:px-20 space-y-6 w-full max-w-5xl bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="SchoolName" className="block mb-2 font-medium text-gray-700 text-md">
              School Name
            </label>
            <input
              type="text"
              id="SchoolName"
              name="SchoolName"
              onChange={(e)=> setData({...data,schoolName:e.target.value })}
              value={data.schoolName}
              placeholder="Enter school name"
              className="w-full p-2 border rounded-md outline-none focus:border-primary text-md"
            />
          </div>

          <div>
            <label htmlFor="SchoolEmail" className="block mb-2 font-medium text-gray-700 text-md">
              School Email
            </label>
            <input
              type="email"
              id="SchoolEmail"
              name="SchoolEmail"
               onChange={(e)=> setData({...data,schoolEmail:e.target.value })}
               value={data.schoolEmail}
              placeholder="Enter school email"
              className="w-full p-2 border rounded-md outline-none focus:border-primary text-md"
            />
          </div>

          <div>
            <label htmlFor="SchoolPhone" className="block mb-2 font-medium text-gray-700 text-md">
              School Phone
            </label>
            <input
              type="text"
              id="SchoolPhone"
              name="SchoolPhone"
               onChange={(e)=> setData({...data,schoolPhone:e.target.value })}
               value={data.schoolPhone}
              placeholder="Enter school phone"
              className="w-full p-2 border rounded-md outline-none focus:border-primary text-md"
            />
          </div>

          <div>
            <label htmlFor="Address" className="block mb-2 font-medium text-gray-700 text-md">
              Address
            </label>
            <input
              type="text"
              id="Address"
              name="Address"
               onChange={(e)=> setData({...data,address:e.target.value })}
               value={data.address}
              placeholder="Enter address"
              className="w-full p-2 border rounded-md outline-none focus:border-primary text-md"
            />
          </div>

          <div>
            <label htmlFor="TypeOfSchool" className="block mb-2 font-medium text-gray-700 text-md">
              Type of School
            </label>
            <select
              id="TypeOfSchool"
              name="TypeOfSchool"
               onChange={(e)=> setData({...data, typeOfSchool:e.target.value })}
               value={data.typeOfSchool}
              className="w-full p-2 border rounded-md outline-none focus:border-primary text-md"
            >
              <option value="">Select type</option>
              <option value="Primary">Primary</option>
              <option value="Secondary">Secondary</option>
              <option value="College">College</option>
            </select>
          </div>

          <div>
            <label htmlFor="Country" className="block mb-2 font-medium text-gray-700 text-md">
              Country
            </label>
            <input
              type="text"
              id="Country"
              name="Country"
               onChange={(e)=> setData({...data,country:e.target.value })}
               value={data.country}
              placeholder="Enter country"
              className="w-full p-2 border rounded-md outline-none focus:border-primary text-md"
            />
          </div>

          <div>
            <label htmlFor="State" className="block mb-2 font-medium text-gray-700 text-md">
              State
            </label>
            <input
              type="text"
              id="State"
               onChange={(e)=> setData({...data,state:e.target.value })}
               value={data.state}
              name="State"
              placeholder="Enter state"
              className="w-full p-2 border rounded-md outline-none focus:border-primary text-md"
            />
          </div>

          <div>
            <label htmlFor="City" className="block mb-2 font-medium text-gray-700 text-md">
              City
            </label>
            <input
              type="text"
              id="City"
              name="City"
               onChange={(e)=> setData({...data, city:e.target.value })}
               value={data.city}
              placeholder="Enter city"
              className="w-full p-2 border rounded-md outline-none focus:border text-md"
            />
          </div>
            <div>
            <label htmlFor="City" className="block mb-2 font-medium text-gray-700 text-md">
              Name
            </label>
            <input
              type="text"
              id="OwnerName"
               onChange={(e)=> setData({...data,ownerName:e.target.value })}
               value={data.ownerName}
              name="OwnerName"
              placeholder="OwnerName"
              className="w-full p-2 border rounded-md outline-none focus:border text-md"
            />
          </div>
            <div>
            <label htmlFor="City" className="block mb-2 font-medium text-gray-700 text-md">
              Phone
            </label>
            <input
              type="text"
              id="OwnerPhone"
              name="OwnerPhone"
               onChange={(e)=> setData({...data,ownerPhone:e.target.value })}
               value={data.ownerPhone}
              placeholder="OwnerPhone"
              className="w-full p-2 border rounded-md outline-none focus:border text-md"
            />
          </div>
            <div>
            <label htmlFor="City" className="block mb-2 font-medium text-gray-700 text-md">
              Email
            </label>
            <input
              type="text"
              id="OwnerEmail"
              name="OwnerEmail"
              placeholder="OwnerEmail"
               onChange={(e)=> setData({...data,ownerEmail:e.target.value })}
               value={data.ownerEmail}
              className="w-full p-2 border rounded-md outline-none focus:border text-md"
            />
          </div>
            <div>
            <label htmlFor="City" className="block mb-2 font-medium text-gray-700 text-md">
             Password
            </label>
            <input
              type="password"
              id="OwnerPassword"
              name="OwnerPassword"
               onChange={(e)=> setData({...data,password:e.target.value })}
               value={data.password}
              placeholder="OwnerPassword"
              className="w-full p-2 border rounded-md outline-none focus:border text-md"
            />
          </div>
        </div>

        {/* Terms Modal */}
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
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-4 px-24 rounded-lg text-md shadow-md transition duration-200"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default Guardian;
