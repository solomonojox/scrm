import React, { useState, useEffect } from 'react';
import { CheckCircle, School, Users, BookOpen, ArrowRight } from 'lucide-react';
import {useNavigate} from 'react-router-dom'

const SuccessPage = () => {
  const [showContent, setShowContent] = useState(false);
  const [animateCheck, setAnimateCheck] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [confetti, setConfetti] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    // Create confetti particles
    const particles = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 3 + Math.random() * 2,
        color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][Math.floor(Math.random() * 5)]
      });
    }
    setConfetti(particles);

    // Stagger animations
    setTimeout(() => setShowContent(true), 300);
    setTimeout(() => setAnimateCheck(true), 800);
    setTimeout(() => setShowFeatures(true), 1500);
  }, []);

  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Student Management",
      description: "Manage student records, attendance, and performance"
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Academic Planning",
      description: "Create timetables, assignments, and track progress"
    },
    {
      icon: <School className="w-6 h-6" />,
      title: "School Analytics",
      description: "Comprehensive reports and insights for better decisions"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Confetti Animation */}
      {confetti.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-3 h-3 rounded-full animate-bounce"
          style={{
            left: `${particle.left}%`,
            backgroundColor: particle.color,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            top: '-10px'
          }}
        />
      ))}

      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon with Animation */}
          <div className={`mb-8 transform transition-all duration-1000 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="relative inline-block">
              <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center shadow-2xl transform transition-all duration-700 ${animateCheck ? 'scale-100 rotate-0' : 'scale-50 rotate-45'}`}>
                <CheckCircle className={`w-16 h-16 text-white transform transition-all duration-500 ${animateCheck ? 'scale-100' : 'scale-0'}`} />
              </div>
              <div className="absolute inset-0 w-32 h-32 rounded-full bg-green-400 animate-ping opacity-25"></div>
            </div>
          </div>

          {/* Main Content */}
          <div className={`transform transition-all duration-1000 delay-300 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-black mb-4">
              Welcome Aboard! 🎉
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Your school has been successfully registered with our management system. 
              <br />
              <span className="font-semibold text-indigo-600">You're all set to transform education!</span>
            </p>
          </div>

          {/* Feature Cards */}
          <div className={`grid md:grid-cols-3 gap-6 mb-10 transform transition-all duration-1000 delay-700 ${showFeatures ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border border-white/20"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-primary-bg to-primary-bg/80 rounded-xl flex items-center justify-center text-white mb-4 mx-auto">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className={`space-y-4 transform transition-all duration-1000 delay-1000 ${showFeatures ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <button className="group bg-gradient-to-r from-primary-bg to-primary-bg/60 hover:from-primary-bg/60 hover:to-primary-bg text-white font-semibold py-4 px-8 rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center space-x-2" onClick={() => navigate('/login')}>
              <span>Continue to Login</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            
            {/* <div className="text-sm text-gray-500">
              <p>Need help getting started? 
                <button className="text-indigo-600 hover:text-indigo-700 font-medium ml-1 hover:underline transition-colors duration-200">
                  View Quick Start Guide
                </button>
              </p>
            </div> */}
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-16 h-16 bg-yellow-200 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3s' }}></div>
          <div className="absolute bottom-20 right-10 w-12 h-12 bg-pink-200 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '2.5s' }}></div>
          <div className="absolute top-1/3 right-20 w-8 h-8 bg-green-200 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '2s', animationDuration: '2s' }}></div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-20 fill-current text-indigo-100 opacity-60" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"></path>
        </svg>
      </div>
    </div>
  );
};

export default SuccessPage;