import React from 'react';
import assets from '../../Assets/assets';
import { useNavigate } from 'react-router-dom';

const Final = () => {
  const navigate = useNavigate()
  return (
    <div>
      <div className='bg-white w-full py-8 px-6 md:px-10 flex flex-col items-center justify-center'>
        <div className='flex flex-col items-center'>
          <p className='text-3xl font-bold'>Welcome to SCRM</p>
        </div>
        <div>
          <img src={assets.woman} alt="Welcome" className='h-[300px] w-[500px] mt-5 rounded-lg object-cover' />
        </div>
        <button className='mt-4 px-32 py-2 bg-green-800 hover:bg-green-700 text-white font-bold rounded-md' onClick={() => navigate('/login')}>
          Login
        </button>
      </div>
    </div>
  )
}

export default Final