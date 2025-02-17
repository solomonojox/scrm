import React, { useState } from 'react';
import Sidebar from '../Pages/Sidebar';
import { FaCalendarAlt } from 'react-icons/fa';
import { MdAccessTime } from 'react-icons/md';
import { IoMdClose } from 'react-icons/io';
import newsId from '../Assets/news.jpg';

const EventPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className='flex bg-white min-h-screen'>
      <div className='fixed h-full'>
        <Sidebar />
      </div>
      <div className='ml-[220px] mt-8 p-6 w-full'>
        <p className='font-bold text-2xl mb-6'>Upcoming Events</p>
        <div className='w-full max-w-[1000px] flex items-center rounded-lg px-6 py-4 bg-white shadow-md border'>
          <img src={newsId} alt='Event' className='w-32 h-32 object-cover rounded-md' />
          <div className='flex flex-col ml-6 space-y-2'>
            <p className='capitalize font-bold text-xl text-gray-800'>Tech Conference 2025</p>
            <p className='text-gray-600 text-sm'>A conference on the latest advancements in technology.</p>
            <div className='flex space-x-6'>
              <div>
                <p className='text-gray-600 text-sm font-semibold'>Date & Time</p>
                <div className='flex items-center space-x-2'>
                  <FaCalendarAlt className='text-blue-500' />
                  <p className='font-semibold text-gray-800'>March 15, 2025</p>
                </div>
                <div className='flex items-center space-x-2'>
                  <MdAccessTime className='text-red-500' />
                  <p className='font-semibold text-gray-800'>10:00 AM - 4:00 PM</p>
                </div>
              </div>
            </div>
          </div>
          <div className='ml-auto'>
            <button onClick={openModal} className='px-5 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition'>View Details</button>
          </div>
        </div>
        <div className='w-full max-w-[1000px] flex items-center rounded-lg px-6 py-4 bg-white shadow-md border mt-4'>
          <img src={newsId} alt='Event' className='w-32 h-32 object-cover rounded-md' />
          <div className='flex flex-col ml-6 space-y-2'>
            <p className='capitalize font-bold text-xl text-gray-800'>Tech Conference 2025</p>
            <p className='text-gray-600 text-sm'>A conference on the latest advancements in technology.</p>
            <div className='flex space-x-6'>
              <div>
                <p className='text-gray-600 text-sm font-semibold'>Date & Time</p>
                <div className='flex items-center space-x-2'>
                  <FaCalendarAlt className='text-blue-500' />
                  <p className='font-semibold text-gray-800'>March 15, 2025</p>
                </div>
                <div className='flex items-center space-x-2'>
                  <MdAccessTime className='text-red-500' />
                  <p className='font-semibold text-gray-800'>10:00 AM - 4:00 PM</p>
                </div>
              </div>
            </div>
          </div>
          <div className='ml-auto'>
            <button onClick={openModal} className='px-5 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition'>View Details</button>
          </div>
        </div>

        {isModalOpen && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
            <div className='bg-white p-6 rounded-lg shadow-lg w-[500px] flex flex-row'>
              <img src={newsId} alt='Event' className='w-48 h-48 object-cover rounded-md mr-4' />
              <div className='w-full'>
                <div className='flex justify-between items-center border-b pb-2'>
                  <p className='font-bold text-lg text-gray-800'>Event Details</p>
                  <IoMdClose className='cursor-pointer text-gray-600 hover:text-red-500' onClick={closeModal} />
                </div>
                <div className='mt-4 space-y-3 text-gray-700'>
                  <p><span className='font-bold'>Title:</span> Tech Conference 2025</p>
                  <p><span className='font-bold'>Description:</span> A conference on the latest advancements in technology.</p>
                  <p><span className='font-bold'>Venue:</span> Berlin Convention Center</p>
                  <p><span className='font-bold'>Date:</span> March 15, 2025</p>
                  <p><span className='font-bold'>Time:</span> 10:00 AM - 4:00 PM</p>
                  <p><span className='font-bold'>Type:</span> Technology</p>
                  <p><span className='font-bold'>Status:</span> Upcoming</p>
                </div>
                <button onClick={closeModal} className='mt-4 w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-800 transition'>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventPage;
