import React, {useState} from 'react'
import Sidebar from '../Pages/Sidebar'
import { IoMdSearch } from "react-icons/io";
import newsId from "../Assets/news.jpg"
import { MdOutlineCancel } from "react-icons/md";

const News = () => {
    const [isModal,setIsModal]=useState(false)
  return (
    <div className='flex '>
        <div className=' fixed'>
            <Sidebar />
        </div>
       <div className='ml-[210px] space-y-5 mt-5'>
       <div className='flex justify-between'>
        <p className='text-2xl ml-4 font-bold '>School News</p>
        <div className='flex items-center relative'>
            <input type="text" className='w-[400px] border border-gray-400 px-4 bg-gray-100 py-2 focus:outline-none  rounded-full' placeholder='Search news' />
            <IoMdSearch className='absolute text-2xl ml-[360px]' />
        </div>
       </div>
        <div className=' px-5 mt-2  rounded-2xl shadow-md h-44 w-[1000px] border flex space-x-5 py-5'>
            <div className=' h-32 w-48  '>
                <img src={newsId} alt="" className='object-cover h-32 w-48 rounded-2xl shadow-md' />
            </div>
            <div className=' flex flex-col space-y-4'>
                <div className='flex flex-row space-x-2'>
                    <p className='text-blue-700 capitalize '>blockchain news . </p>
                    <p className='text-gray-700'>4 hours ago</p>
                </div>
                <div className='font-bold text-xl capitalize'>
                <p>over 65% of cycle-related tweets and 84% of conversations on reddit were positive in 2023</p>
                </div>
                <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2  rounded-2xl w-[100px] shadow-md m capitalize relative left-[590px] bottom-4' onClick={()=>setIsModal(true)}>view more</button>
            </div>
        </div>
        <div className=' px-5 mt-2  rounded-2xl shadow-md h-44 w-[1000px] border flex space-x-5 py-5'>
            <div className='h-32 w-48 '>
            <img src={newsId} alt="" className='object-cover h-32 w-48 rounded-2xl shadow-md' />
            </div>
            <div className=' flex flex-col space-y-4'>
                <div className='flex flex-row space-x-2'>
                    <p className='text-blue-700 capitalize '>blockchain news . </p>
                    <p className='text-gray-700'>4 hours ago</p>
                </div>
                <div className='font-bold text-xl capitalize'>
                <p>over 65% of cycle-related tweets and 84% of conversations on reddit were positive in 2023</p>
                </div>
                <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2  rounded-2xl w-[100px] shadow-md  capitalize relative left-[590px] bottom-4' onClick={()=>setIsModal(true)}>view more</button>
            </div>
        </div>
       </div>
       {isModal && (
       <div className='h-dvh fixed flex justify-center items-center   bg-[#00000099] w-full ' onClick={() => setIsModal(false)}>
           <div className='bg-white px-5 py-5 rounded-xl flex space-x-5' onClick={(e)=> e.stopPropagation()}>
           
           <div className='w-[400px] h-[400px]'>
              <img src={newsId} alt="" className='h-[400px] w-[400px] rounded-xl object-cover' />
              
           </div>
           <MdOutlineCancel className='text-[#00000099] relative left-[500px] text-3xl cursor-pointer' onClick={()=> setIsModal(false)} />
           <div className=' mt-10 w-[500px]'>
              <p className='font-bold text-3xl capitalize'>top analyst unveils ethereum catalyst that could trigger nearly 50% surge for ETH- here's his outlook</p>
           </div>
           </div>
       </div>

       )}
    </div>
  )
}

export default News