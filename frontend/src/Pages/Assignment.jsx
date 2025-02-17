import React from 'react'
import Sidebar from '../Pages/Sidebar'
import { FaFileAlt } from "react-icons/fa";
import { MdOutlineAccessTime } from "react-icons/md";
import { FaCircleNotch } from "react-icons/fa";
import bookId from "../Assets/images (1).jpeg"
const Assignment = () => {
  return (
    <div className='flex'>
                           <div className='fixed'>
                            <Sidebar/>
                           </div>

                          <div className='ml-[210px] mt-5'>
                            <p className='font-bold text-xl'>Assignment List</p>
                          <div className='w-[1000px] flex   space-x-10 rounded-md px-5 py-3 mt-4 h-32 bg-white border-2 '>
                            <div className='flex items-center space-x-4 '>
                                <div className=' h-28 w-32 rounded-md '>
                                  <img src={bookId} alt="" className='h-28 object-cover rounded-md' />
                                </div>
                               <div className=' space-y-2'>
                               <p className='  capitalize ' >courses</p>
                               <p className='text-lg font-bold capitalize '>mastering UI/ux design: a guide..</p>
                               </div>
                            </div>
                            <div className='space-y-3 mt-8 '>
                              <p className='text-gray-700'>Content</p>
                              <div className='flex items-center space-x-2'>
                              <FaFileAlt className='' />
                              <p className='font-bold '> 5 Material</p>
                              </div>
                            </div>
                            <div className='mt-8 space-y-3 ml-10'>
                               <p className='text-gray-700'>Completion</p>
                               <p>___</p>
                            </div>
                            <div className='mt-8 space-y-3 '>
                              <p>Deadline</p>
                              <div className='flex space-x-1 items-center'>
                              <MdOutlineAccessTime className='' />
                                  <p className=' font-bold'>1 Day</p>
                              </div>
                            </div>
                            <div> <button className='px-5 py-3 border-2 bg-white rounded-md mt-8'>Start</button></div>
                          </div>
                          <div className='w-[1000px] flex   space-x-10 rounded-md px-5 py-3 mt-4 h-32 bg-white border-2 '>
                            <div className='flex items-center space-x-4 '>
                                <div className=' h-24 w-32 rounded-md '>
                                <img src={bookId} alt="" className='h-24 object-cover rounded-md' />
                                </div>
                               <div className=' space-y-2'>
                               <p className='  capitalize ' >courses</p>
                               <p className='text-lg font-bold capitalize '>creating engaging learning jour..</p>
                               </div>
                            </div>
                            <div className='space-y-3 mt-8 '>
                              <p className='text-gray-700'>Content</p>
                              <div className='flex items-center space-x-2'>
                              <FaFileAlt className='' />
                              <p className='font-bold '> 12 Material</p>
                              </div>
                            </div>
                            <div className='mt-8 space-y-4 ml-10'>
                               <p className='text-gray-700'>Completion</p>
                              <div className='flex items-center space-x-2'>
                              <FaCircleNotch className='text-blue-600' />
                              <p className='font-bold'>64%</p>
                              </div>
                            </div>
                            <div className='mt-8 space-y-3 '>
                              <p>Deadline</p>
                              <div className='flex space-x-1 items-center'>
                              <MdOutlineAccessTime className='text-red-600' />
                                  <p className=' font-bold'>12 hrs</p>
                              </div>
                            </div>
                            <div> <button className='px-5 py-3 border-2 bg-white rounded-md mt-8'>Continue</button></div>
                          </div>
                          </div>
    </div>
  )
}

export default Assignment