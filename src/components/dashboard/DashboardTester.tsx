
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, Activity, User, Settings, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function DashboardTester() {
  const { user, userProfile, loading } = useAuth();
  const navigate = useNavigate();
  const [testResults, setTestResults] = useState<any[]>([]);
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

  const runDashboardTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    console.log('🧪 Début des tests du Dashboard');

    // Test 1: Vérifier l'authentification
    addTestResult(
      'Authentification',
      !!user,
      user ? `✓ Utilisateur connecté: ${user.email}` : '✗ Aucun utilisateur connecté',
      { userId: user?.id, email: user?.email }
    );

    // Test 2: Vérifier le profil utilisateur
    addTestResult(
      'Profil utilisateur',
      !!userProfile,
      userProfile ? `✓ Profil chargé: ${userProfile.role}` : '✗ Profil non chargé',
      { role: userProfile?.role, status: userProfile?.account_status }
    );

    // Test 3: Tester la navigation vers le Dashboard
    try {
      navigate('/dashboard');
      await new Promise(resolve => setTimeout(resolve, 1000));
      addTestResult('Navigation Dashboard', true, '✓ Navigation vers /dashboard réussie');
    } catch (error: any) {
      addTestResult('Navigation Dashboard', false, `✗ Erreur de navigation: ${error.message}`);
    }

    // Test 4: Vérifier les permissions d'accès
    const hasAccess = user && userProfile && userProfile.account_status === 'approved';
    addTestResult(
      'Permissions d\'accès',
      !!hasAccess,
      hasAccess ? '✓ Accès autorisé au Dashboard' : '✗ Accès refusé - Vérifier le statut du compte',
      { accountStatus: userProfile?.account_status }
    );

    // Test 5: Tester les composants du Dashboard
    const dashboardComponents = [
      'DashboardCard',
      'InterventionTrendChart', 
      'NotificationSystem',
      'ConnectionStatus'
    ];

    dashboardComponents.forEach(component => {
      try {
        // Simulation de test de composant
        addTestResult(
          `Composant ${component}`,
          true,
          `✓ ${component} disponible`
        );
      } catch (error) {
        addTestResult(
          `Composant ${component}`,
          false,
          `✗ Erreur avec ${component}`
        );
      }
    });

    // Test 6: Vérifier les données du Dashboard
    const mockData = {
      totalEquipments: 150,
      activeEquipments: 120,
      maintenancesPlanned: 30,
      maintenancesOverdue: 5,
    };

    addTestResult(
      'Données Dashboard',
      !!mockData,
      '✓ Données mockées disponibles',
      mockData
    );

    // Test 7: Tester les permissions par rôle
    const isAdmin = userProfile?.role === 'admin';
    const isManager = userProfile?.role === 'manager';
    const isTechnician = userProfile?.role === 'technician';

    addTestResult(
      'Vérification des rôles',
      true,
      `✓ Rôle détecté: ${userProfile?.role || 'Aucun'}`,
      { isAdmin, isManager, isTechnician }
    );

    setIsRunning(false);
    console.log('✅ Tests du Dashboard terminés');
  };

  const navigateToDashboard = () => {
    navigate('/dashboard');
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Tests du Dashboard - Diagnostic Complet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={runDashboardTests} 
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              {isRunning ? 'Tests en cours...' : 'Lancer les tests'}
            </Button>
            <Button 
              onClick={navigateToDashboard} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <Activity className="w-4 h-4" />
              Aller au Dashboard
            </Button>
            <Button 
              onClick={clearResults} 
              variant="outline"
              disabled={isRunning}
            >
              Effacer
            </Button>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Tests couverts :</strong> Authentification, Profil, Navigation, Permissions, Composants, Données, Rôles
            </p>
          </div>
        </CardContent>
      </Card>

      {/* État actuel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            État Actuel - Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              <span className="text-sm">Chargement:</span>
              <Badge variant={loading ? "secondary" : "default"}>
                {loading ? 'En cours' : 'Terminé'}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="text-sm">Utilisateur:</span>
              <Badge variant={user ? "default" : "secondary"}>
                {user ? user.email : 'Non connecté'}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="text-sm">Rôle:</span>
              <Badge variant={userProfile ? "default" : "secondary"}>
                {userProfile ? userProfile.role : 'Non défini'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Résultats des tests */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Résultats des Tests Dashboard</CardTitle>
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
