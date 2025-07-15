import React from "react";

const GetStarted = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col font-inter">
      {/* Header */}
      <header className="bg-white shadow-md py-4 px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-xl font-bold text-orange-600 mb-2 sm:mb-0">
          EduCat School
        </h1>
        <nav className="space-x-4 text-sm">
          <a href="#" className="text-gray-700 hover:text-orange-600">
            Home
          </a>
          <a href="#" className="text-gray-700 hover:text-orange-600">
            Features
          </a>
          <a href="#" className="text-gray-700 hover:text-orange-600">
            Contact
          </a>
        </nav>
      </header>

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
          <button className="mt-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm sm:text-base py-2 px-5 rounded">
            Register School
          </button>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="max-w-6xl mx-auto px-4 -mt-16 pb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-12 z-10 relative">
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
            icon: "fa-user-circle",
            title: "Add School Admin",
            description: "Admin of the school to monitor the application",
          },
        ].map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 flex flex-col items-center text-center h-auto sm:h-[220px] custom-shadow transition-shadow hover:shadow-lg"
          >
            <div className="bg-orange-600 text-white rounded-full p-4 mb-4">
              <i className={`fas ${card.icon} text-xl`}></i>
            </div>
            <h3 className="font-bold text-lg mb-1">{card.title}</h3>
            <p className="text-gray-600 text-sm">{card.description}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="bg-black text-white px-4 sm:px-6 pt-10 pb-6 mt-auto">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
            {/* Left Column */}
            <div className="md:w-1/3 text-center md:text-left">
              <div className="inline-block md:inline rounded-md border border-orange-400 p-1 mb-3">
                <img
                  src="https://storage.googleapis.com/a1aa/image/6f2672f2-abe0-45a5-d840-4a6f7e41640f.jpg"
                  alt="EduCat logo"
                  className="w-20 h-20 object-contain mx-auto md:mx-0"
                />
              </div>
              <p className="text-xs max-w-xs mx-auto md:mx-0">
                Empowering educational institutions with innovative technology solutions for better learning outcomes.
              </p>
              <div className="flex justify-center md:justify-start space-x-3 mt-4">
                <button className="bg-gray-800 hover:bg-gray-700 p-2 rounded-md">
                  <i className="fas fa-envelope text-white text-sm"></i>
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 p-2 rounded-md">
                  <i className="fas fa-phone-alt text-white text-sm"></i>
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 p-2 rounded-md">
                  <i className="fas fa-map-marker-alt text-white text-sm"></i>
                </button>
              </div>
            </div>

            {/* Right Columns */}
            <div className="flex flex-col sm:flex-row md:space-x-20 text-xs text-center sm:text-left">
              <div className="mb-6 sm:mb-0">
                <h3 className="font-semibold mb-3">Quick Links</h3>
                <ul className="space-y-1">
                  <li>About Us</li>
                  <li>Features</li>
                  <li>Pricing</li>
                  <li>Support</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Legal</h3>
                <ul className="space-y-1">
                  <li>Terms of Service</li>
                  <li>Privacy Policy</li>
                  <li>Cookie Policy</li>
                </ul>
              </div>
            </div>
          </div>

          <hr className="border-gray-600 my-6" />

          <div className="flex flex-col md:flex-row md:justify-between items-center text-xs text-gray-400 gap-3">
            <div className="flex items-center justify-center space-x-1">
              <span>Made with</span>
              <svg
                aria-hidden="true"
                className="h-4 w-4 text-red-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
                        2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 
                        3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 
                        6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span>for a better education</span>
            </div>

            <div className="flex justify-center space-x-3">
              <a href="#" className="hover:text-white">
                <i className="fab fa-instagram text-gray-400" />
              </a>
              <a href="#" className="hover:text-white">
                <i className="fab fa-facebook-f text-gray-400" />
              </a>
              <a href="#" className="hover:text-white">
                <i className="fab fa-linkedin-in text-gray-400" />
              </a>
            </div>

            <div className="text-center md:text-right">
              © {new Date().getFullYear()} SCRM. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

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
