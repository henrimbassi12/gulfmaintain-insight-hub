
import React, { useState } from 'react';
import { MaintenanceCalendar } from '@/components/MaintenanceCalendar';
import { Button } from "@/components/ui/button";
import { FileText } from 'lucide-react';
import { DepotScheduleForm } from '@/components/forms/DepotScheduleForm';

export default function MaintenanceCalendarPage() {
  const [isDepotFormOpen, setIsDepotFormOpen] = useState(false);

  const handleSaveDepotForm = (data: any) => {
    console.log('Saving depot schedule:', data);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Planning & Calendrier</h1>
          <p className="text-gray-600">Gestion des plannings et calendriers de maintenance</p>
        </div>
        <Button 
          onClick={() => setIsDepotFormOpen(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          <FileText className="w-4 h-4 mr-2" />
          Fiche Passage Dépôt
        </Button>
      </div>
      
      <MaintenanceCalendar />

      <DepotScheduleForm 
        isOpen={isDepotFormOpen}
        onClose={() => setIsDepotFormOpen(false)}
        onSave={handleSaveDepotForm}
      />
    </div>
  );
}
