import React from 'react'
import logo from '../../assets/looogo.png'
const Adminheader = () => {
  return (
    <div  className="max-w-[1440px] mx-auto bg-white">
          <header className="flex items-center justify-between px-6 py-3 h-[70px] border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <img src={logo} alt="EduCat logo" className=" h-[45px]" />
                  </div>
                
                </header>
    </div>
  )
}

export default Adminheader