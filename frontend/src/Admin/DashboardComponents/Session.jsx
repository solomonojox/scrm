/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import NavbarDashboard from '../NavbarDashboard';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { IoMdCloseCircle } from "react-icons/io";

const Session = () => {
    const baseUrl = process.env.REACT_APP_BASEURL;
  const {
    notifySuccess,
    notifyError,
    showOverlay,
    hideOverlay,
    capitalizeText,
    formatDate,
  } = useContext(AppContext);
  const navigate = useNavigate();

  // State for sessions and messages
  const [sessions, setSessions] = useState([]);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    const fetchSessions = async () => {
      showOverlay();
      try {
        const response = await axios.get(`${baseUrl}/api/Session/GetAllSessions`);
        setSessions(response.data.data);
      } catch (error) {
        if (error.response) {
          setMessage(error.response.data.responseMessage);
        } else {
          setMessage(`${error.message}, check your internet connection`);
        }
      } finally {
        hideOverlay();
      }
    };
    fetchSessions();
  }, [showOverlay, hideOverlay, trigger, baseUrl]);

  // Pagination setup
  const [sessionsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const iLastSession = currentPage * sessionsPerPage;
  const iFirstSession = iLastSession - sessionsPerPage;
  const currentSessions = sessions.slice(iFirstSession, iLastSession);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(sessions.length / sessionsPerPage); i++) {
    pageNumbers.push(i);
  }

  // Modal state and form data
  const [addSessionModal, setAddSessionModal] = useState(false);
  const [sessionData, setSessionData] = useState({
    sessionId: '',
    classroomId: '',
    amount: '',
    startDate: '',
    endDate: '',
  });

  const addSession = async (e) => {
    e.preventDefault();
    showOverlay();
    try {
      const res = await axios.post(`${baseUrl}/api/Session/GetAllRegisteredSession`, sessionData);
      notifySuccess(`Session added successfully`);
      setAddSessionModal(false);
      setTrigger(!trigger);
    } catch (error) {
      notifyError(error.response?.data.responseMessage || 'Error adding session');
    } finally {
      hideOverlay();
    }
  };

  // Search/filter function (by sessionId or classroomId)
  const findSessionsByQuery = (items, query) => {
    if (!query) return items;
    const lowerCaseQuery = query.toLowerCase();
    return items.filter(item =>
      item.sessionId.toString().toLowerCase().includes(lowerCaseQuery) ||
      item.classroomId.toString().toLowerCase().includes(lowerCaseQuery)
    );
  };

  const filteredSessions = searchQuery ? findSessionsByQuery(sessions, searchQuery) : currentSessions;

  return (
    <div className="bg-gray-100 pb-8">
      <div className="sticky top-0 mb-10">
        <NavbarDashboard />
      </div>

      <div className="container mb-10 mx-auto p-2">
        <div className="flex flex-col lg:flex-row justify-between lg:items-center mb-4">
          <h2 className="text-2xl font-medium mb-4 text-start">All Sessions</h2>
          <div className="gap-2 flex items-center flex-col md:flex-row md:justify-between">
            <button
              className="bg-gray-900 text-white hover:bg-gray-800 transition-all duration-300 px-4 py-2 rounded mr-2"
              onClick={() => setAddSessionModal(true)}
            >
              Add Session
            </button>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search Sessions"
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

        <div className="overflow-x-auto p-1 pb-24">
          <table className="min-w-full table-auto rounded-lg shadow-md">
            <thead>
              <tr className="bg-gradient-to-r bg-gray-900 text-white rounded-t-lg">
                <th className="px-4 py-4 text-left">Session ID</th>
                <th className="px-4 py-4 text-left">Classroom ID</th>
                <th className="px-4 py-4 text-left">Amount</th>
                <th className="px-4 py-4 text-left">Start Date</th>
                <th className="px-4 py-4 text-left">End Date</th>
                <th className="px-2 py-4 text-left"></th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions && filteredSessions.length > 0 ? (
                filteredSessions.map((sessionItem, index) => (
                  <tr
                    key={sessionItem.sessionId}
                    className={`${index % 2 === 0 ? "bg-blue-50" : "bg-green-50"} hover:bg-gradient-to-r hover:from-green-100 hover:to-purple-100 border-b text-sm text-gray-700 transition-colors`}
                  >
                    <td className="px-4 py-2">{sessionItem.sessionId}</td>
                    <td className="px-2 py-2">{sessionItem.classroomId}</td>
                    <td className="px-2 py-2">{sessionItem.amount}</td>
                    <td className="px-2 py-2">{formatDate(sessionItem.startDate)}</td>
                    <td className="px-2 py-2">{formatDate(sessionItem.endDate)}</td>
                    <td className="px-4 py-2"></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-2 text-center text-gray-500 whitespace-nowrap h-40"
                  >
                    <div className="flex justify-center">
                      {message || "No sessions found"}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {addSessionModal && (
        <div>
          <div className="fixed inset-0 z-30 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
              <IoMdCloseCircle
                className="absolute top-4 right-4 text-3xl text-primary cursor-pointer"
                onClick={() => setAddSessionModal(false)}
              />
              <h2 className="text-lg font-bold text-gray-600 mb-4">Add Session</h2>
              <form onSubmit={addSession} className="space-y-4">
                <div>
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md p-2 focus:border-primary outline-none w-full"
                    id="sessionId"
                    name="sessionId"
                    required
                    placeholder="Session ID"
                    onChange={(e) =>
                      setSessionData({
                        ...sessionData,
                        sessionId: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md p-2 focus:border-primary outline-none w-full"
                    id="classroomId"
                    name="classroomId"
                    required
                    placeholder="Classroom ID"
                    onChange={(e) =>
                      setSessionData({
                        ...sessionData,
                        classroomId: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <input
                    type="number"
                    className="border border-gray-300 rounded-md p-2 focus:border-primary outline-none w-full"
                    id="amount"
                    name="amount"
                    required
                    placeholder="Amount"
                    onChange={(e) =>
                      setSessionData({
                        ...sessionData,
                        amount: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <input
                    type="date"
                    className="border border-gray-300 rounded-md p-2 focus:border-primary outline-none w-full"
                    id="startDate"
                    name="startDate"
                    required
                    onChange={(e) =>
                      setSessionData({
                        ...sessionData,
                        startDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <input
                    type="date"
                    className="border border-gray-300 rounded-md p-2 focus:border-primary outline-none w-full"
                    id="endDate"
                    name="endDate"
                    required
                    onChange={(e) =>
                      setSessionData({
                        ...sessionData,
                        endDate: e.target.value,
                      })
                    }
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-900 hover:bg-gray-800 rounded text-white"
                >
                  Add Session
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Session;
