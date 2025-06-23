
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye } from 'lucide-react';
import { useReportGeneration } from "@/hooks/useReportGeneration";
import { toast } from 'sonner';

interface Report {
  id: number;
  title: string;
  type: string;
  date: string;
  status: string;
  size: string;
  technician?: string;
  zone?: string;
}

interface RecentReportsProps {
  reports: Report[];
}

export function RecentReports({ reports }: RecentReportsProps) {
  const { downloadExistingReport } = useReportGeneration();

  const handleDownload = (report: Report) => {
    if (report.status === 'Terminé') {
      downloadExistingReport(report);
      toast.success(`Téléchargement de "${report.title}" démarré`);
    }
  };

  const handleView = (report: Report) => {
    toast.info(`Ouverture de "${report.title}"`);
    // Logique pour ouvrir/prévisualiser le rapport
  };

  return (
    <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="bg-gray-50 border-b border-gray-100">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          Rapports récents
          <Badge variant="secondary" className="ml-auto text-xs bg-blue-50 text-blue-700 border-blue-200">
            {reports.filter(r => r.status === 'Terminé').length} disponibles
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-sm text-gray-600">
                <th className="py-4 px-6 font-semibold">Titre</th>
                <th className="py-4 px-6 font-semibold">Type</th>
                <th className="py-4 px-6 font-semibold">Technicien</th>
                <th className="py-4 px-6 font-semibold">Zone</th>
                <th className="py-4 px-6 font-semibold">Date</th>
                <th className="py-4 px-6 font-semibold">Statut</th>
                <th className="py-4 px-6 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <span className="font-medium text-gray-900">{report.title}</span>
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant="outline" className="text-xs">{report.type}</Badge>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {report.technician || 'Non assigné'}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {report.zone || 'Non spécifiée'}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">{report.date}</td>
                  <td className="py-4 px-6">
                    <Badge className={`text-xs ${
                      report.status === 'Terminé' ? 'bg-green-50 text-green-700 border-green-200' :
                      'bg-orange-50 text-orange-700 border-orange-200'
                    }`}>
                      {report.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      {report.status === 'Terminé' && (
                        <>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-blue-600 hover:text-blue-700"
                            onClick={() => handleView(report)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Voir
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-green-600 hover:text-green-700"
                            onClick={() => handleDownload(report)}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Télécharger
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
