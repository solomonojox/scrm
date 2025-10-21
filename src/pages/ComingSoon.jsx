import { ArrowLeft, Clock } from "lucide-react";

// Coming Soon Component
export const ComingSoon = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 via-indigo-800 to-orange-500 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <div className="mb-8 inline-block">
          <Clock className="w-24 h-24 text-yellow-500 animate-pulse" />
        </div>
        <h1 className="text-6xl font-bold text-white mb-4">Coming Soon</h1>
        <p className="text-xl text-white/90 mb-8">
          We're working on something amazing. Stay tuned!
        </p>
        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-8 border border-white/30">
          <p className="text-white/80 mb-6">
            This page is under construction and will be available soon.
          </p>
          <button
            onClick={() => (window.location.href = "/teacher/dashboard")}
            className="bg-white text-orange-600 px-8 py-3 rounded-full font-semibold hover:bg-orange-50 transition-all transform hover:scale-105 inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};
