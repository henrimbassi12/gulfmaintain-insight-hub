
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity } from 'lucide-react';

interface Report {
  id: number;
  title: string;
  type: string;
  date: string;
  status: string;
  size: string;
}

interface ReportsStatsProps {
  reports: Report[];
}

export function ReportsStats({ reports }: ReportsStatsProps) {
  return (
    <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="bg-gray-50 border-b border-gray-100">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          Aperçu des rapports
          <Badge variant="secondary" className="ml-auto text-xs bg-blue-50 text-blue-700 border-blue-200">
            {reports.length} rapports
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-2xl font-bold text-blue-600 mb-1">18</p>
            <p className="text-sm text-gray-600">Rapports ce mois</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-2xl font-bold text-green-600 mb-1">15</p>
            <p className="text-sm text-gray-600">Terminés</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-2xl font-bold text-orange-600 mb-1">3</p>
            <p className="text-sm text-gray-600">En cours</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-2xl font-bold text-purple-600 mb-1">156</p>
            <p className="text-sm text-gray-600">Téléchargements</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
