import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import NavbarDashboard from "../../NavbarDashboard";
// import AdminEditMemberProfile from './Admin_EditMemberProfile';
// import Security from "./Security";

import { FaRegEdit } from "react-icons/fa";
// import { IoKey } from "react-icons/io5";
// import { RiParentFill } from "react-icons/ri";
// import { TiDocumentText } from "react-icons/ti";
import { GiTakeMyMoney } from "react-icons/gi";
// import Results from "./Results";
// import Guardian from "./Guardian";
import AdminEditTeacherProfile from "./AdminEditTeacherProfile";
import axios from "axios";
const baseUrl = process.env.REACT_APP_BASEURL;
function AdminTeacherProfile() {
  const location = useLocation();
  const teacherId = location.state;
  console.log(teacherId);
  
 
  const [Classroom, setClassroom]=useState([]);
  useEffect(() => {
    const fetchclassroom = async() =>{
      try {
        const res = await axios.get(`${baseUrl}/api/Classroom/GetClassroomByTeacherId/${teacherId}`)
        setClassroom(res.data.data);
        console.log(res.data.data);
      } catch (error) {
        console.error('error', error);
      }
    }
    fetchclassroom();
    window.scrollTo(0, 0);
  },[teacherId]);
  const [activeTab, setActiveTab] = useState('Edit Profile');
  const tabs = [
    { id: 1, label: 'Edit Profile', value: <AdminEditTeacherProfile teacherId={location.state} />, icon: <FaRegEdit /> },
    { id: 2, label: 'Classroom', value:(
      <div className="mt-20 space-y-6 "> 
        {Classroom.length > 0 ?(
          Classroom.map((Classroom,index)=>(
            <div key={index} className="bg-white p-4 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition duration-300 mt-20 space-y-6">
              <h3 className="text-lg font-semibold text-primary-bg mb-2">Classroom : {Classroom.name}</h3>
            </div>
          ))
        ):( <p>no classroom assigned to this teacher</p> )}
        </div>
    ), icon: <GiTakeMyMoney /> },
    // { id: 3, label: 'Results', value: <Results studentId={location.state} />, icon: <TiDocumentText /> },
    // { id: 4, label: 'Guardian', value: <Guardian/>, icon: <RiParentFill /> },
    // { id: 5, label: 'Security', value: "<Security studentId={location.state}/>", icon: <IoKey /> }
  ];

  return (
    <div className='bg-gray-100 h-screen'>
      <div className='sticky top-0 z-50'>
        <NavbarDashboard />
      </div>

      <div className='w-full'>

        <div className="lg:px-4 flex flex-col lg:flex-row mt-5">
          {/* SidTab */}
          <div className="bg-white w-full flex lg:flex-col lg:space-y-4 lg:w-48 p-4 rounded-lg lg:h-[100dvh] sticky top-[80px] lg:fixed mb-6 z-40 mt-14">
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

export default AdminTeacherProfile;