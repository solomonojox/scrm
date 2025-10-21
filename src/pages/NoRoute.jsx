import { Search } from "lucide-react";

export const NoRoute = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <Search className="w-24 h-24 text-white mx-auto mb-4" />
          <div className="text-8xl font-bold text-white/20">¯\_(ツ)_/¯</div>
        </div>
        <h1 className="text-5xl font-bold text-white mb-4">No Routes Available</h1>
        <p className="text-xl text-white/90 mb-8">
          It looks like no routes have been configured for this application.
        </p>
        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-8 border border-white/30">
          <div className="text-left text-white/80 mb-6 space-y-2">
            <p className="font-semibold text-white">This might mean:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>The application is still being set up</li>
              <li>Routes haven't been properly configured</li>
              <li>There's a routing configuration error</li>
            </ul>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-white text-teal-600 px-8 py-3 rounded-full font-semibold hover:bg-teal-50 transition-all transform hover:scale-105 inline-flex items-center gap-2"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );
};