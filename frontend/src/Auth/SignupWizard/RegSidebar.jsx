import React from 'react';
import { FaRegUser } from "react-icons/fa";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { IoIosRocket } from "react-icons/io";
import { FaArrowLeftLong } from "react-icons/fa6";
import { motion } from 'framer-motion';

const RegSidebar = ({ activeStep, prevStep, nextStep }) => {
  const steps = [
    {
      title: "Add School",
      description: "Provide the details of the guardian",
      icon: <FaRegUser className="text-2xl text-white" />,
    },
    {
      title: "Add School License",
      description: "License of school e.g. CAC",
      icon: <MdOutlineMarkEmailRead className="text-2xl text-white" />,
    },
    {
      title: "Add School Admin",
      description: "Admin of the school to monitor the application",
      icon: <IoIosRocket className="text-2xl text-white" />,
    },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 bg-white shadow-lg rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-orange-50">
        <h1 className="text-2xl font-bold text-orange-600">Register a School</h1>
      </div>

      {/* Steps */}
      <nav className="flex-1 overflow-y-auto px-6 py-4">
        <ul>
          {steps.map((step, index) => {
            const stepNum = index + 1;
            const isActive = activeStep === stepNum;
            const isCompleted = activeStep > stepNum;
            return (
              <li key={index} className="relative flex items-start mb-8 last:mb-0">
                {/* Icon + connector */}
                <div className="flex flex-col items-center">
                  {/* Circle */}
                  <motion.div
                    initial={false}
                    animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                    whileHover={isActive || isCompleted ? { scale: 1.15 } : {}}
                    className={`flex items-center justify-center w-10 h-10 rounded-full 
                      ${isCompleted
                        ? 'bg-orange-500'
                        : isActive
                        ? 'bg-orange-500'
                        : 'bg-gray-300'}
                    `}
                  >
                    {step.icon}
                  </motion.div>
                  {/* Vertical connector line */}
                  {index < steps.length - 1 && (
                    <span
                      className={`block w-1 flex-1 mt-1 
                        ${activeStep > stepNum
                          ? 'bg-orange-200'
                          : 'bg-gray-200'}
                      `}
                    />
                  )}
                </div>

                {/* Text */}
                <div className="ml-4">
                  <h3
                    className={`text-lg font-semibold mb-1 
                      ${isActive
                        ? 'text-orange-600'
                        : isCompleted
                        ? 'text-gray-800'
                        : 'text-gray-600'}
                    `}
                    aria-current={isActive ? 'step' : undefined}
                  >
                    {step.title}
                  </h3>
                  <p
                    className={`text-sm 
                      ${isActive
                        ? 'text-gray-800'
                        : isCompleted
                        ? 'text-gray-600'
                        : 'text-gray-500'}
                    `}
                  >
                    {step.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Navigation controls */}
      <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
        <motion.button
          onClick={prevStep}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center text-gray-600 hover:text-orange-600 font-medium"
        >
          <FaArrowLeftLong className="mr-2 text-xl" />
          Back
        </motion.button>

        {nextStep && (
          <motion.button
            onClick={nextStep}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`font-medium py-2 px-4 rounded-lg shadow-md transition-colors
              ${activeStep < steps.length
                ? 'bg-orange-500 hover:bg-orange-600 text-white'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'}
            `}
            disabled={activeStep >= steps.length}
          >
            Next
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default RegSidebar;
