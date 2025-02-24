import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios
import Sidebar from '../Pages/Sidebar';
import { IoMdSearch } from 'react-icons/io';
import newsId from '../Assets/news.jpg';
import { MdOutlineCancel } from 'react-icons/md';

const News = () => {
  const [isModal, setIsModal] = useState(false);
  const [news, setNews] = useState([]); // State to store the fetched news
  const [selectedNews, setSelectedNews] = useState(null); // State to store the selected news for the modal

  // Fetch news from the API using axios
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('https://scrmapi.tranquility.org.ng/api/News/GetAllNews');
        
        if (response.data.status && response.data.data) {
          setNews(response.data.data); // Set the news array from the API response
        }
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
  }, []);

  // Handle opening the modal with the selected news
  const openModal = (newsItem) => {
    setSelectedNews(newsItem);
    setIsModal(true);
  };

  // Handle closing the modal
  const closeModal = () => {
    setSelectedNews(null);
    setIsModal(false);
  };

  return (
    <div className='flex'>
      <div className='fixed'>
        <Sidebar />
      </div>
      <div className='ml-[20%] space-y-5 mt-5'>
        <div className='flex justify-between'>
          <p className='text-2xl ml-4 font-bold'>School News</p>
          <div className='flex items-center relative'>
            <input
              type="text"
              className='w-[400px] border border-gray-400 px-4 bg-gray-100 py-2 focus:outline-none rounded-full'
              placeholder='Search news'
            />
            <IoMdSearch className='absolute text-2xl ml-[360px]' />
          </div>
        </div>

        {/* Display fetched news */}
        {news.map((newsItem, index) => (
          <div key={index} className='px-5 mt-2 rounded-2xl shadow-md h-44 w-[1000px] border flex space-x-5 py-5'>
            <div className='h-32 w-48'>
              <img src={newsId} alt="" className='object-cover h-32 w-48 rounded-2xl shadow-md' />
            </div>
            <div className='flex flex-col space-y-4'>
              <div className='flex flex-row space-x-2'>
                <p className='text-blue-700 capitalize'>School News . </p>
                <p className='text-gray-700'>
                  {new Date(newsItem.publishedDate).toLocaleDateString()} {/* Display published date */}
                </p>
              </div>
              <div className='font-bold text-xl capitalize'>
                <p>{newsItem.title || 'No Title'}</p> {/* Fallback for null title */}
              </div>
              <button
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded-2xl w-[100px] shadow-md capitalize relative left-[590px] bottom-4'
                onClick={() => openModal(newsItem)}
              >
                View more
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal to show news details */}
      {isModal && selectedNews && (
        <div className='h-dvh fixed flex justify-center items-center bg-[#00000099] w-full' onClick={closeModal}>
          <div className='bg-white px-5 py-5 rounded-xl flex space-x-5' onClick={(e) => e.stopPropagation()}>
            <div className='w-[400px] h-[400px]'>
              <img src={newsId} alt="" className='h-[400px] w-[400px] rounded-xl object-cover' />
            </div>
            <MdOutlineCancel
              className='text-[#00000099] relative left-[500px] text-3xl cursor-pointer'
              onClick={closeModal}
            />
            <div className='mt-10 w-[500px]'>
              <p className='font-bold text-3xl capitalize'>{selectedNews.title || 'No Title'}</p>
              <p className='mt-4 text-gray-700'>{selectedNews.content || 'No Content'}</p>
              <p className='mt-2 text-gray-700'>
                <strong>Published Date:</strong> {new Date(selectedNews.publishedDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default News;