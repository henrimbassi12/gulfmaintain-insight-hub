
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  FileText, 
  Download, 
  Search, 
  Calendar, 
  User, 
  MapPin, 
  Filter,
  Eye,
  Archive,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useReports } from '@/hooks/useReports';
import { toast } from 'sonner';

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTechnician, setSelectedTechnician] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { reports, isLoading } = useReports();

  // Extract unique values for filters
  const filterOptions = useMemo(() => ({
    technicians: Array.from(new Set(reports.map(report => report.technician))),
    regions: Array.from(new Set(reports.map(report => report.region))),
    types: Array.from(new Set(reports.map(report => report.type))),
    statuses: Array.from(new Set(reports.map(report => report.status)))
  }), [reports]);

  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const matchesSearch = searchTerm === "" || 
        report.equipment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.technician.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.report_id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTechnician = selectedTechnician === "all" || report.technician === selectedTechnician;
      const matchesRegion = selectedRegion === "all" || report.region === selectedRegion;
      const matchesType = selectedType === "all" || report.type === selectedType;
      const matchesStatus = selectedStatus === "all" || report.status === selectedStatus;
      
      let matchesPeriod = true;
      if (startDate && endDate) {
        const reportDate = new Date(report.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        matchesPeriod = reportDate >= start && reportDate <= end;
      }

      return matchesSearch && matchesTechnician && matchesRegion && matchesType && matchesStatus && matchesPeriod;
    });
  }, [reports, searchTerm, selectedTechnician, selectedRegion, selectedType, selectedStatus, startDate, endDate]);

  // Calculate statistics
  const statistics = useMemo(() => {
    const totalReports = filteredReports.length;
    const completedReports = filteredReports.filter(r => r.status === "Terminé").length;
    const inProgressReports = filteredReports.filter(r => r.status === "En cours").length;
    const plannedReports = filteredReports.filter(r => r.status === "Planifié").length;
    const totalCost = filteredReports.reduce((sum, r) => sum + r.cost, 0);
    const urgentReports = filteredReports.filter(r => r.type === "Urgente").length;

    return {
      totalReports,
      completedReports,
      inProgressReports,
      plannedReports,
      totalCost,
      urgentReports,
      completionRate: totalReports > 0 ? Math.round((completedReports / totalReports) * 100) : 0
    };
  }, [filteredReports]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Terminé": return "default";
      case "En cours": return "secondary";
      case "Planifié": return "outline";
      default: return "default";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Urgente": return "destructive";
      case "Corrective": return "secondary";
      case "Préventive": return "default";
      default: return "default";
    }
  };

  const exportToPDF = (reportId?: string) => {
    const message = reportId ? `Rapport ${reportId}` : `${filteredReports.length} rapports`;
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 2000)),
      {
        loading: `Export de ${message} en cours...`,
        success: `${message} exporté avec succès`,
        error: 'Erreur lors de l\'export'
      }
    );
  };

  const downloadReport = (reportId: string) => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: `Téléchargement du rapport ${reportId}...`,
        success: `Rapport ${reportId} téléchargé`,
        error: 'Erreur lors du téléchargement'
      }
    );
  };

  const viewReport = (reportId: string) => {
    toast.info(`Ouverture du rapport ${reportId}`, {
      description: 'Redirection vers la vue détaillée...'
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedTechnician("all");
    setSelectedRegion("all");
    setSelectedType("all");
    setSelectedStatus("all");
    setStartDate("");
    setEndDate("");
    toast.success('Filtres réinitialisés');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
            <span className="text-lg text-gray-600">Chargement des rapports...</span>
          </div>
        </div>
      </div>
    );
  }

  const activeFiltersCount = [
    searchTerm,
    selectedTechnician !== "all" ? selectedTechnician : null,
    selectedRegion !== "all" ? selectedRegion : null,
    selectedType !== "all" ? selectedType : null,
    selectedStatus !== "all" ? selectedStatus : null,
    startDate,
    endDate
  ].filter(Boolean).length;

  return (
    <div className="container mx-auto p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-8 h-8 text-green-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rapports de Maintenance</h1>
          <p className="text-gray-600">Archives et génération des rapports terrain</p>
        </div>
      </div>

      {/* Enhanced Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Archive className="w-5 h-5 text-blue-600 mr-1" />
              <h3 className="text-2xl font-bold text-blue-700">{statistics.totalReports}</h3>
            </div>
            <p className="text-sm text-blue-600">Rapports trouvés</p>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="w-5 h-5 text-green-600 mr-1" />
              <h3 className="text-2xl font-bold text-green-700">{statistics.completedReports}</h3>
            </div>
            <p className="text-sm text-green-600">Terminées</p>
          </CardContent>
        </Card>
        
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="w-5 h-5 text-orange-600 mr-1" />
              <h3 className="text-2xl font-bold text-orange-700">{statistics.inProgressReports}</h3>
            </div>
            <p className="text-sm text-orange-600">En cours</p>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <DollarSign className="w-5 h-5 text-purple-600 mr-1" />
              <h3 className="text-2xl font-bold text-purple-700">{statistics.totalCost.toFixed(2)}</h3>
            </div>
            <p className="text-sm text-purple-600">Coût total (DT)</p>
          </CardContent>
        </Card>
        
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <AlertCircle className="w-5 h-5 text-red-600 mr-1" />
              <h3 className="text-2xl font-bold text-red-700">{statistics.urgentReports}</h3>
            </div>
            <p className="text-sm text-red-600">Urgentes</p>
          </CardContent>
        </Card>
        
        <Card className="bg-indigo-50 border-indigo-200">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-indigo-600 mr-1" />
              <h3 className="text-2xl font-bold text-indigo-700">{statistics.completionRate}%</h3>
            </div>
            <p className="text-sm text-indigo-600">Taux réalisation</p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Filters */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              <span>Recherche et filtrage</span>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {activeFiltersCount} filtre{activeFiltersCount > 1 ? 's' : ''} actif{activeFiltersCount > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Button onClick={() => exportToPDF()} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Export PDF
              </Button>
              {activeFiltersCount > 0 && (
                <Button onClick={clearFilters} variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-1" />
                  Effacer filtres
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="search">Recherche générale</Label>
                <Input
                  id="search"
                  placeholder="ID, équipement, technicien, lieu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="technician">Technicien</Label>
                <Select value={selectedTechnician} onValueChange={setSelectedTechnician}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Tous les techniciens" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les techniciens</SelectItem>
                    {filterOptions.technicians.map(tech => (
                      <SelectItem key={tech} value={tech}>{tech}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="region">Région</Label>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Toutes les régions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les régions</SelectItem>
                    {filterOptions.regions.map(region => (
                      <SelectItem key={region} value={region}>{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Tous les types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    {filterOptions.types.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Statut</Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    {filterOptions.statuses.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-date">Date de début</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="end-date">Date de fin</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Archive className="w-5 h-5" />
            Rapports de maintenance par technicien
          </CardTitle>
          <CardDescription>
            {filteredReports.length} rapport{filteredReports.length > 1 ? 's' : ''} trouvé{filteredReports.length > 1 ? 's' : ''} 
            {reports.length !== filteredReports.length && ` sur ${reports.length} total`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Date</TableHead>
                  <TableHead>ID Rapport</TableHead>
                  <TableHead>Technicien</TableHead>
                  <TableHead>Équipement</TableHead>
                  <TableHead>Localisation</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Durée</TableHead>
                  <TableHead>Coût</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="w-8 h-8 text-gray-400" />
                        <p className="text-gray-500">Aucun rapport trouvé avec les critères actuels</p>
                        {activeFiltersCount > 0 && (
                          <Button variant="outline" size="sm" onClick={clearFilters}>
                            Effacer les filtres
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReports.map((report) => (
                    <TableRow key={report.id} className="hover:bg-gray-50">
                      <TableCell>
                        {format(new Date(report.date), 'dd/MM/yyyy', { locale: fr })}
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {report.report_id}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          {report.technician}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{report.equipment}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm">{report.location}</p>
                            <p className="text-xs text-gray-500">{report.region}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getTypeColor(report.type)}>
                          {report.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{report.duration}</TableCell>
                      <TableCell className="font-medium">{report.cost.toFixed(2)} DT</TableCell>
                      <TableCell>
                        <div className="flex gap-1 justify-center">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => viewReport(report.report_id)}
                            title="Voir le détail"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => downloadReport(report.report_id)}
                            title="Télécharger"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
