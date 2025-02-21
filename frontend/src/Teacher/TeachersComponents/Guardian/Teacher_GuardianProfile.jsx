import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import NavbarDashboard from "../../../Admin/NavbarDashboard";
// import AdminEditMemberProfile from './Admin_EditMemberProfile';
// import Security from "./Security";

import { FaRegEdit } from "react-icons/fa";
// import { IoKey } from "react-icons/io5";
import { RiParentFill } from "react-icons/ri";
// import { TiDocumentText } from "react-icons/ti";
// import { GiTakeMyMoney } from "react-icons/gi";
// import Results from "./Results";
import Students from "./Students";
import AdminEditGuardianProfile from "./AdminEditGuardianProfile";

function AdminGuardianProfile() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  });

  const [activeTab, setActiveTab] = useState('Edit Profile');
  const tabs = [
    { id: 1, label: 'Edit Profile', value: <AdminEditGuardianProfile guardianId={location.state} />, icon: <FaRegEdit /> },
    { id: 2, label: 'Students', value: <Students guardianId={location.state}/>, icon: <RiParentFill /> },
    // { id: 3, label: 'Results', value: <Results studentId={location.state} />, icon: <TiDocumentText /> },
    // { id: 4, label: 'Guardian', value: <Guardian/>, icon: <RiParentFill /> },
    // { id: 5, label: 'Security', value: "<Security studentId={location.state}/>", icon: <IoKey /> }
  ];

  return (
    <div className='bg-gray-100'>
      <div className='sticky top-0 z-50'>
        <NavbarDashboard />
      </div>

      <div className='w-full'>

        <div className="lg:px-4 flex flex-col lg:flex-row mt-5">
          {/* SidTab */}
          <div className="bg-white w-full flex lg:flex-col lg:space-y-4 lg:w-48 p-4 rounded-lg lg:h-[100dvh] sticky top-[80px] lg:fixed mb-6 z-40 ">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.label)}
                className={`flex flex-col lg:flex-row items-center space-x-2 lg:space-x-2 px-2 lg:px-4 py-2 rounded-lg hover:bg-gray-200 ${activeTab === tab.label ? 'bg-blue-50 border border-primary-bg' : ''}`}
              >
                <span className="lg:p-2 bg-blue-100 rounded-full text-primary-bg">{tab.icon}</span><span className="text-primary-bg">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Main content */}
          <div className="flex-1 px-4 lg:ml-[192px]">
            {tabs.map(content => (
              <div key={content.id}>
                {content.label === activeTab && (
                  <div>{content.value}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminGuardianProfile;
