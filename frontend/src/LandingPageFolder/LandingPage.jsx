import React, { useState, useEffect } from 'react';
import { ChevronDown, Users, BookOpen, BarChart3, Shield, Clock, Smartphone, CheckCircle, Mail, Phone, MapPin, Star, ArrowRight, Menu, X } from 'lucide-react';
import assets from '../Assets/assets';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';

const LandingPage = () => {
  const { ref: statsRef, inView: statsInView } = useInView({ triggerOnce: true });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  // const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <div className="font-sans text-gray-800 overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-br from-green-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Enhanced Header */}
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-white/95 backdrop-blur-lg shadow-lg' : 'bg-white/90 backdrop-blur-sm'
        }`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <div className="flex items-center space-x-2 group cursor-pointer">
                <div className="w-24 h-10  rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  {/* <BookOpen className="w-6 h-6 text-white" /> */}
                  <img src={assets.scrm} alt="" />
                </div>
                {/* <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SCRM
                </span> */}
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {['Home', 'About', 'Why Choose Us', 'Statistics', 'Contact'].map((item, index) => {
                const sectionId = ['hero', 'about', 'why', 'stats', 'contact'][index];
                return (
                  <button
                    key={item}
                    onClick={() => scrollToSection(sectionId)}
                    className="relative px-4 py-2 text-gray-700 hover:text-blue-600 rounded-lg transition-all duration-300 group"
                  >
                    {item}
                    <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full group-hover:left-0 transition-all duration-300"></div>
                  </button>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transition-all duration-300"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-lg border-t">
            <div className="px-4 py-2 space-y-1">
              {['Home', 'About', 'Why Choose Us', 'Statistics', 'Contact'].map((item, index) => {
                const sectionId = ['hero', 'about', 'why', 'stats', 'contact'][index];
                return (
                  <button
                    key={item}
                    onClick={() => scrollToSection(sectionId)}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      <main className="pt-16 relative z-10">
        {/* Hero Section */}
        <section id="hero" className="min-h-screen flex items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
          <div className="max-w-7xl mx-auto px-4 py-20 text-center relative z-10">
            <div className="animate-fade-in-up">
              <h1 className="text-5xl sm:text-7xl font-extrabold mb-6">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Welcome to
                </span>
                <br />
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  School Management SCRM
                </span>
              </h1>
              <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Simplifying school operations, empowering educators, and engaging students with cutting-edge technology and intuitive design.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => scrollToSection('contact')}
                  className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    Get Started
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                <button
                  onClick={() => scrollToSection('about')}
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-blue-600 bg-white border-2 border-blue-600 rounded-full hover:bg-blue-600 hover:text-white hover:shadow-xl transition-all duration-300"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-8 h-8 text-blue-600" />
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 bg-white relative">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                About SCRM
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                SCRM is a comprehensive school management solution designed to streamline administrative tasks, enhance communication between teachers, students, and parents, and provide data-driven insights for better decision-making.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Users,
                  title: "Effortless Administration",
                  description: "Manage schedules, attendance, and grading all in one intuitive platform.",
                  gradient: "from-blue-500 to-cyan-500"
                },
                {
                  icon: Mail,
                  title: "Engaging Communication",
                  description: "Seamless messaging between teachers, students, and parents with real-time notifications.",
                  gradient: "from-purple-500 to-pink-500"
                },
                {
                  icon: BarChart3,
                  title: "Data-Driven Insights",
                  description: "Advanced analytics to track performance and identify areas for improvement.",
                  gradient: "from-green-500 to-emerald-500"
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section id="why" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                Why Choose SCRM?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: CheckCircle, title: "User-Friendly Interface", desc: "Intuitive design ensures quick adoption by staff and students.", color: "text-green-500" },
                { icon: Shield, title: "Secure & Reliable", desc: "State-of-the-art security measures to protect sensitive data.", color: "text-blue-500" },
                { icon: BookOpen, title: "Customizable Modules", desc: "Tailor features to fit your institution's unique needs.", color: "text-purple-500" },
                { icon: Clock, title: "24/7 Support", desc: "Dedicated support team ready to assist whenever needed.", color: "text-orange-500" },
                { icon: Smartphone, title: "Mobile Access", desc: "Access on the go with responsive design and mobile apps.", color: "text-pink-500" },
                { icon: Star, title: "Proven Results", desc: "Trusted by 150+ schools with 98% satisfaction rate.", color: "text-yellow-500" }
              ].map((item, index) => (
                <div
                  key={index}
                  className="group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 p-3 rounded-lg bg-gray-50 group-hover:bg-gray-100 transition-colors duration-300`}>
                      <item.icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section id="stats" className="py-20 bg-white relative overflow-hidden" ref={statsRef}>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                Statistics & Impact
              </h2>
              <p className="text-xl text-gray-600">Real numbers from real schools using SCRM</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                { number: 150, label: "Schools Onboarded", icon: BookOpen, gradient: "from-blue-500 to-cyan-500", symb: "+" },
                { number: 20, label: "Active Students", icon: Users, gradient: "from-purple-500 to-pink-500", symb: "k+" },
                { number: 98, label: "Satisfaction Rate", icon: Star, gradient: "from-green-500 to-emerald-500", symb: "%" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="group text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
                >
                  <div className={`w-20 h-20 bg-gradient-to-r ${stat.gradient} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="w-10 h-10 text-white" />
                  </div>
                  <p className={`text-6xl font-extrabold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}>
                    {statsInView && <CountUp start={0} end={stat.number} />}{stat.symb}
                  </p>
                  <p className="text-xl text-gray-600 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 relative">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                Contact Us
              </h2>
              <p className="text-xl text-gray-600">Have questions or need a demo? We'd love to hear from you.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400"
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400"
                      placeholder="your.email@school.edu"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Message</label>
                  <textarea
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400 resize-none"
                    placeholder="Tell us about your school's needs and how we can help..."
                  ></textarea>
                </div>
                <div className="text-center">
                  <button
                    className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center">
                      Send Message
                      <Mail className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-blue-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">SCRM</span>
              </div>
              <p className="text-gray-300 leading-relaxed mb-4">
                Empowering educational institutions with innovative technology solutions for better learning outcomes.
              </p>
              <div className="flex space-x-4">
                {[Mail, Phone, MapPin].map((Icon, index) => (
                  <div key={index} className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors duration-300 cursor-pointer">
                    <Icon className="w-5 h-5" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {['About Us', 'Features', 'Pricing', 'Support'].map((link) => (
                  <li key={link}>
                    <button
                      type="button"
                      className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group bg-transparent border-none p-0 m-0 cursor-pointer"
                      onClick={() => { /* Add navigation logic here if needed */ }}
                    >
                      <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((link) => (
                  <li key={link}>
                    <button
                      type="button"
                      className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group bg-transparent border-none p-0 m-0 cursor-pointer"
                      onClick={() => { /* Add navigation logic here if needed */ }}
                    >
                      <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              &copy; {new Date().getFullYear()} SCRM. All rights reserved.
            </p>
            <p className="text-gray-300 text-sm mt-2 sm:mt-0">
              Made with ❤️ for better education
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;