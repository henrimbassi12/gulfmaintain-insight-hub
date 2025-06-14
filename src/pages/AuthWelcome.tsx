
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, LogIn, UserPlus, Shield } from 'lucide-react';

const AuthWelcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <CardContent className="p-8">
            {/* Logo and Title */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Gulf Maintain</h1>
              <p className="text-blue-600 font-medium">Know yourself better</p>
            </div>

            {/* Illustration Area */}
            <div className="relative mb-8">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-6 min-h-[200px] flex items-center justify-center relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute inset-0">
                  <div className="absolute top-4 left-4 w-3 h-3 bg-blue-400 rounded-full"></div>
                  <div className="absolute top-8 right-6 w-2 h-2 bg-blue-300 rounded-full"></div>
                  <div className="absolute bottom-6 left-8 w-4 h-4 bg-blue-500 rounded-full"></div>
                  <div className="absolute bottom-4 right-4 w-2 h-2 bg-blue-400 rounded-full"></div>
                </div>
                
                {/* Industrial elements */}
                <div className="relative z-10 flex items-center justify-center">
                  <Shield className="w-16 h-16 text-white/80" />
                </div>
                
                {/* Abstract shapes */}
                <div className="absolute bottom-0 left-0 right-0">
                  <svg viewBox="0 0 400 100" className="w-full h-16">
                    <path 
                      d="M0,50 C100,20 150,80 250,50 C300,30 350,70 400,40 L400,100 L0,100 Z" 
                      fill="rgba(30, 64, 175, 0.3)"
                    />
                    <path 
                      d="M0,70 C80,40 120,80 200,60 C280,40 320,70 400,50 L400,100 L0,100 Z" 
                      fill="rgba(30, 64, 175, 0.2)"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button 
                onClick={() => navigate('/auth/login')}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                Log In
              </Button>
              
              <Button 
                onClick={() => navigate('/auth/signup')}
                variant="outline"
                className="w-full h-12 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700 rounded-xl font-medium flex items-center justify-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                Sign Up
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthWelcome;
