
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { AddEquipmentForm } from '@/components/AddEquipmentForm';
import { EquipmentFilters } from '@/components/EquipmentFilters';
import { EquipmentStats } from '@/components/EquipmentStats';
import { EquipmentList } from '@/components/EquipmentList';
import { useEquipments } from '@/hooks/useEquipments';

export default function Equipments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { equipments, isLoading, refetch } = useEquipments();

  const filteredEquipments = equipments.filter(equipment => {
    const matchesSearch = equipment.equipment_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipment.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipment.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || equipment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Équipements</h1>
          <p className="text-gray-600">Gestion et suivi de vos équipements frigorifiques</p>
        </div>
        <AddEquipmentForm onSuccess={refetch} />
      </div>

      {/* Filters */}
      <EquipmentFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {/* Statistics */}
      <EquipmentStats equipments={equipments} />

      {/* Equipment List */}
      <EquipmentList
        equipments={equipments}
        filteredEquipments={filteredEquipments}
        isLoading={isLoading}
      />
    </div>
  );
}
