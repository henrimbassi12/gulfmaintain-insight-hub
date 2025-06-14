
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AuthLogin = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await signIn(formData.email, formData.password);
    if (!error) {
      navigate('/');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <CardContent className="p-0">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/auth')}
                className="absolute left-4 top-4 text-white hover:bg-white/10 p-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="ml-2">Back</span>
              </Button>
              
              <div className="pt-8">
                <h1 className="text-2xl font-bold mb-1">Log In</h1>
              </div>
              
              {/* Decorative shape */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full"></div>
            </div>

            {/* Form */}
            <div className="p-8">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-6 text-white">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email or phone number
                    </label>
                    <Input
                      type="email"
                      placeholder="Type here..."
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="bg-transparent border-0 border-b border-gray-600 rounded-none px-0 py-3 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Type here..."
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="bg-transparent border-0 border-b border-gray-600 rounded-none px-0 py-3 pr-10 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-0"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button 
                      type="submit"
                      className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium"
                    >
                      Log In
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthLogin;
