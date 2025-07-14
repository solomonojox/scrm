// src/LandingPage.jsx
import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { FiPhoneCall } from "react-icons/fi";
import boy from '../Assets/boyImage.png'
export default function Mainlanding() {
  return (
    <div className="font-sans">
      {/* Navbar */}
      <header className="bg-white shadow-md fixed top-0 w-full z-50">
        <nav className="max-w-7xl mx-auto flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold">EduCat</h1>
          <ul className="flex space-x-6">
            <li className="hover:text-orange-500 cursor-pointer">Home</li>
            <li className="hover:text-orange-500 cursor-pointer">About</li>
            <li className="hover:text-orange-500 cursor-pointer">Features</li>
            <li className="hover:text-orange-500 cursor-pointer">Contact</li>
          </ul>
          <button className="bg-orange-500 text-white px-4 py-2 rounded">Login</button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="mt-20 bg-gray-5cd fron0 flex flex-col md:flex-row items-center justify-between px-10 py-16">
        <div className="md:w-1/2 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold">Revolutionize Education With EduCat (SCRM)</h2>
          <p className="text-gray-700">Centralized SCRM for managing students, enhancing communication, and improving learning process.</p>
          <button className="bg-orange-500 text-white px-6 py-3 rounded">Get Started</button>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <img src={boy} alt="Hero" className="w-80 rounded-full"/>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-10 px-10 text-center">
        <h3 className="text-2xl font-bold mb-6">What You Get From Us</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <img src="/service1.png" alt="service" className="rounded shadow" />
          <img src="/service2.png" alt="service" className="rounded shadow" />
          <img src="/service3.png" alt="service" className="rounded shadow" />
          <img src="/service4.png" alt="service" className="rounded shadow" />
        </div>
      </section>

      {/* About Us */}
      <section className="bg-white py-10 px-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <img src="/aboutus.png" alt="About" className="w-full md:w-1/2 rounded" />
          <div className="space-y-4 md:w-1/2">
            <h3 className="text-2xl font-bold">About Us</h3>
            <p>EduCat is a School Management System that simplifies administration, enhances communication, and improves student performance.</p>
            <ul className="space-y-2">
              <li className="flex items-center"><FaCheckCircle className="text-orange-500 mr-2"/> Efficient Administration</li>
              <li className="flex items-center"><FaCheckCircle className="text-orange-500 mr-2"/> Engaging Communication</li>
              <li className="flex items-center"><FaCheckCircle className="text-orange-500 mr-2"/> Easy-to-Use Software</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-10 px-10 bg-gray-50">
        <h3 className="text-2xl font-bold text-center mb-6">Why Choose Us?</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {["User friendly interface","Secure & Reliable","Customisable Modules","24/7 Support","Mobile Access","Proven Results"].map((item, idx) => (
            <div key={idx} className="bg-white rounded shadow p-6 text-center">
              <p>{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Statistics */}
      <section className="py-10 px-10">
        <h3 className="text-2xl font-bold text-center mb-6">Statistics & Impact</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <img src="/stat1.png" alt="stat" className="rounded shadow"/>
          <img src="/stat2.png" alt="stat" className="rounded shadow"/>
          <img src="/stat3.png" alt="stat" className="rounded shadow"/>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-gray-50 py-10 px-10">
        <h3 className="text-2xl font-bold text-center mb-6">Contact Us</h3>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
          <form className="space-y-4">
            <input type="text" placeholder="Name" className="w-full border rounded p-3"/>
            <input type="email" placeholder="Email" className="w-full border rounded p-3"/>
            <input type="text" placeholder="Subject" className="w-full border rounded p-3"/>
            <textarea placeholder="Message" className="w-full border rounded p-3 h-32"></textarea>
            <button className="bg-orange-500 text-white px-6 py-3 rounded">Send Message</button>
          </form>
          <iframe title="Map" src="https://maps.google.com/maps?q=location&t=&z=13&ie=UTF8&iwloc=&output=embed" className="w-full h-96 rounded"></iframe>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-10 px-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p>© 2025 EduCat. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <FiPhoneCall /> <span>+234 000 0000</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
