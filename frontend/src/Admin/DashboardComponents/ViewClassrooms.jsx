import React, { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import NavbarDashboard from '../NavbarDashboard';
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { IoMdCloseCircle } from "react-icons/io";

const ViewClassrooms = () => {
  const { notifySuccess, notifyError, showOverlay, hideOverlay, capitalizeText } = useContext(AppContext);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [addMemberModal, setAddMemberModal] = useState(false);

  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setOpenEditMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [classroom, setClassroom] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    const fetchClassroom = async () => {
      showOverlay()
      try {
        const response = await axios.get('https://scrmapi.tranquility.org.ng/api/Classroom/GetAllClassroom');
        localStorage.setItem('classroomId' , response.data.data.classroomId)
        setClassrooms(response.data.data);
        console.log(response.data);
      } catch (error) {
        // console.error(error);
        if (error.response) {
          setMessage(error.response.data.responseMessage)
        } else {
          setMessage(`${error.message}, check your internet connection`)
        }
      } finally {
        hideOverlay()
      }
    }
    fetchClassroom();
  }, [showOverlay, hideOverlay, trigger]);

  useEffect(() => {
    const fetchTeachers = async () => {
      showOverlay()
      try {
        const response = await axios.get('https://scrmapi.tranquility.org.ng/api/Teacher/GetAllTeachers');
        setTeachers(response.data);
        // console.log(response.data)
      } catch (error) {
        // console.error(error);
        if (error.response) {
          setMessage(error.response.data.responseMessage);
        } else {
          setMessage(`${error.message}, check your internet connection`);
        }
      } finally {
        hideOverlay();
      }
    };
    fetchTeachers();
  }, [showOverlay, hideOverlay, trigger]);

  // For edit menu functionality
  const [openEditMenu, setOpenEditMenu] = useState(false);
  const [classroomId, setClassroomId] = useState(null);

  const toggleEditMenu = (item) => {
    setOpenEditMenu(!openEditMenu);
    setClassroomId(item);
  };

  const handleView = (id) => {
    navigate(`/admin/classroom/${id}`, { state: id });
  };

  const findClassroomByName = (classroom, searchQuery) => {
    if (!searchQuery) return;
    const lowerCaseQuery = searchQuery.toLowerCase();

    const result = classroom.filter(classroom => classroom.name.toLowerCase().includes(lowerCaseQuery));

    return result || null;
    // return classrooms.filter(classroom =>
    //   classroom.name.toLowerCase().includes(lowerCaseQuery)
    // );
  };

  const [classroomPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const iLastClassroom = currentPage * classroomPerPage;
  const iFirstClassroom = iLastClassroom - classroomPerPage;
  const currentClassroom = classroom.slice(iFirstClassroom, iLastClassroom);

  // const totalPages = Math.ceil(classroom.length / classroomPerPage);

  // const handlePageChange = (increment) => {
  //   setCurrentPage(prev => Math.min(Math.max(prev + increment, 1), totalPages));
  // };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(classroom.length / classroomPerPage); i++) {
    pageNumbers.push(i);
  }

  const [addClassroomModal, setAddClassroomModal] = useState(false);
  const [name, setName] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const addClassoom = async (e) => {
    e.preventDefault();
    showOverlay();

    try {
      const res = await axios.post('https://scrmapi.tranquility.org.ng/api/Classroom/AddClassroom', classroomData);
      notifySuccess(`${res.data.name} added successfully`);
      setAddMemberModal(false);
      setTrigger(!trigger);
      
    } catch (error) {
      // console.error(error.response.data);
      notifyError(error.response.data.responseMessage);
    } finally {
      hideOverlay();
    }
  };

  // Determine which classrooms to display based on search query
  // const filteredClassrooms = searchQuery ? findClassroomByName(classrooms, searchQuery) : currentClassrooms;
  return (
    <div className="bg-gray-100 pb-8">
      <div className="sticky top-0 mb-10">
        <NavbarDashboard />
      </div>

      <div className="container mb-10 mx-auto p-2">
        <div>
          <div className="flex flex-col lg:flex-row justify-between lg:items-center mb-4">
            <h2 className="text-2xl font-medium mb-4 text-start">
              All Classroom
            </h2>
            <div className="gap-2 flex items-center flex-col md:flex-row md:justify-between">
              <button
                className="bg-gray-900 text-white hover:bg-gray-800 transition-all duration-300 px-4 py-2 rounded mr-2"
                onClick={() => setAddMemberModal(true)}
              >
                Add Classroom
              </button>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search Classroom"
                  className="border border-gray-300 focus:border-primary outline-none rounded-md px-4 py-2 lg:w-[350px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="bg-gray-900 text-white hover:bg-gray-800 transition-all duration-300 px-4 py-2 rounded">
                  Search
                </button>

                <div className="flex items-center bg-gray-900 py-2 px-4 text-white gap-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`${currentPage === 1 ? 'opacity-20' : 'opacity-100'}`}
                  >
                    <FaAngleLeft className="text-2xl" />
                  </button>
                  <span className="font-medium">
                    page {currentPage} of {pageNumbers.length}
                  </span>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === pageNumbers.length}
                    className={`${currentPage === pageNumbers.length ? 'opacity-20' : 'opacity-100'}`}
                  >
                    <FaAngleRight className="text-2xl" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto p-1 pb-24">
          <table className="min-w-full table-auto rounded-lg shadow-md">
            <thead>
              <tr className="bg-gradient-to-r bg-gray-800 text-white rounded-t-lg">
                <th className="px-4 py-4 text-left">Classroom Id</th>
                <th className="px-2 py-4 text-left">Classroom Name</th>
                <th className="px-2 py-4 text-left">Capacity</th>
                <th className="px-2 py-4 text-left"></th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                // Decide which dataset to display: foundClassroom or all classroom
                const filteredClassroom = searchQuery
                  ? findClassroomByName(classroom, searchQuery) || []
                  : currentClassroom;

                return filteredClassroom && filteredClassroom.length > 0 ? (
                  filteredClassroom.map((classroom, index) => (
                    <tr
                      key={classroom.classroomId}
                      className={`${index % 2 === 0 ? "bg-blue-50" : "bg-green-50"
                        } hover:bg-gradient-to-r hover:from-green-100 hover:to-purple-100 border-b text-sm text-gray-700 transition-colors`}
                    >
                      <td className="px-2 py-2">{classroom.classroomId}</td>
                      <td className="flex items-center gap-2 px-4 py-2">
                        {/* <img
                            src={teacher.imageUrl || assets.avatar}
                            alt="thumb"
                            className="w-10 h-10 rounded-full object-cover"
                          /> */}
                        <div>
                          <h3 className="font-medium">
                            {capitalizeText(classroom.name)}
                          </h3>
                        </div>
                      </td>
                      <td className="px-2 py-2">{classroom.capacity}</td>
                      <td className="px-4 py-2">
                        <div className="relative">
                          <HiOutlineDotsHorizontal
                            className="text-[25px] text-gray-500 cursor-pointer transition-transform transform hover:scale-110"
                            onClick={() => toggleEditMenu(classroom.classroomId)}
                          />
                          {classroomId === classroom.classroomId && openEditMenu ? (
                            <div ref={menuRef} className="shadow-lg px-2 py-4 rounded-lg border absolute right-8 top-4 bg-white text-[14px] text-left grid gap-4 w-[150px] z-50">
                              <p
                                className="cursor-pointer hover:bg-blue-500 hover:text-white py-1 px-2 rounded transition-colors"
                                onClick={() => handleView(classroom.classroomId)}
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
                        {"No classroom(s) found" || message}
                      </div>
                    </td>
                  </tr>
                );
              })()}
            </tbody>
          </table>
        </div>
      </div>

      {addClassroomModal && (
        <div>
          <div className="fixed inset-0 z-30 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
              <IoMdCloseCircle
                className="absolute top-4 right-4 text-3xl text-primary cursor-pointer"
                onClick={() => setAddClassroomModal(false)}
              />
              <h2 className="text-lg font-bold text-gray-600 mb-4">
                Add a Classroom
              </h2>
              <form
                action="submit"
                onSubmit={addClassoom}
                className="w-[100%] space-y-4"
              >
                <div className='grid gap-2 grid-cols-1 md:grid-cols-2'>
                  <div className="">
                    <select name="teacher" id="teacher" onChange={(e) => setTeacherId(e.target.value)} className="border border-gray-300 rounded-md p-2 focus:border-primary outline-none w-full">
                      <option value="Select teacher">Select teacher</option>
                      {teachers.map((teacher) => (
                        <option key={teacher.teacherId} value={teacher.teacherId}>
                          {teacher.firstname} {teacher.lastname}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="">
                    <select
                      type="text"
                      className="border border-gray-300 rounded-md p-2 focus:border-primary outline-none w-full"
                      id="classroom"
                      name="classroom"
                      required
                      onChange={(e) =>
                        setName(e.target.value)
                      }
                    >
                      <option value="Select country">Select class</option>
                      <option value="Primary 1">Primary 1</option>
                      <option value="Primary 2">Primary 2</option>
                      <option value="Primary 3">Primary 3</option>
                      <option value="Primary 4">Primary 4</option>
                      <option value="Primary 5">Primary 5</option>
                      <option value="JSS 1">JSS 1</option>
                      <option value="JSS 2">JSS 2</option>
                      <option value="JSS 3">JSS 3</option>
                      <option value="SS 1">SS 1</option>
                      <option value="SS 2">SS 2</option>
                      <option value="SS 3">SS 3</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-900 hover:bg-gray-800 rounded text-white"
                >
                  Add Classroom
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewClassrooms;
