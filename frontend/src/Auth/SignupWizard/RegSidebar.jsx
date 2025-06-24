import React from 'react';
import { FaRegUser } from "react-icons/fa";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { IoIosRocket } from "react-icons/io";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

const RegSidebar = ({ activeStep, prevStep, nextStep }) => {
  const steps = [
    { title: "Add School", description: "Provide the details of the guardian", icon: <FaRegUser className='text-2xl text-white' /> },
    { title: "Add School License", description: "License of school eg. CAC", icon: <MdOutlineMarkEmailRead className='text-2xl text-white' /> },
    { title: "Add school Admin", description: "Admin of the school to monitor the application", icon: <IoIosRocket className='text-2xl text-white' /> },
  ];
  const navigate = useNavigate()

  // const handleButtonClick = () => nextStep();

  return (
    <div className='p-4 h-[100dvh]'>
      <div className="bg-gray-200 h-[100%] p-4 rounded-lg flex flex-col justify-between">
        <div className="space-y-14">
          <h1 className="text-2xl font-semibold">Register a school</h1>

          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="relative">
                  <div className={`${activeStep >= index + 1 ? "bg-orange-500" : "bg-gray-500"} h-10 w-10 rounded-full flex items-center justify-center`}>
                    {step.icon}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="border-[#989898] h-14 left-5 absolute border-dashed border-[1px]"></div>
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-md">{step.title}</h2>
                  <p className='text-[12px]'>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between font-semibold">
          <p className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/login')}>
            <FaArrowLeftLong className="text-xl" /> Back to login
          </p>
          {/* <button className={`${activeStep === 3 ? "hidden" : "block"}`} onClick={nextStep}>
            {activeStep === 1 ? "Login" : "Next"}
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default RegSidebar;
