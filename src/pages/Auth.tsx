
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, Shield, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Auth = () => {
  const { user, loading, signIn, signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'technician'
  });

  // Redirect if already authenticated
  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(formData.email, formData.password);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    await signUp(formData.email, formData.password, formData.fullName, formData.role);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
      {/* Formes organiques décoratives */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-32 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
        
        {/* Formes organiques ondulées */}
        <svg className="absolute bottom-0 left-0 w-full h-32" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,120 C300,90 600,90 900,120 C1050,135 1150,105 1200,120 L1200,120 L0,120 Z" fill="rgba(255,255,255,0.1)"></path>
        </svg>
        <svg className="absolute top-0 right-0 w-full h-40" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0 C300,30 600,30 900,0 C1050,-15 1150,15 1200,0 L1200,0 L0,0 Z" fill="rgba(255,255,255,0.05)"></path>
        </svg>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          {/* Section de bienvenue */}
          <div className="hidden lg:block text-white space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">Gulf Maintain</h1>
                  <p className="text-blue-100 text-lg">Bienvenue</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Système de gestion de maintenance</h2>
                <p className="text-blue-100 leading-relaxed">
                  Gérez efficacement vos équipements, planifiez vos interventions et optimisez 
                  votre maintenance avec notre plateforme intuitive et moderne.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-blue-100 text-sm">Équipements gérés</div>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-blue-100 text-sm">Support technique</div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire d'authentification */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <Tabs defaultValue="signin" className="w-full">
              <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden">
                <div className="p-8">
                  <div className="text-center mb-6 lg:hidden">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Gulf Maintain</h1>
                  </div>

                  <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100">
                    <TabsTrigger value="signin" className="flex items-center gap-2 data-[state=active]:bg-white">
                      <LogIn className="w-4 h-4" />
                      <span className="hidden sm:inline">Connexion</span>
                    </TabsTrigger>
                    <TabsTrigger value="signup" className="flex items-center gap-2 data-[state=active]:bg-white">
                      <UserPlus className="w-4 h-4" />
                      <span className="hidden sm:inline">Inscription</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="signin">
                    <div className="space-y-4">
                      <div className="text-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">Se connecter</h2>
                        <p className="text-gray-600 text-sm mt-1">Accédez à votre espace de travail</p>
                      </div>
                      
                      <form onSubmit={handleSignIn} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="signin-email" className="text-gray-700 font-medium">Adresse e-mail</Label>
                          <Input
                            id="signin-email"
                            type="email"
                            placeholder="votre@email.com"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signin-password" className="text-gray-700 font-medium">Mot de passe</Label>
                          <div className="relative">
                            <Input
                              id="signin-password"
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              value={formData.password}
                              onChange={(e) => handleInputChange('password', e.target.value)}
                              className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-12"
                              required
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                        <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium">
                          Se connecter
                        </Button>
                      </form>
                    </div>
                  </TabsContent>

                  <TabsContent value="signup">
                    <div className="space-y-4">
                      <div className="text-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">Créer un compte</h2>
                        <p className="text-gray-600 text-sm mt-1">Rejoignez l'équipe de maintenance</p>
                      </div>
                      
                      <form onSubmit={handleSignUp} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="signup-name" className="text-gray-700 font-medium">Nom complet</Label>
                          <Input
                            id="signup-name"
                            type="text"
                            placeholder="Votre nom complet"
                            value={formData.fullName}
                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                            className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-email" className="text-gray-700 font-medium">Adresse e-mail</Label>
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="votre@email.com"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-role" className="text-gray-700 font-medium">Rôle</Label>
                          <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                            <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                              <SelectValue placeholder="Sélectionnez votre rôle" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="technician">Technicien</SelectItem>
                              <SelectItem value="manager">Gestionnaire</SelectItem>
                              <SelectItem value="admin">Administrateur</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-password" className="text-gray-700 font-medium">Mot de passe</Label>
                          <div className="relative">
                            <Input
                              id="signup-password"
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              value={formData.password}
                              onChange={(e) => handleInputChange('password', e.target.value)}
                              className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-12"
                              required
                              minLength={6}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                        <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium">
                          Créer le compte
                        </Button>
                      </form>
                    </div>
                  </TabsContent>
                </div>
              </div>
            </Tabs>

            <div className="text-center mt-6 text-sm text-white/80">
              <p>En vous connectant, vous acceptez nos conditions d'utilisation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
