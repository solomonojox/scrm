import React from "react";
import Header from '../Header';
import Footer from "../Footer";
import { Link } from "react-router-dom";

const GetStarted = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col font-inter">
        <Header />

      {/* Hero Section */}
      <div className="relative w-full">
        <img
          src="https://storage.googleapis.com/a1aa/image/c700366e-7023-4ec6-4ae4-4cb2d7438b13.jpg"
          alt="Children in classroom background"
          className="w-full h-[250px] sm:h-[300px] md:h-[400px] object-cover brightness-75"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-white font-extrabold text-2xl sm:text-3xl md:text-4xl leading-tight max-w-xl">
            Bring Edu <span className="text-white">Cat</span> to Your School
          </h1>
          <p className="text-white text-md font-bold sm:text-base mt-2 max-w-md">
            Modern tools for smart school management, tailored for today’s education.
          </p>
         
               <Link
                           to="/addschoolform"  className="mt-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm sm:text-base py-2 px-5 rounded"
                       >
                      Register School
                         </Link>
        </div>
      </div>

<div className="max-w-6xl mx-auto px-4 -mt-16 pb-10 flex gap-x-3 overflow-x-auto z-10 relative">
  {[
    {
      icon: "fa-school",
      title: "Add School",
      description: "Provide the details of the school",
    },
    {
      icon: "fa-file-alt",
      title: "Add School License",
      description: "License of school eg. CAC",
    },
    {
      icon: "fa-university",
      title: "Add School Bank Account",
      description: "Bank account details of school",
    },
    {
      icon: "fa-user-circle",
      title: "Add School Admin",
      description: "Admin of the school to monitor the application",
    },
  ].map((card, index) => (
    <div
      key={index}
      className="bg-white rounded-2xl p-6 flex-shrink-0 w-[250px] flex flex-col items-center text-center custom-shadow transition-shadow hover:shadow-lg"
    >
      <div className="bg-orange-600 text-white rounded-full p-4 mb-4">
        <i className={`fas ${card.icon} text-xl`}></i>
      </div>
      <h3 className="font-bold text-lg mb-1">{card.title}</h3>
      <p className="text-gray-600 text-sm">{card.description}</p>
    </div>
  ))}
</div>


       <Footer />

      {/* Custom CSS */}
      <style>{`
        .custom-shadow {
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default GetStarted;
