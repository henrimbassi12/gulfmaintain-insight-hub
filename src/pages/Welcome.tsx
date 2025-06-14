
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-gray-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        {/* Scattered dots */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-500 rounded-full"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-blue-400 rounded-full"></div>
        <div className="absolute bottom-40 left-20 w-2 h-2 bg-blue-600 rounded-full"></div>
        <div className="absolute bottom-60 right-40 w-1 h-1 bg-blue-300 rounded-full"></div>
        
        {/* Decorative leaves/plants at bottom */}
        <div className="absolute bottom-0 left-10">
          <svg width="120" height="100" viewBox="0 0 120 100" className="text-blue-600">
            <path d="M20 80 Q30 60 50 70 Q70 50 80 70 Q90 40 100 60 L100 100 L0 100 Z" fill="currentColor" opacity="0.8"/>
            <path d="M10 85 Q20 70 35 75 Q50 60 60 75 Q70 55 85 70 L85 100 L0 100 Z" fill="currentColor" opacity="0.6"/>
          </svg>
        </div>
        
        <div className="absolute bottom-0 right-10">
          <svg width="100" height="80" viewBox="0 0 100 80" className="text-blue-500">
            <path d="M0 60 Q20 40 40 50 Q60 30 80 45 Q90 25 100 40 L100 80 L0 80 Z" fill="currentColor" opacity="0.7"/>
          </svg>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8">
        {/* Logo and brand */}
        <div className="bg-white rounded-3xl p-8 shadow-lg mb-12 max-w-sm w-full">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 p-4 rounded-2xl">
              <BarChart3 className="w-12 h-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-blue-600 text-center mb-2">
            Data me.
          </h1>
          <p className="text-gray-600 text-center text-sm">
            Know yourself better
          </p>
        </div>

        {/* Action buttons container */}
        <div className="bg-gray-900 rounded-3xl p-8 shadow-xl max-w-sm w-full">
          <div className="space-y-4">
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-2xl transition-colors duration-200"
            >
              Log In
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="w-full bg-transparent border-2 border-gray-600 hover:border-gray-500 text-white font-semibold py-4 px-6 rounded-2xl transition-colors duration-200"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
