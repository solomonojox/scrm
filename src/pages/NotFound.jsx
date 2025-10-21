import { AlertCircle, ArrowLeft, Home } from "lucide-react";

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 via-indigo-800 to-orange-500 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-white mb-2">404</h1>
          <div className="flex justify-center">
            <AlertCircle className="w-16 h-16 text-yellow-300" />
          </div>
        </div>
        <h2 className="text-4xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-xl text-white/80 mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <p className="text-white/70 mb-6">Let's get you back on track</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.history.back()}
              className="bg-white/20 text-white px-8 py-3 rounded-full font-semibold hover:bg-white/30 transition-all inline-flex items-center justify-center gap-2 border border-white/30"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
