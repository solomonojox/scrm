import React from 'react'
import { Link } from "react-router-dom";
import imageAssets from '../assets/imageAssets';

const Header = () => {
  return (
    <div>
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <img
                src={imageAssets.logo}
                alt="EduCat logo"
                width={96}
                height={44}
                className="block"
              />
            </div>
            <ul className="hidden md:flex ml-auto space-x-8 font-semibold text-black text-sm">
              {['Home', 'About Us', 'Features', 'Statistics', 'Contact'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:underline">
                    {item}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="ml-8 bg-orange-600 text-white text-sm font-semibold px-5 py-2 rounded-md hover:bg-orange-700 transition"
              >
                Login
              </Link>
              <Link
                to="/cbt"
                className="mr-8 bg-orange-600 text-white text-sm font-semibold px-5 py-2 rounded-md hover:bg-orange-700 transition"
              >
                Cbt Exam
              </Link>
            </div>

          </nav>
        </div>
      </header>
    </div>
  )
}

export default Header