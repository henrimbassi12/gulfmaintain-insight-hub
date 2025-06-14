
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Formes nuageuses décoratives */}
      <div className="absolute top-0 right-0 w-1/3 h-1/2 opacity-20">
        <svg viewBox="0 0 400 300" className="w-full h-full">
          <path d="M400,0 L400,200 Q350,180 300,200 Q250,220 200,180 Q150,140 100,180 Q50,220 0,180 L0,0 Z" fill="white"/>
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/3 opacity-10">
        <svg viewBox="0 0 300 200" className="w-full h-full">
          <path d="M0,200 L0,50 Q50,30 100,50 Q150,70 200,30 Q250,0 300,30 L300,200 Z" fill="white"/>
        </svg>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative z-10">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 p-4 rounded-2xl">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Welcome to
          </h1>
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">
            Gulf Maintain
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Optimisez la gestion de vos équipements avec notre plateforme intelligente de maintenance préventive.
          </p>
        </div>

        {/* Boutons d'action */}
        <div className="space-y-4">
          <button
            onClick={() => navigate('/signup')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Créer un compte
          </button>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-4 px-6 rounded-xl transition-all duration-200"
          >
            Se connecter
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-400">
            Plateforme sécurisée • Support 24/7
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
