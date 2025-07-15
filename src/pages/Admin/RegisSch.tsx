import React from "react";
import Header from "../Header";


const featureCards = [
  {
    iconClass: "fa-school",
    title: "Add School",
    description: "Provide the school’s basic details.",
  },
  {
    iconClass: "fa-file-alt",
    title: "Add School License",
    description: "Upload the licence document (e.g., CAC).",
  },
  {
    iconClass: "fa-user-circle",
    title: "Add School Admin",
    description: "Create an admin account to monitor the application.",
  },
];

const GetStarted = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col font-inter">
      {/* 1️⃣  Header was imported but never rendered */}
      <Header />

      {/* Hero Section */}
      <section className="relative w-full">
        <img
          src="https://storage.googleapis.com/a1aa/image/c700366e-7023-4ec6-4ae4-4cb2d7438b13.jpg"
          alt="Smiling children in a classroom"
          className="w-full h-[250px] sm:h-[300px] md:h-[400px] object-cover brightness-75"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-white font-extrabold text-2xl sm:text-3xl md:text-4xl leading-tight max-w-xl">
            Bring&nbsp;Edu<span className="text-white">Cat</span> to&nbsp;Your&nbsp;School
          </h1>
          <p className="text-white text-md font-bold sm:text-base mt-2 max-w-md">
            Modern tools for smart school management, tailored for today’s education.
          </p>
          <button className="mt-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm sm:text-base py-2 px-5 rounded">
            Register School
          </button>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="max-w-6xl mx-auto px-4 -mt-16 pb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-12 z-10 relative">
        {featureCards.map(({ iconClass, title, description }, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-6 flex flex-col items-center text-center h-auto sm:h-[220px] custom-shadow transition-shadow hover:shadow-lg"
          >
            <div className="bg-orange-600 text-white rounded-full p-4 mb-4">
              <i className={`fas ${iconClass} text-xl`} aria-hidden="true" />
            </div>
            <h3 className="font-bold text-lg mb-1">{title}</h3>
            <p className="text-gray-600 text-sm">{description}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="bg-black text-white px-4 sm:px-6 pt-10 pb-6 mt-auto">
        {/* …unchanged footer markup… */}
        {/* I left the footer as‑is because it renders fine; 
            just remember to include Font Awesome and tailor links later. */}
      </footer>

      {/* Custom CSS (kept inline to respect original structure) */}
      <style>{`
        .custom-shadow {
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default GetStarted;
