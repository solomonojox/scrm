import React, { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import NavbarDashboard from '../NavbarDashboard';
import assets from '../../Assets/assets';

import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
// import { PiStudentFill } from "react-icons/pi";
import { IoMdCloseCircle } from "react-icons/io";

const ViewTeachers = () => {
  const { notifySuccess, notifyError, showOverlay, hideOverlay, capitalizeText } = useContext(AppContext);
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

  const [teachers, setTeachers] = useState([]);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [trigger, setTrigger] = useState(false)

  // function countElements(arr) {
  //   let count = 0;
  //   for (let i = 0; i < arr.length; i++) {
  //     count++;
  //   }
  //   return count;
  // }

  useEffect(() => {
    const fetchTeachers = async () => {
      showOverlay()
      try {
        const response = await axios.get('https://scrmapi.tranquility.org.ng/api/Teacher/GetAllTeachers');
        setTeachers(response.data);
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
    fetchTeachers();
  }, [showOverlay, hideOverlay, trigger]);

  const [openEditMenu, setOpenEditMenu] = useState(false);
  const [teacherId, setTeacherId] = useState(null);

  const toggleEditMenu = (item) => {
    setOpenEditMenu(!openEditMenu);
    setTeacherId(item);
  };

  const handleView = (id) => {
    navigate(`/admin/teacher/${id}`, { state: id });
  };

  const findTeacherByName = (teachers, searchQuery) => {
    if (!searchQuery) return;
    const lowerCaseQuery = searchQuery.toLowerCase();

    const result = teachers.filter(teacher => teacher.lastname.toLowerCase().includes(lowerCaseQuery));
    return result || null;
  }

  const [teachersPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const iLastTeacher = currentPage * teachersPerPage;
  const iFirstTeacher = iLastTeacher - teachersPerPage;
  const currentTeachers = teachers.slice(iFirstTeacher, iLastTeacher);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(teachers.length / teachersPerPage); i++) {
    pageNumbers.push(i);
  }

  const [addMemberModal, setAddMemberModal] = useState(false);
  const [teacherData, setTeacherData] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    homeAddress: '',
    classroom: '',
    nationality: '',
    stateOfOrigin: '',
    religion: '',
    email: '',
    username: ''
  })
  const addTeachers = async (e) => {
    e.preventDefault();
    showOverlay();

    try {
      const res = await axios.post('https://scrmapi.tranquility.org.ng/api/Teacher/AddTeacher', teacherData);
      notifySuccess(`${res.data.firstname} added successfully`);
      setAddMemberModal(false);
      setTrigger(!trigger)
    } catch (error) {
      console.error(error.response.data);
      notifyError(error.response.data.responseMessage);
    } finally {
      hideOverlay();
    }
  }

  return (
    <div className="bg-gray-100 pb-8">
      <div className="sticky top-0 mb-10">
        <NavbarDashboard />
      </div>

      <div className="container mb-10 mx-auto p-2">
        <div className=''>
          <div className="flex flex-col lg:flex-row justify-between lg:items-center mb-4">
            <h2 className="text-2xl font-medium mb-4 text-start">
              All Teachers
            </h2>
            <div className="gap-2 flex items-center flex-col md:flex-row md:justify-between ">
              <button
                className="bg-primary-bg text-white hover:bg-primary-hover transition-all duration-300 px-4 py-2 rounded mr-2"
                onClick={() => setAddMemberModal(true)}
              >
                Add Teacher
              </button>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search Teachers"
                  className="border border-gray-300 focus:border-primary outline-none rounded-md px-4 py-2 lg:w-[350px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="bg-primary-bg text-white hover:bg-primary-hover transition-all duration-300 px-4 py-2 rounded">
                  Search
                </button>

                <div className='flex items-center bg-primary-bg py-2 px-4 text-white gap-2'>
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`${currentPage === 1 ? 'opacity-20' : 'opacity-100'}`}
                  ><FaAngleLeft className='text-2xl' /></button>
                  <span className='font-medium'>page {currentPage} of {pageNumbers.length}</span>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === pageNumbers.length}
                    className={`${currentPage === pageNumbers.length ? 'opacity-20' : 'opacity-100'}`}
                  ><FaAngleRight className='text-2xl' /></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto p-1 pb-24">
          <table className="min-w-full table-auto  rounded-lg shadow-md">
            <thead>
              <tr className="bg-gradient-to-r from-primary-bg to-green-800 text-white rounded-t-lg">
                <th className="px-4 py-4 text-left">Teacher Name</th>
                <th className="px-2 py-4 text-left">Email</th>
                <th className="px-2 py-4 text-left">Classroom</th>
                <th className="px-2 py-4 text-left">Username</th>
                <th className="px-2 py-4 text-left">Address</th>
                <th className="px-2 py-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                // Decide which dataset to display: foundTeachers or all teachers
                const filteredTeachers = searchQuery
                  ? findTeacherByName(teachers, searchQuery) || []
                  : currentTeachers;

                return filteredTeachers && filteredTeachers.length > 0 ? (
                  filteredTeachers.map((teacher, index) => (
                    <tr
                      key={teacher.teacherId}
                      className={`${index % 2 === 0 ? "bg-blue-50" : "bg-green-50"
                        } hover:bg-gradient-to-r hover:from-green-100 hover:to-purple-100 border-b text-sm text-gray-700 transition-colors`}
                    >
                      <td className="flex items-center gap-2 px-4 py-2">
                        <img
                          src={teacher.imageUrl || assets.avatar}
                          alt="thumb"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-medium">
                            {capitalizeText(teacher.firstname)} {capitalizeText(teacher.lastname)}
                          </h3>
                        </div>
                      </td>
                      <td className="px-2 py-2">{teacher.email}</td>
                      <td className="px-2 py-2">{capitalizeText(teacher.classroom)}</td>
                      <td className="px-2 py-2">{teacher.username}</td>
                      <td className="px-2 py-2 whitespace-wrap">
                        {capitalizeText(teacher.homeAddress)}
                      </td>
                      <td className="px-4 py-2">
                        <div className="relative">
                          <HiOutlineDotsHorizontal
                            className="text-[25px] text-gray-500 cursor-pointer transition-transform transform hover:scale-110"
                            onClick={() => toggleEditMenu(teacher.teacherId)}
                          />
                          {teacherId === teacher.teacherId && openEditMenu ? (
                            <div ref={menuRef} className="shadow-lg px-2 py-4 rounded-lg border absolute right-8 top-4 bg-white text-[14px] text-left grid gap-4 w-[150px] z-50">
                              <p
                                className="cursor-pointer hover:bg-blue-500 hover:text-white py-1 px-2 rounded transition-colors"
                                onClick={() => handleView(teacher.teacherId)}
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
                        {"No teacher(s) found" || message}
                      </div>
                    </td>
                  </tr>
                );
              })()}
            </tbody>
          </table>
        </div>
      </div>

      {addMemberModal && (
        <div>
          <div className="fixed inset-0 z-30 flex items-center justify-center p-4 lg:overflow-y-auto lg:px-[10%] bg-black bg-opacity-50">
            <div className="bg-white lg:mt-40 lg:mb-10 p-4 lg:p-10 rounded-lg shadow-lg w-full relative">
              <IoMdCloseCircle
                className="absolute top-4 right-4 text-3xl text-primary cursor-pointer"
                onClick={() => setAddMemberModal(false)}
              />
              <h2 className="text-lg font-bold text-gray-600 mb-4">
                Add a Teacher
              </h2>
              <form
                action="submit"
                onSubmit={addTeachers}
                className="w-[100%] space-y-4"
              >
                <div className='grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
                  <div className="">
                    <input
                      type="text"
                      className="border border-gray-300 rounded-md p-2 focus:border-primary outline-none w-full"
                      id="firstname"
                      name="firstname"
                      required
                      placeholder="Teacher's first name"
                      onChange={(e) =>
                        setTeacherData({
                          ...teacherData,
                          firstname: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="">
                    <input
                      type="text"
                      className="border border-gray-300 rounded-md p-2 focus:border-primary outline-none w-full"
                      id="lastname"
                      name="lastname"
                      required
                      placeholder="Teacher's last name"
                      onChange={(e) =>
                        setTeacherData({
                          ...teacherData,
                          lastname: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="">
                    <input
                      type="text"
                      className="border border-gray-300 rounded-md p-2 focus:border-primary outline-none w-full"
                      id="phone"
                      name="phone"
                      required
                      placeholder="Teacher's phone number"
                      onChange={(e) =>
                        setTeacherData({
                          ...teacherData,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="">
                    <input
                      type="text"
                      className="border border-gray-300 rounded-md p-2 focus:border-primary outline-none w-full"
                      id="homeAddress"
                      name="homeAddress"
                      required
                      placeholder="Teachers's home address"
                      onChange={(e) =>
                        setTeacherData({
                          ...teacherData,
                          homeAddress: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="">
                    <select
                      type="text"
                      className="border border-gray-300 rounded-md p-2 focus:border-primary outline-none w-full"
                      id="classroom"
                      name="classroom"
                      required
                      onChange={(e) =>
                        setTeacherData({
                          ...teacherData,
                          classroom: e.target.value,
                        })
                      }
                    >
                      <option value="Select country">Select class</option>
                      <option value="JSS 1">JSS 1</option>
                      <option value="JSS 2">JSS 2</option>
                      <option value="JSS 3">JSS 3</option>
                      <option value="SS 1">SS 1</option>
                      <option value="SS 2">SS 2</option>
                      <option value="SS 3">SS 3</option>
                    </select>
                  </div>

                  <div className="">
                    <select
                      className="border border-gray-300 rounded-md p-2 focus:border-primary outline-none w-full"
                      id="nationality"
                      name="nationality"
                      required
                      placeholder="Teacher's staff Id"
                      onChange={(e) =>
                        setTeacherData({
                          ...teacherData,
                          nationality: e.target.value,
                        })
                      }
                    >
                      <option value="Select country">Select country</option>
                      <option value="Nigeria">Nigeria</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>

                  <div className="">
                    <select
                      className="border border-gray-300 rounded-md p-2 focus:border-primary outline-none w-full"
                      id="nationality"
                      name="nationality"
                      required
                      placeholder="Teacher's staff Id"
                      onChange={(e) =>
                        setTeacherData({
                          ...teacherData,
                          stateOfOrigin: e.target.value,
                        })
                      }
                    >
                      <option value="Select country">Select State</option>
                      <option value="Nigeria">Lagos</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>

                  <div className="">
                    <select
                      className="border border-gray-300 rounded-md p-2 focus:border-primary outline-none w-full"
                      id="nationality"
                      name="nationality"
                      required
                      placeholder="Teacher's staff Id"
                      onChange={(e) =>
                        setTeacherData({
                          ...teacherData,
                          religion: e.target.value,
                        })
                      }
                    >
                      <option value="Select country">Select religion</option>
                      <option value="Christian">Christian</option>
                      <option value="Muslim">Muslim</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>

                  <div className="">
                    <input
                      type="text"
                      className="border border-gray-300 rounded-md p-2 focus:border-primary outline-none w-full"
                      id="username"
                      name="username"
                      required
                      placeholder="Teacher's username"
                      onChange={(e) =>
                        setTeacherData({
                          ...teacherData,
                          username: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="">
                    <input
                      type="email"
                      className="border border-gray-300 rounded-md p-2 focus:border-primary outline-none w-full"
                      id="email"
                      name="email"
                      required
                      placeholder="Teacher's email"
                      onChange={(e) =>
                        setTeacherData({
                          ...teacherData,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-bg hover:bg-primary-hover rounded lg text-white"
                >
                  Add Teacher
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewTeachers