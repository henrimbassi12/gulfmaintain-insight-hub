import React, { useState } from 'react';
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
  Archive
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface MaintenanceReport {
  id: string;
  date: string;
  technician: string;
  equipment: string;
  location: string;
  region: string;
  type: "Préventive" | "Corrective" | "Urgente";
  status: "Terminé" | "En cours" | "Planifié";
  duration: string;
  description: string;
  parts_used: string[];
  cost: number;
}

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTechnician, setSelectedTechnician] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Mock data for maintenance reports
  const maintenanceReports: MaintenanceReport[] = [
    {
      id: "RPT-001",
      date: "2024-01-10",
      technician: "Ahmed Ben Ali",
      equipment: "Climatiseur Bureau A1",
      location: "Bâtiment A - Étage 1",
      region: "Tunis Centre",
      type: "Préventive",
      status: "Terminé",
      duration: "2h 30min",
      description: "Nettoyage des filtres et vérification du gaz réfrigérant",
      parts_used: ["Filtre air", "Gaz R410A"],
      cost: 85.50
    },
    {
      id: "RPT-002",
      date: "2024-01-12",
      technician: "Fatma Trabelsi",
      equipment: "Groupe électrogène Principal",
      location: "Sous-sol technique",
      region: "Tunis Nord",
      type: "Corrective",
      status: "Terminé",
      duration: "4h 15min",
      description: "Remplacement du démarreur et mise à jour logicielle",
      parts_used: ["Démarreur", "Huile moteur"],
      cost: 245.75
    },
    {
      id: "RPT-003",
      date: "2024-01-15",
      technician: "Mohamed Khelifi",
      equipment: "Ascenseur Tour B",
      location: "Tour B - Tous étages",
      region: "Tunis Centre",
      type: "Urgente",
      status: "En cours",
      duration: "1h 45min",
      description: "Panne d'arrêt d'urgence - Vérification sécurité",
      parts_used: ["Capteur sécurité"],
      cost: 120.00
    },
    {
      id: "RPT-004",
      date: "2024-01-18",
      technician: "Leila Mansouri",
      equipment: "Système de ventilation",
      location: "Bâtiment C - RDC",
      region: "Sfax",
      type: "Préventive",
      status: "Planifié",
      duration: "3h 00min",
      description: "Maintenance trimestrielle - Nettoyage conduits",
      parts_used: [],
      cost: 150.00
    }
  ];

  const technicians = ["Ahmed Ben Ali", "Fatma Trabelsi", "Mohamed Khelifi", "Leila Mansouri"];
  const regions = ["Tunis Centre", "Tunis Nord", "Sfax", "Sousse", "Gabès"];

  const filteredReports = maintenanceReports.filter(report => {
    const matchesSearch = searchTerm === "" || 
      report.equipment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.technician.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTechnician = selectedTechnician === "all" || report.technician === selectedTechnician;
    const matchesRegion = selectedRegion === "all" || report.region === selectedRegion;
    
    let matchesPeriod = true;
    if (startDate && endDate) {
      const reportDate = new Date(report.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      matchesPeriod = reportDate >= start && reportDate <= end;
    }

    return matchesSearch && matchesTechnician && matchesRegion && matchesPeriod;
  });

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
    console.log(`Exporting ${reportId ? `report ${reportId}` : 'all filtered reports'} to PDF`);
    // Ici vous pourriez implémenter l'export PDF réel
  };

  const downloadReport = (reportId: string) => {
    console.log(`Downloading report ${reportId}`);
    // Ici vous pourriez implémenter le téléchargement
  };

  return (
    <div className="container mx-auto p-6 space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-8 h-8 text-green-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rapports</h1>
          <p className="text-gray-600">Archives + génération des rapports terrain</p>
        </div>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Recherche et filtrage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <Label htmlFor="search">Recherche générale</Label>
              <Input
                id="search"
                placeholder="Équipement, technicien, lieu..."
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
                  {technicians.map(tech => (
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
                  {regions.map(region => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Actions</Label>
              <div className="flex gap-2 mt-1">
                <Button onClick={() => exportToPDF()} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  Export PDF
                </Button>
              </div>
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
        </CardContent>
      </Card>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold text-blue-600">{filteredReports.length}</h3>
            <p className="text-sm text-gray-600">Rapports trouvés</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold text-green-600">
              {filteredReports.filter(r => r.status === "Terminé").length}
            </h3>
            <p className="text-sm text-gray-600">Interventions terminées</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold text-orange-600">
              {filteredReports.filter(r => r.status === "En cours").length}
            </h3>
            <p className="text-sm text-gray-600">En cours</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold text-purple-600">
              {filteredReports.reduce((sum, r) => sum + r.cost, 0).toFixed(2)} DT
            </h3>
            <p className="text-sm text-gray-600">Coût total</p>
          </CardContent>
        </Card>
      </div>

      {/* Table des rapports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Archive className="w-5 h-5" />
            Rapports de maintenance par technicien
          </CardTitle>
          <CardDescription>
            Liaison avec fiches de maintenance journalières
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Technicien</TableHead>
                <TableHead>Équipement</TableHead>
                <TableHead>Localisation</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Durée</TableHead>
                <TableHead>Coût</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    {format(new Date(report.date), 'dd/MM/yyyy', { locale: fr })}
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
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => console.log(`View ${report.id}`)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => downloadReport(report.id)}>
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
