
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (!acceptTerms) {
      setError('Vous devez accepter les conditions d\'utilisation');
      return;
    }
    
    setLoading(true);
    
    const { error: signUpError } = await signUp(email, password, fullName);
    
    if (signUpError) {
      setError(signUpError.message);
    } else {
      navigate('/dashboard');
    }
    
    setLoading(false);
  };

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
        {/* Header avec retour */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour
          </button>
        </div>

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
          <p className="text-gray-600 text-sm">
            Créez votre compte pour commencer
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
              Nom complet
            </label>
            <input
              id="fullName"
              type="text"
              placeholder="Entrez votre nom complet"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Adresse E-mail
            </label>
            <input
              id="email"
              type="email"
              placeholder="Entrez votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              placeholder="Entrez votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirmer le mot de passe
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirmez votre mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div className="flex items-start">
            <input
              id="terms"
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="terms" className="ml-3 text-sm text-gray-600">
              J'accepte les{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Conditions d'utilisation
              </a>{' '}
              et la{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Politique de confidentialité
              </a>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || password !== confirmPassword || !acceptTerms}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            {loading ? 'Création...' : 'Créer un compte'}
          </button>

          <div className="text-center">
            <span className="text-sm text-gray-600">Déjà un compte ? </span>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              Se connecter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
