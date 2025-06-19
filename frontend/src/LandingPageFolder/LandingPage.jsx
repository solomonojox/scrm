/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  ChevronDown, Users, BookOpen, BarChart3, Shield,
  Clock, Smartphone, CheckCircle, Mail, Phone,
  MapPin, Star, ArrowRight, Menu, X, CreditCard,
  FileText, Zap, UserCheck, MessageCircle, DollarSign
} from 'lucide-react';
import assets from '../Assets/assets';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [featuresInView, setFeaturesInView] = useState(false);
  const [statsInView, setStatsInView] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);

    // Intersection Observer for animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target.id === 'features') {
            setFeaturesInView(entry.isIntersecting);
          }
          if (entry.target.id === 'stats') {
            setStatsInView(entry.isIntersecting);
          }
        });
      },
      { threshold: 0.1 }
    );

    const featuresSection = document.getElementById('features');
    const statsSection = document.getElementById('stats');
    if (featuresSection) observer.observe(featuresSection);
    if (statsSection) observer.observe(statsSection);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const CountUp = ({ end, duration = 2000 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!statsInView) return;

      let start = 0;
      const increment = end / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start > end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }, [end, duration, statsInView]);

    return <span>{count}</span>;
  };

  return (
    <div className="font-sans text-stone-800 overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-400/20 to-amber-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-white/95 backdrop-blur-lg shadow-lg' : 'bg-white/90 backdrop-blur-sm'}`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo */}
            <div className="flex items-center">
              {/* <div className="flex items-center space-x-2 group cursor-pointer">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">SCRM</span>
              </div> */}
              <img src={assets.scrm} alt="logo" className="w-24" />
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-1">
              {['Home', 'Features', 'About', 'Why Choose Us', 'Statistics', 'Contact'].map((item, index) => {
                const sectionId = ['hero', 'features', 'about', 'why', 'stats', 'contact'][index];
                return (
                  <button
                    key={item}
                    onClick={() => scrollToSection(sectionId)}
                    className="relative px-4 py-2 text-stone-700 hover:text-orange-600 rounded-lg transition-all duration-300 group"
                  >
                    {item}
                    <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-orange-600 to-amber-600 group-hover:w-full group-hover:left-0 transition-all duration-300"></div>
                  </button>
                );
              })}
            </div>

            {/* Desktop Login Button */}
            <button
              className="px-10 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-md hidden md:block transition-all duration-300 hover:shadow-lg"
              onClick={() => window.location.href = '/login'}
            >
              Get Started
            </button>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:shadow-lg transition-all duration-300"
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
              {['Home', 'Features', 'About', 'Why Choose Us', 'Statistics', 'Contact'].map((item, index) => {
                const sectionId = ['hero', 'features', 'about', 'why', 'stats', 'contact'][index];
                return (
                  <button
                    key={item}
                    onClick={() => scrollToSection(sectionId)}
                    className="block w-full text-left px-3 py-2 text-stone-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-300"
                  >
                    {item}
                  </button>
                );
              })}
            </div>
            <button
              className="ml-4 mb-10 px-10 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-md md:hidden transition-all duration-300"
              onClick={() => window.location.href = '/login'}
            >
              Login
            </button>
          </div>
        )}
      </header>

      {/* Main Section */}
      <main className="pt-16 relative z-10">
        {/* Hero */}
        <section id="hero" className="min-h-screen flex items-center relative overflow-hidden" style={{background: `url(${assets.heroLanding})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center'}}>
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-black to-amber-50 opacity-15"></div>
          <div className="max-w-7xl mx-auto px-4 py-20 text-center relative z-10">
            <div className="animate-fade-in-up">
              <h1 className="text-5xl sm:text-7xl font-extrabold mb-6">
                <span className=" text-white">
                  Welcome to
                </span>
                <br />
                <span className="bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent shadow-sm">
                  School Management SCRM
                </span>
              </h1>
              <p className="mt-6 text-xl text-stone-50 max-w-3xl mx-auto leading-relaxed">
                Simplifying school operations, empowering educators, and engaging students with cutting-edge technology and intuitive design.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => console.log('Navigate to registration')}
                  className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-orange-600 to-amber-600 rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    Get Started
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </button>
                <button
                  onClick={() => scrollToSection('about')}
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-orange-600 bg-white border-2 border-orange-600 rounded-full hover:bg-orange-600 hover:text-white hover:shadow-xl transition-all duration-300"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-8 h-8 text-orange-600" />
          </div>
        </section>

        {/* What You Get From Us Section */}
        <section id="features" className="py-20 bg-gradient-to-br from-stone-50 to-orange-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/5 to-amber-600/5"></div>
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-6">
                What You Get From Us
              </h2>
              <p className="text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed">
                Comprehensive solutions designed to transform your educational institution
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: CreditCard,
                  title: "Unified Online Payment System",
                  description: "Streamlined payment processing for fees, activities, and services with secure transaction handling.",
                  gradient: "from-orange-500 to-amber-500",
                  delay: "0s"
                },
                {
                  icon: FileText,
                  title: "CBT Examination",
                  description: "Computer-based testing platform with automated grading and comprehensive analytics.",
                  gradient: "from-amber-500 to-yellow-500",
                  delay: "0.2s"
                },
                {
                  icon: Zap,
                  title: "Real-time Result Processing",
                  description: "Instant result compilation and distribution with detailed performance insights.",
                  gradient: "from-orange-600 to-amber-600",
                  delay: "0.4s"
                },
                {
                  icon: UserCheck,
                  title: "Assignment Allocation by Teachers",
                  description: "Easy assignment creation, distribution, and tracking with deadline management.",
                  gradient: "from-amber-600 to-orange-600",
                  delay: "0.6s"
                },
                {
                  icon: MessageCircle,
                  title: "Easy Access to Parents' Communication",
                  description: "Real-time chat system connecting parents, teachers, and administrators seamlessly.",
                  gradient: "from-yellow-500 to-amber-500",
                  delay: "0.8s"
                },
                {
                  icon: DollarSign,
                  title: "Student Termly Payment Tracking",
                  description: "Comprehensive payment monitoring with automated reminders and detailed reports.",
                  gradient: "from-orange-500 to-yellow-500",
                  delay: "1s"
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className={`group relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-700 hover:-translate-y-3 border border-stone-100 ${featuresInView ? 'animate-fade-in-up' : 'opacity-0 translate-y-10'
                    }`}
                  style={{
                    animationDelay: feature.delay,
                    animationFillMode: 'forwards'
                  }}
                >
                  {/* Floating Animation Container */}
                  <div className="relative">
                    <div className={`w-20 h-20 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 animate-pulse`}>
                      <feature.icon className="w-10 h-10 text-white animate-bounce" />
                    </div>

                    {/* Floating Particles */}
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
                    <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300 delay-150"></div>
                  </div>

                  <h3 className="text-2xl font-bold text-stone-800 mb-4 group-hover:text-orange-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-stone-600 leading-relaxed group-hover:text-stone-700 transition-colors duration-300">
                    {feature.description}
                  </p>

                  {/* Hover Effect Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-all duration-500`}></div>

                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 rounded-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 transform skew-x-12"></div>
                  </div>

                  {/* Interactive Arrow */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowRight className="w-6 h-6 text-orange-500 animate-bounce" />
                  </div>
                </div>
              ))}
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-10 left-10 w-20 h-20 border-4 border-orange-200 rounded-full animate-spin-slow opacity-20"></div>
            <div className="absolute bottom-10 right-10 w-16 h-16 border-4 border-amber-200 rounded-full animate-bounce opacity-20"></div>
            <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full animate-pulse opacity-30"></div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 bg-white relative">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-6">
                About SCRM
              </h2>
              <p className="text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed">
                SCRM is a comprehensive school management solution designed to streamline administrative tasks, enhance communication between teachers, students, and parents, and provide data-driven insights for better decision-making.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Users,
                  title: "Effortless Administration",
                  description: "Manage schedules, attendance, and grading all in one intuitive platform.",
                  gradient: "from-orange-500 to-amber-500"
                },
                {
                  icon: Mail,
                  title: "Engaging Communication",
                  description: "Seamless messaging between teachers, students, and parents with real-time notifications.",
                  gradient: "from-amber-500 to-yellow-500"
                },
                {
                  icon: BarChart3,
                  title: "Data-Driven Insights",
                  description: "Advanced analytics to track performance and identify areas for improvement.",
                  gradient: "from-orange-600 to-amber-600"
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-stone-100"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-stone-800 mb-4">{feature.title}</h3>
                  <p className="text-stone-600 leading-relaxed">{feature.description}</p>
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section id="why" className="py-20 bg-gradient-to-br from-stone-50 to-orange-50 relative">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-6">
                Why Choose SCRM?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: CheckCircle, title: "User-Friendly Interface", desc: "Intuitive design ensures quick adoption by staff and students.", color: "text-green-500" },
                { icon: Shield, title: "Secure & Reliable", desc: "State-of-the-art security measures to protect sensitive data.", color: "text-orange-500" },
                { icon: BookOpen, title: "Customizable Modules", desc: "Tailor features to fit your institution's unique needs.", color: "text-amber-500" },
                { icon: Clock, title: "24/7 Support", desc: "Dedicated support team ready to assist whenever needed.", color: "text-orange-600" },
                { icon: Smartphone, title: "Mobile Access", desc: "Access on the go with responsive design and mobile apps.", color: "text-yellow-500" },
                { icon: Star, title: "Proven Results", desc: "Trusted by 150+ schools with 98% satisfaction rate.", color: "text-amber-600" }
              ].map((item, index) => (
                <div
                  key={index}
                  className="group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-stone-100"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 p-3 rounded-lg bg-stone-50 group-hover:bg-stone-100 transition-colors duration-300`}>
                      <item.icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-stone-800 mb-2">{item.title}</h3>
                      <p className="text-stone-600 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section id="stats" className="py-20 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/5 to-amber-600/5"></div>
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-6">
                Statistics & Impact
              </h2>
              <p className="text-xl text-stone-600">Real numbers from real schools using SCRM</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                { number: 150, label: "Schools Onboarded", icon: BookOpen, gradient: "from-orange-500 to-amber-500", symb: "+" },
                { number: 20, label: "Active Students", icon: Users, gradient: "from-amber-500 to-yellow-500", symb: "k+" },
                { number: 98, label: "Satisfaction Rate", icon: Star, gradient: "from-orange-600 to-amber-600", symb: "%" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="group text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-stone-100"
                >
                  <div className={`w-20 h-20 bg-gradient-to-r ${stat.gradient} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="w-10 h-10 text-white" />
                  </div>
                  <p className={`text-6xl font-extrabold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}>
                    <CountUp end={stat.number} />{stat.symb}
                  </p>
                  <p className="text-xl text-stone-600 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-gradient-to-br from-orange-50 to-amber-50 relative">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-6">
                Contact Us
              </h2>
              <p className="text-xl text-stone-600">Have questions or need a demo? We'd love to hear from you.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-stone-100">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-stone-700">Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:border-orange-400"
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-stone-700">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:border-orange-400"
                      placeholder="your.email@school.edu"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-stone-700">Message</label>
                  <textarea
                    rows="6"
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:border-orange-400 resize-none"
                    placeholder="Tell us about your school's needs and how we can help..."
                  ></textarea>
                </div>
                <div className="text-center">
                  <button
                    className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-orange-600 to-amber-600 rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center">
                      Send Message
                      <Mail className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-r from-stone-900 to-stone-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-900/20 to-amber-900/20"></div>
        <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">SCRM</span>
              </div>
              <p className="text-stone-300 leading-relaxed mb-4">
                Empowering educational institutions with innovative technology solutions for better learning outcomes.
              </p>
              <div className="flex space-x-4">
                {[Mail, Phone, MapPin].map((Icon, index) => (
                  <div key={index} className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-orange-500/20 transition-colors duration-300 cursor-pointer">
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
                      className="text-stone-300 hover:text-white transition-colors duration-300 flex items-center group bg-transparent border-none p-0 m-0 cursor-pointer"
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
                      className="text-stone-300 hover:text-white transition-colors duration-300 flex items-center group bg-transparent border-none p-0 m-0 cursor-pointer"
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
            <p className="text-stone-300 text-sm">
              &copy; {new Date().getFullYear()} SCRM. All rights reserved.
            </p>
            <p className="text-stone-300 text-sm mt-2 sm:mt-0">
              Made with ❤️ for better education
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;