import React, { useRef, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { FaRegCheckCircle, FaClipboardCheck, FaComments, FaChartLine, FaShieldAlt, FaThLarge, FaHeadset, FaMobileAlt, FaTrophy, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaCommentDots, FaInstagram, FaFacebookF, FaLinkedinIn, FaYoutube, FaBars, FaTimes } from 'react-icons/fa';
import useTawkTo from '../Context/useTawkTo';

import imageAssets from '../assets/imageAssets';

const {logo, boy, a, b, c, d, e, f, g, h, i} = imageAssets


const slides = [
  { src: a, label: 'Unified Online Payment System' },
  { src: b, label: 'CBT Examination' },
  { src: c, label: 'Real-Time Result Processing' },
  { src: d, label: 'Assignment Allocation By Teachers' },
  { src: e, label: 'Easy Access' },
];
const items = [
  { icon: <FaRegCheckCircle className="text-orange-600 text-xl mt-1" />, title: 'User friendly interface', text: 'Intuitive design ensures quick adoption by staff and students.' },
  { icon: <FaShieldAlt className="text-orange-600 text-xl mt-1" />, title: 'Secure & Reliable', text: 'State-of-the-art security measures to protect sensitive data.' },
  { icon: <FaThLarge className="text-orange-600 text-xl mt-1" />, title: 'Customizable Modules', text: 'Tailored features to meet your organizational needs.' },
  { icon: <FaHeadset className="text-orange-600 text-xl mt-1" />, title: '24/7 Support', text: 'Dedicated Support team ready to assist whenever needed.' },
  { icon: <FaMobileAlt className="text-orange-600 text-xl mt-1" />, title: 'Mobile Access', text: 'Access on the go with responsive design and mobile app.' },
  { icon: <FaTrophy className="text-orange-600 text-xl mt-1" />, title: 'Proven Results', text: 'Trusted by 150+ schools with 98% satisfaction rate.' },
];

const Landing = () => {
  useTawkTo();
  const trackRef = useRef(null);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Duplicate for infinite scroll effect
  const allSlides = [...slides, ...slides];

  return (
    <>
      {/* Optimized Header */}
      <header className="bg-white shadow-md sticky top-0 z-20 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/">
              <img src={logo} alt="EduCat logo" width={96} height={44} className="object-contain" />
            </Link>

            {/* Desktop Navigation */}
            <ul className="hidden md:flex items-center space-x-8 font-semibold text-gray-800 text-sm">
              {[
                { name: "Home", link: "/" },
                { name: "About Us", link: "#about" },
                { name: "Features", link: "#features" },
                { name: "Statistics", link: "#statistics" },
                { name: "Contact", link: "#contact" },
              ].map((item, index) => (
                <li key={index}>
                  <a
                    href={item.link}
                    className="hover:text-orange-600 transition-colors duration-200"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>

            {/* Login Button (Desktop) */}
            <div className="hidden md:flex items-center space-x-2">
              <button
                className="bg-orange-600 text-white text-sm font-semibold px-5 py-2 rounded-md hover:bg-orange-700 transition-colors duration-200"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
              <button
                className="bg-orange-600 text-white text-sm font-semibold px-5 py-2 rounded-md hover:bg-orange-700 transition-colors duration-200"
                onClick={() => navigate("/studentscbt")}
              >
                CBT Exam
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-gray-800 hover:text-orange-600 focus:outline-none"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <FaTimes className="text-2xl" />
                ) : (
                  <FaBars className="text-2xl" />
                )}
              </button>
            </div>
          </nav>

          {/* Mobile Menu */}
          <div
            className={`md:hidden fixed inset-x-0 top-16 bg-white shadow-lg transition-all duration-300 ease-in-out ${isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"
              }`}
          >
            <ul className="flex flex-col items-center py-6 space-y-4 text-gray-800 font-semibold text-sm">
              {[
                { name: "Home", link: "/" },
                { name: "About Us", link: "#about" },
                { name: "Features", link: "#features" },
                { name: "Statistics", link: "#statistics" },
                { name: "Contact", link: "#contact" },

              ].map((item, index) => (
                <li key={index}>
                  <a
                    href={item.link}
                    className="hover:text-orange-600 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
              <li>
                <button
                  className="bg-orange-600 text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-orange-700 transition-colors duration-200"
                  onClick={() => {
                    navigate("/login");
                    setIsMenuOpen(false);
                  }}
                >
                  Login
                </button>
              </li>
              <li>
                <button
                  className="bg-orange-600 text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-orange-700 transition-colors duration-200"
                  onClick={() => {
                    navigate("/studentscbt");
                    setIsMenuOpen(false);
                  }}
                >
                  CBT Exam
                </button>
              </li>
            </ul>
          </div>
        </div>
      </header>

      {/* ─── Hero ─── */}
      <div className="w-full bg-gray-200">
        <main className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between">
          {/* Left column */}
          <section className="max-w-xl">
            <h1 className="text-4xl md:text-6xl font-extrabold text-black leading-tight">
              Revolutionize Education With EduCat(SCRM)
            </h1>
            <p className="mt-4 text-base text-gray-800 max-w-md">
              A powerful digital hub for managing schools, enhancing learning, and simplifying
              every process.
            </p>
            <Link
              to="/get-started"
              className="mt-8 inline-block bg-orange-600 text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-orange-700 transition"
            >
              Get Started
            </Link>
          </section>

          {/* Right column (image) */}
          <section className="relative mt-10 md:mt-0 w-72 h-72 md:w-96 md:h-96">
            <div className="absolute inset-0 rounded-full border-8 border-white" />
            <div className="absolute inset-4 rounded-full bg-orange-600" />
            <img
              src={boy}
              alt="Boy with books"
              className="relative rounded-full object-cover w-full h-full"
            />
          </section>
        </main>
      </div>

      {/* What You Get From Us */}
      <section className="relative bg-gradient-to-b bg-gray-200">
        <div className="pt-1 mt-[-37.4px] pb-8 text-center px-4">
          <h2 className="font-extrabold text-4xl mb-4 text-gray-900">What You Get From Us</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Comprehensive solution designed to transform your educational institution.
          </p>
        </div>
        <div className="absolute inset-x-0 top-[calc(100%-1px)] overflow-hidden leading-none">
          <svg
            className="relative block w-full h-32"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path d="M0,0 C400,150 800,0 1200,100 L1200,0 L0,0 Z" className="fill-gray-100" />
          </svg>
        </div>
      </section>

      {/* Auto-Scrolling Carousel */}
      <section className="bg-gray-200 py-12 overflow-hidden">
        <style>{`
          @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%);} }
        `}</style>
        <div className="relative max-w-7xl mx-auto px-4">
          <div
            className="flex space-x-8 animate-scroll"
            style={{ animation: "scroll 15s linear infinite" }}
          >
            {allSlides.map((item, idx) => (
              <div
                key={idx}
                className="relative w-64 flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-300"
              >
                <div className="overflow-hidden rounded-2xl">
                  <img
                    src={item.src}
                    alt={item.label}
                    className="w-full h-60 object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute bottom-4 left-4 bg-orange-500 bg-opacity-90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center space-x-2 shadow-md">
                  <span className="text-xs font-medium text-white">{item.label}</span>
                  <FaRegCheckCircle className="text-white text-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us */}
      <section className="bg-gray-200 py-8 px-4" id="about">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 md:gap-12 items-center">
          {/* Image */}
          <img src={f} alt="Team working" className="rounded-lg w-full max-w-md object-cover" />

          {/* Text Content */}
          <div className="max-w-xl text-gray-900">
            <h2 className="font-bold text-lg mb-2 text-center md:text-left">About Us</h2>
            <p className="mb-4 text-sm leading-relaxed">
              EduCat(School Management System) is a comprehensive school management solution
              designed to streamline administrative tasks, enhance communication between teachers,
              students, and parents, and provide data-driven insights for better decision-making.
            </p>
            <p className="font-semibold mb-4 text-sm">What we do:</p>

            <ul className="space-y-4 text-sm">
              {/* Effortless Administration */}
              <li className="flex items-start gap-3">
                <div className="bg-orange-600 text-white rounded-full px-4 py-4 flex items-center justify-center mt-1 shadow-md">
                  <FaClipboardCheck className="text-lg" />
                </div>
                <p>
                  <span className="font-semibold">Effortless Administration</span> - Manage
                  schedules, attendance and grading all in one intuitive platform
                </p>
              </li>

              {/* Engaging Communication */}
              <li className="flex items-start gap-3">
                <div className="bg-orange-600 text-white rounded-full px-4 py-4 flex items-center justify-center mt-1 shadow-md">
                  <FaComments className="text-lg" />
                </div>
                <p>
                  <span className="font-semibold">Engaging Communication</span> - Seamless
                  messaging between teachers, students, and parents with real-time notification.
                </p>
              </li>

              {/* Data-Driven Insights */}
              <li className="flex items-start gap-3">
                <div className="bg-orange-600 text-white rounded-full px-4 py-4 flex items-center justify-center mt-1 shadow-md">
                  <FaChartLine className="text-lg" />
                </div>
                <p>
                  <span className="font-semibold">Data-Driven Insights</span> - Advanced analytics
                  to track performance, and identify areas of improvement.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="border-t-4 bg-white" id="features">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <h2 className="text-center font-bold text-lg mb-8">Why Choose Us?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.title} className="flex space-x-4 p-4 bg-white rounded-md shadow-md">
                <div>{item.icon}</div>
                <div>
                  <h3 className="font-bold text-sm">{item.title}</h3>
                  <p className="text-xs leading-tight">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics & Impact */}
      <section className="bg-gray-200 py-8" id="statistics">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-[720px] mx-auto border-4 rounded-md text-center p-4 mb-8">
            <h2 className="font-extrabold text-2xl">Statistics & Impact</h2>
            <p className="text-sm mt-1">Real numbers from real schools using EduCat(SCRM)</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { src: g, label: "150+ Schools Onboarded" },
              { src: h, label: "20k+ Active Students" },
              { src: i, label: "98% Satisfaction Rate" },
            ].map((item) => (
              <div
                key={item.label}
                className="relative rounded-lg shadow-lg bg-white overflow-hidden"
              >
                <img src={item.src} alt={item.label} className="w-full h-64 object-cover" />
                <div className="absolute bottom-4 left-4 bg-orange-600 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center space-x-2 shadow-md">
                  <span>{item.label}</span>
                  <FaRegCheckCircle className="text-white text-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Us */}
      <section className="max-w-7xl mx-auto px-4 py-16 bg-gray-50" id="contact">
        <h2 className="text-center text-3xl font-bold text-orange-600 mb-2">Get In Touch</h2>
        <p className="text-center text-gray-600 mb-10 text-sm">
          We'd love to hear from you. Send us a message or find us on the map below.
        </p>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Contact Form */}
          <div className="bg-white shadow-xl rounded-2xl p-8 w-full md:w-1/2 space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-3 border border-orange-400 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full px-4 py-3 border border-orange-400 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full px-4 py-3 border border-orange-400 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <textarea
              placeholder="Your Message"
              rows={5}
              className="w-full px-4 py-3 border border-orange-400 rounded-lg text-sm placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="button"
              className="w-full bg-orange-600 text-white py-3 rounded-lg text-sm font-medium hover:bg-orange-700 transition duration-300"
            >
              Send Message
            </button>
          </div>

          {/* Real Map */}
          <div className="w-full md:w-1/2 h-[400px] shadow-xl rounded-2xl overflow-hidden">
            <iframe
              title="Company Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3168.989316413396!2d-122.0842491846921!3d37.42199997982444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb0cb35e9c1ef%3A0x3c1154c7e6b1ab88!2sGoogleplex!5e0!3m2!1sen!2sus!4v1618350594953!5m2!1sen!2sus"
              width="100%"
              height="100%"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white px-6 md:px-12 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="flex flex-col md:flex-row md:gap-6 w-full md:w-1/2">
            {/* Logo inside white div */}
            <div className="bg-white p-2 rounded-md w-fit">
              <img src={logo} alt="Logo" width={100} height={60} className="rounded-md" />
            </div>

            <p className="mt-4 md:mt-0 text-xs leading-tight max-w-xs">
              Empowering educational institutions with innovative technology solutions for better
              learning outcomes.
            </p>

            <div className="flex gap-2 mt-3">
              {/* Contact icons */}
              <button aria-label="email" className="bg-gray-700 hover:bg-gray-600 p-2 rounded">
                <FaEnvelope className="text-xs text-white" />
              </button>
              <button aria-label="phone" className="bg-gray-700 hover:bg-gray-600 p-2 rounded">
                <FaPhoneAlt className="text-xs text-white" />
              </button>
              <button aria-label="location" className="bg-gray-700 hover:bg-gray-600 p-2 rounded">
                <FaMapMarkerAlt className="text-xs text-white" />
              </button>

              {/* Chat icon */}
              <button aria-label="chat" className="bg-orange-500 hover:bg-orange-600 p-2 rounded">
                <FaCommentDots className="text-xs text-white" />
              </button>
            </div>
          </div>

          {/* Quick Links and Legal */}
          <div className="flex flex-col md:flex-row md:gap-20 text-xs font-normal w-full md:w-auto">
            <div>
              <h3 className="font-semibold mb-2">Quick Links</h3>
              <ul className="space-y-1">
                {["About Us", "Features", "Pricing", "Support"].map((link) => (
                  <li key={link}>{link}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Legal</h3>
              <ul className="space-y-1">
                {["Terms of Service", "Privacy Policy", "Cookie Policy"].map((link) => (
                  <li key={link}>{link}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <hr className="border-gray-600 my-6" />

        {/* Bottom bar */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs">
          <div className="flex items-center gap-1 mb-4 md:mb-0">
            Made with <span className="text-red-600">♥</span> for a better education
          </div>
          <div className="flex gap-4 text-white text-lg">
            <a href="#" aria-label="instagram" className="hover:text-gray-400">
              <FaInstagram />
            </a>
            <a href="#" aria-label="facebook" className="hover:text-gray-400">
              <FaFacebookF />
            </a>
            <a href="#" aria-label="linkedin" className="hover:text-gray-400">
              <FaLinkedinIn />
            </a>
            <a href="#" aria-label="youtube" className="hover:text-gray-400">
              <FaYoutube />
            </a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-2 text-xs text-center md:text-right">
          © 2025 EDUCAT. All rights reserved.
        </div>
      </footer>
    </>
  );
};

export default Landing;