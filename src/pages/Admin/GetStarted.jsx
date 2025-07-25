import React from "react";
import Header from "../Header";
import Footer from "../Footer";
import { Link } from "react-router-dom";

const cardData = [
  {
    icon: "fa-school",
    title: "Add School",
    description: "Provide the details of the school",
  },
  {
    icon: "fa-file-alt",
    title: "Add School License",
    description: "License of school e.g. CAC",
  },
  {
    icon: "fa-user-circle",
    title: "Add School Admin",
    description: "Admin of the school to monitor the application",
  },
  {
    icon: "fa-bank",
    title: "Add School Bank Account",
    description: "Bank account details of the school",
  },
];

const GetStarted = () => {
  return (
    <div className="bg-gray-100  flex flex-col font-inter">
      <Header />

      {/* Hero Section */}
      <div className="relative">
        <div className="relative w-full">
          <img
            src="https://storage.googleapis.com/a1aa/image/c700366e-7023-4ec6-4ae4-4cb2d7438b13.jpg"
            alt="Happy children in classroom"
            loading="lazy"
            className="w-full h-[250px] sm:h-[300px] md:h-[400px] object-cover brightness-45"
          />

          {/* Hero Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-white font-extrabold text-3xl sm:text-4xl md:text-5xl leading-snug max-w-2xl">
              Bring Edu<span className="text-white">Cat</span> to Your School
            </h1>
            <p className="text-white text-sm sm:text-base md:text-lg font-medium mt-3 max-w-xl">
              Modern tools for smart school management, tailored for today’s education.
            </p>
            <Link
              to="/add-school-form"
              className="mt-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm sm:text-base py-2 px-6 rounded transition"
            >
              Register School
            </Link>
          </div>

        </div>

        {/* Info Cards */}
        <div className="lg:absolute lg:bottom-[-110px] mt-10 w-full px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cardData.map((card, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 flex flex-col items-center text-center shadow-md hover:shadow-lg transition duration-300"
              >
                <div className="bg-orange-600 text-white rounded-full p-4 mb-4">
                  <i className={`fas ${card.icon} text-2xl`}></i>
                </div>
                <h3 className="font-semibold text-lg mb-1">{card.title}</h3>
                <p className="text-gray-600 text-sm">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Spacer to avoid content cutoff due to absolute cards */}
      <div className="h-10 lg:h-52"></div>

      <Footer />
    </div>
  );
};

export default GetStarted;
