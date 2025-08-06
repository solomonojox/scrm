import React from 'react';
import logo from '../../assets/looogo.png';
import { useAuth } from '../../Context/Auth/useAuth';
import { IoIosCopy } from "react-icons/io";

const Adminheader = () => {
  const { user } = useAuth();

  // Function to handle copy
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('Copied to clipboard');
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <div className="fixed top-0 left-0 w-full z-30 bg-white shadow-md">
      <header className="flex items-center justify-between px-6 h-[70px] border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="EduCat logo" className="h-[45px]" />
        </div>

        <div className="rounded-lg py-2 px-3 flex items-center justify-center gap-4 border shadow">
          {/* School Reg Number */}
          <div className="flex items-center gap-2">
            <p>School Reg. No - </p>
            <div
              className="rounded-lg py-1 px-2 border shadow-md border-gray-400 flex flex-col items-center justify-center hover:bg-gray-100 cursor-pointer"
              onClick={() => handleCopy(user?.reg)}
            >
              <IoIosCopy className="w-4 h-4 text-gray-400" />
              <p className="text-[10px]">copy</p>
            </div>
          </div>

          {/* School ID */}
          <div className="flex items-center gap-2">
            <p>School ID - </p>
            <div
              className="rounded-lg py-1 px-2 border shadow-md border-gray-400 flex flex-col items-center justify-center hover:bg-gray-100 cursor-pointer"
              onClick={() => handleCopy(user?.id)}
            >
              <IoIosCopy className="w-4 h-4 text-gray-400" />
              <p className="text-[10px]">copy</p>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Adminheader;