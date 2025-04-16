import React, { useEffect, useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import NavbarDashboard from '../NavbarDashboard';
// import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { IoMdCloseCircle } from "react-icons/io";

const Event = () => {
  const baseUrl = process.env.REACT_APP_BASEURL;
  const { notifySuccess, notifyError, showOverlay, hideOverlay, capitalizeText } = useContext(AppContext);
  const navigate = useNavigate();
  const menuRef = useRef(null);

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

  // State for events and messaging
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      showOverlay();
      try {
        // Updated endpoint for events
        const response = await axios.get('https://scrmapi.tranquility.org.ng/api/Events/GetAllEvents');
        setEvents(response.data.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
        if (error.response) {
          setMessage(error.response.data.responseMessage);
        } else {
          setMessage(`${error.message}, check your internet connection`);
        }
      } finally {
        hideOverlay();
      }
    };
    fetchEvents();
  }, [showOverlay, hideOverlay, trigger]);

  // For edit menu functionality
  const [openEditMenu, setOpenEditMenu] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);

  const toggleEditMenu = (id) => {
    setOpenEditMenu(!openEditMenu);
    setSelectedEventId(id);
  };

  const handleView = (id) => {
    navigate(`/admin/events/${id}`, { state: id });
  };

  // Search/filter function (by event title)
  const findEventsByTitle = (items, query) => {
    if (!query) return items;
    const lowerCaseQuery = query.toLowerCase();
    return items.filter(item =>
      item.eventTitle.toLowerCase().includes(lowerCaseQuery)
    );
  };

  // Pagination setup
  const [eventsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const iLastEvent = currentPage * eventsPerPage;
  const iFirstEvent = iLastEvent - eventsPerPage;
  const currentEvents = events.slice(iFirstEvent, iLastEvent);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(events.length / eventsPerPage); i++) {
    pageNumbers.push(i);
  }

  // Modal state and function for adding an event
  const [addEventModal, setAddEventModal] = useState(false);
  const [eventData, setEventData] = useState({
    eventTitle: '',
    eventDescription: '',
    eventVenue: '',
    eventDate: '',
    eventTime: '',
    eventType: ''
  });

  const addEvent = async (e) => {
    e.preventDefault();
    showOverlay();

    try {
      const res = await axios.post('https://scrmapi.tranquility.org.ng/api/Events/AddEvent', eventData);
      notifySuccess(`${res.data.eventTitle} added successfully`);
      setAddEventModal(false);
      setTrigger(!trigger);
    } catch (error) {
      console.error(error.response?.data);
      notifyError(error.response?.data.responseMessage || 'Error adding event');
    } finally {
      hideOverlay();
    }
  };

  // Determine which items to display based on search query
  const filteredEvents = searchQuery ? findEventsByTitle(events, searchQuery) : currentEvents;

  return (
    <div className="bg-gray-100 pb-8">
      <div className="sticky top-0 mb-10">
        <NavbarDashboard />
      </div>

      <div className="container mb-10 mx-auto p-2">
        <div>
          <div className="flex flex-col lg:flex-row justify-between lg:items-center mb-4">
            <h2 className="text-2xl font-medium mb-4 text-start">
              All Events
            </h2>
            <div className="gap-2 flex items-center flex-col md:flex-row md:justify-between">
              <button
                className="bg-gray-900 text-white hover:bg-gray-800 transition-all duration-300 px-4 py-2 rounded mr-2"
                onClick={() => setAddEventModal(true)}
              >
                Add Event
              </button>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search Events"
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
              <tr className="bg-gradient-to-r bg-gray-900 text-white rounded-t-lg">
                <th className="px-4 py-4 text-left">Event ID</th>
                <th className="px-4 py-4 text-left">Event Title</th>
                <th className="px-4 py-4 text-left">Event Description</th>
                <th className="px-4 py-4 text-left">Event Venue</th>
                <th className="px-4 py-4 text-left">Event Date</th>
                <th className="px-4 py-4 text-left">Event Time</th>
                <th className="px-4 py-4 text-left">Event Type</th>
                <th className="px-2 py-4 text-left"></th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents && filteredEvents.length > 0 ? (
                filteredEvents.map((eventItem, index) => (
                  <tr
                    key={eventItem.eventId}
                    className={`${index % 2 === 0 ? "bg-blue-50" : "bg-green-50"} hover:bg-gradient-to-r hover:from-green-100 hover:to-purple-100 border-b text-sm text-gray-700 transition-colors`}
                  >
                    <td className="px-2 py-2">{eventItem.eventId}</td>
                    <td className="px-4 py-2">
                      <h3 className="font-medium">
                        {capitalizeText(eventItem.eventTitle)}
                      </h3>
                    </td>
                    <td className="px-2 py-2">{eventItem.eventDescription}</td>
                    <td className="px-2 py-2">{eventItem.eventVenue}</td>
                    <td className="px-2 py-2">{eventItem.eventDate}</td>
                    <td className="px-2 py-2">{eventItem.eventTime}</td>
                    <td className="px-2 py-2">{eventItem.eventType}</td>
                    <td className="px-4 py-2">
                      {/* <div className="relative">
                        <HiOutlineDotsHorizontal
                          className="text-[25px] text-gray-500 cursor-pointer transition-transform transform hover:scale-110"
                          onClick={() => toggleEditMenu(eventItem.eventId)}
                        />
                        {selectedEventId === eventItem.eventId && openEditMenu && (
                          <div ref={menuRef} className="shadow-lg px-2 py-4 rounded-lg border absolute right-8 top-4 bg-white text-[14px] text-left grid gap-4 w-[150px] z-50">
                            <p
                              className="cursor-pointer hover:bg-gray-800 hover:text-white py-1 px-2 rounded transition-colors"
                              onClick={() => handleView(eventItem.eventId)}
                            >
                              View
                            </p>
                            <p className="cursor-pointer hover:bg-gray-800 hover:text-white py-1 px-2 rounded transition-colors">
                              Edit
                            </p>
                          </div>
                        )}
                      </div> */}
                    </td> 
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="px-4 py-2 text-center text-gray-500 whitespace-nowrap h-40"
                  >
                    <div className="flex justify-center">
                      {message || "No events found"}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {addEventModal && (
        <div>
          <div className="fixed inset-0 z-30 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
              <IoMdCloseCircle
                className="absolute top-4 right-4 text-3xl text-primary cursor-pointer"
                onClick={() => setAddEventModal(false)}
              />
              <h2 className="text-lg font-bold text-gray-600 mb-4">
                Add Event
              </h2>
              <form onSubmit={addEvent} className="space-y-4">
                <div>
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md p-2 focus:border-primary outline-none w-full"
                    id="eventTitle"
                    name="eventTitle"
                    required
                    placeholder="Event Title"
                    onChange={(e) =>
                      setEventData({
                        ...eventData,
                        eventTitle: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <textarea
                    className="border border-gray-300 rounded-md p-2 focus:border-primary outline-none w-full"
                    id="eventDescription"
                    name="eventDescription"
                    required
                    placeholder="Event Description"
                    onChange={(e) =>
                      setEventData({
                        ...eventData,
                        eventDescription: e.target.value,
                      })
                    }
                  ></textarea>
                </div>
                <div>
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md p-2 focus:border-primary outline-none w-full"
                    id="eventVenue"
                    name="eventVenue"
                    required
                    placeholder="Event Venue"
                    onChange={(e) =>
                      setEventData({
                        ...eventData,
                        eventVenue: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <input
                    type="date"
                    className="border border-gray-300 rounded-md p-2 focus:border-primary outline-none w-full"
                    id="eventDate"
                    name="eventDate"
                    required
                    onChange={(e) =>
                      setEventData({
                        ...eventData,
                        eventDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <input
                    type="time"
                    className="border border-gray-300 rounded-md p-2 focus:border-primary outline-none w-full"
                    id="eventTime"
                    name="eventTime"
                    required
                    onChange={(e) =>
                      setEventData({
                        ...eventData,
                        eventTime: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md p-2 focus:border-primary outline-none w-full"
                    id="eventType"
                    name="eventType"
                    required
                    placeholder="Event Type"
                    onChange={(e) =>
                      setEventData({
                        ...eventData,
                        eventType: e.target.value,
                      })
                    }
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-900 hover:bg-gray-800 rounded text-white"
                >
                  Add Event
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Event;
