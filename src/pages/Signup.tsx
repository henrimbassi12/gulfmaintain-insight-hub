
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return;
    }
    
    setLoading(true);
    
    const { error } = await signUp(email, password, name);
    
    if (!error) {
      navigate('/');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 relative overflow-hidden">
      {/* Background decorative blue shape */}
      <div className="absolute top-0 right-0">
        <svg width="300" height="200" viewBox="0 0 300 200" className="text-blue-600">
          <path d="M150 0 Q250 50 300 0 L300 150 Q200 100 150 150 Q100 100 50 150 L0 0 Z" fill="currentColor"/>
        </svg>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-white font-semibold"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
        <h1 className="text-white text-xl font-bold">Sign Up</h1>
        <HelpCircle className="w-6 h-6 text-white" />
      </div>

      {/* Main form container */}
      <div className="relative z-10 flex justify-center items-center min-h-[calc(100vh-100px)] px-8">
        <div className="bg-gray-900 rounded-3xl p-8 shadow-xl max-w-sm w-full">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email or phone number"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-800 text-white placeholder-gray-400 border-0 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-800 text-white placeholder-gray-400 border-0 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-gray-800 text-white placeholder-gray-400 border-0 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Name or pseudo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-800 text-white placeholder-gray-400 border-0 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || password !== confirmPassword}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-4 px-6 rounded-2xl transition-colors duration-200"
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
