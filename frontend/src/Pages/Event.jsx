import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios
import Sidebar from '../Pages/Sidebar';
import { FaCalendarAlt } from 'react-icons/fa';
import { MdAccessTime } from 'react-icons/md';
import { IoMdClose } from 'react-icons/io';
import newsId from '../Assets/news.jpg';

const EventPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState([]); // State to store the fetched events
  const [selectedEvent, setSelectedEvent] = useState(null); // State to store the selected event for the modal

  // Fetch events from the API using axios
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('https://scrmapi.tranquility.org.ng/api/Event/GetAllEvents');
        
        if (response.data.status && response.data.data) {
          setEvents(response.data.data); // Set the events array from the API response
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  // Handle opening the modal with the selected event
  const openModal = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  // Handle closing the modal
  const closeModal = () => {
    setSelectedEvent(null);
    setIsModalOpen(false);
  };

  return (
    <div className='flex bg-white min-h-screen'>
      <div className='fixed h-full'>
        <Sidebar />
      </div>
      <div className='ml-[220px] mt-8 p-6 w-full'>
        <p className='font-bold text-2xl mb-6'>Upcoming Events</p>

        {/* Display fetched events */}
        {events.map((event, index) => (
          <div key={index} className='w-full max-w-[1000px] flex items-center rounded-lg px-6 py-4 bg-white shadow-md border mb-4'>
            <img src={newsId} alt='Event' className='w-32 h-32 object-cover rounded-md' />
            <div className='flex flex-col ml-6 space-y-2'>
              <p className='capitalize font-bold text-xl text-gray-800'>
                {event.eventTitle || 'No Title'} {/* Fallback for null eventTitle */}
              </p>
              <p className='text-gray-600 text-sm'>
                {event.eventDescription || 'No Description'} {/* Fallback for null eventDescription */}
              </p>
              <div className='flex space-x-6'>
                <div>
                  <p className='text-gray-600 text-sm font-semibold'>Date & Time</p>
                  <div className='flex items-center space-x-2'>
                    <FaCalendarAlt className='text-blue-500' />
                    <p className='font-semibold text-gray-800'>
                      {event.eventDate ? new Date(event.eventDate).toLocaleDateString() : 'No Date'} {/* Fallback for null eventDate */}
                    </p>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <MdAccessTime className='text-red-500' />
                    <p className='font-semibold text-gray-800'>
                      {event.eventTime || 'No Time'} {/* Fallback for null eventTime */}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className='ml-auto'>
              <button
                onClick={() => openModal(event)}
                className='px-5 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition'
              >
                View Details
              </button>
            </div>
          </div>
        ))}

        {/* Modal to show event details */}
        {isModalOpen && selectedEvent && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
            <div className='bg-white p-6 rounded-lg shadow-lg w-[500px] flex flex-row'>
              <img src={newsId} alt='Event' className='w-48 h-48 object-cover rounded-md mr-4' />
              <div className='w-full'>
                <div className='flex justify-between items-center border-b pb-2'>
                  <p className='font-bold text-lg text-gray-800'>Event Details</p>
                  <IoMdClose className='cursor-pointer text-gray-600 hover:text-red-500' onClick={closeModal} />
                </div>
                <div className='mt-4 space-y-3 text-gray-700'>
                  <p><span className='font-bold'>Title:</span> {selectedEvent.eventTitle || 'No Title'}</p>
                  <p><span className='font-bold'>Description:</span> {selectedEvent.eventDescription || 'No Description'}</p>
                  <p><span className='font-bold'>Venue:</span> {selectedEvent.eventVenue || 'No Venue'}</p>
                  <p><span className='font-bold'>Date:</span> {selectedEvent.eventDate ? new Date(selectedEvent.eventDate).toLocaleDateString() : 'No Date'}</p>
                  <p><span className='font-bold'>Time:</span> {selectedEvent.eventTime || 'No Time'}</p>
                  <p><span className='font-bold'>Type:</span> {selectedEvent.eventType || 'No Type'}</p>
                  <p><span className='font-bold'>Status:</span> Upcoming</p>
                </div>
                <button
                  onClick={closeModal}
                  className='mt-4 w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-800 transition'
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventPage;