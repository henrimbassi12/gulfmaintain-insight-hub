
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

interface WeekData {
  week1: string[];
  week2: string[];
  week3: string[];
  week4: string[];
}

interface DepotScheduleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export function DepotScheduleForm({ isOpen, onClose, onSave }: DepotScheduleFormProps) {
  const [formData, setFormData] = useState({
    depot: '',
    technicianName: '',
    date: '',
    departureTime: '',
    arrivalTime: '',
    signature: '',
    firstPeriod: {
      week1: ['', '', '', '', '', '', ''],
      week2: ['', '', '', '', '', '', ''],
      week3: ['', '', '', '', '', '', ''],
      week4: ['', '', '', '', '', '', '']
    } as WeekData,
    secondPeriod: {
      week1: ['', '', '', '', '', '', ''],
      week2: ['', '', '', '', '', '', ''],
      week3: ['', '', '', '', '', '', ''],
      week4: ['', '', '', '', '', '', '']
    } as WeekData
  });

  const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  const updateWeekData = (period: 'firstPeriod' | 'secondPeriod', week: keyof WeekData, dayIndex: number, value: string) => {
    const newPeriod = { ...formData[period] };
    newPeriod[week][dayIndex] = value;
    setFormData({ ...formData, [period]: newPeriod });
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  const renderWeekGrid = (period: 'firstPeriod' | 'secondPeriod', title: string) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="grid grid-cols-8 gap-2 text-xs">
        {/* En-tête */}
        <div className="font-medium"></div>
        <div className="font-medium">SEMAINE 1</div>
        <div className="font-medium">SEMAINE 2</div>
        <div className="font-medium">SEMAINE 3</div>
        <div className="font-medium">SEMAINE 4</div>
        <div className="font-medium">AINE</div>
        <div className="font-medium">DATE</div>
        <div className="font-medium">SIG CHEF SECTEUR</div>

        {/* Lignes pour chaque jour */}
        {daysOfWeek.map((day, dayIndex) => (
          <React.Fragment key={day}>
            <div className="font-medium py-2">{day}</div>
            <Input 
              className="h-8 text-xs"
              value={formData[period].week1[dayIndex]}
              onChange={(e) => updateWeekData(period, 'week1', dayIndex, e.target.value)}
            />
            <Input 
              className="h-8 text-xs"
              value={formData[period].week2[dayIndex]}
              onChange={(e) => updateWeekData(period, 'week2', dayIndex, e.target.value)}
            />
            <Input 
              className="h-8 text-xs"
              value={formData[period].week3[dayIndex]}
              onChange={(e) => updateWeekData(period, 'week3', dayIndex, e.target.value)}
            />
            <Input 
              className="h-8 text-xs"
              value={formData[period].week4[dayIndex]}
              onChange={(e) => updateWeekData(period, 'week4', dayIndex, e.target.value)}
            />
            <Input className="h-8 text-xs" />
            <Input className="h-8 text-xs" />
            <Input className="h-8 text-xs" />
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-gray-100">
          <CardTitle className="flex justify-between items-center">
            <span>Fiche de Passage au Dépôt</span>
            <Button variant="ghost" onClick={onClose}>×</Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* En-tête */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="depot">Dépôt</Label>
              <Input 
                id="depot"
                value={formData.depot}
                onChange={(e) => setFormData({...formData, depot: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="technicianName">Nom du Technicien</Label>
              <Input 
                id="technicianName"
                value={formData.technicianName}
                onChange={(e) => setFormData({...formData, technicianName: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input 
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="departureTime">Heure de Départ</Label>
              <Input 
                id="departureTime"
                type="time"
                value={formData.departureTime}
                onChange={(e) => setFormData({...formData, departureTime: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="arrivalTime">Heure d'Arrivée</Label>
              <Input 
                id="arrivalTime"
                type="time"
                value={formData.arrivalTime}
                onChange={(e) => setFormData({...formData, arrivalTime: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="signature">Signature Chef Secteur</Label>
              <Input 
                id="signature"
                value={formData.signature}
                onChange={(e) => setFormData({...formData, signature: e.target.value})}
              />
            </div>
          </div>

          <Separator />

          {/* Première période */}
          {renderWeekGrid('firstPeriod', '1ère Période')}

          <Separator />

          {/* Deuxième période */}
          {renderWeekGrid('secondPeriod', '2ème Période')}

          <div className="flex justify-end gap-4 pt-4">
            <Button variant="outline" onClick={onClose}>Annuler</Button>
            <Button onClick={handleSave}>Enregistrer</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
