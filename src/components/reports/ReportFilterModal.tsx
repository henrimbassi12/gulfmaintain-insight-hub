
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Filter, Calendar, FileText } from 'lucide-react';
import { toast } from "sonner";

interface ReportFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Report {
  id: number;
  title: string;
  type: string;
  date: string;
  status: string;
  size: string;
  cost?: string;
}

const SAMPLE_REPORTS: Report[] = [
  {
    id: 1,
    title: 'Rapport mensuel - Janvier 2024',
    type: 'Maintenance',
    date: '31/01/2024',
    status: 'Terminé',
    size: '2.4 MB',
    cost: '1,250,000 FCFA'
  },
  {
    id: 2,
    title: 'Analyse des pannes - Q4 2023',
    type: 'Analyse',
    date: '15/01/2024',
    status: 'Terminé',
    size: '1.8 MB',
    cost: '850,000 FCFA'
  },
  {
    id: 3,
    title: 'Performance techniciens - Décembre',
    type: 'RH',
    date: '05/01/2024',
    status: 'En cours',
    size: '-',
    cost: '2,100,000 FCFA'
  },
  {
    id: 4,
    title: 'Rapport de coûts - Q4 2023',
    type: 'Financier',
    date: '20/01/2024',
    status: 'Terminé',
    size: '1.2 MB',
    cost: '3,750,000 FCFA'
  },
  {
    id: 5,
    title: 'Suivi des équipements - Janvier',
    type: 'Équipement',
    date: '28/01/2024',
    status: 'Terminé',
    size: '3.1 MB',
    cost: '675,000 FCFA'
  }
];

export function ReportFilterModal({ isOpen, onClose }: ReportFilterModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const filteredReports = SAMPLE_REPORTS.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || report.type === filterType;
    const matchesStatus = !filterStatus || report.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleDownload = (report: Report) => {
    if (report.status === 'Terminé') {
      toast.promise(
        new Promise(resolve => setTimeout(resolve, 1500)),
        {
          loading: `Téléchargement de "${report.title}"...`,
          success: `"${report.title}" téléchargé avec succès !`,
          error: 'Erreur lors du téléchargement'
        }
      );
      
      // Simulation du téléchargement
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = '#';
        link.download = `${report.title}.pdf`;
        link.click();
      }, 1500);
    } else {
      toast.error('Ce rapport n\'est pas encore disponible au téléchargement');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Terminé':
        return 'bg-green-100 text-green-800';
      case 'En cours':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            Filtrer et télécharger les rapports
          </DialogTitle>
          <DialogDescription>
            Recherchez et téléchargez les rapports disponibles
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Filtres */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">Rechercher</Label>
              <Input
                id="search"
                placeholder="Nom du rapport..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les types</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Analyse">Analyse</SelectItem>
                  <SelectItem value="RH">RH</SelectItem>
                  <SelectItem value="Financier">Financier</SelectItem>
                  <SelectItem value="Équipement">Équipement</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Statut</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les statuts</SelectItem>
                  <SelectItem value="Terminé">Terminé</SelectItem>
                  <SelectItem value="En cours">En cours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Liste des rapports */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Rapports disponibles ({filteredReports.length})</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('');
                  setFilterStatus('');
                }}
              >
                Réinitialiser
              </Button>
            </div>

            {filteredReports.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Aucun rapport trouvé avec ces critères
              </div>
            ) : (
              <div className="space-y-2">
                {filteredReports.map((report) => (
                  <Card key={report.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="w-8 h-8 text-blue-600" />
                          <div>
                            <h4 className="font-medium">{report.title}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="w-4 h-4" />
                              {report.date}
                              <span>•</span>
                              <span>{report.size}</span>
                              {report.cost && (
                                <>
                                  <span>•</span>
                                  <span className="font-medium text-blue-600">{report.cost}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className={getStatusColor(report.status)}>
                            {report.status}
                          </Badge>
                          <Badge variant="outline">
                            {report.type}
                          </Badge>
                          <Button
                            size="sm"
                            onClick={() => handleDownload(report)}
                            disabled={report.status === 'En cours'}
                            className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Télécharger
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
