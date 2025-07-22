import React from 'react';
import logo from '../../assets/looogo.png';

const Adminheader = () => {
  return (
    <div className="fixed top-0 left-0 w-full z-30 bg-white shadow-md">
      <header className="flex items-center justify-between px-6 h-[70px] border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="EduCat logo" className="h-[45px]" />
        </div>
      </header>
    </div>
  );
};

export default Adminheader;
