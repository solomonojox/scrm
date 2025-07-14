import React from 'react'
import logo from '../assets/looogo.png';
const Header = () => {
  return (
    <div>
        <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <nav className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-2">
                      <img
                        src={logo}
                        alt="EduCat logo"
                        width={96}
                        height={44}
                        className="block"
                      />
                    </div>
                    <ul className="hidden md:flex ml-[400px] space-x-8 font-semibold text-black text-sm">
                      {['Home', 'About Us', 'Features', 'Statistics', 'Contact'].map((item) => (
                        <li key={item}>
                          <a href="#" className="hover:underline">
                            {item}
                          </a>
                        </li>
                      ))}
                    </ul>
                    <div>
                      <button className="bg-orange-600 text-white text-sm font-semibold px-5 py-2 rounded-md hover:bg-orange-700 transition">
                        Login
                      </button>
                    </div>
                  </nav>
                </div>
              </header>
    </div>
  )
}

export default Header