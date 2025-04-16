import React, {useEffect, useState}from "react";
import Sidebar from "../Pages/Sidebar";
import axios from "axios";
const Assignment = () => {
  const [data, setData]= useState([]);
  let classroomId = Number(localStorage.getItem('classroomId'));
  useEffect(()=>{
    const  fetchAss = async () =>{
      try{
        const response = await axios.get(`https://scrmapi.tranquility.org.ng/api/Assignment/GetAssignmentByClassId/${classroomId}`) 
        setData(response.data);
        console.log(response.data)
  
      } catch(error){
        console.error('error', error);
      }
    }
    fetchAss();
  },[classroomId]);

  return (
    <div className="flex">
    <div className="fixed">
      <Sidebar />
    </div>
    <div className="ml-[280px] mt-5">
      <p className="font-bold text-xl">Assignment List</p>
      {data.length > 0 ? (
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Header row using td instead of th */}
              <tr className="bg-gray-50">
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                  Title
                </td>
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                  Description
                </td>
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                  Due Date
                </td>
              </tr>
              {data.map((assignment) => (
                <tr key={assignment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {assignment.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {assignment.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {assignment.duedate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-4 text-gray-700">No assignments available.</div>
      )}
    </div>
  </div>

  );
};

export default Assignment;
