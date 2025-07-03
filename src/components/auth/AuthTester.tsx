
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, User, Mail, Lock } from 'lucide-react';

export function AuthTester() {
  const { user, session, userProfile, signIn, signUp, signOut, resetPassword } = useAuth();
  const [testResults, setTestResults] = useState<any[]>([]);
  const [testEmail, setTestEmail] = useState('testuser@gmail.com'); // Email valide
  const [testPassword, setTestPassword] = useState('TestPassword123!');
  const [isRunning, setIsRunning] = useState(false);

  const addTestResult = (name: string, success: boolean, message: string, details?: any) => {
    setTestResults(prev => [...prev, {
      name,
      success,
      message,
      details,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const runAuthTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    console.log('🧪 Début des tests d\'authentification');

    // Test 1: Vérifier l'état initial
    addTestResult(
      'État initial',
      true,
      `User: ${user ? '✓ Connecté' : '✗ Non connecté'}, Session: ${session ? '✓ Active' : '✗ Inactive'}`,
      { user: user?.email, sessionValid: !!session }
    );

    // Test 2: Test de déconnexion si connecté
    if (user) {
      try {
        await signOut();
        addTestResult('Déconnexion', true, 'Déconnexion réussie');
        // Attendre un peu pour que l'état se mette à jour
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error: any) {
        addTestResult('Déconnexion', false, `Erreur: ${error.message}`);
      }
    }

    // Test 3: Test d'inscription avec email valide
    try {
      console.log('🔄 Test d\'inscription...');
      const signUpResult = await signUp(testEmail, testPassword, 'Utilisateur Test', 'technician');
      
      if (signUpResult.error) {
        if (signUpResult.error.message.includes('already_registered') || 
            signUpResult.error.message.includes('User already registered')) {
          addTestResult('Inscription', true, 'Email déjà enregistré (comportement attendu pour les tests)');
        } else if (signUpResult.error.message.includes('email_address_invalid')) {
          addTestResult('Inscription', false, `Email invalide: ${signUpResult.error.message}`);
        } else {
          addTestResult('Inscription', false, `Erreur: ${signUpResult.error.message}`);
        }
      } else {
        addTestResult('Inscription', true, 'Inscription réussie');
      }
    } catch (error: any) {
      addTestResult('Inscription', false, `Exception: ${error.message}`);
    }

    // Attendre un peu
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Test 4: Test de connexion
    try {
      console.log('🔄 Test de connexion...');
      const signInResult = await signIn(testEmail, testPassword);
      
      if (signInResult.error) {
        // Tenter avec un compte qui existe probablement
        if (signInResult.error.message.includes('Invalid login credentials')) {
          addTestResult('Connexion', false, 'Credentials invalides - Tentative avec un compte existant...');
          
          // Test avec un email générique qui pourrait exister
          const fallbackResult = await signIn('admin@gulfmaintain.com', 'AdminPass123!');
          if (fallbackResult.error) {
            addTestResult('Connexion (fallback)', false, `Erreur: ${fallbackResult.error.message}`);
          } else {
            addTestResult('Connexion (fallback)', true, 'Connexion réussie avec compte fallback');
          }
        } else {
          addTestResult('Connexion', false, `Erreur: ${signInResult.error.message}`);
        }
      } else {
        addTestResult('Connexion', true, 'Connexion réussie');
      }
    } catch (error: any) {
      addTestResult('Connexion', false, `Exception: ${error.message}`);
    }

    // Attendre un peu
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test 5: Vérifier l'état après connexion
    addTestResult(
      'État après connexion',
      !!user,
      `User: ${user ? '✓ Connecté (' + user.email + ')' : '✗ Non connecté'}, Profile: ${userProfile ? '✓ Chargé (' + userProfile.role + ')' : '✗ Non chargé'}`,
      { user: user?.email, profile: userProfile }
    );

    // Test 6: Test de réinitialisation de mot de passe
    try {
      console.log('🔄 Test de réinitialisation...');
      const resetResult = await resetPassword(testEmail);
      
      if (resetResult.error) {
        addTestResult('Reset Password', false, `Erreur: ${resetResult.error.message}`);
      } else {
        addTestResult('Reset Password', true, 'Email de réinitialisation envoyé');
      }
    } catch (error: any) {
      addTestResult('Reset Password', false, `Exception: ${error.message}`);
    }

    // Test 7: Test de création de compte valide
    try {
      console.log('🔄 Test avec email unique...');
      const uniqueEmail = `test-${Date.now()}@gmail.com`;
      const uniqueSignUpResult = await signUp(uniqueEmail, testPassword, 'Test User', 'technician');
      
      if (uniqueSignUpResult.error) {
        addTestResult('Inscription unique', false, `Erreur: ${uniqueSignUpResult.error.message}`);
      } else {
        addTestResult('Inscription unique', true, 'Inscription avec email unique réussie');
      }
    } catch (error: any) {
      addTestResult('Inscription unique', false, `Exception: ${error.message}`);
    }

    setIsRunning(false);
    console.log('✅ Tests d\'authentification terminés');
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Test d'Authentification - Version Améliorée
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Email de test</label>
              <Input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="testuser@gmail.com"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Utilise un email valide comme gmail.com
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Mot de passe de test</label>
              <Input
                type="password"
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
                placeholder="TestPassword123!"
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={runAuthTests} 
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              {isRunning ? 'Tests en cours...' : 'Lancer les tests'}
            </Button>
            <Button 
              onClick={clearResults} 
              variant="outline"
              disabled={isRunning}
            >
              Effacer les résultats
            </Button>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Améliorations :</strong> Email valide par défaut, test avec compte unique, gestion des erreurs améliorée
            </p>
          </div>
        </CardContent>
      </Card>

      {/* État actuel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            État Actuel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span className="text-sm">Utilisateur:</span>
              <Badge variant={user ? "default" : "secondary"}>
                {user ? user.email : 'Non connecté'}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span className="text-sm">Session:</span>
              <Badge variant={session ? "default" : "secondary"}>
                {session ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="text-sm">Profil:</span>
              <Badge variant={userProfile ? "default" : "secondary"}>
                {userProfile ? userProfile.role : 'Non chargé'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Résultats des tests */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Résultats des Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  {result.success ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{result.name}</span>
                      <Badge variant={result.success ? "default" : "destructive"} className="text-xs">
                        {result.timestamp}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{result.message}</p>
                    {result.details && (
                      <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-x-auto">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
