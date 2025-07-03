
import React, { useState } from 'react';
import { AuthTester } from '@/components/auth/AuthTester';
import { DashboardTester } from '@/components/dashboard/DashboardTester';
import { EquipmentTester } from '@/components/equipments/EquipmentTester';
import { MaintenanceTester } from '@/components/maintenance/MaintenanceTester';
import { MessagesTester } from '@/components/messages/MessagesTester';
import { HistoryTester } from '@/components/history/HistoryTester';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Activity, TestTube, Package, Wrench, MessageCircle, Clock } from 'lucide-react';

const TestPage = () => {
  const [activeTest, setActiveTest] = useState<'auth' | 'dashboard' | 'equipments' | 'maintenance' | 'messages' | 'history'>('history');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧪 Page de Tests - GulfMaintain
          </h1>
          <p className="text-gray-600">
            Tests systématiques des fonctionnalités de l'application
          </p>
        </div>
        
        {/* Sélecteur de tests */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="w-5 h-5" />
              Sélection des Tests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={() => setActiveTest('auth')}
                variant={activeTest === 'auth' ? 'default' : 'outline'}
                className="flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Tests Authentification
              </Button>
              <Button
                onClick={() => setActiveTest('dashboard')}
                variant={activeTest === 'dashboard' ? 'default' : 'outline'}
                className="flex items-center gap-2"
              >
                <Activity className="w-4 h-4" />
                Tests Dashboard
              </Button>
              <Button
                onClick={() => setActiveTest('equipments')}
                variant={activeTest === 'equipments' ? 'default' : 'outline'}
                className="flex items-center gap-2"
              >
                <Package className="w-4 h-4" />
                Tests Équipements
              </Button>
              <Button
                onClick={() => setActiveTest('maintenance')}
                variant={activeTest === 'maintenance' ? 'default' : 'outline'}
                className="flex items-center gap-2"
              >
                <Wrench className="w-4 h-4" />
                Tests Maintenance
              </Button>
              <Button
                onClick={() => setActiveTest('messages')}
                variant={activeTest === 'messages' ? 'default' : 'outline'}
                className="flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Tests Messages
              </Button>
              <Button
                onClick={() => setActiveTest('history')}
                variant={activeTest === 'history' ? 'default' : 'outline'}
                className="flex items-center gap-2"
              >
                <Clock className="w-4 h-4" />
                Tests Historique
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contenu des tests */}
        {activeTest === 'auth' && <AuthTester />}
        {activeTest === 'dashboard' && <DashboardTester />}
        {activeTest === 'equipments' && <EquipmentTester />}
        {activeTest === 'maintenance' && <MaintenanceTester />}
        {activeTest === 'messages' && <MessagesTester />}
        {activeTest === 'history' && <HistoryTester />}
      </div>
    </div>
  );
}

export default TestPage;
