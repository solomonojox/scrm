import React, { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../../../context/AppContext';
import NavbarDashboard from '../../TeacherNavbarDashboard';
import assets from '../../../Assets/assets';

import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
// import { PiStudentFill } from "react-icons/pi";

const ViewStudents = () => {
  const { showOverlay, hideOverlay, capitalizeText, formatDate } = useContext(AppContext);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setOpenEditMenu(false);
    }
  }
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, []);

  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // function countElements(arr) {
  //   let count = 0;
  //   for (let i = 0; i < arr.length; i++) {
  //     count++;
  //   }
  //   return count;
  // }

  useEffect(() => {
    const fetchStudents = async () => {
      showOverlay()
      try {
        const response = await axios.get('https://scrmapi.tranquility.org.ng/api/Student/GetAllStudent');
        setStudents(response.data);
        console.log(response.data)
      } catch (error) {
        console.error(error);
        if (error.response) {
          setMessage(error.response.data.responseMessage)
        } else {
          setMessage(`${error.message}, check your internet connection`)
        }
      } finally {
        hideOverlay()
      }
    }
    fetchStudents();
  }, [showOverlay, hideOverlay]);

  const [openEditMenu, setOpenEditMenu] = useState(false);
  const [studentId, setStudentId] = useState(null);

  const toggleEditMenu = (item) => {
    setOpenEditMenu(!openEditMenu);
    setStudentId(item);
  };

  const handleView = (id) => {
    navigate(`/teacher/student/${id}`, { state: id });
  };

  const findStudentByName = (students, searchQuery) => {
    if (!searchQuery) return;
    const lowerCaseQuery = searchQuery.toLowerCase();

    const result = students.filter(student => student.lastname.toLowerCase().includes(lowerCaseQuery));
    return result || null;
  }

  const [studentsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const iLastStudent = currentPage * studentsPerPage;
  const iFirstStudent = iLastStudent - studentsPerPage;
  const currentStudents = students.slice(iFirstStudent, iLastStudent);

  const totalPages = Math.ceil(students.length / studentsPerPage);

  const handlePageChange = (increment) => {
    setCurrentPage(prev => Math.min(Math.max(prev + increment, 1), totalPages));
  };

  return (
    <div className="bg-gray-100 pb-8">
      <div className="sticky top-0 mb-10">
        <NavbarDashboard />
      </div>

      <div className="container mb-10 mx-auto p-2">
        <div className=''>
          <div className="flex flex-col lg:flex-row justify-between lg:items-center mb-4">
            <h2 className="text-2xl font-medium mb-4 text-start">
              All Students
            </h2>
            <div className="gap-2 flex items-center flex-col md:flex-row md:justify-between ">
              <button
                className="bg-primary-bg text-white hover:bg-primary-hover transition-all duration-300 px-4 py-2 rounded mr-2"
                onClick={() => navigate('/registrationwiz')}
              >
                Add Student
              </button>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search Students"
                  className="border border-gray-300 focus:border-primary outline-none rounded-md px-4 py-2 lg:w-[350px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="bg-primary-bg text-white hover:bg-primary-hover transition-all duration-300 px-4 py-2 rounded">
                  Search
                </button>

                <div className='flex items-center bg-primary-bg py-2 px-4 text-white gap-2'>
                  <button
                    onClick={() => handlePageChange(-1)}
                    disabled={currentPage === 1}
                    className={`${currentPage === 1 ? 'opacity-20' : 'opacity-100'}`}
                  >
                    <FaAngleLeft className='text-2xl' />
                  </button>

                  <span className='font-medium'>page {currentPage} of {totalPages}</span>

                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === totalPages}
                    className={`${currentPage === totalPages ? 'opacity-20' : 'opacity-100'}`}
                  >
                    <FaAngleRight className='text-2xl' />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto p-1 pb-24">
          <table className="min-w-full table-auto  rounded-lg shadow-md">
            <thead>
              <tr className="bg-gradient-to-r from-primary-bg to-green-800 text-white rounded-t-lg">
                <th className="px-4 py-4 text-left">Student Name</th>
                <th className="px-2 py-4 text-left">Age</th>
                <th className="px-2 py-4 text-left">Classroom</th>
                <th className="px-2 py-4 text-left">Student No</th>
                <th className="px-2 py-4 text-left">Address</th>
                <th className="px-2 py-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                // Decide which dataset to display: foundStudents or all students
                const filteredStudents = searchQuery
                  ? findStudentByName(students, searchQuery) || []
                  : currentStudents;

                return filteredStudents && filteredStudents.length > 0 ? (
                  filteredStudents.map((student, index) => (
                    <tr
                      key={student.studentId}
                      className={`${index % 2 === 0 ? "bg-blue-50" : "bg-green-50"
                        } hover:bg-gradient-to-r hover:from-green-100 hover:to-purple-100 border-b text-sm text-gray-700 transition-colors`}
                    >
                      <td className="flex items-center gap-2 px-4 py-2">
                        <img
                          src={student.imageUrl || assets.avatar}
                          alt="thumb"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-medium">
                            {capitalizeText(student.firstname)} {capitalizeText(student.lastname)}
                          </h3>
                        </div>
                      </td>
                      <td className="px-2 py-2">{formatDate(student.dateOfBirth)}</td>
                      <td className="px-2 py-2">{student.classroom !== null ? capitalizeText(student.classroom) : 'no class added'}</td>
                      <td className="px-2 py-2">{student.studentNo}</td>
                      <td className="px-2 py-2 whitespace-wrap">
                        {capitalizeText(student.homeAddress)}
                      </td>
                      <td className="px-4 py-2">
                        <div className="relative">
                          <HiOutlineDotsHorizontal
                            className="text-[25px] text-gray-500 cursor-pointer transition-transform transform hover:scale-110"
                            onClick={() => toggleEditMenu(student.studentId)}
                          />
                          {studentId === student.studentId && openEditMenu ? (
                            <div ref={menuRef} className="shadow-lg px-2 py-4 rounded-lg border absolute right-8 top-4 bg-white text-[14px] text-left grid gap-4 w-[150px] z-50">
                              <p
                                className="cursor-pointer hover:bg-blue-500 hover:text-white py-1 px-2 rounded transition-colors"
                                onClick={() => handleView(student.studentId)}
                              >
                                View
                              </p>
                              <p className="cursor-pointer hover:bg-green-500 hover:text-white py-1 px-2 rounded transition-colors">
                                Edit
                              </p>
                              {/* <p className="cursor-pointer hover:bg-red-500 hover:text-white py-1 px-2 rounded transition-colors">
                                Delete
                              </p> */}
                            </div>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 py-2 text-center text-gray-500 whitespace-nowrap h-40"
                    >
                      <div className="flex justify-center">
                        {"No student(s) found" || message}
                      </div>
                    </td>
                  </tr>
                );
              })()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ViewStudents