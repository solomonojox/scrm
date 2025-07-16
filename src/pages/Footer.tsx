import React from "react";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaCommentDots,
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

import logo from '../assets/looogo.png';

const Footer = () => (
  <footer className="bg-black text-white px-6 md:px-12 py-8">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
      {/* Logo & intro */}
      <div className="flex flex-col md:flex-row md:gap-6 w-full md:w-1/2">
        <div className="bg-white p-2 rounded-md w-fit">
          <img src={logo} alt="Logo" width={100} height={60} className="rounded-md" />
        </div>

        <p className="mt-4 md:mt-0 text-xs leading-tight max-w-xs">
          Empowering educational institutions with innovative technology solutions for better learning outcomes.
        </p>

        <div className="flex gap-2 mt-3">
          {/* Contact icons */}
          {[FaEnvelope, FaPhoneAlt, FaMapMarkerAlt].map((Icon, i) => (
            <button
              key={i}
              aria-label="contact-icon"
              className="bg-gray-700 hover:bg-gray-600 p-2 rounded"
            >
              <Icon className="text-xs text-white" />
            </button>
          ))}

          {/* Chat icon */}
          <button aria-label="chat" className="bg-orange-500 hover:bg-orange-600 p-2 rounded">
            <FaCommentDots className="text-xs text-white" />
          </button>
        </div>
      </div>

      {/* Quick Links & Legal */}
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
        {[FaInstagram, FaFacebookF, FaLinkedinIn, FaYoutube].map((Icon, i) => (
          <a key={i} href="#" aria-label="social-icon" className="hover:text-gray-400">
            <Icon />
          </a>
        ))}
      </div>
    </div>

    <div className="max-w-7xl mx-auto mt-2 text-xs text-center md:text-right">
      © 2025 SCRM. All rights reserved.
    </div>
  </footer>
);

export default Footer;
