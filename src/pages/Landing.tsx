import React from 'react';
import logo from '../assets/looogo.png';
import boy from '../assets/boyImage.png';
const Landing = () => {
  return (
    <>
      {/* Header */}
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
            <ul className="hidden md:flex space-x-8 ml-[400px] font-semibold text-black text-sm">
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

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-12 flex flex-col md:flex-row items-center justify-between bg-gray-200">
        <section className="max-w-xl md:max-w-lg lg:max-w-xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-black leading-tight">
            Revolutionize Education With EduCat(SCRM)
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-800 max-w-md">
            A powerful digital hub for managing schools, enhancing learning, and simplifying every process.
          </p>
          <button className="mt-8 bg-orange-600 text-white font-semibold text-sm px-6 py-3 rounded-md hover:bg-orange-700 transition">
            Get Started
          </button>
        </section>
        <section className="relative mt-12 md:mt-0 flex justify-center items-center w-72 h-72 md:w-96 md:h-96">
          <div className="absolute inset-0 rounded-full border-8 border-white" />
          <div className="absolute inset-4 rounded-full bg-orange-600" />
          <img
            src={boy}
            alt="Boy with glasses holding colorful books"
            className="relative rounded-full object-cover w-72 h-72 md:w-96 md:h-96"
          />
          {/* <div className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-md shadow-md w-16 h-16 flex flex-col items-center justify-center text-[8px] font-bold text-black">
            <div className="text-[6px] font-normal mb-0.5">Track Students</div>
            <svg className="w-6 h-6 mb-0.5" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="#eee" />
              <circle cx="18" cy="18" r="10" fill="#3b82f6" />
              <circle cx="18" cy="18" r="6" fill="#2563eb" />
            </svg>
            <div className="flex justify-between w-full px-1 text-[6px] font-normal">
              <span>Teachers</span>
              <span>Guardians</span>
            </div>
          </div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-md shadow-md w-16 h-16 flex flex-col items-center justify-center text-[8px] font-bold text-black">
            <div className="text-[6px] font-normal mb-0.5">Examination</div>
            <img
              src="https://storage.googleapis.com/a1aa/image/36107014-66a7-4819-4a56-4a5e266054f9.jpg"
              alt="CBT Test Icon"
              className="mb-0.5"
              width={20}
              height={20}
            />
            <div className="flex justify-between w-full px-1 text-[6px] font-normal">
              <span>Test</span>
              <span>CA</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-white rounded-md shadow-md w-20 h-12 flex items-center justify-center">
            <img
              src="https://storage.googleapis.com/a1aa/image/a3bff257-a694-4868-97b6-dc696635d0f4.jpg"
              alt="Statistics Icon"
              width={60}
              height={30}
            />
          </div> */}
        </section>
      </main>

      {/* What You Get From Us */}
      <section>
        <div className="skew-container py-10 bg-gray-100">
          <div className="unskew-content max-w-7xl mx-auto px-4 text-center">
            <h2 className="font-extrabold text-lg sm:text-xl md:text-2xl text-black mb-1">
              What You Get From Us
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-black max-w-md mx-auto">
              Comprehensive solution designed to transform your educational institution.
            </p>
          </div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 -mt-10 overflow-x-auto">
          <div className="flex space-x-4 min-w-[1200px]">
            {[
              { src: 'https://storage.googleapis.com/a1aa/image/c4c7ecfe-5a26-4aa7-51d4-065c0e8729f5.jpg', label: 'Unified Online Payment System' },
              { src: 'https://storage.googleapis.com/a1aa/image/7bef6070-1655-4a01-5ca4-b6184116a214.jpg', label: 'CBT Examination' },
              { src: 'https://storage.googleapis.com/a1aa/image/18aa74f2-c37a-43dd-e260-2d75b4b6abeb.jpg', label: 'Real-Time Result Processing' },
              { src: 'https://storage.googleapis.com/a1aa/image/200f16ca-6039-494e-53fc-161365799232.jpg', label: 'Assignment Allocation By Teachers' },
              { src: 'https://storage.googleapis.com/a1aa/image/b1760fd3-7b9b-498b-c45a-ff470fc44ed2.jpg', label: 'Easy Access' },
            ].map((item) => (
              <div key={item.label} className="relative w-48 sm:w-56 md:w-64 flex-shrink-0">
                <img src={item.src} alt={item.label} className="w-full h-auto object-cover" />
                <button className="absolute bottom-3 left-3 bg-orange-600 text-white text-xs px-3 py-1 rounded-full flex items-center space-x-1">
                  <span>{item.label}</span><i className="fas fa-check-circle" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us */}
      <section className="bg-gray-200 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 md:gap-12 items-center">
          <img
            src="https://storage.googleapis.com/a1aa/image/a8bfbac7-83fa-42e6-a0b0-d14610a99d11.jpg"
            alt="Team working" className="rounded-lg w-full max-w-md object-cover"
          />
          <div className="max-w-xl text-gray-900">
            <h2 className="font-bold text-lg mb-2 text-center md:text-left">About Us</h2>
            <p className="mb-4 text-sm leading-relaxed">
              EduCat(School Management System) is a comprehensive school management solution designed to streamline administrative tasks, enhance communication between teachers, students, and parents, and provide data-driven insights for better decision-making.
            </p>
            <p className="font-semibold mb-4 text-sm">What we do:</p>
            <ul className="space-y-4 text-sm">
              {[
                { icon: 'user-friends', title: 'Effortless Administration', text: 'Manage schedules, attendance and grading all in one intuitive platform' },
                { icon: 'broadcast-tower', title: 'Engaging Communication', text: 'Seamless messaging between teachers, students, and parents with real-time notification.' },
                { icon: 'stopwatch', title: 'Data-Driven Insights', text: 'Advanced analytics to track performance, and identify areas of improvement.' },
              ].map((item) => (
                <li key={item.title} className="flex items-start gap-3">
                  <div className="flex-shrink-0 bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center mt-1">
                    <i className={`fas fa-${item.icon} text-xs`} />
                  </div>
                  <p><span className="font-semibold">{item.title}</span> - {item.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

       {/* Why Choose Us */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center font-bold text-lg mb-8">Why Choose Us?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[ 
              {
                icon: 'fas fa-check-circle',
                title: 'User friendly interface',
                desc: 'Intuitive design ensures quick adoption by staff and students.',
              },
              {
                icon: 'fas fa-shield-alt',
                title: 'Secure & Reliable',
                desc: 'State-of-the-art security measures to protect sensitive data.',
              },
              {
                icon: 'fas fa-th-large',
                title: 'Customizable Modules',
                desc: 'Tailored features to meet your organizational needs.',
              },
              {
                icon: 'fas fa-headset',
                title: '24/7 Support',
                desc: 'Dedicated Support team ready to assist whenever needed.',
              },
              {
                icon: 'fas fa-mobile-alt',
                title: 'Mobile Access',
                desc: 'Access on the go with responsive design and mobile app.',
              },
              {
                icon: 'fas fa-trophy',
                title: 'Proven Results',
                desc: 'Trusted by 150+ schools with 98% satisfaction rate.',
              },
            ].map((item, index) => (
              <div key={index} className="flex space-x-4 p-4 bg-white rounded-md shadow-md">
                <div className="text-orange-600 text-xl mt-1">
                  <i className={item.icon}></i>
                </div>
                <div>
                  <h3 className="font-bold text-sm flex items-center">
                    {item.title}
                  </h3>
                  <p className="text-xs leading-tight">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics & Impact */}
      <section className="bg-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-[720px] mx-auto border-4 rounded-md bg-white text-center p-4 mb-8">
            <h2 className="font-extrabold text-2xl">Statistics & Impact</h2>
            <p className="text-sm mt-1">Real numbers from real schools using EduCat(SCRM)</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { src: 'https://placehold.co/400x250?text=Group+of+diverse+students+walking+outside+school', label: '150+ Schools Onboarded' },
              { src: 'https://storage.googleapis.com/a1aa/image/c607b413-87dc-4481-9de6-533967b38df5.jpg', label: '20k+ Active Students' },
              { src: 'https://storage.googleapis.com/a1aa/image/7d50b7d8-c75a-444e-3df7-04e9bc128efd.jpg', label: '98% Satisfaction Rate' },
            ].map((item) => (
              <div key={item.label} className="relative rounded-lg shadow-lg bg-white overflow-hidden">
                <img src={item.src} alt={item.label} className="w-full h-64 object-cover" />
                <div className="absolute bottom-4 left-4 bg-orange-600 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center space-x-2 shadow-md">
                  <span>{item.label}</span><i className="fas fa-check-circle" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Us */}
      <section className="max-w-7xl mx-auto px-4 py-10 bg-white">
        <h2 className="text-center font-bold text-lg mb-2">Contact Us</h2>
        <p className="text-center text-sm mb-8">Have questions or need a demo? We'd love to hear from you.</p>
        <div className="flex flex-col md:flex-row md:space-x-10 justify-center items-start">
          <form className="bg-white shadow-lg rounded-md p-6 w-full max-w-md">
            <input type="text" placeholder="Name" className="w-full mb-4 px-3 py-2 border border-orange-400 rounded-md placeholder-orange-400 text-xs focus:outline-none" />
            <input type="text" placeholder="Phone Number" className="w-full mb-4 px-3 py-2 border border-orange-400 rounded-md placeholder-orange-400 text-xs focus:outline-none" />
            <input type="email" placeholder="Email" className="w-full mb-4 px-3 py-2 border border-orange-400 rounded-md placeholder-orange-400 text-xs focus:outline-none" />
            <textarea placeholder="Message" rows={5} className="w-full mb-6 px-3 py-2 border border-orange-400 rounded-md placeholder-orange-400 text-xs resize-none focus:outline-none" />
            <button type="submit" className="w-full bg-orange-600 text-white text-xs font-normal py-3 rounded-md hover:bg-orange-700 transition">Submit</button>
          </form>
          <div className="mt-8 md:mt-0 w-full max-w-lg shadow-lg rounded-md overflow-hidden">
            <img
              src="https://storage.googleapis.com/a1aa/image/15376956-ab58-4e85-0dad-becba5575d75.jpg"
              alt="Map"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white px-6 md:px-12 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="flex flex-col md:flex-row md:gap-6 w-full md:w-1/2">
            <img src={logo} alt="Logo" width={100} height={60} className="rounded-md" />
            <p className="mt-4 md:mt-0 text-xs leading-tight max-w-xs">
              Empowering educational institutions with innovative technology solutions for better learning outcomes.
            </p>
            <div className="flex gap-2 mt-3">
              {['envelope', 'phone-alt', 'map-marker-alt'].map(icon => (
                <button key={icon} aria-label={icon} className="bg-gray-700 hover:bg-gray-600 p-2 rounded">
                  <i className={`fas fa-${icon} text-xs text-white`} />
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:gap-20 text-xs font-normal w-full md:w-auto">
            <div>
              <h3 className="font-semibold mb-2">Quick Links</h3>
              <ul className="space-y-1">
                {['About Us', 'Features', 'Pricing', 'Support'].map(link => <li key={link}>{link}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Legal</h3>
              <ul className="space-y-1">
                {['Terms of Service', 'Privacy Policy', 'Cookie Policy'].map(link => <li key={link}>{link}</li>)}
              </ul>
            </div>
          </div>
        </div>
        <hr className="border-gray-600 my-6" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs">
          <div className="flex items-center gap-1 mb-4 md:mb-0">Made with <span className="text-red-600">♥</span> for a better education</div>
          <div className="flex gap-4 text-white text-lg">
            {['instagram', 'facebook-f', 'linkedin-in', 'youtube'].map(social => (
              <a key={social} href="#" className="hover:text-gray-400" aria-label={social}>
                <i className={`fab fa-${social}`} />
              </a>
            ))}
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-2 text-xs text-center md:text-right">© 2025 SCRM. All rights reserved.</div>
      </footer>
    </>
  );
};

export default Landing;
